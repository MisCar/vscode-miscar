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

const fastDeploy = async () => {
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

    await vscode.commands.executeCommand("miscar.buildRoboRIO")
    vscode.tasks.onDidEndTask(async () => {
        for (const folder of folders) {
            const robotBinaryLocation = join(
                folder.uri.fsPath,
                "cbuild",
                "robot"
            )

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
            // const connect1 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "10.15.74.2",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("10.15.74.2")
            //         })
            //         .catch(() => {
            //             reject("10.15.74.2")
            //         })
            // })
            // const connect2 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "roborio-1574-frc.local",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("roborio-1574-frc.local")
            //         })
            //         .catch(() => {
            //             reject("roborio-1574-frc.local")
            //         })
            // })
            // const connect3 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "172.22.11.2",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("172.22.11.2")
            //         })
            //         .catch(() => {
            //             reject("172.22.11.2")
            //         })
            // })
            // const connect4 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "roborio-1574-frc",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("roborio-1574-frc")
            //         })
            //         .catch(() => {
            //             reject("roborio-1574-frc")
            //         })
            // })
            // const connect5 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "roborio-1574-frc.lan",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("roborio-1574-frc.lan")
            //         })
            //         .catch(() => {
            //             reject("roborio-1574-frc.lan")
            //         })
            // })
            // const connect6 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "roborio-1574-frc.frc-field.local",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("roborio-1574-frc.frc-field.local")
            //         })
            //         .catch(() => {
            //             reject("roborio-1574-frc.frc-field.local")
            //         })
            // })
            // const connect7 = new Promise((resolve, reject) => {
            //     ssh.connect({
            //         host: "roboRIO-1574-FRC.local",
            //         username: "admin",
            //     })
            //         .then(() => {
            //             resolve("roboRIO-1574-FRC.local")
            //         })
            //         .catch(() => {
            //             reject("roboRIO-1574-FRC.local")
            //         })
            // })
            Promise.race(connects).then(async (connectionData) => {
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

                commands.appendLine("Deploy Complete")
            })
        }
    })
}
export default fastDeploy
