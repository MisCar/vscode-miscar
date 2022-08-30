import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import * as vscode from "vscode"
import { buildRoboRIOProcess, roboRIOKilledProcesses } from "../extension"
import { bazel } from "../utilities"

const buildRoboRIO = async (status: vscode.StatusBarItem) => {
    let buildFinished = false
    await vscode.workspace.saveAll()

    if (buildRoboRIOProcess) {
        buildRoboRIOProcess.kill()
        roboRIOKilledProcesses.push(buildRoboRIOProcess)
    }

    status.text = "$(sync~spin) miscar: building"
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) =>
                execution.task.definition.type === "miscar.buildRoboRIO"
        )
        .forEach((execution) => execution.terminate())

    const CMakeLists = readFileSync(
        join(folders[0].uri.fsPath, "./CMakeLists.txt"),
        "utf-8"
    )

    if (!CMakeLists.includes("#roborio")) {
        writeFileSync(
            join(folders[0].uri.fsPath, "./CMakeLists.txt"),
            CMakeLists.replace("#local", "#roborio").replace(
                "#firsttime",
                "#roborio"
            )
        )

        const setupAndBuild = new vscode.Task(
            { type: "miscar.runSimulation" },
            folders[0],
            "Simulation",
            "vscode-miscar",
            new vscode.ShellExecution(
                `cd ${join(folders[0].uri.fsPath, "cbuild")} && del /F /Q * && cmake .. -GNinja -DCMAKE_TOOLCHAIN_FILE=../roborio.toolchain.cmake -DIS_ROBORIO=TRUE && ninja`
            )
        )
        setupAndBuild.presentationOptions.clear = true
        setupAndBuild.presentationOptions.echo = true
        await vscode.tasks.executeTask(setupAndBuild)
    } else {
        const build = new vscode.Task(
            { type: "miscar.runSimulation" },
            folders[0],
            "Simulation",
            "vscode-miscar",
            new vscode.ShellExecution(`cd ${join(folders[0].uri.fsPath, "cbuild")} && ninja`)
        )
        build.presentationOptions.clear = true
        build.presentationOptions.echo = true

        build.isBackground = false
        build.presentationOptions.focus = false
        //execSync(`cd ${join(folders[0].uri.fsPath, "cbuild")}`)
        //execSync("ninja")
        vscode.tasks.executeTask(build)
    }
}

export default buildRoboRIO
