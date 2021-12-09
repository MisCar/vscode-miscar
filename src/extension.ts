/* eslint-disable @typescript-eslint/semi */
import * as vscode from "vscode"
import buildLocal from "./tasks/buildLocal"
import buildRoboRIO from "./tasks/buildRoboRIO"
import test from "./tasks/test"
import deploy from "./tasks/deploy"
import openCommandPalette from "./tasks/openCommandPalette"
import runSimulation from "./tasks/runSimulation"
import startTool from "./tasks/startTool"
import createCompileFlags from "./tasks/createCompileFlags"
import { ChildProcess, exec } from "child_process"
import { relative } from "path"
import newClass from "./tasks/newClass"
import wpiformat from "./tasks/wpiformat"
import { bazel } from "./utilities"

let buildRoboRIOProcess: ChildProcess | undefined
let wpiformatProcess: ChildProcess | undefined
let status: vscode.StatusBarItem
let log: vscode.OutputChannel

const STATUS_BUILDING = "$(sync~spin) miscar: building"
const STATUS_READY = "$(testing-passed-icon) miscar: ready"
const STATUS_FAILED = "$(testing-failed-icon) miscar: failing"

export const activate = (context: vscode.ExtensionContext) => {
    log = vscode.window.createOutputChannel("MisCar")
    status = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        0
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "miscar.openCommandPalette",
            openCommandPalette
        ),
        vscode.commands.registerCommand("miscar.buildLocal", buildLocal),
        vscode.commands.registerCommand("miscar.buildRoboRIO", () =>
            buildRoboRIO(status)
        ),
        vscode.commands.registerCommand("miscar.test", test),
        vscode.commands.registerCommand("miscar.deploy", deploy),
        vscode.commands.registerCommand("miscar.runSimulation", runSimulation),
        vscode.commands.registerCommand("miscar.startTool", startTool),
        vscode.commands.registerCommand("miscar.newClass", newClass),
        vscode.commands.registerCommand("miscar.createCompileFlags", () =>
            createCompileFlags(context)
        ),
        vscode.commands.registerCommand("miscar.wpiformat", wpiformat),
        vscode.commands.registerCommand("miscar.showOutput", () => {
            if (
                vscode.window.activeTextEditor?.document.fileName.startsWith(
                    "extension-output-miscar.vscode-miscar"
                )
            ) {
                log.hide()
            } else {
                log.show()
            }
        }),
        vscode.tasks.onDidStartTask((event) => {
            if (
                event.execution.task.definition.type === "miscar.buildRoboRIO"
            ) {
                status.text = STATUS_BUILDING
            }
        }),
        vscode.tasks.onDidEndTaskProcess((event) => {
            if (
                event.execution.task.definition.type === "miscar.buildRoboRIO"
            ) {
                status.text =
                    event.exitCode === 0 ? STATUS_READY : STATUS_FAILED
            }
        }),

        status
    )

    status.command = "miscar.showOutput"

    vscode.workspace.onDidSaveTextDocument(buildRoboRIOSilent)
    vscode.workspace.onDidSaveTextDocument(wpiformatSilent)
    buildRoboRIOSilent()
    status.show()
}

export const deactivate = () => { }

const buildRoboRIOSilent = () => {
    if (buildRoboRIOProcess) {
        buildRoboRIOProcess.kill()
    }
    status.text = STATUS_BUILDING

    if (vscode.workspace.workspaceFolders) {
        buildRoboRIOProcess = exec(bazel + "build //... --config=for-roborio", {
            cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
        })

        buildRoboRIOProcess.stdout?.setEncoding("utf8")
        buildRoboRIOProcess.stderr?.setEncoding("utf8")

        buildRoboRIOProcess.stdout?.on("data", (message) => log.append(message))
        buildRoboRIOProcess.stderr?.on("data", (message) => log.append(message))

        buildRoboRIOProcess.addListener("exit", (code, __) => {
            status.text = code === 0 ? STATUS_READY : STATUS_FAILED
        })
    }
}

const wpiformatSilent = () => {
    if (wpiformatProcess) {
        wpiformatProcess.kill()
    }

    if (vscode.workspace.workspaceFolders) {
        wpiformatProcess = exec("wpiformat -f " + relative(vscode.workspace.workspaceFolders[0].uri.fsPath, vscode.window.activeTextEditor?.document.fileName ?? ""), {
            cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
        })

        wpiformatProcess.addListener("exit", (code, __) => {
            if (code !== 0) {
                vscode.window.showWarningMessage("WPIFormat failed")
            }
        })
    }
}