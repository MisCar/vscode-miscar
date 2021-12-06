import * as vscode from "vscode"
import { readdirSync, writeFile } from "fs"
import { join } from "path"

const newClass = async (path: vscode.Uri | undefined) => {
    if (vscode.workspace.workspaceFolders === undefined) {
        return
    }

    path =
        path ??
        vscode.Uri.file(
            join(
                vscode.workspace.workspaceFolders[0].uri.fsPath,
                "src",
                "main",
                "cpp",
                "commands"
            )
        )

    const subsystemFolder = join(
        vscode.workspace.workspaceFolders[0].uri.fsPath,
        "src",
        "main",
        "cpp",
        "subsystems"
    )

    const subsystems = readdirSync(subsystemFolder)
        .filter((f) => f.endsWith(".h"))
        .map((f) => f.replace(".h", ""))

    const className = await vscode.window.showInputBox({
        placeHolder: "Enter the name of the class",
    })

    const type = await vscode.window.showQuickPick(
        ["Class", "Command", "Subsystem"],
        { placeHolder: "Select the type of the class" }
    )

    const classPath = path.fsPath
        .split(join("src", "main", "cpp"))[1]
        .replace("\\", "/")
        .substring(1)
    if (type === "Class") {
        writeFile(
            join(path.fsPath, className + ".h"),
            `#pragma once

class ${className} {
 public:

 private:
  
};
`,
            () => {}
        )

        writeFile(
            join(path.fsPath, className + ".cpp"),
            `#include "${classPath}/${className}.h"
`,
            () => {}
        )
    } else if (type === "Subsystem") {
        writeFile(
            join(path.fsPath, className + ".h"),
            `#pragma once

#include <frc2/command/SubsystemBase.h>

class ${className} : public frc2::SubsystemBase {
 public:
  ${className}();

  void Periodic() override;

 private:
  
};
`,
            () => {}
        )

        writeFile(
            join(path.fsPath, className + ".cpp"),
            `#include "${classPath}/${className}.h"

${className}::${className}() {}

void ${className}::Periodic() {}
`,
            () => {}
        )
    } else if (type === "Command") {
        const usesSubsystems =
            (await vscode.window.showQuickPick(subsystems, {
                title: "Select subsystems to use",
                canPickMany: true,
            })) ?? []

        const requiresSubsystems =
            (await vscode.window.showQuickPick(usesSubsystems, {
                title: "Select subsystems to require",
                canPickMany: true,
            })) ?? []

        const subsystemIncludes = usesSubsystems
            .map((subsystem) => `#include "subsystems/${subsystem}.h"`)
            .join("\n")
        const subsystemMembers = usesSubsystems
            .map((subsystem) => `${subsystem}& m_${subsystem.toLowerCase()};`)
            .join("\n  ")
        const subsystemReferences = usesSubsystems
            .map((subsystem) => `${subsystem}& ${subsystem.toLowerCase()}`)
            .join(", ")
        const subsystemInitializers = usesSubsystems
            .map(
                (subsystem) =>
                    `m_${subsystem.toLowerCase()}(${subsystem.toLowerCase()})`
            )
            .join(", ")

        const constructorContents =
            requiresSubsystems.length === 0
                ? ""
                : "\n    AddRequirements({ " +
                  requiresSubsystems
                      .map((subsystem) => "&" + subsystem.toLowerCase())
                      .join(", ") +
                  " });\n"

        writeFile(
            join(path.fsPath, className + ".h"),
            `#pragma once

#include <frc2/command/CommandBase.h>
#include <frc2/command/CommandHelper.h>

${subsystemIncludes}

class ${className}
    : public frc2::CommandHelper<frc2::CommandBase, ${className}> {
 public:
  ${className}(${subsystemReferences});

  void Initialize() override;

  void Execute() override;

  void End(bool interrupted) override;

  bool IsFinished() override;

 private:
  ${subsystemMembers}
};
`,
            () => {}
        )

        writeFile(
            join(path.fsPath, className + ".cpp"),
            `#include "${classPath}/${className}.h"

${className}::${className}(${subsystemReferences}): ${subsystemInitializers} {${constructorContents}}

void ${className}::Initialize() {}

void ${className}::Execute() {}

void ${className}::End(bool interrupted) {}

bool ${className}::IsFinished() {
    return false;
}
`,
            () => {}
        )
    }
}

export default newClass
