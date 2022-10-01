import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join, resolve } from "path"
import { readdirSync } from "fs"

const ADDRESSES = [
    "10.15.74.2",
    "172.22.11.2",
    "roborio-1574-frc.local",
    "roborio-1574-frc",
    "roborio-1574-frc.lan",
    "roborio-1574-frc.frc-field.local",
    "roboRIO-1574-FRC.local",
]

let commands = vscode.window.createOutputChannel("Commands")
const runCommand = async (client: NodeSSH, command: string) => {
    while (!client.isConnected());
    await client.execCommand(command).catch((error: string) => {
        commands.appendLine(error)
        commands.appendLine("connection status " + client.isConnected())
    })
    commands.appendLine(command)
}

const raceFirstSuccess = (promises: Promise<any>[]) => {
    return Promise.all(promises.map(p =>
        p.then(
            value => Promise.reject(value),
            error => Promise.resolve(error)
        )
    )).then(
        errors => {
            Promise.reject(errors)
        },
        value => {
            Promise.resolve(value)
        }
    );
}

let stillTrying = [...ADDRESSES]

const deploy = async (context: vscode.ExtensionContext, isFast: boolean) => {
    let isRobotConnected = false
    let startedDeploy = false
    let finishedFirstBuild = false
    let failedConnects = 0
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
            event.execution.task.definition.type === "miscar.buildRoboRIO" && event.exitCode === 0 && !finishedFirstBuild) {
            finishedFirstBuild = true
            for (const folder of folders) {
                stillTrying = [...ADDRESSES]
                const robotBinaryLocation = join(
                    folder.uri.fsPath,
                    "build/roborio",
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

                let connects: Promise<{
                    "adress": string,
                    "ssh": NodeSSH
                }>[] = ADDRESSES.map((address) => {
                    const ssh = new NodeSSH()

                    return (
                        new Promise((resolve, reject) => {
                            ssh.connect({
                                host: address,
                                username: "admin",
                            })
                                .then(() => {
                                    resolve({ "adress": address, "ssh": ssh })
                                })
                                .catch((e) => {
                                    failedConnects++
                                    if (!isRobotConnected && stillTrying.includes(address)) {
                                        stillTrying.splice(stillTrying.indexOf(address), 1)
                                        commands.appendLine(
                                            "Cant connect to " + address
                                        )
                                    }
                                    ssh.dispose()
                                    if (failedConnects == ADDRESSES.length) {
                                        reject(e)
                                    }
                                })
                        })
                    )
                })

                Promise.race(connects).then(async (connectionData: any) => {

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

                        await runCommand(ssh, `echo ${robotBinaryDestination} > /home/lvuser/robotCommand`)
                        await runCommand(ssh, "chmod +x /home/lvuser/robotCommand")
                        await runCommand(ssh, "chown lvuser:ni /home/lvuser/robotCommand")

                        if (!isFast) {
                            await ssh.putFiles(moveFiles)
                        }

                        commands.appendLine("Restarting Robot Code...")
                        await runCommand(ssh, "sync")
                        await runCommand(ssh, "ldconfig")
                        await runCommand(
                            ssh,
                            ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t -r"
                        )

                        ssh.dispose()
                        for (const p of connects) {
                            p.then(({ ssh }) => ssh.dispose())
                        }
                        commands.appendLine("Deploy Complete")
                    }
                }).catch(() => {
                    commands.appendLine("Deploy Failed")
                    console.log("Failed to deploy")
                })

            }
        }
    })
}
export default deploy
