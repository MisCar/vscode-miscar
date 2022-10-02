import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join } from "path"

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

    vscode.tasks.onDidEndTaskProcess((event) => {
        if (
            event.execution.task.definition.type === "miscar.buildRoboRIO" && event.exitCode === 0) {
            for (const folder of folders) {
                const robotBinaryLocation = join(
                    folder.uri.fsPath,
                    "cbuild",
                    "robot"
                )

                const robotBinaryDestination = "/home/lvuser/robot"
                commands.clear()
                commands.show(true)

                let addresses: any[] = [
                    "10.15.74.2",
                    "172.22.11.2",
                    "roborio-1574-frc.local",
                    "roborio-1574-frc",
                    "roborio-1574-frc.lan",
                    "roborio-1574-frc.frc-field.local",
                    "roboRIO-1574-FRC.local",
                ]
                let connects: any[] = []
                addresses.map((address) => {
                    const ssh = new NodeSSH()

                    connects.push(
                        new Promise((resolve) => {
                            ssh.connect({
                                host: address,
                                username: "admin",
                            })
                                .then(() => {
                                    resolve({ "address": address, "ssh": ssh })
                                })
                                .catch(() => {
                                    if (!isRobotConnected) {
                                        commands.appendLine(
                                            "Cant connect to " + address
                                        )
                                    }
                                })
                        })
                    )
                })
                Promise.race(connects).then(async (connectionData) => {
                    const ip = connectionData['address']
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
                    ssh.despose()
                    commands.appendLine("Deploy Complete")
                })
            }
        }
    })
}
export default fastDeploy
