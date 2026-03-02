import { Command } from 'commander';
import * as templatesApi from '../../api/templates.js';
import { printTable, printJson, formatDate, printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';

export function registerTemplateCommands(program: Command): void {
  const templates = program
    .command('templates')
    .description('Manage templates');

  templates
    .command('list')
    .description('List all templates')
    .option('-t, --type <type>', 'Template type (Base|Blast|Triggered|Workflow)')
    .option('-m, --medium <medium>', 'Message medium (Email|Push|SMS|InApp)')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (options) => {
      const spinner = ora('Fetching templates...').start();
      try {
        const allTemplates = await templatesApi.listTemplates(options.type, options.medium);
        spinner.stop();

        if (options.format === 'json') {
          printJson(allTemplates);
        } else {
          if (allTemplates.length === 0) {
            console.log('No templates found');
            return;
          }

          printTable(
            ['ID', 'Name', 'Created', 'Updated'],
            allTemplates.map(t => [
              t.templateId.toString(),
              t.name,
              formatDate(t.createdAt),
              formatDate(t.updatedAt),
            ])
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  templates
    .command('get <type> <templateId>')
    .description('Get template details (type: email|push|sms|inapp)')
    .option('-f, --format <format>', 'Output format', 'json')
    .action(async (type, templateId, options) => {
      const spinner = ora('Fetching template...').start();
      try {
        let template;
        switch (type.toLowerCase()) {
          case 'email':
            template = await templatesApi.getEmailTemplate(parseInt(templateId));
            break;
          case 'push':
            template = await templatesApi.getPushTemplate(parseInt(templateId));
            break;
          case 'sms':
            template = await templatesApi.getSmsTemplate(parseInt(templateId));
            break;
          case 'inapp':
            template = await templatesApi.getInAppTemplate(parseInt(templateId));
            break;
          default:
            throw new Error(`Unknown template type: ${type}. Use email, push, sms, or inapp`);
        }
        spinner.stop();
        printJson(template);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  templates
    .command('preview <templateId>')
    .description('Preview email template for a user')
    .requiredOption('--email <email>', 'Recipient email for preview')
    .action(async (templateId, options) => {
      const spinner = ora('Generating preview...').start();
      try {
        const preview = await templatesApi.previewEmailTemplate(
          parseInt(templateId),
          options.email
        );
        spinner.stop();

        console.log('\n--- Subject ---');
        console.log(preview.subject);
        console.log('\n--- HTML (truncated) ---');
        console.log(preview.html?.slice(0, 500) + '...');
        console.log('\n--- Plain Text ---');
        console.log(preview.plainText);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  templates
    .command('update <type> <templateId>')
    .description('Update a template')
    .option('--name <name>', 'Template name')
    .option('--subject <subject>', 'Email subject (email only)')
    .option('--title <title>', 'Push title (push only)')
    .option('--message <message>', 'Push message (push only)')
    .option('--data <json>', 'Additional update data (JSON)')
    .action(async (type, templateId, options) => {
      const spinner = ora('Updating template...').start();
      try {
        const updates: Record<string, unknown> = {};
        if (options.name) updates.name = options.name;
        if (options.subject) updates.subject = options.subject;
        if (options.title) updates.title = options.title;
        if (options.message) updates.message = options.message;
        if (options.data) {
          Object.assign(updates, JSON.parse(options.data));
        }

        let result;
        switch (type.toLowerCase()) {
          case 'email':
            result = await templatesApi.updateEmailTemplate(parseInt(templateId), updates);
            break;
          case 'push':
            result = await templatesApi.updatePushTemplate(parseInt(templateId), updates);
            break;
          default:
            throw new Error(`Update not yet supported for type: ${type}`);
        }
        spinner.stop();
        printSuccess(`Template updated: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  templates
    .command('proof <type> <templateId>')
    .description('Send a proof email/push/sms')
    .requiredOption('--email <email>', 'Recipient email')
    .action(async (type, templateId, options) => {
      const spinner = ora('Sending proof...').start();
      try {
        const result = await templatesApi.sendProof(
          type.toLowerCase() as 'email' | 'push' | 'sms',
          parseInt(templateId),
          options.email
        );
        spinner.stop();
        printSuccess(`Proof sent: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
