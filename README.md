# SendGrid MCP Server

[![CI](https://github.com/coopersully/sendgrid-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/coopersully/sendgrid-mcp/actions/workflows/ci.yml)

An MCP stdio server for managing SendGrid email workflows from Codex and other MCP clients.

It supports:

- Design Library assets
- Dynamic transactional templates and versions
- Marketing contacts and contact lists
- Single Sends
- Direct email sends
- Stats, email validation, verified senders, and suppression groups

The server uses SendGrid v3 APIs only. It never hardcodes API keys; provide `SENDGRID_API_KEY` through the environment.

## Install

Requires Node.js 24 or newer.

```bash
git clone https://github.com/coopersully/sendgrid-mcp.git
cd sendgrid-mcp
npm install
npm run build
```

## Codex Configuration

Add the server to `~/.codex/config.toml`:

```toml
[mcp_servers.sendgrid]
command = "node"
args = ["/absolute/path/to/sendgrid-mcp/build/index.js"]
env = { SENDGRID_API_KEY = "SG.your-api-key" }
```

Prefer setting the key in your local environment or secret store instead of writing it into a shared file.

Recommended auto-approval policy: approve read-only tools only. Require review for tools that send email, mutate contacts, update templates/designs, or delete anything.

Read-only tools that are usually safe to auto-approve:

```json
[
  "list_contacts",
  "list_contact_lists",
  "get_contacts_by_list",
  "get_contacts_by_emails",
  "get_contact_by_id",
  "get_total_contact_count",
  "get_contact_list",
  "get_list_contact_count",
  "list_custom_fields",
  "list_segments",
  "list_templates",
  "get_template",
  "get_template_version",
  "list_designs",
  "get_design",
  "list_pre_built_designs",
  "get_pre_built_design",
  "list_single_sends",
  "get_single_send",
  "search_single_sends",
  "get_single_send_schedule",
  "list_single_send_categories",
  "list_single_send_stats",
  "get_single_send_stats",
  "list_verified_senders",
  "list_suppression_groups",
  "list_group_suppressions",
  "list_global_suppressions",
  "list_bounces",
  "list_blocks",
  "list_invalid_emails",
  "list_spam_reports",
  "list_marketing_senders",
  "get_marketing_sender",
  "get_stats",
  "validate_email"
]
```

## Tool Groups

### Design Library

| Tool                         | Purpose                                                                                                                             | Mutates |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `list_designs`               | List account designs with optional `page_size`, `page_token`, and `summary`. Returns pagination metadata when SendGrid provides it. | No      |
| `get_design`                 | Retrieve a design, including editable content fields returned by SendGrid.                                                          | No      |
| `create_design`              | Create a design from name, subject, HTML/plain content, editor, categories, and plain-text generation options.                      | Yes     |
| `update_design`              | Patch an existing design. Requires at least one editable field.                                                                     | Yes     |
| `duplicate_design`           | Copy an existing account design.                                                                                                    | Yes     |
| `delete_design`              | Permanently delete a design. Requires `confirm_delete: true`.                                                                       | Yes     |
| `list_pre_built_designs`     | List SendGrid pre-built designs.                                                                                                    | No      |
| `get_pre_built_design`       | Retrieve a pre-built design.                                                                                                        | No      |
| `duplicate_pre_built_design` | Copy a pre-built design into the account.                                                                                           | Yes     |

### Dynamic Templates

| Tool                        | Purpose                                                                       | Mutates |
| --------------------------- | ----------------------------------------------------------------------------- | ------- |
| `list_templates`            | List dynamic transactional templates.                                         | No      |
| `get_template`              | Retrieve a template and its versions.                                         | No      |
| `create_template`           | Create a dynamic template and an initial active version.                      | Yes     |
| `update_template_name`      | Rename a template.                                                            | Yes     |
| `duplicate_template`        | Copy a template using SendGrid's native duplicate endpoint.                   | Yes     |
| `delete_template`           | Permanently delete a template. Requires `confirm_delete: true`.               | Yes     |
| `get_template_version`      | Retrieve one version's content and active state.                              | No      |
| `create_template_version`   | Create a new version. Defaults to inactive with `active: 0`.                  | Yes     |
| `activate_template_version` | Activate an existing version for future sends.                                | Yes     |
| `update_template_version`   | Directly patch a version. Prefer creating a new version for reviewable edits. | Yes     |
| `delete_template_version`   | Permanently delete a version. Requires `confirm_delete: true`.                | Yes     |

Safe editing workflow:

1. Call `get_template`.
2. Call `get_template_version` for the active version.
3. Call `create_template_version` with edited content and leave `active` omitted or set to `0`.
4. Inspect the returned version.
5. Call `activate_template_version` only after approval.

### Contacts and Lists

| Tool                        | Purpose                                                                | Mutates |
| --------------------------- | ---------------------------------------------------------------------- | ------- |
| `list_contacts`             | List marketing contacts.                                               | No      |
| `add_contact`               | Upsert one contact.                                                    | Yes     |
| `delete_contacts`           | Permanently delete contacts by email. Requires `confirm_delete: true`. | Yes     |
| `get_contacts_by_emails`    | Retrieve contacts by email addresses.                                  | No      |
| `get_contact_by_id`         | Retrieve one contact by SendGrid contact ID.                           | No      |
| `get_total_contact_count`   | Retrieve total marketing contact count.                                | No      |
| `list_contact_lists`        | List contact lists.                                                    | No      |
| `get_contact_list`          | Retrieve one contact list by ID.                                       | No      |
| `create_contact_list`       | Create a list.                                                         | Yes     |
| `update_contact_list`       | Rename a contact list.                                                 | Yes     |
| `delete_list`               | Delete a list. Requires `confirm_delete: true`.                        | Yes     |
| `get_list_contact_count`    | Retrieve contact count for one list.                                   | No      |
| `get_contacts_by_list`      | List contacts in a list.                                               | No      |
| `add_contacts_to_list`      | Add emails to a list.                                                  | Yes     |
| `remove_contacts_from_list` | Remove emails from a list without deleting contacts.                   | Yes     |

### Custom Fields and Segments

| Tool                  | Purpose                                                                                           | Mutates |
| --------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| `list_custom_fields`  | List marketing contact custom field definitions.                                                  | No      |
| `create_custom_field` | Create a custom field definition.                                                                 | Yes     |
| `update_custom_field` | Rename a custom field definition.                                                                 | Yes     |
| `delete_custom_field` | Delete a custom field definition. Requires `confirm_delete: true`.                                | Yes     |
| `list_segments`       | List Segments v2 segments with optional `ids`, `parent_list_ids`, or `no_parent_list_id` filters. | No      |
| `create_segment`      | Create a segment from `name` and `query_dsl`.                                                     | Yes     |
| `get_segment`         | Retrieve one segment.                                                                             | No      |
| `update_segment`      | Update a segment name or query DSL.                                                               | Yes     |
| `refresh_segment`     | Refresh a segment.                                                                                | Yes     |
| `delete_segment`      | Delete a segment. Requires `confirm_delete: true`.                                                | Yes     |

### Sending

| Tool                          | Purpose                                                                                                                                 | Mutates |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `send_email`                  | Send one email through SendGrid Mail Send.                                                                                              | Yes     |
| `send_to_list`                | Create and immediately schedule a Single Send to lists or segments. Requires either `suppression_group_id` or `custom_unsubscribe_url`. | Yes     |
| `create_single_send`          | Create a Single Send draft without scheduling it.                                                                                       | Yes     |
| `update_single_send`          | Patch a Single Send draft.                                                                                                              | Yes     |
| `delete_single_send`          | Delete a Single Send. Requires `confirm_delete: true`.                                                                                  | Yes     |
| `duplicate_single_send`       | Duplicate a Single Send.                                                                                                                | Yes     |
| `search_single_sends`         | Search Single Sends with SendGrid query syntax.                                                                                         | No      |
| `schedule_single_send`        | Schedule an existing Single Send for `now` or a future timestamp.                                                                       | Yes     |
| `get_single_send_schedule`    | Retrieve schedule information for a Single Send.                                                                                        | No      |
| `cancel_single_send_schedule` | Cancel a Single Send schedule without deleting the draft.                                                                               | Yes     |
| `list_single_send_categories` | List Single Send categories.                                                                                                            | No      |
| `list_single_send_stats`      | Retrieve Single Sends stats.                                                                                                            | No      |
| `get_single_send_stats`       | Retrieve stats for one Single Send.                                                                                                     | No      |
| `list_single_sends`           | List Single Sends as summaries with optional `page_size` and `page_token`.                                                              | No      |
| `get_single_send`             | Retrieve one Single Send summary. Use `include_details: true` for the full payload.                                                     | No      |

### Suppressions, Senders, Stats, and Validation

| Tool                                   | Purpose                                                                                                                    | Mutates |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| `list_verified_senders`                | List verified sender identities.                                                                                           | No      |
| `list_suppression_groups`              | List unsubscribe groups.                                                                                                   | No      |
| `list_group_suppressions`              | List suppressed addresses in a suppression group.                                                                          | No      |
| `add_group_suppressions`               | Add addresses to a suppression group.                                                                                      | Yes     |
| `delete_group_suppression`             | Remove an address from a suppression group. Requires `confirm_delete: true`.                                               | Yes     |
| `list_global_suppressions`             | List global suppressions.                                                                                                  | No      |
| `add_global_suppressions`              | Add addresses to global suppressions.                                                                                      | Yes     |
| `delete_global_suppression`            | Remove an address from global suppressions. Requires `confirm_delete: true`.                                               | Yes     |
| `list_bounces`                         | List bounce suppressions. Defaults to `limit: 50` and redacted emails; use `include_emails: true` to reveal emails.        | No      |
| `list_blocks`                          | List block suppressions. Defaults to `limit: 50` and redacted emails; use `include_emails: true` to reveal emails.         | No      |
| `list_invalid_emails`                  | List invalid email suppressions. Defaults to `limit: 50` and redacted emails; use `include_emails: true` to reveal emails. | No      |
| `list_spam_reports`                    | List spam report suppressions. Defaults to `limit: 50` and redacted emails; use `include_emails: true` to reveal emails.   | No      |
| `list_marketing_senders`               | List Marketing sender identities.                                                                                          | No      |
| `get_marketing_sender`                 | Retrieve one Marketing sender identity.                                                                                    | No      |
| `create_marketing_sender`              | Create a Marketing sender identity.                                                                                        | Yes     |
| `update_marketing_sender`              | Update a Marketing sender identity.                                                                                        | Yes     |
| `delete_marketing_sender`              | Delete a Marketing sender identity. Requires `confirm_delete: true`.                                                       | Yes     |
| `resend_marketing_sender_verification` | Resend a sender verification email.                                                                                        | Yes     |
| `get_stats`                            | Retrieve email stats for `start_date`, optional `end_date`, and optional aggregation.                                      | No      |
| `validate_email`                       | Validate one email address.                                                                                                | No      |

## Safety Behavior

- Tool schemas are closed with `additionalProperties: false`.
- Tool arguments are validated before SendGrid is called.
- Empty strings, wrong primitive types, empty arrays, unexpected arguments, and missing required fields are rejected locally.
- Destructive delete tools require `confirm_delete: true`.
- Template content edits are safe by default through `create_template_version`, which creates inactive versions unless `active: 1` is explicitly provided.
- Server error logging avoids dumping raw error objects to stderr.

## Agent Response Conventions

- List tools use the SendGrid endpoint's real pagination model: `page_size`/`page_token`, `limit`/`offset`, or endpoint-specific filters.
- Transformed list responses use `{ "result": [], "_metadata": {} }`.
- `_metadata` carries pagination, applied limits, offsets, and redaction flags.
- Suppression list tools default to `limit: 50` and redact `email` fields unless `include_emails: true` is set.
- Content-heavy get tools may return summaries by default and expose full details through an explicit flag such as `include_details: true`.

## Development

```bash
npm ci
npm run check
```

`npm run check` runs formatting, ESLint, TypeScript type checks, Vitest coverage, build, and `npm audit`.

Tests use Vitest with mocked SendGrid clients. They do not make live API calls.

Useful commands:

```bash
npm run format
npm run lint
npm run typecheck
npm run test:coverage
npm run watch
npm run inspector
```

CI runs the same validation gates on Node.js 24 and 26.

Architecture and code standards live in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Notes

- The API key must have the SendGrid permissions required for the tools you use.
- Sender addresses must be verified before sending.
- Bulk sends must include either a suppression group or custom unsubscribe URL.
- SendGrid Marketing API changes can be eventually consistent; recently changed contacts and lists may not appear immediately.
- Use least-privilege API keys when possible, especially for agents that only need template/design management.

## References

- [SendGrid v3 API](https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api)
- [SendGrid Design Library API](https://www.twilio.com/docs/sendgrid/api-reference/designs-api)
- [SendGrid Transactional Templates API](https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates)
- [SendGrid Single Sends API](https://www.twilio.com/docs/sendgrid/api-reference/single-sends)
- [SendGrid Contacts API](https://www.twilio.com/docs/sendgrid/api-reference/contacts)
- [SendGrid Segments v2 API](https://www.twilio.com/docs/sendgrid/api-reference/segmenting-contacts-v2)
- [SendGrid Suppressions API](https://www.twilio.com/docs/sendgrid/api-reference/suppressions-suppressions)
- [MCP tools specification](https://modelcontextprotocol.io/specification/draft/server/tools)
