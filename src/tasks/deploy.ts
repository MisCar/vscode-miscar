import * as vscode from "vscode"
import { bazel } from "../utilities"
import { NodeSSH } from "node-ssh"
import { addListener } from "process"
import { join } from "path"
import { runInContext } from "vm"

const runCommand = (client: NodeSSH, command: string) => {
    const [cmd, ...parameters] = command.split(" ")
    client.exec(cmd, parameters)
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
            const robotBinaryDestination = join(folder.uri.fsPath, 'cbuild', 'robot')
            await ssh.connect({
                host: "10.15.74.2",
                username: "admin",
            })
            await runCommand(ssh, ". /etc/profile.d/natinst-path.sh; /usr/local/frc/bin/frcKillRobot.sh -t")
            await runCommand(ssh, "rm -f ${robotBinaryDestination}")
            await runCommand(ssh, "sed -i -e 's/\\\"exec /\\\"/' /usr/local/frc/bin/frcRunRobot.sh")
            await runCommand(ssh, "sed -i -e 's/^StartupDLLs/;StartupDLLs/' /etc/natinst/share/ni-rt.ini")

            await ssh.putFile(robotBinaryDestination, "/home/lvuser/robot")

            await runCommand(ssh, `chmod -x ${robotBinaryDestination}`)
            await runCommand(ssh, `chown lvuser:ni ${robotBinaryDestination}`)
            await runCommand(ssh, `setcap cap_sys_nice+eip ${robotBinaryDestination}`)


        }
    }


}


}



export default deploy
