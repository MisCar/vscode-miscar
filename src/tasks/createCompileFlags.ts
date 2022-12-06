import {
    createWriteStream,
    existsSync,
    mkdirSync,
    readdirSync,
    rmSync,
    writeFileSync
} from "fs"
import { basename, join } from "path"
import * as vscode from "vscode"
// import { get as httpGet } from "http"
import { execSync } from "child_process"
import { IncomingMessage } from "http"
import { get } from "https"
import { arch } from "process"
import { status, STATUS_READY } from "../extension"
import { platform } from "../utilities"
import vendordeps from "../vendordeps"

const NI_VERSION = "2023.1.0"
const WPILIB_VERSION = "2023.1.1-beta-4"

const OPENCV_VERSION = "4.6.0-3"
const FRC_YEAR = "frc2023"

const TOOLCHAIN_VERSION = "v2023-7"
const TOOLCHAIN_GCC_VERSION = "12.1.0"
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
    'wpinet'
]

const TOOLCHAIN_URL =
    platform == "windows"
        ? `https://github.com/wpilibsuite/opensdk/releases/download/${TOOLCHAIN_VERSION}/cortexa9_vfpv3-roborio-academic-2023-x86_64-w64-mingw32-Toolchain-${TOOLCHAIN_GCC_VERSION}.zip`
        : platform == "linux"
            ? `https://github.com/wpilibsuite/opensdk/releases/download/${TOOLCHAIN_VERSION}/cortexa9_vfpv3-roborio-academic-2023-armv6-bullseye-linux-gnueabihf-Toolchain-${TOOLCHAIN_GCC_VERSION}.tgz`
            : platform == "mac-arm" ? `https://github.com/wpilibsuite/opensdk/releases/download/${TOOLCHAIN_VERSION}/cortexa9_vfpv3-roborio-academic-2023-arm64-apple-darwin-Toolchain-${TOOLCHAIN_GCC_VERSION}.tgz` :
                `https://github.com/wpilibsuite/opensdk/releases/download/${TOOLCHAIN_VERSION}/cortexa9_vfpv3-roborio-academic-2023-x86_64-apple-darwin-Toolchain-${TOOLCHAIN_GCC_VERSION}.tgz`

const localLibraryType =
    platform === "windows"
        ? "windowsx86-64"
        : platform.includes("mac")
            ? "osxx86-64"
            : "linuxx86-64"

let libraries: string[] = []

const getWithRedirects = (
    url: string,
    callback: (message: IncomingMessage) => void
) => {
    // REV has fixed its certificate issue

    // let get = httpsGet
    // if (url.startsWith("https://maven.revrobotics.com")) {
    //     url = url.replace("https", "http")
    //     get = httpGet
    // }
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
        console.error(`Error fetching ${url}: ${err}`)
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
            if (
                readdirSync(libraryPath).filter((f) => f != "compile_flags.txt")
                    .length > 0
            ) {
                libraries.push(libraryPath)
            }

            resolve()
            return
        }

        mkdirSync(libraryPath)
        console.log(url)
        getWithRedirects(url, (response) => {
            if (response.statusCode === 404) {
                console.log(
                    `WARNING: Skipping ${url} because server returned 404.`
                )
                resolve()
                return
            }
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
                } catch (_) { }

                libraries.push(libraryPath)
                resolve()
            })
        })
    })
}

let remainingLibraries = 0
let stage = ""
const queuePromise = async (p: Promise<void>) => {
    remainingLibraries++
    p.then(() => {
        remainingLibraries--
        status.text = `$(sync~spin) miscar: downloading ${stage} (${remainingLibraries} remaining)`
    })
    promises.push(p)
    if (promises.length >= 15) {
        await Promise.all(promises)
        promises.splice(0)
    }
}

const MAVEN_NAMES: any = {
    header: "headers",
    roborio: "linuxathena",
    local: localLibraryType,
}
const ALL_PLATFORMS = ["header", "roborio", "local"]

