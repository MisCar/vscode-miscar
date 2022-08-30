import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join } from "path"

let commands = vscode.window.createOutputChannel("Commands")
const runCommand = (client: NodeSSH, command: string) => {
    client.execCommand(command).catch((error: string) => {
        commands.appendLine(error)
    })
    commands.appendLine(command)
}

const deploy = async () => {
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
    vscode.tasks.onDidEndTask(() => {
        const ssh = new NodeSSH()
        for (const folder of folders) {
            const robotBinaryLocation = join(
                folder.uri.fsPath,
                "cbuild",
                "robot"
            )

            const robotBinaryDestination = "/home/lvuser/robot"

            commands.show(true)

            const connect1 = new Promise((resolve) => {
                ssh.connect({
                    host: "10.15.74.2",
                    username: "admin",
                })
                resolve("10.15.74.2")
            })
            const connect2 = new Promise((resolve) => {
                ssh.connect({
                    host: "roborio-1574-frc.local",
                    username: "admin",
                })
                resolve("roborio-1574-frc.local")
            })
            const connect3 = new Promise((resolve) => {
                ssh.connect({
                    host: "172.22.11.2",
                    username: "admin",
                })
                resolve("172.22.11.2")
            })
            const connect4 = new Promise((resolve) => {
                ssh.connect({
                    host: "roborio-1574-frc",
                    username: "admin",
                })
                resolve("roborio-1574-frc")
            })
            const connect5 = new Promise((resolve) => {
                ssh.connect({
                    host: "roborio-1574-frc.lan",
                    username: "admin",
                })
                resolve("roborio-1574-frc.lan")
            })
            const connect6 = new Promise((resolve) => {
                ssh.connect({
                    host: "roborio-1574-frc.frc-field.local",
                    username: "admin",
                })
                resolve("roborio-1574-frc.frc-field.local")
            })
            Promise.race([
                connect1,
                connect2,
                connect3,
                connect4,
                connect5,
                connect6,
            ])
                .then(async (ip) => {
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
                })
                .catch((error) => {
                    commands.appendLine(error)
                })
        }
    })
}

export default deploy
