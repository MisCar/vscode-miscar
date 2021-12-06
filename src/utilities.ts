import { platform as processPlatform } from "process"

export const platform =
    processPlatform === "win32"
        ? "windows"
        : processPlatform === "darwin"
        ? "mac"
        : "linux"

export const platformArguments =
    platform == "windows"
        ? "--config=for-windows --output_user_root=C:\\bazelroot"
        : ""
