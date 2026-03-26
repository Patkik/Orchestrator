
import { execSync, spawnSync } from "child_process";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { isWindows } from "./utils.js";


export const setupPythonVenv = async (targetPath) => {
  const spinner = ora("Setting up Python virtual environment...");
  try {
    try {
      execSync("python --version", { encoding: "utf-8", stdio: "pipe" });
    } catch (error) {
      spinner.warn("Python not found, skipping");
      return;
    }
    const venvPath = path.join(targetPath, ".venv");
    if (await fs.pathExists(venvPath)) {
      spinner.info("Virtual environment exists");
      return;
    }
    const result = spawnSync("python", ["-m", "venv", venvPath], {
      cwd: targetPath,
      encoding: "utf-8",
      stdio: "pipe"
    });
    if (result.error || result.status !== 0) {
      throw new Error("Failed to create venv");
    }
    spinner.succeed("Virtual environment created");
  } catch (error) {
    spinner.warn("Venv setup skipped");
  }
};


export const installPythonDependencies = async (targetPath) => {
  const spinner = ora("Installing dependencies...");
  try {
    const venvPath = path.join(targetPath, ".venv");
    const pipPath = isWindows() ? path.join(venvPath, "Scripts", "pip.exe") : path.join(venvPath, "bin", "pip");
    if (!await fs.pathExists(pipPath)) {
      spinner.warn("Pip not found");
      return;
    }
    const deps = ["pytest", "ruff", "mypy"];
    spawnSync(pipPath, ["install", ...deps], { cwd: targetPath, stdio: "pipe" });
    spinner.succeed("Dependencies installed");
  } catch (error) {
    spinner.warn("Dependency install skipped");
  }
};


export const createPyprojectToml = async (targetPath) => {
  const spinner = ora("Creating pyproject.toml...");
  try {
    const pyprojectPath = path.join(targetPath, "pyproject.toml");
    if (await fs.pathExists(pyprojectPath)) {
      spinner.info("pyproject.toml exists");
      return;
    }
    const content = "[build-system]\nrequires = [\"setuptools\", \"wheel\"]\n\n[project]\nname = \"orchestrator\"\nversion = \"0.1.0\"\npython = \">=3.10\"";
    await fs.writeFile(pyprojectPath, content);
    spinner.succeed("pyproject.toml created");
  } catch (error) {
    spinner.warn("pyproject.toml skipped");
  }
};
