import { Command } from 'commander';
import * as usersApi from '../../api/users.js';
import { printTable, printJson, formatDate, printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';

export function registerUserCommands(program: Command): void {
  const users = program
    .command('users')
    .description('Manage users');

  users
    .command('get <email>')
    .description('Get user by email')
    .option('-f, --format <format>', 'Output format (table|json)', 'json')
    .action(async (email, options) => {
      const spinner = ora('Fetching user...').start();
      try {
        const user = await usersApi.getUser(email);
        spinner.stop();

        if (options.format === 'json') {
          printJson(user);
        } else {
          const rows: string[][] = [
            ['Email', user.email],
            ['User ID', user.userId || 'N/A'],
            ['Signup Date', user.signupDate ? formatDate(user.signupDate) : 'N/A'],
            ['Signup Source', user.signupSource || 'N/A'],
          ];

          if (user.dataFields) {
            Object.entries(user.dataFields).forEach(([key, value]) => {
              rows.push([`Data: ${key}`, JSON.stringify(value)]);
            });
          }

          printTable(['Property', 'Value'], rows);
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  users
    .command('get-by-id <userId>')
    .description('Get user by user ID')
    .option('-f, --format <format>', 'Output format (table|json)', 'json')
    .action(async (userId, options) => {
      const spinner = ora('Fetching user...').start();
      try {
        const user = await usersApi.getUserById(userId);
        spinner.stop();

        if (options.format === 'json') {
          printJson(user);
        } else {
          printTable(
            ['Property', 'Value'],
            [
              ['Email', user.email],
              ['User ID', user.userId || 'N/A'],
              ['Signup Date', user.signupDate ? formatDate(user.signupDate) : 'N/A'],
            ]
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  users
    .command('update <email>')
    .description('Update user data')
    .requiredOption('--data <json>', 'Data fields to update (JSON)')
    .option('--user-id <userId>', 'Set user ID')
    .option('--merge', 'Merge nested objects (default: replace)')
    .action(async (email, options) => {
      const spinner = ora('Updating user...').start();
      try {
        const dataFields = JSON.parse(options.data);
        const result = await usersApi.updateUser({
          email,
          userId: options.userId,
          dataFields,
          mergeNestedObjects: options.merge,
        });
        spinner.stop();
        printSuccess(`User updated: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  users
    .command('delete <email>')
    .description('Delete user by email')
    .action(async (email) => {
      const spinner = ora('Deleting user...').start();
      try {
        const result = await usersApi.deleteUser(email);
        spinner.stop();
        printSuccess(`User deleted: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  users
    .command('events <email>')
    .description('Get user events')
    .option('-l, --limit <number>', 'Limit number of events', '50')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (email, options) => {
      const spinner = ora('Fetching events...').start();
      try {
        const events = await usersApi.getUserEvents(email, parseInt(options.limit));
        spinner.stop();

        if (options.format === 'json') {
          printJson(events);
        } else {
          if (events.length === 0) {
            console.log('No events found');
            return;
          }

          printTable(
            ['Event Name', 'Time', 'Data'],
            events.map(e => [
              e.eventName,
              formatDate(e.createdAt),
              JSON.stringify(e.dataFields || {}).slice(0, 50),
            ])
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  users
    .command('fields')
    .description('List all user profile fields')
    .action(async () => {
      const spinner = ora('Fetching fields...').start();
      try {
        const fields = await usersApi.getFields();
        spinner.stop();
        console.log('User profile fields:');
        fields.forEach(f => console.log(`  - ${f}`));
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
