import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth.js';
import { registerCampaignCommands } from './commands/campaigns.js';
import { registerUserCommands } from './commands/users.js';
import { registerListCommands } from './commands/lists.js';
import { registerTemplateCommands } from './commands/templates.js';
import { registerMessagingCommands } from './commands/messaging.js';
import { registerJourneyCommands } from './commands/journeys.js';
import { registerEventCommands } from './commands/events.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('iterable')
    .description('CLI tool for interacting with the Iterable marketing platform')
    .version('1.0.0');

  // Register all command groups
  registerAuthCommands(program);
  registerCampaignCommands(program);
  registerUserCommands(program);
  registerListCommands(program);
  registerTemplateCommands(program);
  registerMessagingCommands(program);
  registerJourneyCommands(program);
  registerEventCommands(program);

  return program;
}
