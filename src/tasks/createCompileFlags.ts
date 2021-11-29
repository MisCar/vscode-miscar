import * as vscode from "vscode"
import {
    createWriteStream,
    existsSync,
    mkdirSync,
    rmSync,
    readdirSync,
    writeFileSync,
} from "fs"
import { join } from "path"
import { get as httpGet } from "http"
import { get as httpsGet } from "https"
import { execSync } from "child_process"
import { IncomingMessage } from "http"

const NI_VERSION = "2022.2.3"
const WPILIB_VERSION = "2022.1.1-beta-3"
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

const PHOENIX_VENDORDEP = {
    fileName: "Phoenix.json",
    name: "CTRE-Phoenix",
    version: "5.20.0-beta-1",
    uuid: "ab676553-b602-441f-a38d-f1296eff6537",
    mavenUrls: ["https://maven.ctr-electronics.com/release/"],
    jsonUrl:
        "https://maven.ctr-electronics.com/release/com/ctre/phoenix/Phoenix-latest.json",
    javaDependencies: [
        {
            groupId: "com.ctre.phoenix",
            artifactId: "api-java",
            version: "5.20.0",
        },
        {
            groupId: "com.ctre.phoenix",
            artifactId: "wpiapi-java",
            version: "5.20.0",
        },
    ],
    jniDependencies: [
        {
            groupId: "com.ctre.phoenix",
            artifactId: "cci",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["linuxathena"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "cci-sim",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simTalonSRX",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simTalonFX",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simVictorSPX",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simPigeonIMU",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simCANCoder",
            version: "5.20.0",
            isJar: false,
            skipInvalidPlatforms: true,
            validPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
    ],
    cppDependencies: [
        {
            groupId: "com.ctre.phoenix",
            artifactId: "wpiapi-cpp",
            version: "5.20.0",
            libName: "CTRE_Phoenix_WPI",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: [
                "linuxathena",
                "windowsx86-64",
                "linuxx86-64",
                "osxx86-64",
            ],
        },
        {
            groupId: "com.ctre.phoenix",
            artifactId: "api-cpp",
            version: "5.20.0",
            libName: "CTRE_Phoenix",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: [
                "linuxathena",
                "windowsx86-64",
                "linuxx86-64",
                "osxx86-64",
            ],
        },
        {
            groupId: "com.ctre.phoenix",
            artifactId: "cci",
            version: "5.20.0",
            libName: "CTRE_PhoenixCCI",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["linuxathena"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "cci-sim",
            version: "5.20.0",
            libName: "CTRE_PhoenixCCISim",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simTalonSRX",
            version: "5.20.0",
            libName: "CTRE_SimTalonSRX",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simTalonFX",
            version: "5.20.0",
            libName: "CTRE_SimTalonFX",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simVictorSPX",
            version: "5.20.0",
            libName: "CTRE_SimVictorSPX",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simPigeonIMU",
            version: "5.20.0",
            libName: "CTRE_SimPigeonIMU",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
        {
            groupId: "com.ctre.phoenix.sim",
            artifactId: "simCANCoder",
            version: "5.20.0",
            libName: "CTRE_SimCANCoder",
            headerClassifier: "headers",
            sharedLibrary: true,
            skipInvalidPlatforms: true,
            binaryPlatforms: ["windowsx86-64", "linuxx86-64", "osxx86-64"],
        },
    ],
}

const REVLIB_VENDORDEP = {
    fileName: "REVLib.json",
    name: "REVLib",
    version: "2022.0.0",
    uuid: "3f48eb8c-50fe-43a6-9cb7-44c86353c4cb",
    mavenUrls: ["https://maven.revrobotics.com/"],
    jsonUrl: "https://software-metadata.revrobotics.com/REVLib.json",
    javaDependencies: [
        {
            groupId: "com.revrobotics.frc",
            artifactId: "REVLib-java",
            version: "2022.0.0",
        },
    ],
    jniDependencies: [
        {
            groupId: "com.revrobotics.frc",
            artifactId: "REVLib-driver",
            version: "2022.0.0",
            skipInvalidPlatforms: true,
            isJar: false,
            validPlatforms: [
                "windowsx86-64",
                "windowsx86",
                "linuxaarch64bionic",
                "linuxx86-64",
                "linuxathena",
                "linuxraspbian",
                "osxx86-64",
            ],
        },
    ],
    cppDependencies: [
        {
            groupId: "com.revrobotics.frc",
            artifactId: "REVLib-cpp",
            version: "2022.0.0",
            libName: "REVLib",
            headerClassifier: "headers",
            sharedLibrary: false,
            skipInvalidPlatforms: true,
            binaryPlatforms: [
                "windowsx86-64",
                "windowsx86",
                "linuxaarch64bionic",
                "linuxx86-64",
                "linuxathena",
                "linuxraspbian",
                "osxx86-64",
            ],
        },
        {
            groupId: "com.revrobotics.frc",
            artifactId: "REVLib-driver",
            version: "2022.0.0",
            libName: "REVLibDriver",
            headerClassifier: "headers",
            sharedLibrary: false,
            skipInvalidPlatforms: true,
            binaryPlatforms: [
                "windowsx86-64",
                "windowsx86",
                "linuxaarch64bionic",
                "linuxx86-64",
                "linuxathena",
                "linuxraspbian",
                "osxx86-64",
            ],
        },
    ],
}

const VENDORDEPS = [PHOENIX_VENDORDEP, REVLIB_VENDORDEP]

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
                const zip = join(root, library, "headers.zip")
                response.pipe(createWriteStream(zip))
                response.on("end", () => {
                    try {
                        execSync("tar -xf " + zip, { cwd: libraryPath })
                        rmSync(zip)
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

    for (const vendordep of VENDORDEPS) {
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
        console.log(join(folder, "compile_flags.txt"))
        writeFileSync(join(folder, "compile_flags.txt"), compileFlags)
    }
    vscode.window.showInformationMessage("Succesfully created compile flags")
}

export default createCompileFlags
