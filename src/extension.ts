import * as vscode from "vscode"
import buildLocal from "./tasks/buildLocal"
import buildRoboRIO from "./tasks/buildRoborio"
import test from "./tasks/test"
import deploy from "./tasks/deploy"
import openCommandPalette from "./tasks/openCommandPalette"
import runSimulation from "./tasks/runSimulation"
import startTool from "./tasks/startTool"
import createCompileFlags from "./tasks/createCompileFlags"
import { ChildProcess, exec } from "child_process"

let process: ChildProcess | undefined

export const activate = (context: vscode.ExtensionContext) => {
    const log = vscode.window.createOutputChannel("MisCar")

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "miscar.openCommandPalette",
            openCommandPalette
        ),
        vscode.commands.registerCommand("miscar.buildLocal", buildLocal),
        vscode.commands.registerCommand("miscar.buildRoboRIO", buildRoboRIO),
        vscode.commands.registerCommand("miscar.test", test),
        vscode.commands.registerCommand("miscar.deploy", deploy),
        vscode.commands.registerCommand("miscar.runSimulation", runSimulation),
        vscode.commands.registerCommand("miscar.startTool", startTool),
        vscode.commands.registerCommand("miscar.createCompileFlags", () =>
            createCompileFlags(context)
        )
    )

    vscode.workspace.onDidSaveTextDocument(() => {
        if (process) {
            process.kill()
        }

        if (vscode.workspace.workspaceFolders) {
            process = exec("bazel build //... --config=for-roborio", {
                cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
            })

            process.stdout?.setEncoding("utf8")
            process.stderr?.setEncoding("utf8")

            process.stdout?.on("data", (message) => log.append(message))
            process.stderr?.on("data", (message) => log.append(message))
        }
    })
}

export const deactivate = () => {}
