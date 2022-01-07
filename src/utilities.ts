import { platform as processPlatform } from "process"

export const platform =
    processPlatform === "win32"
        ? "windows"
        : processPlatform === "darwin"
        ? "mac"
        : "linux"

export const platformArguments =
    platform == "windows" ? "--config=for-windows" : ""

export const platformStartupArguments =
    platform == "windows" ? "--output_user_root=C:\\bazelroot " : ""

export const bazel = "bazel " + platformStartupArguments
