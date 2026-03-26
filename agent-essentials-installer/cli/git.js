import simpleGit from 'simple-git';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';

export const cloneRepository = async (targetPath, repoUrl, branch = 'main', mode = 'copy') => {
  const spinner = ora();
  
  try {
    if (mode === 'submodule') {
      spinner.start('Setting up git repository...');
      const git = simpleGit(targetPath);
      
      // Initialize git if needed
      try {
        await git.getRemotes();
      } catch (e) {
        await git.init();
        spinner.text = 'Initializing git repository...';
      }
      
      spinner.text = 'Adding submodule...';
      const orchestratorPath = path.join(targetPath, 'orchestrator-core');
      await git.submoduleAdd(repoUrl, orchestratorPath);
      await git.submoduleUpdate(['--init', '--recursive']);
      
      spinner.succeed('Submodule added successfully');
    } else {
      // Copy mode - clone and then remove git
      spinner.start('Cloning repository...');
      const tempPath = path.join(targetPath, '.temp-clone');
      await fs.ensureDir(tempPath);
      
      try {
        const git = simpleGit();
        await git.clone(repoUrl, tempPath, ['--branch', branch, '--depth', '1']);
        spinner.text = 'Processing cloned files...';
        
        // Copy contents to target, removing git
        const content = await fs.readdir(tempPath);
        for (const item of content) {
          if (item !== '.git') {
            const src = path.join(tempPath, item);
            const dst = path.join(targetPath, item);
            await fs.copy(src, dst, { overwrite: true });
          }
        }
        
        // Cleanup temp directory
        await fs.remove(tempPath);
        spinner.succeed('Repository cloned successfully');
      } catch (error) {
        await fs.remove(tempPath);
        throw error;
      }
    }
  } catch (error) {
    spinner.fail('Failed to clone repository');
    throw new Error(`Repository clone failed: ${error.message}`);
  }
};

export const initializeGitRepository = async (targetPath) => {
  const spinner = ora();
  
  try {
    spinner.start('Initializing git repository...');
    const git = simpleGit(targetPath);
    
    try {
      await git.getRemotes();
      spinner.info('Git repository already initialized');
    } catch (e) {
      await git.init();
      spinner.succeed('Git repository initialized');
    }
  } catch (error) {
    spinner.fail('Failed to initialize git repository');
    throw new Error(`Git initialization failed: ${error.message}`);
  }
};

export const setupGitHooks = async (targetPath) => {
  const spinner = ora('Setting up git hooks...');
  
  try {
    const hooksDir = path.join(targetPath, '.git', 'hooks');
    const preCommitPath = path.join(hooksDir, 'pre-commit');
    
    // Create hooks directory if it doesn't exist
    await fs.ensureDir(hooksDir);
    
    // Create pre-commit hook
    const preCommitContent = `#!/bin/bash
# Pre-commit hook for Orchestrator

echo "Running pre-commit checks..."

# Run linting if available
if command -v npm &> /dev/null; then
  npm run lint 2>/dev/null || true
fi

# Run Python checks if available
if command -v python &> /dev/null; then
  python -m pytest tests/ -q 2>/dev/null || true
fi

exit 0
`;

    await fs.writeFile(preCommitPath, preCommitContent, { mode: 0o755 });
    spinner.succeed('Git hooks configured');
  } catch (error) {
    spinner.warn('Git hook setup skipped or partial');
  }
};

export const addGitIgnore = async (targetPath) => {
  const spinner = ora('Setting up .gitignore...');
  
  try {
    const gitignorePath = path.join(targetPath, '.gitignore');
    
    const gitignoreContent = `.env
.env.local
node_modules/
package-lock.json
yarn.lock
.venv/
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
dist/
build/
*.egg-info/
.DS_Store
*.log
.idea/
.vscode/settings.json
.vscode/launch.json
.vscode/extensions.json
.claude/
.temp-*
`;

    await fs.writeFile(gitignorePath, gitignoreContent);
    spinner.succeed('.gitignore created');
  } catch (error) {
    spinner.warn('.gitignore setup skipped');
  }
};
