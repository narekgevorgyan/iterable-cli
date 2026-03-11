# Iterable CLI

> **An experimental internal tool by [CoinStats](https://coinstats.app).** Command-line interface for the [Iterable API](https://api.iterable.com/api/docs), built by agents, for agents.

## Installation

```bash
npm install
npm run build
npm link
npx skills add narekgevorgyan/iterable-cli --skill iterable
```

This repo ships a single installable agent skill at `skills/iterable/SKILL.md`.

If you have not added the skill yet, run:

```bash
npx skills add narekgevorgyan/iterable-cli --skill iterable
```

## Auth

```bash
iterable auth login --key <apiKey>              # saves to OS keychain
export ITERABLE_API_KEY=...                     # or env var
```

Get your API key from your [Iterable project settings](https://app.iterable.com).

## Commands

```
iterable campaigns <subcommand> [options]    # campaign management
iterable users <subcommand> [options]        # user profiles
iterable lists <subcommand> [options]        # subscriber lists
iterable templates <subcommand> [options]    # message templates
iterable send <channel> <campaignId> [opts]  # send messages
iterable cancel <channel> [options]          # cancel scheduled messages
iterable journeys <subcommand> [options]     # journeys & workflows
iterable events <subcommand> [options]       # event tracking
iterable auth <subcommand>                   # authentication
```

**Campaigns:** `list`, `get`, `create`, `metrics`, `trigger`, `schedule`, `abort`, `archive`

**Users:** `get`, `get-by-id`, `update`, `delete`, `events`, `fields`

**Lists:** `list`, `create`, `delete`, `size`, `subscribe`, `unsubscribe`, `users`

**Templates:** `list`, `get`, `preview`, `update`, `proof`

**Messaging:** `send email|push|sms|inapp`, `cancel email|push`

**Journeys:** `list`, `trigger`

**Events:** `track`, `purchase`, `cart`

## Key Options

| Option | Description |
|--------|-------------|
| `--format table\|json` | Output format (default: `table`) |
| `--email <email>` | Target user email |
| `--data '<json>'` | JSON payload for updates/events |
| `--list <listId>` | Target list ID |
| `--emails <list>` | Comma-separated emails for bulk operations |
| `--limit <n>` | Max results to return |
| `--send-at <datetime>` | ISO 8601 datetime for scheduling |

## Agent Tips

**Use `--format json` for programmatic parsing:**
```bash
iterable campaigns list --format json
```

**Chain commands for workflows:**
```bash
# Create list → add users → trigger campaign
iterable lists create "Promo Segment"
iterable lists subscribe <listId> --emails "a@x.com,b@x.com"
iterable campaigns trigger <campaignId> --list <listId>
```

**Track events with data payloads:**
```bash
iterable events track --event "purchase" --email user@example.com --data '{"item": "widget", "value": 29.99}'
```

## API Limitations

Some Iterable features are UI-only and **cannot** be done via CLI:

| Feature | Limitation |
|---------|------------|
| Create/edit journeys | UI only |
| Journey analytics | UI only |
| A/B test management | UI only |
| Segment creation | UI only |
| Create email templates | Requires verified sender domain |

## Error Codes

| Code | Action |
|------|--------|
| `401 Unauthorized` | Invalid API key. Re-auth with `auth login`. |
| `404 Not Found` | Resource doesn't exist. Check the ID. |
| `429 Rate Limited` | Too many requests. Wait and retry. |
| `400 Bad Request` | Check required parameters. |

## Message Types

| ID | Name | Channel |
|----|------|---------|
| 55492 | Marketing Message | Email |
| 55493 | Transactional Message | Email |
| 55494 | Push Marketing Message | Push |
| 66249 | In-App | In-App |

## Development

```bash
npm install
npm run build
npm link
iterable --help
```

See [CLAUDE.md](CLAUDE.md) for full command reference and architecture.

## License

MIT
