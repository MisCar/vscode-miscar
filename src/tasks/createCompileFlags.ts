import * as vscode from "vscode"
import {
    createWriteStream,
    existsSync,
    mkdirSync,
    rmSync,
    writeFileSync,
} from "fs"
import { join } from "path"
import { get as httpGet } from "http"
import { get as httpsGet } from "https"
import { execSync } from "child_process"
import { IncomingMessage } from "http"
import vendordeps from "../vendordeps"
import { platform } from "../utilities"

const NI_VERSION = "2022.2.3"
const WPILIB_VERSION = "2022.1.1"
const NI_LIBRARIES = ["visa", "netcomm", "chipobject"]
const WPILIB_LIBRARIES = [
    "wpilibc",
    "wpiutil",
    "wpimath",
    "ntcore",
    "cscore",
    "hal",
    "cameraserver",
    "wpilibNewCommands",
]

let libraries: string[] = []

const getWithRedirects = (
    url: string,
    callback: (message: IncomingMessage) => void
) => {
    // REV has a certificate issue
    let get = httpsGet
    if (url.startsWith("https://maven.revrobotics.com")) {
        url = url.replace("https", "http")
        get = httpGet
    }
    get(url, (response) => {
        if (
            response.statusCode &&
            Math.floor(response.statusCode / 100) === 3 &&
            response.headers.location
        ) {
            getWithRedirects(response.headers.location, callback)
        } else {
            callback(response)
        }
    }).addListener("error", (err) => {
        console.error(err)
    })
}

const getLibrary = (
    root: string,
    library: string,
    version: string,
    base: string
) => {
    return new Promise<void>((resolve, reject) => {
        const libraryPath = join(root, library)
        if (existsSync(libraryPath)) {
            libraries.push(libraryPath)
            resolve()
            return
        }

        mkdirSync(libraryPath)
        getWithRedirects(
            `${base}/${library}/${version}/${library}-${version}-headers.zip`,
            (response) => {
                const zipPath = join(root, library, "headers.zip")
                const stream = createWriteStream(zipPath)
                response.pipe(stream)
                stream.on("finish", () => {
                    try {
                        if (platform === "windows") {
                            execSync(`tar -xf "${zipPath}"`, {
                                cwd: libraryPath,
                            })
                        } else {
                            execSync(`unzip "${zipPath}"`, { cwd: libraryPath })
                        }
                        rmSync(zipPath)
                    } catch (_) {}

                    libraries.push(libraryPath)
                    resolve()
                })
            }
        )
    })
}

const createCompileFlags = async (context: vscode.ExtensionContext) => {
    libraries = []
    const root = context.globalStorageUri.fsPath
    if (!existsSync(root)) {
        mkdirSync(root)
    }

    const promises: Promise<void>[] = []
    for (const library of NI_LIBRARIES) {
        promises.push(
            getLibrary(
                root,
                library,
                NI_VERSION,
                "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/ni-libraries"
            )
        )
    }

    for (const library of WPILIB_LIBRARIES) {
        promises.push(
            getLibrary(
                root,
                library + "-cpp",
                WPILIB_VERSION,
                "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
                    library
            )
        )
    }

    for (const vendordep of vendordeps) {
        for (const dependency of vendordep.cppDependencies) {
            promises.push(
                getLibrary(
                    root,
                    dependency.artifactId,
                    dependency.version,
                    vendordep.mavenUrls[0] +
                        dependency.groupId.replace(/\./g, "/")
                )
            )
        }
    }

    await Promise.all(promises)

    if (vscode.workspace.workspaceFolders) {
        for (const folder of vscode.workspace.workspaceFolders) {
            libraries.push(join(folder.uri.fsPath, "src", "main", "cpp"))
            libraries.push(
                join(folder.uri.fsPath, "..", "libmiscar", "src", "main", "cpp")
            )
        }
    }
    const libraryIncludes = libraries
        .map((library) => "-I" + library.replace(/\\/g, "/"))
        .join("\n")
    const compileFlags = libraryIncludes + "\n-std=c++17\n-xc++"
    for (const folder of libraries) {
        try {
            writeFileSync(join(folder, "compile_flags.txt"), compileFlags)
        } catch (_) {}
    }
    vscode.window.showInformationMessage("Succesfully created compile flags")
}

export default createCompileFlags
