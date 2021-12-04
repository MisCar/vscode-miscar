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

export default REVLIB_VENDORDEP
