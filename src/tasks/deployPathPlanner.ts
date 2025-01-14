import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import { status } from '../extension';

let didDeploy = true;
const ADDRESSES = [
    "10.15.74.2",
    "172.22.11.2",
    ".\\deploy\\pathplanner\\paths",
    ".\\deploy\\pathplanner\\autos"
];

let stillTrying = [...ADDRESSES];

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

// Function to collect files recursively (same as before)
async function collectFilesRecursively(uri: vscode.Uri): Promise<string[]> {
    const files: string[] = [];
    try {
        const entries = await vscode.workspace.fs.readDirectory(uri);

        for (const [name, type] of entries) {
            const fullPath = vscode.Uri.joinPath(uri, name);

            if (type === vscode.FileType.Directory) {
                const subFiles = await collectFilesRecursively(fullPath);
                files.push(...subFiles);
            } else if (type === vscode.FileType.File) {
                files.push(fullPath.fsPath);
            }
        }
    } catch (error) {
        console.error('Error reading directory ${uri.fsPath}: ${error.message}');
    }
    return files;
}

// Function to log user-friendly messages to the terminal
function logToTerminal(message: string, terminal: vscode.Terminal) {
    terminal.sendText(`#${message}`);
}

// Function to execute and log SCP commands
function runSCPCommandAndLog(localFilePath: string, remoteFilePath: string, outputChannel: vscode.OutputChannel) {
    const command = `scp "${localFilePath}" admin@10.15.74.2:${remoteFilePath}`;
    


     child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            // vscode.window.showErrorMessage(`problom deploying ${path.basename(localFilePath)}`);
            // status.text = "$(close) miscar: failing"
            didDeploy = false
            outputChannel.appendLine(`⚠️problem deploying ${path.basename(localFilePath)}⚠️`);
            // console.error(`Error during SCP: ${stderr}`);
        } else {
            // if (didDeploy == false){
            //     didDeploy = true
            // }
            outputChannel.appendLine(`✅deployed ${path.basename(localFilePath)} successfully✅`);
            // console.log(`SCP successful: ${stdout}`);
        }
        outputChannel.show();
    });

   

    // Run the SCP command
    // terminal.sendText(command);

    // Log the friendly message to the user
    // logToTerminal(`Copied ${localFilePath} to tobot`, terminal);
}

const deployPathPlanner = async (status: vscode.StatusBarItem) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    status.text = "$(sync~spin) miscar: deploying"
    

    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const pathplannerPath = vscode.Uri.file(path.join(rootPath, 'deploy', 'pathplanner'));

    // Check if the path exists
    try {
        await vscode.workspace.fs.stat(pathplannerPath); // Try accessing the path
    } catch {
        vscode.window.showErrorMessage('The directory deploy/pathplanner does not exist.');
        return;
    }

    const outputChannel = vscode.window.createOutputChannel('Path Planner Deployment');
    outputChannel.show();

    outputChannel.appendLine(`started pathplanner deploy`);
    // const commandreal = `scp "${localFilePath}" admin@10.15.74.2:/home/lvuser/`;
    const command = `scp -r ${pathplannerPath} admin@10.15.74.2:/home/lvuser`

    child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            // vscode.window.showErrorMessage(`problom deploying ${path.basename(localFilePath)}`);
            status.text = "$(close) miscar: failing"
            // didDeploy = false
            outputChannel.appendLine(pathplannerPath.toString());
            outputChannel.appendLine(`⚠️problem deploying ${path.basename(pathplannerPath.toString())}⚠️ ${getRandomInt(0,10) === 5 ? "(Go blame Gil or something IDK🤷‍♂️)" : ""}`);
            outputChannel.appendLine(`${error}`);
            // console.error(`Error during SCP: ${stderr}`);
        } else {
            // if (didDeploy == false){
            //     didDeploy = true
            // }
            outputChannel.appendLine(`✅deployed ${path.basename(pathplannerPath.toString())} successfully✅`);
            console.log(`SCP successful: ${stdout}`);
        }});

     


    
    // console.log(`Collecting files under: ${pathplannerPath.fsPath}`);
    
    // const files = await collectFilesRecursively(pathplannerPath);
    
    // if (files.length === 0) {
        // vscode.window.showInformationMessage('No files found in deploy/pathplanner.');
    // } else {
        // vscode.window.showInformationMessage(`Found ${files.length} files in deploy/pathplanner.`);

        // Create a terminal to run the SCP commands and log messages
        // const terminal = vscode.window.createTerminal("Path Planner Deployment");
        // outputChannel.appendLine('Hello, this is a log message!');
         // Automatically opens the output channel
        
         
         
/*

         outputChannel.show();

        //  for (const file : F)
        files.forEach(file => {
            console.log(`File: ${file}`);

            // Determine the appropriate SCP destination path
            let remotePath = '/home/lvuser/deploy/pathplanner/'; // Default destination

            if (file.includes('paths')) {
                remotePath = '/home/lvuser/deploy/pathplanner/paths';
            } else if (file.includes('autos')) {
                remotePath = '/home/lvuser/deploy/pathplanner/autos';
            }

            // Run the SCP command and log a friendly message to the terminal
            console.log("lior is stupid")

            runSCPCommandAndLog(file, remotePath, outputChannel);
        });


        // Show the terminal to the user
        if (didDeploy)
        {

        }
        console.log("seeeeeee?");
        if (status.text != "$(close) miscar: failing")
        {
    
            status.text = "$(pass) miscar: ready"
        }
    }
        */
};

export default deployPathPlanner;
