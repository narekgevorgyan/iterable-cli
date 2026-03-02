---
name: iterable
description: Manage the Iterable marketing platform — campaigns, users, lists, templates, messaging, journeys, and event tracking. Use when working with Iterable marketing automation.
allowed-tools: Bash
---

# Iterable CLI

CLI for the Iterable marketing automation platform.

## Setup

```bash
export ITERABLE_API_KEY=your_api_key_here
# Or store in keychain:
node dist/index.js auth login --key <apiKey>
```

## Campaigns

```bash
# List all campaigns
node dist/index.js campaigns list

# Get campaign details
node dist/index.js campaigns get <campaignId>

# Get performance metrics
node dist/index.js campaigns metrics <campaignId>

# Create a campaign
node dist/index.js campaigns create --name "My Campaign" --template <templateId> --lists <listId1,listId2>

# Trigger for a user or list
node dist/index.js campaigns trigger <campaignId> --email user@example.com
node dist/index.js campaigns trigger <campaignId> --list <listId>
node dist/index.js campaigns trigger <campaignId> --email user@example.com --data '{"promo_code": "SAVE20"}'

# Schedule, abort, archive
node dist/index.js campaigns schedule <campaignId> --send-at "2026-04-01T10:00:00Z"
node dist/index.js campaigns abort <campaignId>
node dist/index.js campaigns archive <campaignId>
```

## Users

```bash
# Get user
node dist/index.js users get <email>
node dist/index.js users get-by-id <userId>

# Update user fields
node dist/index.js users update <email> --data '{"firstName": "John", "lastName": "Doe"}'
node dist/index.js users update <email> --data '{"preferences": {"theme": "dark"}}' --merge

# Delete user
node dist/index.js users delete <email>

# Get user events
node dist/index.js users events <email> --limit 50

# List profile fields
node dist/index.js users fields
```

## Lists

```bash
# List all lists
node dist/index.js lists list

# Create / delete
node dist/index.js lists create "My New List"
node dist/index.js lists delete <listId>

# Subscriber count
node dist/index.js lists size <listId>

# Subscribe / unsubscribe
node dist/index.js lists subscribe <listId> --emails "a@x.com,b@x.com"
node dist/index.js lists unsubscribe <listId> --emails "a@x.com"

# Preview members
node dist/index.js lists users <listId>
```

## Templates

```bash
# List templates
node dist/index.js templates list
node dist/index.js templates list --type Blast --medium Email

# Get template (email|push|sms|inapp)
node dist/index.js templates get email <templateId>
node dist/index.js templates get push <templateId>

# Preview with user data
node dist/index.js templates preview <templateId> --email user@example.com

# Update template
node dist/index.js templates update email <templateId> --name "New Name" --subject "New Subject"
node dist/index.js templates update push <templateId> --title "Alert" --message "Tap here"

# Send proof
node dist/index.js templates proof email <templateId> --email test@example.com
```

## Messaging

```bash
# Send messages (email|push|sms|inapp)
node dist/index.js send email <campaignId> --email user@example.com
node dist/index.js send push <campaignId> --email user@example.com
node dist/index.js send sms <campaignId> --email user@example.com
node dist/index.js send inapp <campaignId> --email user@example.com

# Cancel scheduled messages
node dist/index.js cancel email --campaign-id <id> --email user@example.com
node dist/index.js cancel push --campaign-id <id> --email user@example.com
```

## Journeys

```bash
# List all journeys
node dist/index.js journeys list

# Trigger workflow for user
node dist/index.js journeys trigger <workflowId> --email user@example.com
```

## Events

```bash
# Track custom event
node dist/index.js events track --event "userSignup" --email user@example.com --data '{"source": "web"}'

# Track purchase
node dist/index.js events purchase --email user@example.com --items '[{"id":"SKU123","name":"Widget","price":9.99,"quantity":1}]' --total 9.99

# Track cart update
node dist/index.js events cart --email user@example.com --items '[{"id":"SKU123","name":"Widget","price":9.99,"quantity":2}]'
```

## Common Flags

| Flag | Description |
|------|-------------|
| `--format table\|json` | Output format (default: table) |
| `--email` | Target user email |
| `--data` | JSON payload |
| `--merge` | Merge nested objects (users update) |
| `--limit` | Max results to return |

## Notes

- **Campaign types**: Blast (one-time) and Triggered (API/workflow).
- **Campaign states**: Draft, Running, Finished, Cancelled.
- **Template types**: Email, Push, SMS, InApp. Templates use Handlebars: `{{firstName}}`, `{{dataFields.custom}}`.
- Journeys can only be created/edited in the Iterable UI — API supports listing and triggering only.
- Requires `ITERABLE_API_KEY` env var or keychain auth via `auth login`.
