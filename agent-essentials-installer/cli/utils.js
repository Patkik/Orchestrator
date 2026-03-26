import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

export const version = '1.0.0';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const __filename = fileURLToPath(import.meta.url);

export const isWindows = () => process.platform === 'win32';
export const isMacOS = () => process.platform === 'darwin';
export const isLinux = () => process.platform === 'linux';

export const getPlatform = () => {
  if (isWindows()) return 'windows';
  if (isMacOS()) return 'macos';
  if (isLinux()) return 'linux';
  return 'unknown';
};

export const getShell = () => {
  const platform = getPlatform();
  const env = process.env.SHELL || process.env.COMSPEC;
  
  if (platform === 'windows') return 'powershell';
  if (env?.includes('zsh')) return 'zsh';
  if (env?.includes('bash')) return 'bash';
  return 'sh';
};

export const normalizePath = (p) => {
  return path.normalize(path.resolve(p));
};

export const getHomeDir = () => os.homedir();

export const expandPath = (p) => {
  if (p.startsWith('~')) {
    return path.join(getHomeDir(), p.slice(1));
  }
  return p;
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
