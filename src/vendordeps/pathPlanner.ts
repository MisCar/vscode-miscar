const PATH_PLANNER_VENDORDEP = {
    "fileName": "PathplannerLib.json",
    "name": "PathplannerLib",
    "version": "2025.1.1",
    "uuid": "1b42324f-17c6-4875-8e77-1c312bc8c786",
    "frcYear": "2025",
    "mavenUrls": [
        "https://3015rangerrobotics.github.io/pathplannerlib/repo"
    ],
    "jsonUrl": "https://3015rangerrobotics.github.io/pathplannerlib/PathplannerLib.json",
    "javaDependencies": [
        {
            "groupId": "com.pathplanner.lib",
            "artifactId": "PathplannerLib-java",
            "version": "2025.1.1"
        }
    ],
    "jniDependencies": [],
    "cppDependencies": [
        {
            "groupId": "com.pathplanner.lib",
            "artifactId": "PathplannerLib-cpp",
            "version": "2025.1.1",
            "libName": "PathplannerLib",
            "headerClassifier": "headers",
            "sharedLibrary": false,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal",
                "linuxathena",
                "linuxarm32",
                "linuxarm64"
            ]
        }
    ]
}

export default PATH_PLANNER_VENDORDEP
