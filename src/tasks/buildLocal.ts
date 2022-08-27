/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
const buildLocal = async (context: vscode.ExtensionContext) => {
    await vscode.workspace.saveAll()

    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) =>
                execution.task.definition.type === "miscar.buildLocal"
        )
        .forEach((execution) => execution.terminate())

    const CMakeLists = readFileSync(
        join(folders[0].uri.fsPath, "./CMakeLists.txt"),
        "utf-8"
    )

    if (!CMakeLists.includes("#local")) {
        writeFileSync(
            join(folders[0].uri.fsPath, "./CMakeLists.txt"),
            CMakeLists.replace("#roborio", "#local").replace(
                "#firsttime",
                "#local"
            )
        )

        const setupAndBuild = new vscode.Task(
            { type: "miscar.runSimulation" },
            folders[0],
            "Simulation",
            "vscode-miscar",
            new vscode.ShellExecution(
                "Get-ChildItem -Path './cbuild' | Remove-Item -Recurse -Confirm:$false -Force; cmake -S ./ -B ./cbuild -DIS_ROBORIO=FALSE -GNinja; cd cbuild; ninja"
            )
        )
        setupAndBuild.presentationOptions.clear = true
        setupAndBuild.presentationOptions.echo = true

        vscode.tasks.executeTask(setupAndBuild)
    } else {
        const build = new vscode.Task(
            { type: "miscar.runSimulation" },
            folders[0],
            "Simulation",
            "vscode-miscar",
            new vscode.ShellExecution("cd cbuild; ninja")
        )
        build.presentationOptions.clear = true
        build.presentationOptions.echo = true

        vscode.tasks.executeTask(build)
    }
}

export default buildLocal
