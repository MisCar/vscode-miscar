/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import { python } from "../utilities"
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
            `${python} build.py local`)

    )
    setupAndBuild.presentationOptions.clear = true
    setupAndBuild.presentationOptions.echo = true

    vscode.tasks.executeTask(setupAndBuild)

}

export default buildLocal
