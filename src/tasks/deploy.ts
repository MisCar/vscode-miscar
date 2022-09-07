import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join, resolve } from "path"
import { readdirSync } from "fs"

let commands = vscode.window.createOutputChannel("Commands")
const runCommand = async (client: NodeSSH, command: string) => {
    while (!client.isConnected());
    await client.execCommand(command).catch((error: string) => {
        commands.appendLine(error)
        commands.appendLine("connection status " + client.isConnected())
    })
    commands.appendLine(command)
}

const deploy = async (context: vscode.ExtensionContext, isFast: boolean) => {
    let isRobotConnected = false
    let startedDeploy = false
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) => execution.task.definition.type === "miscar.deploy" || execution.task.definition.type === "miscar.fastDeploy"
        )
        .forEach((execution) => execution.terminate())

    const roborioRoot = join(context.globalStorageUri.fsPath, "roborio")
    await vscode.commands.executeCommand("miscar.buildRoboRIO")
    vscode.tasks.onDidEndTaskProcess((event) => {
        if (
            event.execution.task.definition.type === "miscar.buildRoboRIO" && event.exitCode === 0) {

            for (const folder of folders) {
                const robotBinaryLocation = join(
                    folder.uri.fsPath,
                    "cbuild",
                    "robot"
                )

                const libraries = readdirSync(roborioRoot)
                let moveFiles: any[] = []
                if (!isFast) {
                    libraries.map((lib) => {
                        if (readdirSync(join(roborioRoot, lib)).length != 0) {
                            let libnames = readdirSync(
                                join(roborioRoot, lib, "linux", "athena", "shared")
                            )
                            libnames = libnames.filter((lib) => {
                                return !lib.includes("debug")
                            })
                            for (let libName of libnames) {
                                moveFiles.push({
                                    local: join(
                                        roborioRoot,
                                        lib,
                                        "linux",
                                        "athena",
                                        "shared",
                                        libName
                                    ).replace(/\\/g, "/"),
                                    remote: join(
                                        "/usr/local/frc/third-party/lib",
                                        libName
                                    ).replace(/\\/g, "/"),
                                })
                            }
                        }
                    })
                }

                const robotBinaryDestination = "/home/lvuser/robot"
                commands.clear()
                commands.show(true)

                let adresses: any[] = [
                    "10.15.74.2",
                    "172.22.11.2",
                    "roborio-1574-frc.local",
                    "roborio-1574-frc",
                    "roborio-1574-frc.lan",
                    "roborio-1574-frc.frc-field.local",
                    "roboRIO-1574-FRC.local",
                ]
                let connects: any[] = []
                adresses.map((adress) => {
                    const ssh = new NodeSSH()

                    connects.push(
                        new Promise((resolve) => {
                            ssh.connect({
                                host: adress,
                                username: "admin",
                            })
                                .then(() => {
                                    resolve({ "adress": adress, "ssh": ssh })
                                })
                                .catch(() => {
                                    if (!isRobotConnected) {
                                        commands.appendLine(
                                            "Cant connect to " + adress
                                        )
                                    }
                                })
                        })
                    )
                })
                Promise.race(connects).then(async (connectionData) => {
                    if (!startedDeploy) {
                        startedDeploy = true
                        const ip = connectionData['adress']
                        const ssh = connectionData['ssh']
                        isRobotConnected = true
                        commands.appendLine("Conneted to " + ip)
                        await runCommand(
                            ssh,
                            ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t"
                        )
                        await runCommand(ssh, `rm -f ${robotBinaryDestination}`)
                        await runCommand(
                            ssh,
                            "sed -i -e 's/\\\"exec /\\\"/' /usr/local/frc/bin/frcRunRobot.sh"
                        )
                        await runCommand(
                            ssh,
                            "sed -i -e 's/^StartupDLLs/;StartupDLLs/' /etc/natinst/share/ni-rt.ini"
                        )

                        await ssh.putFile(robotBinaryLocation, robotBinaryDestination)

                        await runCommand(ssh, `chmod +x ${robotBinaryDestination}`)
                        await runCommand(
                            ssh,
                            `chown lvuser:ni ${robotBinaryDestination}`
                        )
                        await runCommand(
                            ssh,
                            `setcap cap_sys_nice+eip ${robotBinaryDestination}`
                        )

                        await runCommand(ssh, "sync")
                        await runCommand(ssh, "ldconfig")
                        await runCommand(
                            ssh,
                            ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t -r"
                        )
                        if (!isFast) {
                            await ssh.putFiles(moveFiles)
                        }
                        ssh.dispose()
                        ssh.Connection.close()
                        commands.appendLine("Deploy Complete")
                    }
                })
            }
        }
    })
}
export default deploy
