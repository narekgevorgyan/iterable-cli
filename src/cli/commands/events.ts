import { Command } from 'commander';
import * as eventsApi from '../../api/events.js';
import { printSuccess, printError, printJson } from '../../utils/output.js';
import ora from 'ora';

export function registerEventCommands(program: Command): void {
  const events = program
    .command('events')
    .description('Track events');

  events
    .command('track')
    .description('Track a custom event')
    .requiredOption('--event <name>', 'Event name')
    .option('--email <email>', 'User email')
    .option('--user-id <userId>', 'User ID')
    .option('--data <json>', 'Event data fields (JSON)')
    .option('--campaign-id <id>', 'Associated campaign ID')
    .option('--template-id <id>', 'Associated template ID')
    .action(async (options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Tracking event...').start();
      try {
        const result = await eventsApi.trackEvent({
          email: options.email,
          userId: options.userId,
          eventName: options.event,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
          campaignId: options.campaignId ? parseInt(options.campaignId) : undefined,
          templateId: options.templateId ? parseInt(options.templateId) : undefined,
        });
        spinner.stop();
        printSuccess(`Event tracked: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  events
    .command('purchase')
    .description('Track a purchase event')
    .requiredOption('--items <json>', 'Purchase items (JSON array)')
    .requiredOption('--total <amount>', 'Total amount')
    .option('--email <email>', 'User email')
    .option('--user-id <userId>', 'User ID')
    .option('--data <json>', 'Additional data fields (JSON)')
    .action(async (options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Tracking purchase...').start();
      try {
        const items = JSON.parse(options.items);
        const result = await eventsApi.trackPurchase({
          email: options.email,
          userId: options.userId,
          items,
          total: parseFloat(options.total),
          dataFields: options.data ? JSON.parse(options.data) : undefined,
        });
        spinner.stop();
        printSuccess(`Purchase tracked: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  events
    .command('cart')
    .description('Update shopping cart')
    .requiredOption('--items <json>', 'Cart items (JSON array)')
    .option('--email <email>', 'User email')
    .option('--user-id <userId>', 'User ID')
    .action(async (options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Updating cart...').start();
      try {
        const items = JSON.parse(options.items);
        const result = await eventsApi.updateCart({
          email: options.email,
          userId: options.userId,
          items,
        });
        spinner.stop();
        printSuccess(`Cart updated: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
