import * as vscode from "vscode"
import buildLocal from "./tasks/buildLocal"
import buildRoboRIO from "./tasks/buildRoborio"
import test from "./tasks/test"
import deploy from "./tasks/deploy"
import openCommandPalette from "./tasks/openCommandPalette"
import runSimulation from "./tasks/runSimulation"
import startTool from "./tasks/startTool"
import createCompileFlags from "./tasks/createCompileFlags"

export const activate = (context: vscode.ExtensionContext) => {
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
}

export const deactivate = () => {}