const installAll = async (
    library: string,
    version: string,
    base: string,
    platforms = ALL_PLATFORMS
) => {
    for (const platform of platforms) {
        await queuePromise(
            getLibrary(
                root[platform],
                library,
                formatMavenUrl(library, version, base, MAVEN_NAMES[platform])
            )
        )
    }
}

let root: { [key: string]: string } = {
    header: "",
    local: "",
    roborio: "",
}
let promises: Promise<void>[] = []

const createCompileFlags = async (context: vscode.ExtensionContext) => {
    console.log(arch)
    libraries = []

    root.all = context.globalStorageUri.fsPath
    root.header = join(context.globalStorageUri.fsPath, "headers")
    root.local = join(context.globalStorageUri.fsPath, "local")
    root.roborio = join(context.globalStorageUri.fsPath, "roborio")

    for (const r of ["all", "header", "local", "roborio"]) {
        if (!existsSync(root[r])) {
            mkdirSync(root[r])
        }
    }

    stage = "ni libraries"
    for (const library of NI_LIBRARIES) {
        await installAll(
            library,
            NI_VERSION,
            "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/ni-libraries",
            ["header", "roborio"]
        )
    }

    stage = "wpilib"
    for (const library of WPILIB_LIBRARIES) {
        await installAll(
            library + "-cpp",
            WPILIB_VERSION,
            "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
            library
        )
    }

    await installAll(
        "opencv-cpp",
        OPENCV_VERSION,
        `https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/thirdparty/${FRC_YEAR}/opencv`
    )

    stage = "toolchain"
    await queuePromise(
        getLibrary(context.globalStorageUri.fsPath, "toolchain", TOOLCHAIN_URL)
    )

    for (const vendordep of vendordeps) {
        stage = vendordep.name.toLowerCase()
        for (const dependency of vendordep.cppDependencies) {
            let mavenUrl = vendordep.mavenUrls[0]
            if (!mavenUrl.endsWith("/")) {
                mavenUrl += "/"
            }

            await installAll(
                dependency.artifactId,
                dependency.version,
                mavenUrl + dependency.groupId.replace(/\./g, "/")
            )
        }
    }

    await Promise.all(promises)
    status.text = STATUS_READY

    let localDirectories = []
    let headerDirectories = []
    const roborioDirectories = []
    for (const folder of libraries) {
        if (folder.includes("headers")) {
            headerDirectories.push(folder)
        } else if (folder.includes("local")) {
            localDirectories.push(folder)
        } else if (folder.includes("roborio")) {
            roborioDirectories.push(folder)
        }
    }

    if (vscode.workspace.workspaceFolders) {
        for (const folder of vscode.workspace.workspaceFolders) {
            libraries.push(join(folder.uri.fsPath, "src", "main", "cpp"))
            headerDirectories.push(
                join(folder.uri.fsPath, "src", "main", "cpp")
            )
            libraries.push(
                join(folder.uri.fsPath, "..", "libmiscar", "src", "main", "cpp")
            )
            headerDirectories.push(
                join(folder.uri.fsPath, "..", "libmiscar", "src", "main", "cpp")
            )
        }
    }
    const libraryIncludes = headerDirectories
        .map((library) => "-I" + library.replace(/\\/g, "/"))
        .join("\n")
    const compileFlags = libraryIncludes + "\n-std=c++20\n-xc++"
    for (const folder of libraries) {
        try {
            writeFileSync(join(folder, "compile_flags.txt"), compileFlags)
        } catch (_) { }
    }
    if (vscode.workspace.workspaceFolders) {
        for (const dir of vscode.workspace.workspaceFolders) {
            writeFileSync(
                join(dir.uri.fsPath, "CMakeLists.txt"),
                `
#firsttime
cmake_minimum_required(VERSION 3.10)
set(CMAKE_CPP_STANDARD 20)
set(CMAKE_CXX_FLAGS "\${CMAKE_CXX_FLAGS} -pthread")
project(robot)

file(GLOB_RECURSE SOURCES "src/main/cpp/*.cpp")
add_executable(robot \${SOURCES})
file(GLOB_RECURSE LIBMISCAR "c:/Users/progr/Developer/libmiscar/src/main/cpp/miscar/*.cpp" )
target_sources(robot PRIVATE  \${LIBMISCAR})
set_property(TARGET robot PROPERTY CXX_STANDARD 20)
target_compile_options(robot PUBLIC -Wno-psabi)
include_directories(src/main/cpp)

${headerDirectories
                    .map((f) => `include_directories(SYSTEM "${f}")`.replace(/\\/g, "/"))
                    .join("\n")}
if(IS_ROBORIO)

${roborioDirectories
                    .map((dir) => {
                        const objectDirectory = join(dir, "linux", "athena", "shared")
                        return readdirSync(objectDirectory)
                            .filter(
                                (f) =>
                                    f.includes(".so") &&
                                    !f.includes(".debug") &&
                                    !f.includes("opencv_java")
                            )
                            .map((file) => {
                                const libraryName = basename(dir) + "_" + file.split(".")[0]
                                return `

add_library(${libraryName} STATIC IMPORTED)
set_property(TARGET ${libraryName} PROPERTY IMPORTED_LOCATION "${join(
                                    objectDirectory,
                                    file
                                ).replace(/\\/g, "/")}")
set_target_properties(${libraryName} PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(robot ${libraryName})`
                            })
                            .join("\n")
                    })
                    .join("\n")}
else()
${localDirectories
                    .map((dir) => {
                        let objectDirectory = "";
                        if (platform == "windows") {
                            objectDirectory = join(dir, "windows", "x86-64", "shared")
                        } else if (platform.includes("mac")) {
                            objectDirectory = join(dir, "osx", "x86-64", "shared")
                        } else if (platform == "linux") {
                            objectDirectory = join(dir, "linux", "x86-64", "shared")
                        }

                        return readdirSync(objectDirectory)
                            .filter(
                                (f) =>
                                    !f.includes(".debug") &&
                                    !f.includes("opencv_java") &&
                                    f.includes(".lib")
                            )
                            .map((file) => {
                                const libraryName = basename(dir) + "_" + file.split(".")[0]
                                return `add_library(${libraryName} STATIC IMPORTED)
set_property(TARGET ${libraryName} PROPERTY IMPORTED_LOCATION "${join(
                                    objectDirectory,
                                    file
                                ).replace(/\\/g, "/")}")
set_target_properties(${libraryName} PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(robot ${libraryName})`
                            })
                            .join("\n")
                    })
                    .join("\n")} 



endif()`
            )

            const toolchainRoot = join(
                root.all,
                "toolchain",
                "roborio-academic"
            ).replace(/\\/g, "/")
            let executableExtension = ""
            if (platform == "windows") {
                executableExtension = ".exe"
            }

            console.log(toolchainRoot)

            writeFileSync(
                join(dir.uri.fsPath, "roborio.toolchain.cmake"),
                `set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_VERSION 1)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(CMAKE_SYSROOT "${join(
                    toolchainRoot,
                    "arm-nilrt-linux-gnueabi",
                    "sysroot"
                ).replace(/\\/g, "/")}")

set(CMAKE_C_COMPILER "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-gcc${executableExtension}")
set(CMAKE_CXX_COMPILER "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-g++${executableExtension}")
set(CMAKE_FORTRAN_COMPILER "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-gfortran")

set(CMAKE_AR "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-ar")
set(CMAKE_AS "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-as")
set(CMAKE_NM "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-nm")
set(CMAKE_LINKER "${toolchainRoot}/bin/arm-frc2023-linux-gnueabi-ld")

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)`
            )
        }
    }

    if (vscode.workspace.workspaceFolders != undefined) {
        if (!existsSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build"))) {
            mkdirSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build"))
        }

        if (!existsSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "roborio"))) {
            mkdirSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "roborio"))
        }

        if (!existsSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "local"))) {
            mkdirSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "local"))
        }

        if (!existsSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "roborio", "build.py"))) {

            const pyfile: string = `import subprocess
from colorama import Fore
from colorama import Style
import sys
import datetime

pre_process = subprocess.Popen("cmake ../.. -GNinja -DCMAKE_TOOLCHAIN_FILE=../../roborio.toolchain.cmake -DIS_ROBORIO=TRUE", stdout=subprocess.PIPE)
while True:
    line = pre_process.stdout.readline()
    if not line:
        break           
    if line == b"": 
        continue
    print(line.decode())
process = subprocess.Popen("ninja -k 1", stdout=subprocess.PIPE)

need_space = False
last_line = ""
while True:
    line = process.stdout.readline()
    if not line:
        break           
    if line == b"": 
        continue
    if("In file included from" in line.decode() or "arm-frc2022-linux-gnueabi-g++.exe" in line.decode()):
        continue
    if(need_space and "FAILED" in line.decode()):
        print("\\n\\n")
        print(line.decode().replace("FAILED:","\\033[1m" +  f"{Fore.RED}FAILED:{Style.RESET_ALL}" + "\\033[0m"))
        need_space = False
        last_line = ""
        continue
    elif(need_space):
        print(last_line)
        last_line = line.decode()
    elif(not "Building CXX object" in line.decode()):
        print(line.decode().replace("error:","\\033[1m" +  f"{Fore.RED}error:{Style.RESET_ALL}" + "\\033[0m").replace("~",f"{Fore.GREEN}~{Style.RESET_ALL}").replace("^",f"{Fore.GREEN}^{Style.RESET_ALL}").replace("warning:", f"{Fore.YELLOW}warning:{Style.RESET_ALL}"), end="")
    elif("Linking" in line.decode()):
        print(line.decode())
    else:
        last_line = line.decode()
        need_space = True
process.wait()
print(datetime.datetime.now())
sys.exit(process.poll())`
            writeFileSync(
                join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "roborio", "build.py"),
                pyfile
            )
        }

        if (!existsSync(join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "local", "build.py"))) {

            const pyfile: string = `import subprocess
from colorama import Fore
from colorama import Style
import sys
import datetime

pre_process = subprocess.Popen("cmake ../.. -GNinja -DIS_ROBORIO=FALSE", stdout=subprocess.PIPE)
while True:
    line = pre_process.stdout.readline()
    if not line:
        break           
    if line == b"": 
        continue
    print(line.decode())
process = subprocess.Popen("ninja -k 1", stdout=subprocess.PIPE)

need_space = False
last_line = ""
while True:
    line = process.stdout.readline()
    if not line:
        break           
    if line == b"": 
        continue
    if("In file included from" in line.decode() or "arm-frc2022-linux-gnueabi-g++.exe" in line.decode()):
        continue
    if(need_space and "FAILED" in line.decode()):
        print("\\n\\n")
        print(line.decode().replace("FAILED:","\\033[1m" +  f"{Fore.RED}FAILED:{Style.RESET_ALL}" + "\\033[0m"))
        need_space = False
        last_line = ""
        continue
    elif(need_space):
        print(last_line)
        last_line = line.decode()
    elif(not "Building CXX object" in line.decode()):
        print(line.decode().replace("error:","\\033[1m" +  f"{Fore.RED}error:{Style.RESET_ALL}" + "\\033[0m").replace("~",f"{Fore.GREEN}~{Style.RESET_ALL}").replace("^",f"{Fore.GREEN}^{Style.RESET_ALL}").replace("warning:", f"{Fore.YELLOW}warning:{Style.RESET_ALL}"), end="")
    elif("Linking" in line.decode()):
        print(line.decode())
    else:
        last_line = line.decode()
        need_space = True
process.wait()
print(datetime.datetime.now())
sys.exit(process.poll())`
            writeFileSync(
                join(vscode.workspace.workspaceFolders[0].uri.fsPath, "build", "local", "build.py"),
                pyfile
            )
        }




    }



    vscode.window.showInformationMessage("Succesfully created compile flags")
}

export default createCompileFlags
