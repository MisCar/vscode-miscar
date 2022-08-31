/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import { readdirSync, readFileSync, writeFileSync } from "fs" // Find something to remove unused imports
// If you want to learn stuff do it automatically with GitHub Actions
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

    const CMakeLists = readFileSync(
        join(folders[0].uri.fsPath, "./CMakeLists.txt"),
        "utf-8" // I don't think this is required
    )

    if (!CMakeLists.includes("#local")) { // What is this? Why does CMakeLists include #local?
        // I'm guessing it's because you are lazy and you didn't use an `if` in the CMakeLists.
        // Do it. The way you're doing it is pretty lame
        writeFileSync(
            join(folders[0].uri.fsPath, "./CMakeLists.txt"),
            CMakeLists.replace("#roborio", "#local").replace(
                "#firsttime",
                "#local"
            )
        )

        const setupAndBuild = new vscode.Task(
            { type: "miscar.buildLocal" },
            folders[0],
            "Build Local",
            "vscode-miscar",
            new vscode.ShellExecution(
                // Unless you are a complete dumbass, you know this doesn't work on other OSs. 
                // Don't build in cbuild. We used it because we didn't delete bazel's BUILD file
                // so we couldn't create a build directory
                // `cmake -S ./ -B ./cbuild` works but it's super unorthodox.
                // Run `cmake ..` when your cwd is `build`.
                "Get-ChildItem -Path './cbuild' | Remove-Item -Recurse -Confirm:$false -Force; cmake -S ./ -B ./cbuild -DIS_ROBORIO=FALSE -GNinja; cd cbuild; ninja"
            )
        )
        setupAndBuild.presentationOptions.clear = true
        setupAndBuild.presentationOptions.echo = true

        vscode.tasks.executeTask(setupAndBuild)
    } else {
        const build = new vscode.Task(
            { type: "miscar.buildLocal" },
            folders[0],
            "Build Local",
            "vscode-miscar",
            new vscode.ShellExecution("cd cbuild; ninja") // Instead of cd cbuild; ninja, figure out how you set cwd. Hint: VSCode, like many other JS libraries, uses an optional options last parameter.
        )
        build.presentationOptions.clear = true
        build.presentationOptions.echo = true

        vscode.tasks.executeTask(build)
    }
}

export default buildLocal
