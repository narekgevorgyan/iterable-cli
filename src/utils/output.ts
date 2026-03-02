import Table from 'cli-table3';
import chalk from 'chalk';

export type OutputFormat = 'table' | 'json';

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: string[][]): void {
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: { head: [], border: [] },
  });

  rows.forEach(row => table.push(row));
  console.log(table.toString());
}

export function printSuccess(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function printError(message: string): void {
  console.error(chalk.red('✗'), message);
}

export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function formatCampaignState(state: string): string {
  switch (state) {
    case 'Draft':
      return chalk.yellow(state);
    case 'Running':
      return chalk.green(state);
    case 'Finished':
      return chalk.blue(state);
    case 'Cancelled':
      return chalk.red(state);
    default:
      return state;
  }
}

export function formatMedium(medium: string): string {
  switch (medium) {
    case 'Email':
      return chalk.cyan(medium);
    case 'Push':
      return chalk.magenta(medium);
    case 'SMS':
      return chalk.green(medium);
    case 'InApp':
      return chalk.yellow(medium);
    default:
      return medium;
  }
}
