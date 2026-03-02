# Iterable CLI & Marketing Agent

Experimental internal tool by CoinStats — a CLI and Claude Code skill for the Iterable marketing automation platform.

- **GitHub**: `narekgevorgyan/iterable-cli`
- **Install skill**: `npx skills add narekgevorgyan/iterable-cli`

## Working Preferences

- Bias toward action — minimal exploration before coding
- Keep changes minimal and consolidated
- TypeScript stack, zero-dependency preference
- Manual testing by default (curl commands, `node dist/index.js ...`), not automated test suites

## Quick Start

```bash
# Set API key
export ITERABLE_API_KEY=your_api_key_here

# Run commands
node dist/index.js campaigns list
node dist/index.js users get user@example.com
```

## CLI Commands Reference

### Authentication
```bash
iterable auth login --key <apiKey>   # Store in keychain
iterable auth logout                  # Remove from keychain
iterable auth status                  # Check auth state
```

### Campaigns
```bash
iterable campaigns list                                    # List all campaigns
iterable campaigns get <id>                                # Get campaign details
iterable campaigns create --name "X" --template <id> --lists <ids>  # Create campaign
iterable campaigns metrics <id>                            # Get performance metrics
iterable campaigns trigger <id> --email <email>            # Trigger for user
iterable campaigns trigger <id> --list <listId>            # Trigger for list
iterable campaigns schedule <id> --send-at <datetime>      # Schedule send
iterable campaigns abort <id>                              # Stop running campaign
iterable campaigns archive <id>                            # Archive campaign
```

### Users
```bash
iterable users get <email>                                 # Get user by email
iterable users get-by-id <userId>                          # Get user by ID
iterable users update <email> --data '<json>'              # Update user fields
iterable users delete <email>                              # Delete user
iterable users events <email>                              # Get user's events
iterable users fields                                      # List profile fields
```

### Lists
```bash
iterable lists list                                        # List all lists
iterable lists create "<name>"                             # Create new list
iterable lists delete <id>                                 # Delete list
iterable lists size <id>                                   # Get subscriber count
iterable lists subscribe <id> --emails "a@x.com,b@x.com"   # Add users
iterable lists unsubscribe <id> --emails "a@x.com"         # Remove users
iterable lists users <id>                                  # Preview list members
```

### Templates
```bash
iterable templates list                                    # List all templates
iterable templates get <type> <id>                         # Get template (email|push|sms|inapp)
iterable templates preview <id> --email <email>            # Preview with user data
iterable templates update <type> <id> --name "X"           # Update template
iterable templates proof <type> <id> --email <email>       # Send test
```

### Messaging
```bash
iterable send email <campaignId> --email <email>           # Send email
iterable send push <campaignId> --email <email>            # Send push
iterable send sms <campaignId> --email <email>             # Send SMS
iterable send inapp <campaignId> --email <email>           # Send in-app

iterable cancel email --campaign-id <id> --email <email>   # Cancel scheduled
iterable cancel push --campaign-id <id> --email <email>
```

### Journeys
```bash
iterable journeys list                                     # List all journeys
iterable journeys trigger <workflowId> --email <email>     # Trigger for user
```

### Events
```bash
iterable events track --event "<name>" --email <email> --data '<json>'
iterable events purchase --email <email> --items '<json>' --total <amount>
iterable events cart --email <email> --items '<json>'
```

## API Capabilities & Limitations

### ✅ What You CAN Do

| Feature | API Support |
|---------|-------------|
| List/Get campaigns | ✅ Full |
| Create campaigns | ✅ Full |
| Trigger/Schedule campaigns | ✅ Full |
| CRUD users | ✅ Full |
| CRUD lists | ✅ Full |
| Subscribe/Unsubscribe | ✅ Full |
| List templates | ✅ Full |
| Update templates | ✅ Full |
| Create templates (upsert) | ✅ Push/SMS/InApp |
| Send messages | ✅ All channels |
| Track events | ✅ Full |
| Track purchases | ✅ Full |
| List journeys | ✅ Basic info only |
| Trigger workflows | ✅ Full |

