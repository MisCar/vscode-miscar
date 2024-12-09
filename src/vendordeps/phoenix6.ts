const PHOENIX_6_VENDORDEP = {
    "fileName": "Phoenix6-frc2025-beta-latest.json",
    "name": "CTRE-Phoenix (v6)",
    "version": "25.0.0-beta-3",
    "frcYear": "2025",
    "uuid": "e995de00-2c64-4df5-8831-c1441420ff19",
    "mavenUrls": [
        "https://maven.ctr-electronics.com/release/"
    ],
    "jsonUrl": "https://maven.ctr-electronics.com/release/com/ctre/phoenix6/latest/Phoenix6-frc2025-beta-latest.json",
    "conflictsWith": [
        {
            "uuid": "e7900d8d-826f-4dca-a1ff-182f658e98af",
            "errorMessage": "Users can not have both the replay and regular Phoenix 6 vendordeps in their robot program.",
            "offlineFileName": "Phoenix6-replay-frc2025-beta-latest.json"
        }
    ],
    "javaDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-java",
            "version": "25.0.0-beta-3"
        }
    ],
    "jniDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "api-cpp",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "tools",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "api-cpp-sim",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "tools-sim",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonSRX",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simVictorSPX",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simPigeonIMU",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simCANCoder",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProTalonFX",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProCANcoder",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProPigeon2",
            "version": "25.0.0-beta-3",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        }
    ],
    "cppDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-cpp",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_Phoenix6_WPI",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "tools",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_PhoenixTools",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "wpiapi-cpp-sim",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_Phoenix6_WPISim",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "tools-sim",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_PhoenixTools_Sim",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonSRX",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimTalonSRX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simVictorSPX",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimVictorSPX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simPigeonIMU",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimPigeonIMU",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simCANCoder",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimCANCoder",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProTalonFX",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimProTalonFX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProCANcoder",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimProCANcoder",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProPigeon2",
            "version": "25.0.0-beta-3",
            "libName": "CTRE_SimProPigeon2",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxarm64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        }
    ]
}


export default PHOENIX_6_VENDORDEP