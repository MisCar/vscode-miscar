const PHOTONLIB = {
    "fileName": "photonlib.json",
    "name": "photonlib",
    "version": "v2023.1.1-beta-6",
    "uuid": "515fe07e-bfc6-11fa-b3de-0242ac130004 ",
    "mavenUrls": [
        "https://maven.photonvision.org/repository/internal",
        "https://maven.photonvision.org/repository/snapshots"
    ],
    "jsonUrl": "https://maven.photonvision.org/repository/internal/org/photonvision/PhotonLib-json/1.0/PhotonLib-json-1.0.json",
    "jniDependencies": [],
    "cppDependencies": [
        {
            "groupId": "org.photonvision",
            "artifactId": "PhotonLib-cpp",
            "version": "v2023.1.1-beta-6",
            "libName": "Photon",
            "headerClassifier": "headers",
            "sharedLibrary": true,
            "skipInvalidPlatforms": true,
            "binaryPlatforms": [
                "windowsx86-64",
                "linuxathena",
                "linuxx86-64",
                "osxx86-64"
            ]
        }
    ],
    "javaDependencies": [
        {
            "groupId": "org.photonvision",
            "artifactId": "PhotonLib-java",
            "version": "v2023.1.1-beta-6"
        },
        {
            "groupId": "org.photonvision",
            "artifactId": "PhotonTargeting-java",
            "version": "v2023.1.1-beta-6"
        }
    ]
}

export default PHOTONLIB