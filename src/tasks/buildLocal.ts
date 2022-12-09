import * as vscode from "vscode"
import { buildLocalProcess, localKilledProcesses } from "../extension"
import { python } from "../utilities"

const buildLocal = async (status: vscode.StatusBarItem) => {
    await vscode.workspace.saveAll()

    if (buildLocalProcess) {
        buildLocalProcess.kill()
        localKilledProcesses.push(buildLocalProcess)
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
        { type: "miscar.buildLocal" },
        folders[0],
        "Build Local",
        "vscode-miscar",
        new vscode.ShellExecution(`${python} build.py local`)
    )

    build.presentationOptions.clear = true
    build.presentationOptions.echo = true

    build.isBackground = false
    build.presentationOptions.focus = false

    vscode.tasks.executeTask(build)

}

export default buildLocal
