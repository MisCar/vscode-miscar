import * as vscode from "vscode"
import { bazel } from "../utilities"
import { NodeSSH } from "node-ssh"
import { addListener } from "process"
import { join } from "path"
import { runInContext } from "vm"

const runCommand = (client: NodeSSH, command: string) => {
    console.log("i try to run " + command)
    client.execCommand(command)
    console.log("i run the command")
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

    const task = new vscode.Task(
        { type: "miscar.deploy" },
        folders[0],
        "Deploy",
        "vscode-miscar",
        new vscode.ShellExecution(bazel + "run robot.deploy --config=for-roborio --ui_event_filters=-info")
    )

    task.presentationOptions.clear = true
    task.presentationOptions.echo = false

    //vscode.tasks.executeTask(task)
    if (vscode.workspace.workspaceFolders) {
        const ssh = new NodeSSH()
        for (const folder of vscode.workspace.workspaceFolders) {
            const robotBinaryLocation = join(folder.uri.fsPath, 'cbuild', 'robot')
            const robotBinaryDestination = "/home/lvuser/robot"
            console.log("i try to connect")
            await ssh.connect({
                host: "10.15.74.2",
                username: "admin",
            })
            console.log("i connected to the robot")
            await runCommand(ssh, ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t")
            await runCommand(ssh, `rm -f ${robotBinaryDestination}`)
            await runCommand(ssh, "sed -i -e 's/\\\"exec /\\\"/' /usr/local/frc/bin/frcRunRobot.sh")
            await runCommand(ssh, "sed -i -e 's/^StartupDLLs/;StartupDLLs/' /etc/natinst/share/ni-rt.ini")

            await ssh.putFile(robotBinaryLocation, robotBinaryDestination)

            await runCommand(ssh, `chmod +x ${robotBinaryDestination}`)
            await runCommand(ssh, `chown lvuser:ni ${robotBinaryDestination}`)
            await runCommand(ssh, `setcap cap_sys_nice+eip ${robotBinaryDestination}`)

            await runCommand(ssh, "sync")
            await runCommand(ssh, "ldconfig")
            await runCommand(ssh, ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t -r")

        }
    }


}






export default deploy
