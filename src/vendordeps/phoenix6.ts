const PHOENIX_6_VENDORDEP = {
    "fileName": "Phoenix6.json",
    "name": "CTRE-Phoenix (v6)",
    "version": "24.2.0",
    "frcYear": 2024,
    "uuid": "e995de00-2c64-4df5-8831-c1441420ff19",
    "mavenUrls": [
        "https://maven.ctr-electronics.com/release/"
    ],
    "jsonUrl": "https://maven.ctr-electronics.com/release/com/ctre/phoenix6/latest/Phoenix6-frc2024-latest.json",
    "conflictsWith": [
        {
            "uuid": "3fcf3402-e646-4fa6-971e-18afe8173b1a",
            "errorMessage": "The combined Phoenix-6-And-5 vendordep is no longer supported. Please remove the vendordep and instead add both the latest Phoenix 6 vendordep and Phoenix 5 vendordep.",
            "offlineFileName": "Phoenix6And5.json"
        }
    ],
    "javaDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-java",
            "version": "24.2.0"
        }
    ],
    "jniDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "tools",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "tools-sim",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonSRX",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonFX",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simVictorSPX",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simPigeonIMU",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simCANCoder",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProTalonFX",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProCANcoder",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProPigeon2",
            "version": "24.2.0",
            "isJar": false,
            "skipInvalidPlatforms": true,
            "validPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        }
    ],
    "cppDependencies": [
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-cpp",
            "version": "24.2.0",
            "libName": "CTRE_Phoenix6_WPI",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "tools",
            "version": "24.2.0",
            "libName": "CTRE_PhoenixTools",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "linuxathena"
            ],
            "simMode": "hwsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "wpiapi-cpp-sim",
            "version": "24.2.0",
            "libName": "CTRE_Phoenix6_WPISim",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "tools-sim",
            "version": "24.2.0",
            "libName": "CTRE_PhoenixTools_Sim",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonSRX",
            "version": "24.2.0",
            "libName": "CTRE_SimTalonSRX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simTalonFX",
            "version": "24.2.0",
            "libName": "CTRE_SimTalonFX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simVictorSPX",
            "version": "24.2.0",
            "libName": "CTRE_SimVictorSPX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simPigeonIMU",
            "version": "24.2.0",
            "libName": "CTRE_SimPigeonIMU",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simCANCoder",
            "version": "24.2.0",
            "libName": "CTRE_SimCANCoder",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProTalonFX",
            "version": "24.2.0",
            "libName": "CTRE_SimProTalonFX",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProCANcoder",
            "version": "24.2.0",
            "libName": "CTRE_SimProCANcoder",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        },
        {
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "simProPigeon2",
            "version": "24.2.0",
            "libName": "CTRE_SimProPigeon2",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxx86-64",
                "osxuniversal"
            ],
            "simMode": "swsim"
        }
    ]
}

export default PHOENIX_6_VENDORDEP
