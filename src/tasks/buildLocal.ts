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



    const setupAndBuild = new vscode.Task(
        { type: "miscar.buildLocal" },
        folders[0],
        "Build Local",
        "vscode-miscar",
        new vscode.ShellExecution(
            `cmake ../.. -GNinja  -DIS_ROBORIO=FALSE && ninja`, { cwd: join(folders[0].uri.fsPath, "build/local") })

    )
    setupAndBuild.presentationOptions.clear = true
    setupAndBuild.presentationOptions.echo = true

    vscode.tasks.executeTask(setupAndBuild)

}

export default buildLocal
