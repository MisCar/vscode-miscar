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
        includes.map((file) => `#include <${file}>`).join("\n")
    )

    execSync("clangd-indexer src/main/cpp/IncludeAll.h > clangd.idx", {
        cwd: folders[0].uri.fsPath,
    })
}

export default createIndex
