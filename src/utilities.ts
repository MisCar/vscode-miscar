import { arch, platform as processPlatform } from "process"

export const platform =
    processPlatform === "win32"
        ? "windows"
        : processPlatform === "darwin" && arch == "x64"
        ? "mac-x64"
        : processPlatform === "darwin" && arch == "arm64"
        ? "mac-arm"
        : "linux"

export const platformArguments =
    platform == "windows" ? "--config=for-windows" : ""

export const platformStartupArguments =
    platform == "windows" ? "--output_user_root=C:\\bazelroot " : ""

export const bazel = "bazel " + platformStartupArguments

export const python = platform === "windows" ? "py" : "python3"
