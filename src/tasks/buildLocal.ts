/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import { readdirSync } from "fs"
import { join } from "path"
const buildLocal = async (context: vscode.ExtensionContext) => {
    await vscode.workspace.saveAll()

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

    const headersRoot = join(context.globalStorageUri.fsPath, "headers")
    const localRoot = join(context.globalStorageUri.fsPath, "local")

    readdirSync(headersRoot).map((dir) => {
        console.log(dir)
    })
}

export default buildLocal
