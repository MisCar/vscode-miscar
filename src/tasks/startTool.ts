import * as vscode from "vscode"

const startTool = async () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) => execution.task.definition.type === "miscar.startTool"
        )
        .forEach((execution) => execution.terminate())

    const tool = await vscode.window.showQuickPick(
        [
            "Shuffleboard",
            "Glass",
            "PathWeaver",
            "SmartDashboard",
            "RobotBuilder",
        ],
        {
            placeHolder: "Tool",
        }
    )

    if (tool !== undefined) {
        const task = new vscode.Task(
            { type: "miscar.startTool" },
            folders[0],
            "Start Tool",
            "vscode-miscar",
            new vscode.ShellExecution(
                "bazel run @bazelrio//libraries/tools/" + tool.toLowerCase()
            )
        )

        task.presentationOptions.clear = false
        task.presentationOptions.echo = false
        task.presentationOptions.showReuseMessage = false

        vscode.tasks.executeTask(task)
    }
}

export default startTool
