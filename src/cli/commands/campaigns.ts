import { Command } from 'commander';
import * as campaignsApi from '../../api/campaigns.js';
import { printTable, printJson, formatDate, formatCampaignState, formatMedium, printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';

export function registerCampaignCommands(program: Command): void {
  const campaigns = program
    .command('campaigns')
    .description('Manage campaigns');

  campaigns
    .command('list')
    .description('List all campaigns')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (options) => {
      const spinner = ora('Fetching campaigns...').start();
      try {
        const campaigns = await campaignsApi.listCampaigns();
        spinner.stop();

        if (options.format === 'json') {
          printJson(campaigns);
        } else {
          if (campaigns.length === 0) {
            console.log('No campaigns found');
            return;
          }

          printTable(
            ['ID', 'Name', 'Type', 'Medium', 'State', 'Updated'],
            campaigns.map(c => [
              c.id.toString(),
              c.name,
              c.type,
              formatMedium(c.messageMedium),
              formatCampaignState(c.campaignState),
              formatDate(c.updatedAt),
            ])
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('create')
    .description('Create a new campaign')
    .requiredOption('--name <name>', 'Campaign name')
    .requiredOption('--template <templateId>', 'Template ID to use')
    .requiredOption('--lists <listIds>', 'Comma-separated list IDs')
    .option('--type <type>', 'Campaign type (Blast|Triggered)', 'Blast')
    .option('--suppression-lists <listIds>', 'Comma-separated suppression list IDs')
    .option('--send-at <datetime>', 'Schedule send time (ISO format)')
    .option('--data <json>', 'Additional data fields (JSON)')
    .action(async (options) => {
      const spinner = ora('Creating campaign...').start();
      try {
        const listIds = options.lists.split(',').map((id: string) => parseInt(id.trim()));
        const suppressionListIds = options.suppressionLists
          ? options.suppressionLists.split(',').map((id: string) => parseInt(id.trim()))
          : undefined;

        const result = await campaignsApi.createCampaign({
          name: options.name,
          templateId: parseInt(options.template),
          listIds,
          suppressionListIds,
          sendAt: options.sendAt,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
        });
        spinner.stop();
        printSuccess(`Campaign created with ID: ${result.campaignId}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('get <campaignId>')
    .description('Get campaign details')
    .option('-f, --format <format>', 'Output format (table|json)', 'json')
    .action(async (campaignId, options) => {
      const spinner = ora('Fetching campaign...').start();
      try {
        const campaign = await campaignsApi.getCampaign(parseInt(campaignId));
        spinner.stop();

        if (options.format === 'json') {
          printJson(campaign);
        } else {
          printTable(
            ['Property', 'Value'],
            [
              ['ID', campaign.id.toString()],
              ['Name', campaign.name],
              ['Type', campaign.type],
              ['Medium', campaign.messageMedium],
              ['State', campaign.campaignState],
              ['Template ID', campaign.templateId.toString()],
              ['Created', formatDate(campaign.createdAt)],
              ['Updated', formatDate(campaign.updatedAt)],
              ['Created By', campaign.createdByUserId],
              ['Labels', campaign.labels.join(', ') || 'None'],
            ]
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('metrics <campaignId>')
    .description('Get campaign metrics')
    .option('--start <date>', 'Start date (ISO format)')
    .option('--end <date>', 'End date (ISO format)')
    .option('-f, --format <format>', 'Output format (table|json)', 'json')
    .action(async (campaignId, options) => {
      const spinner = ora('Fetching metrics...').start();
      try {
        const metrics = await campaignsApi.getCampaignMetrics(
          parseInt(campaignId),
          options.start,
          options.end
        );
        spinner.stop();
        printJson(metrics);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('trigger <campaignId>')
    .description('Trigger a campaign')
    .option('--list <listId>', 'Target list ID')
    .option('--email <email>', 'Target user email')
    .option('--user-id <userId>', 'Target user ID')
    .option('--data <json>', 'Additional data fields (JSON)')
    .action(async (campaignId, options) => {
      const spinner = ora('Triggering campaign...').start();
      try {
        const dataFields = options.data ? JSON.parse(options.data) : undefined;
        const result = await campaignsApi.triggerCampaign(parseInt(campaignId), {
          listId: options.list ? parseInt(options.list) : undefined,
          email: options.email,
          userId: options.userId,
          dataFields,
        });
        spinner.stop();
        printSuccess(`Campaign triggered: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('schedule <campaignId>')
    .description('Schedule a campaign')
    .requiredOption('--send-at <datetime>', 'Send time (ISO format)')
    .action(async (campaignId, options) => {
      const spinner = ora('Scheduling campaign...').start();
      try {
        const result = await campaignsApi.scheduleCampaign(
          parseInt(campaignId),
          options.sendAt
        );
        spinner.stop();
        printSuccess(`Campaign scheduled: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('abort <campaignId>')
    .description('Abort a running campaign')
    .action(async (campaignId) => {
      const spinner = ora('Aborting campaign...').start();
      try {
        const result = await campaignsApi.abortCampaign(parseInt(campaignId));
        spinner.stop();
        printSuccess(`Campaign aborted: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  campaigns
    .command('archive <campaignId>')
    .description('Archive a campaign')
    .action(async (campaignId) => {
      const spinner = ora('Archiving campaign...').start();
      try {
        const result = await campaignsApi.archiveCampaign(parseInt(campaignId));
        spinner.stop();
        printSuccess(`Campaign archived: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
