import * as vscode from "vscode"

const buildRoboRIO = async (status: vscode.StatusBarItem) => {
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

    const task = new vscode.Task(
        { type: "miscar.buildRoboRIO" },
        folders[0],
        "Build RoboRIO",
        "vscode-miscar",
        new vscode.ShellExecution("bazel build //... --config=for-roborio")
    )

    task.presentationOptions.clear = false
    task.presentationOptions.echo = false
    task.presentationOptions.showReuseMessage = false

    vscode.tasks.executeTask(task)
}

export default buildRoboRIO
