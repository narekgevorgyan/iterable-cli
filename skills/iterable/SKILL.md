---
name: iterable
description: Use when working with Iterable marketing automation, including campaigns, users, lists, templates, sends, journeys, and event tracking.
---

# Iterable CLI

## Auth Setup

```bash
export ITERABLE_API_KEY=<key>
iterable auth status
# optional: save the key in the system keychain
iterable auth login --key <key>
```

Environment variables take priority over the saved keychain value.

## Command Groups

```bash
iterable auth <login|logout|status>
iterable campaigns <list|get|create|metrics|trigger|schedule|abort|archive>
iterable users <get|get-by-id|update|delete|events|fields>
iterable lists <list|create|delete|size|subscribe|unsubscribe|users>
iterable templates <list|get|preview|update|proof>
iterable send <email|push|sms|inapp> <campaignId> --email <email>
iterable cancel <email|push> --campaign-id <id> --email <email>
iterable journeys <list|trigger>
iterable events <track|purchase|cart>
```

## Common Commands

```bash
iterable campaigns list --format json
iterable campaigns create --name "Spring Promo" --template <templateId> --lists <listId>
iterable campaigns trigger <campaignId> --email user@example.com
iterable campaigns schedule <campaignId> --send-at 2026-04-01T10:00:00Z

iterable users get user@example.com
iterable users update user@example.com --data '{"firstName":"Ada","platform":"ios"}'
iterable users events user@example.com
iterable users fields

iterable lists create "Android Users"
iterable lists subscribe <listId> --emails "a@example.com,b@example.com"
iterable lists users <listId>

iterable templates list
iterable templates get email <templateId>
iterable templates preview <templateId> --email user@example.com
iterable templates update push <templateId> --title "Welcome" --message "Open the app"

iterable send push <campaignId> --email user@example.com
iterable cancel email --campaign-id <campaignId> --email user@example.com

iterable journeys list
iterable journeys trigger <workflowId> --email user@example.com

iterable events track --event "userSignup" --email user@example.com --data '{"source":"app"}'
iterable events purchase --email user@example.com --items '[{"id":"SKU123","price":9.99,"quantity":1}]' --total 9.99
iterable events cart --email user@example.com --items '[{"id":"SKU123","price":9.99,"quantity":2}]'
```

## Output and Safety

- Use `--format json` when another agent or script needs stable output.
- These commands have real side effects: `iterable send ...`, `iterable campaigns trigger`, `iterable campaigns schedule`, `iterable journeys trigger`, `iterable templates proof`, `iterable users delete`, `iterable lists delete`, `iterable campaigns abort`.
- Journey creation/editing, journey analytics, A/B tests, and segment creation remain UI-only in Iterable.
