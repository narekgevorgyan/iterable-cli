import { Command } from 'commander';
import * as listsApi from '../../api/lists.js';
import { printTable, printJson, formatDate, printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';

export function registerListCommands(program: Command): void {
  const lists = program
    .command('lists')
    .description('Manage lists');

  lists
    .command('list')
    .description('List all lists')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (options) => {
      const spinner = ora('Fetching lists...').start();
      try {
        const allLists = await listsApi.listLists();
        spinner.stop();

        if (options.format === 'json') {
          printJson(allLists);
        } else {
          if (allLists.length === 0) {
            console.log('No lists found');
            return;
          }

          printTable(
            ['ID', 'Name', 'Type', 'Created'],
            allLists.map(l => [
              l.id.toString(),
              l.name,
              l.listType,
              formatDate(l.createdAt),
            ])
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('create <name>')
    .description('Create a new list')
    .action(async (name) => {
      const spinner = ora('Creating list...').start();
      try {
        const result = await listsApi.createList(name);
        spinner.stop();
        printSuccess(`List created with ID: ${result.listId}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('delete <listId>')
    .description('Delete a list')
    .action(async (listId) => {
      const spinner = ora('Deleting list...').start();
      try {
        const result = await listsApi.deleteList(parseInt(listId));
        spinner.stop();
        printSuccess(`List deleted: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('size <listId>')
    .description('Get list size')
    .action(async (listId) => {
      const spinner = ora('Fetching list size...').start();
      try {
        const size = await listsApi.getListSize(parseInt(listId));
        spinner.stop();
        console.log(`List ${listId} has ${size} subscribers`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('subscribe <listId>')
    .description('Subscribe users to a list')
    .requiredOption('--emails <emails>', 'Comma-separated list of emails')
    .action(async (listId, options) => {
      const spinner = ora('Subscribing users...').start();
      try {
        const emails = options.emails.split(',').map((e: string) => e.trim());
        const subscribers = emails.map((email: string) => ({ email }));
        const result = await listsApi.subscribeToList(parseInt(listId), subscribers);
        spinner.stop();
        printSuccess(`Subscribed ${result.successCount} users (${result.failCount} failed)`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('unsubscribe <listId>')
    .description('Unsubscribe users from a list')
    .requiredOption('--emails <emails>', 'Comma-separated list of emails')
    .action(async (listId, options) => {
      const spinner = ora('Unsubscribing users...').start();
      try {
        const emails = options.emails.split(',').map((e: string) => e.trim());
        const subscribers = emails.map((email: string) => ({ email }));
        const result = await listsApi.unsubscribeFromList(parseInt(listId), subscribers);
        spinner.stop();
        printSuccess(`Unsubscribed ${result.successCount} users (${result.failCount} failed)`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  lists
    .command('users <listId>')
    .description('Preview users in a list')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (listId, options) => {
      const spinner = ora('Fetching list users...').start();
      try {
        const users = await listsApi.previewListUsers(parseInt(listId));
        spinner.stop();

        if (options.format === 'json') {
          printJson(users);
        } else {
          if (users.length === 0) {
            console.log('No users in this list');
            return;
          }

          console.log(`Users in list ${listId} (preview, max 5000):`);
          users.forEach(u => console.log(`  - ${u.email}`));
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
