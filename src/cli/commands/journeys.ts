import { Command } from 'commander';
import * as journeysApi from '../../api/journeys.js';
import { printTable, printJson, formatDate, printSuccess, printError } from '../../utils/output.js';
import ora from 'ora';
import chalk from 'chalk';

function formatJourneyStatus(journeyType: string, enabled: boolean): string {
  if (journeyType === 'Published' && enabled) return chalk.green('Published (Active)');
  if (journeyType === 'Published' && !enabled) return chalk.yellow('Published (Paused)');
  if (journeyType === 'Draft') return chalk.yellow('Draft');
  if (journeyType === 'Stopped') return chalk.red('Stopped');
  return journeyType;
}

export function registerJourneyCommands(program: Command): void {
  const journeys = program
    .command('journeys')
    .description('Manage journeys (workflows)');

  journeys
    .command('list')
    .description('List all journeys')
    .option('--archived', 'Show archived journeys')
    .option('--sort <field>', 'Sort field (prefix with - for descending)', 'id')
    .option('--limit <number>', 'Max results to return')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (options) => {
      const spinner = ora('Fetching journeys...').start();
      try {
        const { journeys: allJourneys, totalCount } = await journeysApi.listJourneys({
          state: options.archived ? 'Archived' : undefined,
          sort: options.sort !== 'id' ? options.sort : undefined,
          limit: options.limit ? parseInt(options.limit) : undefined,
        });
        spinner.stop();

        if (options.format === 'json') {
          printJson(allJourneys);
        } else {
          if (allJourneys.length === 0) {
            console.log('No journeys found');
            return;
          }

          printTable(
            ['ID', 'Name', 'Status', 'Triggers', 'Archived', 'Created', 'Updated'],
            allJourneys.map(j => [
              j.id.toString(),
              j.name,
              formatJourneyStatus(j.journeyType, j.enabled),
              j.triggerEventNames.filter(Boolean).join(', ') || '-',
              j.isArchived ? chalk.gray('Yes') : 'No',
              formatDate(j.createdAt),
              formatDate(j.updatedAt),
            ])
          );
          console.log(chalk.gray(`\nTotal: ${totalCount} journey(s)`));
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  journeys
    .command('get <journeyId>')
    .description('Get journey details by ID')
    .option('-f, --format <format>', 'Output format (table|json)', 'table')
    .action(async (journeyId, options) => {
      const spinner = ora('Fetching journey...').start();
      try {
        const journey = await journeysApi.getJourney(parseInt(journeyId));
        spinner.stop();

        if (!journey) {
          printError(`Journey with ID ${journeyId} not found`);
          process.exit(1);
        }

        if (options.format === 'json') {
          printJson(journey);
        } else {
          console.log(chalk.bold(`Journey: ${journey.name}`));
          console.log();
          printTable(
            ['Field', 'Value'],
            [
              ['ID', journey.id.toString()],
              ['Name', journey.name],
              ['Description', journey.description || '-'],
              ['Status', formatJourneyStatus(journey.journeyType, journey.enabled)],
              ['Enabled', journey.enabled ? 'Yes' : 'No'],
              ['Trigger Events', journey.triggerEventNames.filter(Boolean).join(', ') || '-'],
              ['Simultaneous Limit', journey.simultaneousLimit.toString()],
              ['Lifetime Limit', journey.lifetimeLimit?.toString() || 'None'],
              ['Archived', journey.isArchived ? 'Yes' : 'No'],
              ['Creator', journey.creatorUserId],
              ['Created', formatDate(journey.createdAt)],
              ['Updated', formatDate(journey.updatedAt)],
            ]
          );
        }
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });

  journeys
    .command('trigger <workflowId>')
    .description('Trigger a workflow for a user or list')
    .option('--email <email>', 'User email')
    .option('--user-id <userId>', 'User ID')
    .option('--list <listId>', 'List ID (trigger for all users on list)')
    .option('--data <json>', 'Data fields (JSON)')
    .action(async (workflowId, options) => {
      if (!options.email && !options.userId && !options.list) {
        printError('Either --email, --user-id, or --list is required');
        process.exit(1);
      }

      const spinner = ora('Triggering workflow...').start();
      try {
        const result = await journeysApi.triggerWorkflow(parseInt(workflowId), {
          email: options.email,
          userId: options.userId,
          listId: options.list ? parseInt(options.list) : undefined,
          dataFields: options.data ? JSON.parse(options.data) : undefined,
        });
        spinner.stop();
        printSuccess(`Workflow triggered: ${result.msg}`);
      } catch (error) {
        spinner.stop();
        printError((error as Error).message);
        process.exit(1);
      }
    });
}
