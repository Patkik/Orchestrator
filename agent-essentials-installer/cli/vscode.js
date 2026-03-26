
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";


export const setupVscodeExtensions = async (targetPath) => {
  const spinner = ora("Setting up VS Code...");
  try {
    const vscodeDir = path.join(targetPath, ".vscode");
    await fs.ensureDir(vscodeDir);
    const extPath = path.join(vscodeDir, "extensions.json");
    const extensions = {
      recommendations: [
        "ms-python.python",
        "charliermarsh.ruff",
        "ms-python.black-formatter",
        "GitHub.copilot",
        "GitLens.gitlens"
      ]
    };
    await fs.writeJSON(extPath, extensions, { spaces: 2 });
    spinner.succeed("VS Code recommended extensions configured");
  } catch (error) {
    spinner.warn("VS Code setup skipped");
  }
};


export const setupVscodeSettings = async (targetPath) => {
  const spinner = ora("Configuring VS Code settings...");
  try {
    const vscodeDir = path.join(targetPath, ".vscode");
    await fs.ensureDir(vscodeDir);
    const settingsPath = path.join(vscodeDir, "settings.json");
    let settings = {};
    if (await fs.pathExists(settingsPath)) {
      settings = await fs.readJSON(settingsPath);
    }
    const defaults = {
      "editor.defaultFormatter": "ms-python.black-formatter",
      "editor.formatOnSave": true,
      "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter"
      },
      "python.testing.pytestEnabled": true
    };
    Object.assign(settings, defaults);
    await fs.writeJSON(settingsPath, settings, { spaces: 2 });
    spinner.succeed("VS Code settings created");
  } catch (error) {
    spinner.warn("Settings skipped");
  }
};


export const setupVscodeDebugConfig = async (targetPath) => {
  const spinner = ora("Setting up debug config...");
  try {
    const vscodeDir = path.join(targetPath, ".vscode");
    await fs.ensureDir(vscodeDir);
    const launchPath = path.join(vscodeDir, "launch.json");
    if (await fs.pathExists(launchPath)) {
      spinner.info("launch.json exists");
      return;
    }
    const config = {
      version: "0.2.0",
      configurations: []
    };
    await fs.writeJSON(launchPath, config, { spaces: 2 });
    spinner.succeed("Debug config created");
  } catch (error) {
    spinner.warn("Debug config skipped");
  }
};
