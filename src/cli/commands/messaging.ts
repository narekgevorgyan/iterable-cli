import { Command } from 'commander';
import * as messagingApi from '../../api/messaging.js';
import { printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';

export function registerMessagingCommands(program: Command): void {
  const send = program
    .command('send')
    .description('Send messages to users');

  send
    .command('email <campaignId>')
    .description('Send email to a user')
    .requiredOption('--email <email>', 'Recipient email')
    .option('--user-id <userId>', 'Recipient user ID')
    .option('--data <json>', 'Data fields (JSON)')
    .option('--send-at <datetime>', 'Schedule for later (ISO format)')
    .action(async (campaignId, options) => {
      const spinner = ora('Sending email...').start();
      try {
        const result = await messagingApi.sendEmail(parseInt(campaignId), {
          recipientEmail: options.email,
          recipientUserId: options.userId,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
          sendAt: options.sendAt,
        });
        spinner.stop();
        printSuccess(`Email sent: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  send
    .command('push <campaignId>')
    .description('Send push notification to a user')
    .option('--email <email>', 'Recipient email')
    .option('--user-id <userId>', 'Recipient user ID')
    .option('--data <json>', 'Data fields (JSON)')
    .option('--send-at <datetime>', 'Schedule for later (ISO format)')
    .action(async (campaignId, options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Sending push notification...').start();
      try {
        const result = await messagingApi.sendPush(parseInt(campaignId), {
          recipientEmail: options.email,
          recipientUserId: options.userId,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
          sendAt: options.sendAt,
        });
        spinner.stop();
        printSuccess(`Push notification sent: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  send
    .command('sms <campaignId>')
    .description('Send SMS to a user')
    .option('--email <email>', 'Recipient email')
    .option('--user-id <userId>', 'Recipient user ID')
    .option('--data <json>', 'Data fields (JSON)')
    .option('--send-at <datetime>', 'Schedule for later (ISO format)')
    .action(async (campaignId, options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Sending SMS...').start();
      try {
        const result = await messagingApi.sendSms(parseInt(campaignId), {
          recipientEmail: options.email,
          recipientUserId: options.userId,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
          sendAt: options.sendAt,
        });
        spinner.stop();
        printSuccess(`SMS sent: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  send
    .command('inapp <campaignId>')
    .description('Send in-app message to a user')
    .option('--email <email>', 'Recipient email')
    .option('--user-id <userId>', 'Recipient user ID')
    .option('--data <json>', 'Data fields (JSON)')
    .action(async (campaignId, options) => {
      if (!options.email && !options.userId) {
        printError('Either --email or --user-id is required');
        process.exit(1);
      }

      const spinner = ora('Sending in-app message...').start();
      try {
        const result = await messagingApi.sendInApp(parseInt(campaignId), {
          recipientEmail: options.email,
          recipientUserId: options.userId,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
        });
        spinner.stop();
        printSuccess(`In-app message sent: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  // Cancel commands
  const cancel = program
    .command('cancel')
    .description('Cancel scheduled messages');

  cancel
    .command('email')
    .description('Cancel scheduled email')
    .option('--campaign-id <id>', 'Campaign ID')
    .option('--email <email>', 'User email')
    .option('--message-id <id>', 'Scheduled message ID')
    .action(async (options) => {
      const spinner = ora('Cancelling email...').start();
      try {
        const result = await messagingApi.cancelEmail({
          campaignId: options.campaignId ? parseInt(options.campaignId) : undefined,
          email: options.email,
          scheduledMessageId: options.messageId,
        });
        spinner.stop();
        printSuccess(`Email cancelled: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  cancel
    .command('push')
    .description('Cancel scheduled push notification')
    .option('--campaign-id <id>', 'Campaign ID')
    .option('--email <email>', 'User email')
    .option('--message-id <id>', 'Scheduled message ID')
    .action(async (options) => {
      const spinner = ora('Cancelling push...').start();
      try {
        const result = await messagingApi.cancelPush({
          campaignId: options.campaignId ? parseInt(options.campaignId) : undefined,
          email: options.email,
          scheduledMessageId: options.messageId,
        });
        spinner.stop();
        printSuccess(`Push cancelled: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
