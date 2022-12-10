import { readFileSync } from "fs"
import { join } from "path"
import * as vscode from "vscode"
import { buildLocalProcess, localKilledProcesses } from "../extension"
import { getVersions, python } from "../utilities"

const buildLocal = async (status: vscode.StatusBarItem) => {
    await vscode.workspace.saveAll()

    const versions = readFileSync(
        join(vscode.workspace.workspaceFolders![0].uri.fsPath, "versions.json")
    ).toString()

    if (
        JSON.stringify(JSON.parse(versions)) !== JSON.stringify(getVersions())
    ) {
        console.log(JSON.parse(versions))
        console.log(getVersions())
        vscode.window.showWarningMessage(
            "Version mismatch between this project and the computer"
        )
    }

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
