import * as vscode from "vscode"
import { bazel, platformArguments } from "../utilities"

const test = async () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.test")
        .forEach((execution) => execution.terminate())

    const task = new vscode.Task(
        { type: "miscar.test" },
        folders[0],
        "Test",
        "vscode-miscar",
        new vscode.ShellExecution(bazel + "test //... " + platformArguments)
    )

    task.presentationOptions.clear = true
    task.presentationOptions.echo = false

    vscode.tasks.executeTask(task)
}

export default test
