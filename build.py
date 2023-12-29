import datetime
import os
import subprocess
import sys

from colorama import Fore, Style


def main(build_type: str):
    starting_time = datetime.datetime.now()
    print(
        f"{Style.BRIGHT}{Fore.GREEN}Started build at{Style.RESET_ALL} {datetime.datetime.now()}"
    )
    project_path = os.getcwd()
    if build_type == "local":
        cwd = "./build/local"
    else:
        cwd = "./build/roborio"
    if build_type == "local":
        pre_process = subprocess.Popen(
            ["cmake", "../..", "-GNinja", "-DIS_ROBORIO=FALSE"],
            stdout=subprocess.PIPE,
            cwd=cwd,
        )
    else:
        pre_process = subprocess.Popen(
            [
                "cmake",
                "../../",
                "-GNinja",
                "-DCMAKE_TOOLCHAIN_FILE=../../roborio.toolchain.cmake",
                "-DIS_ROBORIO=TRUE",
            ],
            stdout=subprocess.PIPE,
            cwd=cwd,
        )
    while True:
        line = pre_process.stdout.readline()
        if not line:
            break
        if line == b"":
            continue
        print(line.decode(), end="")

    print(
        f"{Style.BRIGHT}{Fore.GREEN}CMake finished in {Style.RESET_ALL}{(datetime.datetime.now() - starting_time).total_seconds() :.2f}s"
    )
    print(
        f"{Style.BRIGHT}{Fore.GREEN}Started ninja at {Style.RESET_ALL}{datetime.datetime.now()}"
    )
    process = subprocess.Popen("ninja -k 1", stdout=subprocess.PIPE, cwd=cwd)

    while True:
        line = process.stdout.readline()
        if not line:
            break
        if line == b"":
            continue

        text_line = line.decode()
        if "Building CXX object" in text_line:
            print(text_line, end="", flush=True)
        elif (
            "\\miscar.vscode-miscar\\toolchain\\" in text_line
            or "C:\\PROGRA~1\\LLVM\\bin\\CLANG_~1.EXE" in text_line
        ):
            continue
        else:
            path_to_file = "-157415741574"
            if project_path.replace("\\", "/") + "/src" in text_line or "libmiscar" in text_line:
                if ".cpp" in text_line:
                    path_to_file = text_line[0 : text_line.find(".cpp") + 4].split(" ")[-1]
                elif ".h" in text_line:
                    path_to_file = text_line[0 : text_line.find(".h") + 2].split(" ")[-1]

            print(
                text_line.replace(
                    "FAILED:",
                    f"{Style.BRIGHT}{Fore.RED}FAILED:{Style.RESET_ALL}",
                )
                .replace("warning:", f"{Fore.YELLOW}warning:{Style.RESET_ALL}")
                .replace("note:", f"{Fore.BLUE}note:{Style.RESET_ALL}")
                .replace(
                    "error:",
                    f"{Style.BRIGHT}{Fore.RED}error:{Style.RESET_ALL}",
                )
                .replace("^", f"{Fore.GREEN}^{Style.RESET_ALL}")
                .replace("~", f"{Fore.GREEN}~{Style.RESET_ALL}")
                .replace(
                    path_to_file, f"{Fore.LIGHTCYAN_EX}" + path_to_file + f"{Style.RESET_ALL}"
                )
                .replace("c:/", "C:/"),
                end="",
                flush=True,
            )
    process.wait()
    exit_code = process.poll()
    color = Style.BRIGHT + (Fore.GREEN if exit_code == 0 else Fore.RED)
    print(
        f"{color}Finished at {Style.RESET_ALL}{datetime.datetime.now()} {color}in{Style.RESET_ALL} {(datetime.datetime.now() - starting_time).total_seconds() :.2f}s"
    )

    sys.exit(exit_code)


if __name__ == "__main__":
    main(sys.argv[1])