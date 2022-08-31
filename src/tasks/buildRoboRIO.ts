import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import * as vscode from "vscode"
import { buildRoboRIOProcess, roboRIOKilledProcesses } from "../extension"

const buildRoboRIO = async (status: vscode.StatusBarItem) => {
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
            { type: "miscar.buildRoboRIO" },
            folders[0],
            "Build Roborio",
            "vscode-miscar",
            new vscode.ShellExecution(
                "Get-ChildItem -Path './cbuild' | Remove-Item -Recurse -Confirm:$false -Force; cmake -S ./ -B ./cbuild -DIS_ROBORIO=TRUE -GNinja -DCMAKE_TOOLCHAIN_FILE='./roborio.toolchain.cmake'; cd cbuild; ninja"
            )
        )
        setupAndBuild.presentationOptions.clear = true
        setupAndBuild.presentationOptions.echo = true
        await vscode.tasks.executeTask(setupAndBuild)
    } else {
        const build = new vscode.Task(
            { type: "miscar.buildRoboRIO" },
            folders[0],
            "Build Roborio",
            "vscode-miscar",
            new vscode.ShellExecution("cd cbuild; ninja")
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
