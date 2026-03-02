import { Command } from 'commander';
import { setApiKey, deleteApiKey, getApiKey } from '../../auth/index.js';
import { printSuccess, printError, printInfo } from '../../utils/output.js';
import chalk from 'chalk';
import * as readline from 'readline';

async function promptForKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter your Iterable API key: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export function registerAuthCommands(program: Command): void {
  const auth = program
    .command('auth')
    .description('Manage authentication');

  auth
    .command('login')
    .description('Store your Iterable API key in the system keychain')
    .option('-k, --key <apiKey>', 'API key (or enter interactively)')
    .action(async (options) => {
      try {
        let apiKey = options.key;

        if (!apiKey) {
          apiKey = await promptForKey();
        }

        if (!apiKey) {
          printError('No API key provided');
          process.exit(1);
        }

        await setApiKey(apiKey);
        printSuccess('API key stored securely in system keychain');
      } catch (error) {
        printError(`Failed to store API key: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  auth
    .command('logout')
    .description('Remove your Iterable API key from the system keychain')
    .action(async () => {
      try {
        const deleted = await deleteApiKey();
        if (deleted) {
          printSuccess('API key removed from system keychain');
        } else {
          printInfo('No API key was stored');
        }
      } catch (error) {
        printError(`Failed to remove API key: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  auth
    .command('status')
    .description('Check authentication status')
    .action(async () => {
      try {
        const apiKey = await getApiKey();

        if (apiKey) {
          const masked = apiKey.slice(0, 4) + '...' + apiKey.slice(-4);
          printSuccess(`Authenticated with API key: ${chalk.dim(masked)}`);

          if (process.env.ITERABLE_API_KEY) {
            printInfo('Using API key from environment variable');
          } else {
            printInfo('Using API key from system keychain');
          }
        } else {
          printError('Not authenticated');
          console.log(chalk.dim('Run `iterable auth login` to configure your API key'));
        }
      } catch (error) {
        printError(`Failed to check auth status: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
