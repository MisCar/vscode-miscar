import * as vscode from "vscode"
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"

const findAllHeadersIn = (path: string) => {
    const files = readdirSync(path)
    let result: string[] = []
    for (const file of files) {
        const fullPath = join(path, file)
        const stats = statSync(fullPath)
        if (stats.isDirectory()) {
            result = result.concat(
                findAllHeadersIn(fullPath).map((f) => `${file}/${f}`)
            )
        } else if (file.endsWith(".h") && !file.toLowerCase().includes("jni")) {
            result.push(file)
        }
    }
    return result
}

const createIndex = () => {
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }
    const includePaths = readFileSync(
        join(folders[0].uri.fsPath, "src", "main", "cpp", "compile_flags.txt")
    )
        .toString()
        .split("\n")
        .filter((line) => line.startsWith("-I"))
        .map((line) => line.substring(2))
    let includes: string[] = []
    for (const path of includePaths) {
        includes = includes.concat(findAllHeadersIn(path))
    }

    writeFileSync(
        join(folders[0].uri.fsPath, "src", "main", "cpp", "IncludeAll.h"),
        "#pragma once\n" + includes.filter((file) => file.startsWith("frc") || file.startsWith("units")).map((file) => `#include <${file}>`).join("\n")
    )

    try {
        execSync("clangd-indexer src/main/cpp/IncludeAll.h > clangd.idx", {
            cwd: folders[0].uri.fsPath,
        })
    } catch (e: any) {
        if (e.stderr.toString().includes("clangd-indexer: not found")) {
            vscode.window.showErrorMessage("clangd indexer is not installed. Please install it from the clangd releases page.")
        }
    }
}

export default createIndex
