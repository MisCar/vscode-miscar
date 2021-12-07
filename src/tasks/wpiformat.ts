import { log } from "console"
import * as vscode from "vscode"

const wpiformat = async () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) => execution.task.definition.type === "miscar.wpiformat"
        )
        .forEach((execution) => execution.terminate())

    const task = new vscode.Task(
        { type: "miscar.wpiformat" },
        folders[0],
        "wpiformat",
        "vscode-miscar",
        new vscode.ShellExecution("wpiformat")
    )

    task.presentationOptions.clear = false
    task.presentationOptions.echo = false
    task.presentationOptions.showReuseMessage = false

    vscode.tasks.executeTask(task)
    console.log("I have run this thing ")
}

export default wpiformat
