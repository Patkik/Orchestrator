#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { setupInteractive } from './cli/interactive.js';
import { handleSetup } from './cli/setup.js';
import { version } from './cli/utils.js';

const packageVersion = '1.0.0';

program
  .name('orchestrator-essentials-setup')
  .description('Set up agentic workflow environments with a single command')
  .version(packageVersion, '-v, --version', 'Display version');

// Main command (interactive by default)
program
  .command('init [targetPath]')
  .description('Initialize a new orchestrator workspace')
  .option('--mode <mode>', 'Installation mode: copy or submodule (default: copy)', 'copy')
  .option('--branch <branch>', 'Git branch to clone/pull (default: main)', 'main')
  .option('--repo-url <url>', 'Custom repository URL', 'https://github.com/its-patri/Orchestrator')
  .option('--no-python', 'Skip Python environment setup')
  .option('--no-git-hooks', 'Skip git hooks setup')
  .option('--no-vscode', 'Skip VS Code extensions setup')
  .option('--no-clone', 'Only create structure, don\'t clone Orchestrator')
  .option('--force', 'Force setup even if directory exists')
  .option('--non-interactive', 'Use provided arguments without prompts')
  .action(async (targetPath, options) => {
    try {
      if (options.nonInteractive) {
        // Direct CLI mode
        const config = {
          targetPath: targetPath || process.cwd(),
          mode: options.mode,
          installPython: !options.noPython,
          setupGitHooks: !options.noGitHooks,
          setupVscode: !options.noVscode,
          cloneOrchestrator: !options.noClone,
          branch: options.branch,
          repoUrl: options.repoUrl,
          force: options.force
        };
        await handleSetup(config);
      } else {
        // Interactive mode
        const config = await setupInteractive(targetPath);
        await handleSetup(config);
      }
    } catch (error) {
      console.error(chalk.red('✗ Setup failed:'), error.message);
      process.exit(1);
    }
  });

// Default to interactive if no command provided
program
  .action(async (options) => {
    try {
      const config = await setupInteractive(process.cwd());
      await handleSetup(config);
    } catch (error) {
      console.error(chalk.red('✗ Setup failed:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
