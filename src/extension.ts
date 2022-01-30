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
import createIndex from "./tasks/createIndex"
import clearCompileFlags from "./tasks/clearCompileFlags"
import fastDeploy from "./tasks/fastDeploy"

export let buildRoboRIOProcess: ChildProcess | undefined
export let roboRIOKilledProcesses: ChildProcess[] = []
let wpiformatProcess: ChildProcess | undefined
let status: vscode.StatusBarItem
let log: vscode.OutputChannel

const STATUS_BUILDING = "$(sync~spin) miscar: building"
const STATUS_READY = "$(testing-passed-icon) miscar: ready"
const STATUS_FAILED = "$(testing-failed-icon) miscar: failing"
let buildRoboRIOSilentFirstTime = true

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
        vscode.commands.registerCommand("miscar.fastDeploy", fastDeploy),
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
        vscode.workspace.onDidSaveTextDocument(buildRoboRIOSilent),
    )

    status.command = "miscar.showOutput"

    buildRoboRIOSilent()
    status.show()
}

export const deactivate = () => { }

const buildRoboRIOSilent = () => {
    if (buildRoboRIOProcess) {
        buildRoboRIOProcess.kill()
        roboRIOKilledProcesses.push(buildRoboRIOProcess)
    }
    status.text = STATUS_BUILDING

    if (vscode.workspace.workspaceFolders) {
        buildRoboRIOProcess = exec(bazel + "build //... --config=for-roborio" + (buildRoboRIOSilentFirstTime ? " --jobs 2 --local_ram_resources=HOST_RAM*0.5" : ""), {
            cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
        })

        buildRoboRIOProcess.stdout?.setEncoding("utf8")
        buildRoboRIOProcess.stderr?.setEncoding("utf8")

        buildRoboRIOProcess.stdout?.on("data", (message) => log.append(message))
        buildRoboRIOProcess.stderr?.on("data", (message) => log.append(message))

        const thisProcess = buildRoboRIOProcess // We don't want the captured one to change

        buildRoboRIOProcess.addListener("exit", (code, __) => {
            if (roboRIOKilledProcesses.includes(thisProcess)) {
                return
            }

            status.text = code === 0 ? STATUS_READY : STATUS_FAILED
        })
    }

    if (buildRoboRIOSilentFirstTime) {
        buildRoboRIOSilentFirstTime = false
    }
}
