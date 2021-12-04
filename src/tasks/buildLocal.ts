import * as vscode from "vscode"
import { platform } from "../utilities"

const buildLocal = async () => {
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
        new vscode.ShellExecution(
            platform === "windows"
                ? "bazel build //... --config=for-" + platform
                : "bazel build //..."
        )
    )

    task.presentationOptions.clear = false
    task.presentationOptions.echo = false
    task.presentationOptions.showReuseMessage = false

    vscode.tasks.executeTask(task)
}

export default buildLocal
