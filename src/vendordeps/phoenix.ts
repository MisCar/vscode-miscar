const PHOENIX_VENDORDEP = {
    "fileName": "Phoenix6And5.json",
    "name": "CTRE-Phoenix (v6 And v5)",
    "version": "23.2.2",
    "frcYear": 2023,
    "uuid": "3fcf3402-e646-4fa6-971e-18afe8173b1a",
    "mavenUrls": [
        "https://maven.ctr-electronics.com/release/"
    ],
    "jsonUrl": "https://maven.ctr-electronics.com/release/com/ctre/phoenix6/latest/Phoenix6And5-frc2023-latest.json",
    "javaDependencies": [
        {
            "groupId": "com.ctre.phoenix",
            "artifactId": "api-java",
            "version": "5.31.0"
        },
        {
            "groupId": "com.ctre.phoenix",
            "artifactId": "wpiapi-java",
            "version": "5.31.0"
        },
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-java",
            "version": "23.2.2"
        }
    ],
    "jniDependencies": [
        {
            "groupId": "com.ctre.phoenix",
            "artifactId": "cci",
            "version": "5.31.0",
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
            "groupId": "com.ctre.phoenix.sim",
            "artifactId": "cci-sim",
            "version": "5.31.0",
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
            "groupId": "com.ctre.phoenix6",
            "artifactId": "tools",
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "groupId": "com.ctre.phoenix",
            "artifactId": "wpiapi-cpp",
            "version": "5.31.0",
            "libName": "CTRE_Phoenix_WPI",
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
            "groupId": "com.ctre.phoenix",
            "artifactId": "api-cpp",
            "version": "5.31.0",
            "libName": "CTRE_Phoenix",
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
            "groupId": "com.ctre.phoenix",
            "artifactId": "cci",
            "version": "5.31.0",
            "libName": "CTRE_PhoenixCCI",
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
            "version": "23.2.2",
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
            "groupId": "com.ctre.phoenix.sim",
            "artifactId": "wpiapi-cpp-sim",
            "version": "5.31.0",
            "libName": "CTRE_Phoenix_WPISim",
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
            "groupId": "com.ctre.phoenix.sim",
            "artifactId": "api-cpp-sim",
            "version": "5.31.0",
            "libName": "CTRE_PhoenixSim",
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
            "groupId": "com.ctre.phoenix.sim",
            "artifactId": "cci-sim",
            "version": "5.31.0",
            "libName": "CTRE_PhoenixCCISim",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
            "version": "23.2.2",
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
        },
        {
            "groupId": "com.ctre.phoenix6",
            "artifactId": "wpiapi-cpp",
            "version": "23.2.2",
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
            "groupId": "com.ctre.phoenix6.sim",
            "artifactId": "wpiapi-cpp-sim",
            "version": "23.2.2",
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
        }
    ]
}

export default PHOENIX_VENDORDEP
