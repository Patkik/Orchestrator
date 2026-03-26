import path from 'path';
import fs from 'fs-extra';
import { normalizePath, expandPath } from './utils.js';

export const validatePath = async (targetPath, allowExisting = false) => {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('Target path must be a non-empty string');
  }

  const normalizedPath = normalizePath(expandPath(targetPath));
  const exists = await fs.pathExists(normalizedPath);

  if (exists) {
    const stat = await fs.stat(normalizedPath);
    if (!stat.isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${targetPath}`);
    }
    
    const isEmpty = (await fs.readdir(normalizedPath)).length === 0;
    if (!isEmpty && !allowExisting) {
      throw new Error(`Directory is not empty: ${targetPath}. Use --force to override.`);
    }
  }

  return normalizedPath;
};

export const validateMode = (mode) => {
  const validModes = ['copy', 'submodule'];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid mode '${mode}'. Must be one of: ${validModes.join(', ')}`);
  }
  return mode;
};

export const validateBranch = (branch) => {
  if (!branch || typeof branch !== 'string' || branch.trim().length === 0) {
    throw new Error('Branch name cannot be empty');
  }
  // Basic validation - branch names shouldn't have spaces or special patterns
  if (!/^[a-zA-Z0-9._\/-]+$/.test(branch)) {
    throw new Error(`Invalid branch name: ${branch}`);
  }
  return branch.trim();
};

export const validateRepositoryUrl = (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('Repository URL cannot be empty');
  }
  
  // Basic URL validation
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(`Invalid repository URL: ${url}`);
  }
};

export const validateConfig = (config) => {
  if (!config) {
    throw new Error('Configuration object is required');
  }

  const required = ['targetPath', 'mode'];
  for (const field of required) {
    if (!(field in config)) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }

  validateMode(config.mode);
  validateBranch(config.branch || 'main');
  validateRepositoryUrl(config.repoUrl);

  return true;
};
