import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { getHomeDir, getPlatform, normalizePath, expandPath } from './utils.js';
import { validatePath } from './validators.js';

export const setupInteractive = async (defaultPath = null) => {
  console.log(chalk.cyan.bold('\n🚀 Orchestrator Essentials Setup\n'));
  console.log(chalk.gray('This tool will guide you through setting up your agentic workflow environment.\n'));

  const questions = [
    {
      type: 'input',
      name: 'targetPath',
      message: 'Target workspace path:',
      default: defaultPath || process.cwd(),
      filter: async (input) => {
        try {
          const validated = await validatePath(input, true);
          return validated;
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Installation mode:',
      choices: [
        { name: 'Copy files (self-contained, no git link)', value: 'copy' },
        { name: 'Git submodule (track upstream changes)', value: 'submodule' }
      ],
      default: 'copy'
    },
    {
      type: 'confirm',
      name: 'cloneOrchestrator',
      message: 'Clone the Orchestrator project?',
      default: true
    },
    {
      type: 'input',
      name: 'branch',
      message: 'Git branch to use:',
      default: 'main',
      when: (answers) => answers.cloneOrchestrator
    },
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Repository URL:',
      default: 'https://github.com/its-patri/Orchestrator',
      when: (answers) => answers.cloneOrchestrator
    },
    {
      type: 'confirm',
      name: 'installPython',
      message: 'Set up Python virtual environment?',
      default: true,
      when: (answers) => answers.cloneOrchestrator
    },
    {
      type: 'confirm',
      name: 'setupGitHooks',
      message: 'Set up git hooks (pre-commit)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'setupVscode',
      message: 'Install VS Code extensions and settings?',
      default: true
    },
    {
      type: 'confirm',
      name: 'force',
      message: 'Force setup if directory exists?',
      default: false
    }
  ];

  const answers = await inquirer.prompt(questions);

  return {
    targetPath: answers.targetPath,
    mode: answers.mode,
    cloneOrchestrator: answers.cloneOrchestrator,
    branch: answers.branch || 'main',
    repoUrl: answers.repoUrl || 'https://github.com/its-patri/Orchestrator',
    installPython: answers.installPython || false,
    setupGitHooks: answers.setupGitHooks,
    setupVscode: answers.setupVscode,
    force: answers.force
  };
};

export const confirmSetup = async (config) => {
  console.log(chalk.cyan('\n📋 Setup Configuration:\n'));
  console.log(chalk.gray('  Target Path:        ') + chalk.white(config.targetPath));
  console.log(chalk.gray('  Mode:               ') + chalk.white(config.mode));
  console.log(chalk.gray('  Clone Orchestrator: ') + (config.cloneOrchestrator ? chalk.green('Yes') : chalk.gray('No')));
  if (config.cloneOrchestrator) {
    console.log(chalk.gray('  Branch:             ') + chalk.white(config.branch));
    console.log(chalk.gray('  Repository:         ') + chalk.white(config.repoUrl));
  }
  console.log(chalk.gray('  Python Setup:       ') + (config.installPython ? chalk.green('Yes') : chalk.gray('No')));
  console.log(chalk.gray('  Git Hooks:          ') + (config.setupGitHooks ? chalk.green('Yes') : chalk.gray('No')));
  console.log(chalk.gray('  VS Code Setup:      ') + (config.setupVscode ? chalk.green('Yes') : chalk.gray('No')));
  console.log();

  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ready to proceed?',
      default: true
    }
  ]);

  return proceed;
};
