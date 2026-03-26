
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { validateConfig, validatePath } from "./validators.js";
import { cloneRepository, initializeGitRepository, setupGitHooks, addGitIgnore } from "./git.js";
import { setupPythonVenv, installPythonDependencies, createPyprojectToml } from "./python.js";
import { setupVscodeExtensions, setupVscodeSettings, setupVscodeDebugConfig } from "./vscode.js";
import { confirmSetup } from "./interactive.js";


const createDirectoryStructure = async (targetPath) => {
  const spinner = ora("Creating directory structure...");
  try {
    const dirs = ["src", "tests", "scripts", "context", "documentation", ".github/instructions", ".github/agents", ".github/skills"];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(targetPath, dir));
    }
    spinner.succeed("Directory structure created");
  } catch (error) {
    throw new Error(`Directory creation failed: ${error.message}`);
  }
};


const extractAgentWorkflows = async (sourceOrchestrator, targetPath, force) => {
  const spinner = ora("Extracting agent workflows...");
  try {
    const agentDirs = [".github/instructions", ".github/agents", ".github/skills"];
    const extracted = [];
    
    for (const agentDir of agentDirs) {
      const sourcePath = path.join(sourceOrchestrator, agentDir);
      const targetAgentPath = path.join(targetPath, agentDir);
      
      if (await fs.pathExists(sourcePath)) {
        if (await fs.pathExists(targetAgentPath) && !force) {
          continue;
        }
        if (await fs.pathExists(targetAgentPath) && force) {
          await fs.remove(targetAgentPath);
        }
        await fs.copy(sourcePath, targetAgentPath);
        extracted.push(agentDir);
      }
    }
    
    if (extracted.length > 0) {
      spinner.succeed(`Agent workflows extracted: ${extracted.join(", ")}`);
    } else {
      spinner.warn("No agent workflows found to extract");
    }
    
    return extracted;
  } catch (error) {
    throw new Error(`Agent workflow extraction failed: ${error.message}`);
  }
};


export const handleSetup = async (config) => {
  try {
    validateConfig(config);
    const targetPath = await validatePath(config.targetPath, config.force);
    await createDirectoryStructure(targetPath);
    
    // Clone/copy Orchestrator if requested
    if (config.cloneOrchestrator !== false) {
      const orchestratorPath = await cloneRepository(config.cloneUrl, targetPath, config.mode);
      
      // Extract agent workflows from cloned Orchestrator
      if (orchestratorPath && config.extractAgents !== false) {
        await extractAgentWorkflows(orchestratorPath, targetPath, config.force);
      }
    }
    
    console.log(chalk.green.bold("\nSetup completed!\n"));
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

export { extractAgentWorkflows };
