import { platform as processPlatform } from "process"

export const platform =
    processPlatform === "win32"
        ? "windows"
        : processPlatform === "darwin"
        ? "mac"
        : "linux"