### ❌ What You CANNOT Do

| Feature | Limitation |
|---------|------------|
| Create journeys | UI only |
| Edit journey steps | UI only |
| Get journey analytics | UI only |
| View journey step details | Not exposed |
| Create email templates | Requires verified sender domain |
| Pause/Resume journeys | UI only |
| A/B test management | UI only |
| Segment creation | UI only |

## Project Structure

```
iterable-cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── api/
│   │   ├── client.ts         # HTTP client with auth
│   │   ├── campaigns.ts      # Campaign API
│   │   ├── users.ts          # User API
│   │   ├── lists.ts          # List API
│   │   ├── templates.ts      # Template API
│   │   ├── messaging.ts      # Send API
│   │   ├── journeys.ts       # Journey API
│   │   ├── events.ts         # Event tracking API
│   │   └── types.ts          # TypeScript interfaces
│   ├── auth/
│   │   └── keychain.ts       # OS keychain integration
│   ├── cli/commands/         # CLI command handlers
│   └── utils/                # Output formatting
├── skills/iterable/SKILL.md  # Consolidated Claude Code skill
├── agent/                    # Marketing agent prompt
├── README.md
├── .gitignore
└── dist/                     # Compiled JavaScript
```

## Destructive & Side-Effect Commands

These commands send real communications or delete data — handle with care:

- **Sends messages**: `send email|push|sms|inapp`, `campaigns trigger`, `campaigns schedule`, `journeys trigger`, `templates proof`
- **Deletes data**: `users delete`, `lists delete`, `campaigns abort`

## Common Workflows

### Send Welcome Push to New User
```bash
# 1. Create/update user
iterable users update newuser@example.com --data '{"firstName": "John", "platform": "android"}'

# 2. Track signup event
iterable events track --event "userSignup" --email newuser@example.com

# 3. Send welcome push
iterable send push <welcomeCampaignId> --email newuser@example.com
```

### Create App Rating Campaign for Android
```bash
# 1. Create list
iterable lists create "Android Users - App Rating"

# 2. Create push template (via API)
curl -X POST "https://api.iterable.com/api/templates/push/upsert" \
  -H "Api-Key: $ITERABLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "clientTemplateId": "android-rating-v1",
    "name": "Android App Rating",
    "messageTypeId": 55494,
    "title": "Enjoying the app?",
    "message": "Rate us on Google Play!",
    "deepLink": "https://play.google.com/store/apps/details?id=your.app.id"
  }'

# 3. Create campaign
iterable campaigns create --name "Android Rating" --template <templateId> --lists <listId>

# 4. Add users and trigger
iterable lists subscribe <listId> --emails "user1@example.com,user2@example.com"
iterable campaigns trigger <campaignId> --list <listId>
```

### Re-engage Inactive Users
```bash
# 1. Create segment list
iterable lists create "Inactive 30+ Days"

# 2. Add inactive users (from your database)
iterable lists subscribe <listId> --emails "inactive1@example.com,inactive2@example.com"

# 3. Trigger re-engagement campaign
iterable campaigns trigger <reengageCampaignId> --list <listId>
```

## Message Types in This Project

| ID | Name | Channel |
|----|------|---------|
| 55492 | Marketing Message | Email |
| 55493 | Transactional Message | Email |
| 55494 | Push Marketing Message | Push |
| 66249 | In-App | In-App |

## Output Formats

All list/get commands support `--format`:
- `--format table` (default) - Pretty printed tables
- `--format json` - Raw JSON for programmatic use

## Error Handling

Common errors:
- **401 Unauthorized**: Invalid API key
- **404 Not Found**: Resource doesn't exist
- **429 Rate Limited**: Too many requests, wait and retry
- **400 Bad Request**: Check required parameters

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ITERABLE_API_KEY` | Your Iterable API key (required) |

## Building from Source

```bash
npm install
npm run build
node dist/index.js --help
```

## Links

- [Iterable API Docs](https://api.iterable.com/api/docs)
- [Iterable Support](https://support.iterable.com)
