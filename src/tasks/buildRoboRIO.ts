import * as vscode from "vscode"
import { buildRoboRIOProcess, roboRIOKilledProcesses } from "../extension"
import { python } from "../utilities"

const buildRoboRIO = async (status: vscode.StatusBarItem) => {
    await vscode.workspace.saveAll()

    if (buildRoboRIOProcess) {
        buildRoboRIOProcess.kill()
        roboRIOKilledProcesses.push(buildRoboRIOProcess)
    }

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


    const build = new vscode.Task(
        { type: "miscar.buildRoboRIO" },
        folders[0],
        "Build Roborio",
        "vscode-miscar",
        new vscode.ShellExecution(`${python} build.py roborio`)
    )
    build.presentationOptions.clear = true
    build.presentationOptions.echo = true

    build.isBackground = false
    build.presentationOptions.focus = false

    vscode.tasks.executeTask(build)

}

export default buildRoboRIO
