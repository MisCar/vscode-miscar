/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import { bazel, platformArguments } from "../utilities"

const buildLocal = async () => {
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

    const task = new vscode.Task(
        { type: "bazelrio.buildLocal" },
        folders[0],
        "Build Local",
        "vscode-miscar",
        new vscode.ShellExecution(bazel + " build //... " + platformArguments)
    )

    task.presentationOptions.clear = true
    task.presentationOptions.echo = false

    vscode.tasks.executeTask(task)
}

export default buildLocal
