import * as vscode from "vscode"
import { execSync } from "child_process"

const openInstallDirectory = (context: vscode.ExtensionContext) => {
    execSync("start " + context.globalStorageUri.fsPath)
}

export default openInstallDirectory