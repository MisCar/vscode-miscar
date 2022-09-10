import * as vscode from "vscode"
import buildLocal from "./tasks/buildLocal"
import buildRoboRIO from "./tasks/buildRoboRIO"
import test from "./tasks/test"
import deploy from "./tasks/deploy"
import openCommandPalette from "./tasks/openCommandPalette"
import runSimulation from "./tasks/runSimulation"
import startTool from "./tasks/startTool"
import createCompileFlags from "./tasks/createCompileFlags"
import { ChildProcess } from "child_process"
import newClass from "./tasks/newClass"
import wpiformat from "./tasks/wpiformat"
import createIndex from "./tasks/createIndex"
import clearCompileFlags from "./tasks/clearCompileFlags"
import fastDeploy from "./tasks/fastDeploy"

export let buildRoboRIOProcess: ChildProcess | undefined
export let roboRIOKilledProcesses: ChildProcess[] = []
export let status: vscode.StatusBarItem
export let log: vscode.OutputChannel

const STATUS_BUILDING = "$(sync~spin) miscar: building"
export const STATUS_READY = "$(pass) miscar: ready"
const STATUS_FAILED = "$(close) miscar: failing"
const STATUS_UNKNOWN = "$(watch) miscar: unknown"

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
        vscode.commands.registerCommand("miscar.buildLocal", () =>
            buildLocal(context)
        ),
        vscode.commands.registerCommand("miscar.buildRoboRIO", () =>
            buildRoboRIO(status)
        ),
        vscode.commands.registerCommand("miscar.test", test),
        vscode.commands.registerCommand("miscar.deploy", () => deploy(context, false)),
        vscode.commands.registerCommand("miscar.fastDeploy", () => deploy(context, true)),
        vscode.commands.registerCommand("miscar.runSimulation", runSimulation),
        vscode.commands.registerCommand("miscar.startTool", startTool),
        vscode.commands.registerCommand("miscar.newClass", newClass),
        vscode.commands.registerCommand("miscar.createCompileFlags", () =>
            createCompileFlags(context)
        ),
        vscode.commands.registerCommand("miscar.wpiformat", wpiformat),
        vscode.commands.registerCommand("miscar.createIndex", createIndex),
        vscode.commands.registerCommand("miscar.clearCompileFlags", () =>
            clearCompileFlags(context)
        ),
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
        status,
        vscode.workspace.onDidSaveTextDocument(() => {
            status.text = STATUS_UNKNOWN
        })
    )

    status.command = "miscar.buildRoboRIO"
    status.text = STATUS_UNKNOWN

    status.show()
}

export const deactivate = () => { }
