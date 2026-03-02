import { homedir } from 'os';
import { join } from 'path';

export const CONFIG_DIR = join(homedir(), '.iterable-cli');
export const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface Config {
  defaultFormat?: 'table' | 'json';
  projectName?: string;
}

export function getDefaultConfig(): Config {
  return {
    defaultFormat: 'table',
  };
}
