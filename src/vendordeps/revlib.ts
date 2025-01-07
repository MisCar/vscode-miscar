const REVLIB_VENDORDEP = {
    "fileName": "REVLib.json",
    "name": "REVLib",
    "version": "2025.0.0",
    "frcYear": "2025",
    "uuid": "3f48eb8c-50fe-43a6-9cb7-44c86353c4cb",
    "mavenUrls": [
        "https://maven.revrobotics.com/"
    ],
    "jsonUrl": "https://software-metadata.revrobotics.com/REVLib-2025.json",
    "javaDependencies": [
        {
            "groupId": "com.revrobotics.frc",
            "artifactId": "REVLib-java",
            "version": "2025.0.0"
        }
    ],
    "jniDependencies": [
        {
            "groupId": "com.revrobotics.frc",
            "artifactId": "REVLib-driver",
            "version": "2025.0.0",
            "skipInvalidPlatforms": true,
            "isJar": false,
            "validPlatforms": [
                "windowsx86-64",
                "windowsx86",
                "linuxarm64",
                "linuxx86-64",
                "linuxathena",
                "linuxarm32",
                "osxuniversal"
            ]
        }
    ],
    "cppDependencies": [
        {
            "groupId": "com.revrobotics.frc",
            "artifactId": "REVLib-cpp",
            "version": "2025.0.0",
            "libName": "REVLib",
            "headerClassifier": "headers",
            "sharedLibrary": false,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "windowsx86",
                "linuxarm64",
                "linuxx86-64",
                "linuxathena",
                "linuxarm32",
                "osxuniversal"
            ]
        },
        {
            "groupId": "com.revrobotics.frc",
            "artifactId": "REVLib-driver",
            "version": "2025.0.0",
            "libName": "REVLibDriver",
            "headerClassifier": "headers",
            "sharedLibrary": false,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "windowsx86",
                "linuxarm64",
                "linuxx86-64",
                "linuxathena",
                "linuxarm32",
                "osxuniversal"
            ]
        }
    ]
}

export default REVLIB_VENDORDEP
