import { rmSync } from "fs"
import * as vscode from "vscode"

const clearCompileFlags = (context: vscode.ExtensionContext) => {
    const root = context.globalStorageUri.fsPath
    rmSync(root, { recursive: true })
}

export default clearCompileFlags
