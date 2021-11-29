import * as vscode from "vscode"

const openCommandPalette = () =>
    vscode.commands.executeCommand("workbench.action.quickOpen", "> MisCar: ")

export default openCommandPalette
