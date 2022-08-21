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
var fs = require("fs")
const SOURCES = "${SOURCES}"
const NI_VERSION = "2022.4.0"
const WPILIB_VERSION = "2022.4.1"
const OPENCV_VERSION = "4.5.2-1"
const TOOLCHAIN_VERSION = "v2022-1"
const TOOLCHAIN_GCC_VERSION = "7.3.0"
const NI_LIBRARIES = ["visa", "netcomm", "chipobject", "runtime"]
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

const formatMavenUrl = (
    library: string,
    version: string,
    base: string,
    type = "headers"
) => {
    return `${base}/${library}/${version}/${library}-${version}-${type}.zip`
}

const getLibrary = (root: string, library: string, url: string) => {
    return new Promise<void>((resolve, reject) => {
        const libraryPath = join(root, library)
        if (existsSync(libraryPath)) {
            libraries.push(libraryPath)
            resolve()
            return
        }

        mkdirSync(libraryPath)
        getWithRedirects(url, (response) => {
            const zipPath = join(root, library, "download.zip")
            const stream = createWriteStream(zipPath)
            response.pipe(stream)
            stream.on("finish", () => {
                try {
                    if (platform === "windows" || url.endsWith(".tar.gz")) {
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
        })
    })
}

const createCompileFlags = async (context: vscode.ExtensionContext) => {
    const localLibraryType =
        platform === "windows"
            ? "windowsx86-64"
            : platform === "mac"
            ? "osxx86-64"
            : "linuxx86-64"
    libraries = []
    if (!existsSync(context.globalStorageUri.fsPath)) {
        mkdirSync(context.globalStorageUri.fsPath)
    }
    const headersRoot = join(context.globalStorageUri.fsPath, "headers")
    const localRoot = join(context.globalStorageUri.fsPath, "local")
    const roborioRoot = join(context.globalStorageUri.fsPath, "roborio")
    if (!existsSync(headersRoot)) {
        mkdirSync(headersRoot)
    }

    if (!existsSync(localRoot)) {
        mkdirSync(localRoot)
    }

    if (!existsSync(roborioRoot)) {
        mkdirSync(roborioRoot)
    }

    const promises: Promise<void>[] = []
    for (const library of NI_LIBRARIES) {
        promises.push(
            getLibrary(
                headersRoot,
                library,
                formatMavenUrl(
                    library,
                    NI_VERSION,
                    "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/ni-libraries"
                )
            )
        )
        promises.push(
            getLibrary(
                roborioRoot,
                library,
                formatMavenUrl(
                    library,
                    NI_VERSION,
                    "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/ni-libraries",
                    "linuxathena"
                )
            )
        )
    }

    for (const library of WPILIB_LIBRARIES) {
        promises.push(
            getLibrary(
                headersRoot,
                library + "-cpp",
                formatMavenUrl(
                    library + "-cpp",
                    WPILIB_VERSION,
                    "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
                        library
                )
            )
        )
        promises.push(
            getLibrary(
                localRoot,
                library,
                formatMavenUrl(
                    library + "-cpp",
                    WPILIB_VERSION,
                    "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
                        library,
                    localLibraryType
                )
            )
        )
        promises.push(
            getLibrary(
                roborioRoot,
                library,
                formatMavenUrl(
                    library + "-cpp",
                    WPILIB_VERSION,
                    "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
                        library,
                    "linuxathena"
                )
            )
        )
    }
    promises.push(
        getLibrary(
            headersRoot,
            "opencv-cpp",
            `https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/thirdparty/frc2022/opencv/opencv-cpp/${OPENCV_VERSION}/opencv-cpp-${OPENCV_VERSION}-headers.zip`
        )
    )
    promises.push(
        getLibrary(
            localRoot,
            "opencv-cpp",
            `https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/thirdparty/frc2022/opencv/opencv-cpp/${OPENCV_VERSION}/opencv-cpp-${OPENCV_VERSION}-${localLibraryType}.zip`
        )
    )
    promises.push(
        getLibrary(
            localRoot,
            "opencv-cpp",
            `https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/thirdparty/frc2022/opencv/opencv-cpp/${OPENCV_VERSION}/opencv-cpp-${OPENCV_VERSION}-linuxathena.zip`
        )
    )

    let toolChainUrl = ""
    if (platform == "windows") {
        toolChainUrl = `https://github.com/wpilibsuite/roborio-toolchain/releases/download/${TOOLCHAIN_VERSION}/FRC-2022-Windows64-Toolchain-${TOOLCHAIN_GCC_VERSION}.zip`
    } else if (platform == "linux") {
        toolChainUrl = `https://github.com/wpilibsuite/roborio-toolchain/releases/download/${TOOLCHAIN_VERSION}/FRC-2022-Linux-Toolchain-${TOOLCHAIN_GCC_VERSION}.tar.gz`
    } else {
        toolChainUrl = `https://github.com/wpilibsuite/roborio-toolchain/releases/download/${TOOLCHAIN_VERSION}/FRC-2022-Mac-Toolchain-${TOOLCHAIN_GCC_VERSION}.tar.gz`
    }

    promises.push(
        getLibrary(
            context.globalStorageUri.fsPath,
            "roborio-toolchain",
            toolChainUrl
        )
    )

    for (const vendordep of vendordeps) {
        for (const dependency of vendordep.cppDependencies) {
            promises.push(
                getLibrary(
                    headersRoot,
                    dependency.artifactId,
                    formatMavenUrl(
                        dependency.artifactId,
                        dependency.version,
                        vendordep.mavenUrls[0] +
                            dependency.groupId.replace(/\./g, "/")
                    )
                )
            )

            promises.push(
                getLibrary(
                    localRoot,
                    dependency.artifactId,
                    formatMavenUrl(
                        dependency.artifactId,
                        dependency.version,
                        vendordep.mavenUrls[0] +
                            dependency.groupId.replace(/\./g, "/"),
                        localLibraryType
                    )
                )
            )

            if (dependency.binaryPlatforms.includes("linuxathena")) {
                promises.push(
                    getLibrary(
                        roborioRoot,
                        dependency.artifactId,
                        formatMavenUrl(
                            dependency.artifactId,
                            dependency.version,
                            vendordep.mavenUrls[0] +
                                dependency.groupId.replace(/\./g, "/"),
                            "linuxathena"
                        )
                    )
                )
            }
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
    let locallibrarys = []
    let headerslibrarys = []
    for (const folder of libraries) {
        console.log(locallibrarys.length)
        try {
            writeFileSync(join(folder, "compile_flags.txt"), compileFlags)
            console.log(folder)
            if (folder.includes("headers")) {
                headerslibrarys.push(folder)
            } else if (folder.includes("local")) {
                locallibrarys.push(folder)
            }
        } catch (_) {}
    }

    if (vscode.workspace.workspaceFolders) {
        for (const dir of vscode.workspace.workspaceFolders) {
            const CMAKE_PATH = join(dir.uri.fsPath, "CMakeLists.txt")
            writeFileSync(
                CMAKE_PATH,
                `cmake_minimum_required(VERSION 3.10)
set(CMAKE_CPP_STANDARD 17)
project(robot)
include_directories(src/main/cpp)

${headerslibrarys
    .map((f) => `include_directories(${f})`.replace(/\\/g, "/"))
    .join("\n")}

                ${fs
                    .readdirSync(
                        "C:/Users/lior1/AppData/Roaming/Code/User/globalStorage/miscar.vscode-miscar/local"
                    )
                    .map((dir: string) => {
                        return fs
                            .readdirSync(
                                "C:/Users/lior1/AppData/Roaming/Code/User/globalStorage/miscar.vscode-miscar/local/" +
                                    dir +
                                    "/windows/x86-64/shared"
                            )
                            .map((file: string) => {
                                if (file.includes(".lib")) {
                                    console.log("zaks")
                                    return `add_library(${dir}-${file.replace(
                                        ".lib",
                                        ""
                                    )} STATIC IMPORTED)
set_property(TARGET ${dir}-${file.replace(
                                        ".lib",
                                        ""
                                    )} PROPERTY IMPORTED_LOCATION C:/Users/lior1/AppData/Roaming/Code/User/globalStorage/miscar.vscode-miscar/local/${dir}/windows/x86-64/shared/${file})
 
`
                                }
                            })
                            .filter((val: string) => {
                                console.log(val)
                                return val != ""
                            })
                            .join("")
                    })
                    .join("")}
file(GLOB_RECURSE SOURCES "src/main/cpp/*.cpp")

add_executable(robot ${SOURCES})

${fs
    .readdirSync(
        "C:/Users/lior1/AppData/Roaming/Code/User/globalStorage/miscar.vscode-miscar/local"
    )
    .map((dir: string) => {
        return fs
            .readdirSync(
                "C:/Users/lior1/AppData/Roaming/Code/User/globalStorage/miscar.vscode-miscar/local/" +
                    dir +
                    "/windows/x86-64/shared"
            )
            .map((file: string) => {
                return `target_link_libraries(robot ${dir}-${
                    file.split(".")[0]
                })
set_target_properties(${dir}-${
                    file.split(".")[0]
                } PROPERTIES LINKER_LANGUAGE CXX)
`
            })
            .filter((val: string) => {
                console.log(val)
                return val != ""
            })
            .join("")
    })
    .join("")}

target_compile_features(robot PRIVATE cxx_std_17)`
            )
        }
    }

    vscode.window.showInformationMessage("Succesfully created compile flags")
}

export default createCompileFlags
