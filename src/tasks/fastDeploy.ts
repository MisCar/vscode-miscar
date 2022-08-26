import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join } from "path"

const runCommand = (client: NodeSSH, command: string) => {
    client.execCommand(command)
}

const fastDeploy = async (context: vscode.ExtensionContext) => {
    await vscode.workspace.saveAll()

    const folders = vscode.workspace.workspaceFolders
    if (folders === undefined) {
        return
    }

    vscode.tasks.taskExecutions
        .filter(
            (execution) =>
                execution.task.definition.type === "miscar.fastDeploy"
        )
        .forEach((execution) => execution.terminate())

    const ssh = new NodeSSH()
    for (const folder of folders) {
        const robotBinaryLocation = join(folder.uri.fsPath, "cbuild", "robot")

        const robotBinaryDestination = "/home/lvuser/robot"
        await ssh.connect({
            host: "10.15.74.2",
            username: "admin",
        })
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
        await runCommand(ssh, `chown lvuser:ni ${robotBinaryDestination}`)
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
    }
}

export default fastDeploy
