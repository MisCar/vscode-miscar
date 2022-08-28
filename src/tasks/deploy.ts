import * as vscode from "vscode"
import { NodeSSH } from "node-ssh"
import { join } from "path"
import { readdir, readdirSync, readFileSync } from "fs"

const runCommand = (client: NodeSSH, command: string) => {
    client.execCommand(command)
}

const deploy = async (context: vscode.ExtensionContext) => {
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
    vscode.commands.executeCommand("miscar.buildRoboRIO")
    const ssh = new NodeSSH()
    for (const folder of folders) {
        const robotBinaryLocation = join(folder.uri.fsPath, "cbuild", "robot")

        const libraries = readdirSync(roborioRoot)
        //ssh.putFiles()
        let moveFiles: any[] = []
        libraries.map((lib) => {
            if (readdirSync(join(roborioRoot, lib)).length != 0) {
                console.log(join(roborioRoot, lib, "linux", "athena", "shared"))
                let libnames = readdirSync(
                    join(roborioRoot, lib, "linux", "athena", "shared")
                )
                libnames = libnames.filter((lib) => {
                    return !lib.includes("debug")
                })
                for (let libName of libnames) {
                    console.log(libName)
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
        // await ssh.putFile('C:\\Users\\progr\\AppData\\Roaming\\Code\\User\\globalStorage\\miscar.vscode-miscar\\roborio\\REVLib-cpp\\linux\\athena\\shared\\libREVlib.so'.replace(/\\/g, "/"), '/usr/local/frc/third-party/lib/libREVLib.so')
        // await ssh.putFile('C:\\Users\\progr\\AppData\\Roaming\\Code\\User\\globalStorage\\miscar.vscode-miscar\\roborio\\REVLib-driver\\linux\\athena\\shared\\libREVLibDriver.so'.replace(/\\/g, "/"), '/usr/local/frc/third-party/lib/libREVLibDriver.so')

        ssh.putFiles(moveFiles)
    }
}

export default deploy
