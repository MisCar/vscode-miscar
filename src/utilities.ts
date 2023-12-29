import { execSync } from "child_process"
import { join } from "path"
import { arch, platform as processPlatform } from "process"
import * as vscode from "vscode"
import PHOENIX_5_VENDORDEP from "./vendordeps/phoenix5"
import PHOENIX_6_VENDORDEP from "./vendordeps/phoenix6"
import REVLIB_VENDORDEP from "./vendordeps/revlib"
import {
    FRC_YEAR,
    NI_VERSION,
    OPENCV_VERSION,
    TOOLCHAIN_GCC_VERSION,
    TOOLCHAIN_VERSION,
    WPILIB_VERSION,
} from "./versions"

export const platform =
    processPlatform === "win32"
        ? "windows"
        : processPlatform === "darwin"
        ? arch === "x64"
            ? "mac-x64"
            : "mac-arm"
        : "linux"

export const platformArguments =
    platform === "windows" ? "--config=for-windows" : ""

export const platformStartupArguments =
    platform === "windows" ? "--output_user_root=C:\\bazelroot " : ""

export const bazel = "bazel " + platformStartupArguments

export const python = platform === "windows" ? "py" : "python3"

export const getVersions = () => {
    let LIBMISCAR = ""
    try {
        if (vscode.workspace.workspaceFolders) {
            LIBMISCAR = execSync('git log --format="%H" -n 1', {
                cwd: join(
                    vscode.workspace.workspaceFolders![0].uri.fsPath,
                    "..",
                    "libmiscar"
                ),
            })
                .toString()
                .trim()
        }
    } catch (_) {}

    return {
        NI_VERSION,
        WPILIB_VERSION,
        OPENCV_VERSION,
        FRC_YEAR,
        TOOLCHAIN_VERSION,
        TOOLCHAIN_GCC_VERSION,
        PHOENIX_5: PHOENIX_5_VENDORDEP.version,
        PHOENIX_6: PHOENIX_6_VENDORDEP.version,
        REVLIB: REVLIB_VENDORDEP.version,
        LIBMISCAR,
    }
}
