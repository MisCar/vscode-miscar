/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const utilities_1 = __webpack_require__(3);
const buildLocal = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.buildLocal")
        .forEach((execution) => execution.terminate());
    const task = new vscode.Task({ type: "bazelrio.buildLocal" }, folders[0], "Build Local", "vscode-miscar", new vscode.ShellExecution("bazel build //... --config=for-" + utilities_1.platform));
    task.presentationOptions.clear = false;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    vscode.tasks.executeTask(task);
};
exports["default"] = buildLocal;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.platform = void 0;
const process_1 = __webpack_require__(4);
exports.platform = process_1.platform === "win32"
    ? "windows"
    : process_1.platform === "darwin"
        ? "mac"
        : "linux";


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("process");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const buildRoboRIO = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.buildRoboRIO")
        .forEach((execution) => execution.terminate());
    const task = new vscode.Task({ type: "miscar.buildRoboRIO" }, folders[0], "Build RoboRIO", "vscode-miscar", new vscode.ShellExecution("bazel build //... --config=for-roborio"));
    task.presentationOptions.clear = false;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    vscode.tasks.executeTask(task);
};
exports["default"] = buildRoboRIO;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const utilities_1 = __webpack_require__(3);
const test = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.test")
        .forEach((execution) => execution.terminate());
    const task = new vscode.Task({ type: "miscar.test" }, folders[0], "Test", "vscode-miscar", new vscode.ShellExecution("bazel test //... --config=for-" + utilities_1.platform));
    task.presentationOptions.clear = false;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    vscode.tasks.executeTask(task);
};
exports["default"] = test;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const deploy = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.deploy")
        .forEach((execution) => execution.terminate());
    const task = new vscode.Task({ type: "miscar.deploy" }, folders[0], "Deploy", "vscode-miscar", new vscode.ShellExecution("bazel run robot.deploy --config=for-roborio"));
    task.presentationOptions.clear = false;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    vscode.tasks.executeTask(task);
};
exports["default"] = deploy;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const openCommandPalette = () => vscode.commands.executeCommand("workbench.action.quickOpen", "> MisCar: ");
exports["default"] = openCommandPalette;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const utilities_1 = __webpack_require__(3);
const runSimulation = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.runSimulation")
        .forEach((execution) => execution.terminate());
    const task = new vscode.Task({ type: "miscar.runSimulation" }, folders[0], "Simulation", "vscode-miscar", new vscode.ShellExecution("bazel run robot.simulation.all --config=for-" + utilities_1.platform));
    task.presentationOptions.clear = false;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    vscode.tasks.executeTask(task);
};
exports["default"] = runSimulation;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const startTool = async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
        return;
    }
    vscode.tasks.taskExecutions
        .filter((execution) => execution.task.definition.type === "miscar.startTool")
        .forEach((execution) => execution.terminate());
    const tool = await vscode.window.showQuickPick([
        "Shuffleboard",
        "Glass",
        "PathWeaver",
        "SmartDashboard",
        "RobotBuilder",
    ], {
        placeHolder: "Tool",
    });
    if (tool !== undefined) {
        const task = new vscode.Task({ type: "miscar.startTool" }, folders[0], "Start Tool", "vscode-miscar", new vscode.ShellExecution("bazel run @bazelrio//libraries/tools/" + tool.toLowerCase()));
        task.presentationOptions.clear = false;
        task.presentationOptions.echo = false;
        task.presentationOptions.showReuseMessage = false;
        vscode.tasks.executeTask(task);
    }
};
exports["default"] = startTool;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(1);
const fs_1 = __webpack_require__(12);
const path_1 = __webpack_require__(13);
const http_1 = __webpack_require__(16);
const https_1 = __webpack_require__(14);
const child_process_1 = __webpack_require__(15);
const NI_VERSION = "2022.2.3";
const WPILIB_VERSION = "2022.1.1-beta-3";
const NI_LIBRARIES = ["visa", "netcomm", "chipobject"];
const WPILIB_LIBRARIES = [
    "wpilibc",
    "wpiutil",
    "wpimath",
    "ntcore",
    "cscore",
    "hal",
    "cameraserver",
    "wpilibNewCommands",
];
const PHOENIX_VENDORDEP = {
    fileName: "Phoenix.json",
    name: "CTRE-Phoenix",
    version: "5.20.0-beta-1",
    uuid: "ab676553-b602-441f-a38d-f1296eff6537",
    mavenUrls: ["https://maven.ctr-electronics.com/release/"],
    jsonUrl: "https://maven.ctr-electronics.com/release/com/ctre/phoenix/Phoenix-latest.json",
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
};
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
};
const VENDORDEPS = [PHOENIX_VENDORDEP, REVLIB_VENDORDEP];
let libraries = [];
const getWithRedirects = (url, callback) => {
    // REV has a certificate issue
    let get = https_1.get;
    if (url.startsWith("https://maven.revrobotics.com")) {
        url = url.replace("https", "http");
        get = http_1.get;
    }
    get(url, (response) => {
        if (response.statusCode &&
            Math.floor(response.statusCode / 100) === 3 &&
            response.headers.location) {
            getWithRedirects(response.headers.location, callback);
        }
        else {
            callback(response);
        }
    }).addListener("error", (err) => {
        console.error(err);
    });
};
const getLibrary = (root, library, version, base) => {
    return new Promise((resolve, reject) => {
        const libraryPath = (0, path_1.join)(root, library);
        if ((0, fs_1.existsSync)(libraryPath)) {
            libraries.push(libraryPath);
            resolve();
            return;
        }
        (0, fs_1.mkdirSync)(libraryPath);
        getWithRedirects(`${base}/${library}/${version}/${library}-${version}-headers.zip`, (response) => {
            const zip = (0, path_1.join)(root, library, "headers.zip");
            response.pipe((0, fs_1.createWriteStream)(zip));
            response.on("end", () => {
                try {
                    (0, child_process_1.execSync)("tar -xf " + zip, { cwd: libraryPath });
                    (0, fs_1.rmSync)(zip);
                }
                catch (_) { }
                libraries.push(libraryPath);
                resolve();
            });
        });
    });
};
const createCompileFlags = async (context) => {
    libraries = [];
    const root = context.globalStorageUri.fsPath;
    if (!(0, fs_1.existsSync)(root)) {
        (0, fs_1.mkdirSync)(root);
    }
    const promises = [];
    for (const library of NI_LIBRARIES) {
        promises.push(getLibrary(root, library, NI_VERSION, "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/ni-libraries"));
    }
    for (const library of WPILIB_LIBRARIES) {
        promises.push(getLibrary(root, library + "-cpp", WPILIB_VERSION, "https://frcmaven.wpi.edu/ui/api/v1/download?repoKey=release&path=edu/wpi/first/" +
            library));
    }
    for (const vendordep of VENDORDEPS) {
        for (const dependency of vendordep.cppDependencies) {
            promises.push(getLibrary(root, dependency.artifactId, dependency.version, vendordep.mavenUrls[0] +
                dependency.groupId.replace(/\./g, "/")));
        }
    }
    await Promise.all(promises);
    if (vscode.workspace.workspaceFolders) {
        for (const folder of vscode.workspace.workspaceFolders) {
            libraries.push((0, path_1.join)(folder.uri.fsPath, "src", "main", "cpp"));
            libraries.push((0, path_1.join)(folder.uri.fsPath, "..", "libmiscar", "src", "main", "cpp"));
        }
    }
    const libraryIncludes = libraries
        .map((library) => "-I" + library.replace(/\\/g, "/"))
        .join("\n");
    const compileFlags = libraryIncludes + "\n-std=c++17\n-xc++";
    for (const folder of libraries) {
        console.log((0, path_1.join)(folder, "compile_flags.txt"));
        (0, fs_1.writeFileSync)((0, path_1.join)(folder, "compile_flags.txt"), compileFlags);
    }
    vscode.window.showInformationMessage("Succesfully created compile flags");
};
exports["default"] = createCompileFlags;


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("https");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("http");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const buildLocal_1 = __webpack_require__(2);
const buildRoborio_1 = __webpack_require__(5);
const test_1 = __webpack_require__(6);
const deploy_1 = __webpack_require__(7);
const openCommandPalette_1 = __webpack_require__(8);
const runSimulation_1 = __webpack_require__(9);
const startTool_1 = __webpack_require__(10);
const createCompileFlags_1 = __webpack_require__(11);
const activate = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand("miscar.openCommandPalette", openCommandPalette_1.default), vscode.commands.registerCommand("miscar.buildLocal", buildLocal_1.default), vscode.commands.registerCommand("miscar.buildRoboRIO", buildRoborio_1.default), vscode.commands.registerCommand("miscar.test", test_1.default), vscode.commands.registerCommand("miscar.deploy", deploy_1.default), vscode.commands.registerCommand("miscar.runSimulation", runSimulation_1.default), vscode.commands.registerCommand("miscar.startTool", startTool_1.default), vscode.commands.registerCommand("miscar.createCompileFlags", () => (0, createCompileFlags_1.default)(context)));
};
exports.activate = activate;
const deactivate = () => { };
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map