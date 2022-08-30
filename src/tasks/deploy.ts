import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join, resolve } from "path"
import { readdirSync } from "fs"

let commands = vscode.window.createOutputChannel("Commands")
const runCommand = (client: NodeSSH, command: string) => {
    client.execCommand(command).catch((error: string) => {
        commands.appendLine(error)
    })
    commands.appendLine(command)
}

const deploy = async (context: vscode.ExtensionContext) => {
    let isRobotConnected = false
    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) => execution.task.definition.type === "miscar.deploy"
        )
        .forEach((execution) => execution.terminate())

    const roborioRoot = join(context.globalStorageUri.fsPath, "roborio")
    await vscode.commands.executeCommand("miscar.buildRoboRIO")
    vscode.tasks.onDidEndTask(async () => {
        const ssh = new NodeSSH()
        for (const folder of folders) {
            const robotBinaryLocation = join(
                folder.uri.fsPath,
                "cbuild",
                "robot"
            )

            const libraries = readdirSync(roborioRoot)
            let moveFiles: any[] = []
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

            const robotBinaryDestination = "/home/lvuser/robot"
            commands.clear()
            commands.show(true)

            let connect1 = new Promise(resolve => {
                ssh.connect({ host: '10.15.74.2', username: "admin" }).then(() => {
                    resolve('10.15.74.2')

                })
            })
            let connect2 = new Promise(resolve => {
                ssh.connect({ host: '172.22.11.2', username: "admin" }).then(() => {
                    resolve('172.22.11.2')
                })

            })
            let connect3 = new Promise(resolve => {
                ssh.connect({ host: 'roborio-1574-frc.local', username: "admin" }).then(() => {
                    resolve('roborio-1574-frc.local')
                })

            })
            let connect4 = new Promise(resolve => {
                ssh.connect({ host: 'roborio-1574-frc', username: "admin" }).then(() => {
                    resolve('roborio-1574-frc')
                })

            })
            let connect5 = new Promise(resolve => {
                ssh.connect({ host: 'roborio-1574-frc.lan', username: "admin" }).then(() => {
                    resolve('roborio-1574-frc.lan')
                })

            })
            let connect6 = new Promise(resolve => {
                ssh.connect({ host: 'roborio-1574-frc.frc-field.local', username: "admin" }).then(() => {
                    resolve('roborio-1574-frc.frc-field.local')
                })

            })

            Promise.race([connect1, connect2, connect3, connect4, connect5, connect6]).then(async (ip) => {
                await ssh.connect({ host: '172.22.11.2', username: "admin" })
                commands.appendLine("Connected To " + ip)
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

                await ssh.putFile(
                    robotBinaryLocation,
                    robotBinaryDestination
                )

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

                ssh.putFiles(moveFiles)
                commands.appendLine("Deploy Complete!")
            }).catch(() => {
                commands.appendLine("Can't Connect To Robot!")
            })
        }
        // .catch((error) => {
        //     if (!isRobotConnected) {
        //         commands.appendLine(error)
        //     }
        // })
    }
    )
}

export default deploy
