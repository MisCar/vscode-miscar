import * as vscode from "vscode"
import { platform } from "../utilities"

const runSimulation = async () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) =>
                execution.task.definition.type === "miscar.runSimulation"
        )
        .forEach((execution) => execution.terminate())

    const task = new vscode.Task(
        { type: "miscar.runSimulation" },
        folders[0],
        "Simulation",
        "vscode-miscar",
        new vscode.ShellExecution(
            "bazel run robot.simulation.all --config=for-" + platform
        )
    )

    task.presentationOptions.clear = false
    task.presentationOptions.echo = false
    task.presentationOptions.showReuseMessage = false

    vscode.tasks.executeTask(task)
}

export default runSimulation
