import * as vscode from "vscode"
import { bazel } from "../utilities"

const fastDeploy = async () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) => execution.task.definition.type === "miscar.deploy"
        )
        .forEach((execution) => execution.terminate())

    const task = new vscode.Task(
        { type: "miscar.fastDeploy" },
        folders[0],
        "Fast Deploy",
        "vscode-miscar",
        new vscode.ShellExecution(bazel + "run robot.deploy --config=for-roborio --ui_event_filters=-info -- --skip_dynamic_libraries")
    )

    task.presentationOptions.clear = true
    task.presentationOptions.echo = false
    task.presentationOptions.showReuseMessage = false

    vscode.tasks.executeTask(task)
}

export default fastDeploy
