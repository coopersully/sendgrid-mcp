# Architecture and Code Standards

## Architecture

The server has three production layers:

1. `src/index.ts` owns process startup, environment loading, MCP server registration, and stdio transport wiring.
2. `src/services/sendgrid.ts` owns SendGrid API access. It maps typed service methods to SendGrid HTTP requests and must not know about MCP tool schemas or response formatting.
3. `src/tools/` owns the MCP tool surface. It defines tool schemas, validates tool arguments, routes tool calls to `SendGridService`, and formats MCP text responses.

Keep public imports stable through facade modules:

- `src/tools/index.ts` exports `getToolDefinitions` and `handleToolCall`.
- `src/services/sendgrid.ts` exports `SendGridService`.
- `src/types/index.ts` exports shared SendGrid data shapes.

## Tool Layer Organization

Use these files for new MCP tool work:

- `src/tools/definitions.ts`: tool names, descriptions, and JSON schemas.
- `src/tools/handlers.ts`: tool execution and MCP response formatting.
- `src/tools/validation.ts`: local argument validation before calling SendGrid.
- `src/tools/utils.ts`: shared tool helper functions.
- `src/tools/types.ts`: tool-layer TypeScript types.

Add a tool by changing both `definitions.ts` and `handlers.ts`, then add mocked tests that prove the schema and handler stay in sync.

If either `definitions.ts` or `handlers.ts` becomes hard to review by domain, split it by SendGrid resource area:

- `contacts`
- `custom-fields`
- `designs`
- `marketing-senders`
- `segments`
- `single-sends`
- `suppressions`
- `templates`
- `validation-and-stats`

Each resource module should export definitions and handlers for that resource only. The central tool registry should only concatenate modules and dispatch by tool name.

## SendGrid Service Organization

`SendGridService` is a compatibility facade. Keep SendGrid request construction there until a resource area needs independent behavior, shared paging, retries, or enough methods that review becomes slow.

When splitting service code, use resource clients behind the same facade:

- `src/services/sendgrid/client.ts`: SendGrid client setup and low-level request helper.
- `src/services/sendgrid/templates.ts`: transactional templates and versions.
- `src/services/sendgrid/designs.ts`: Design Library and pre-built designs.
- `src/services/sendgrid/contacts.ts`: contacts, lists, custom fields, and segments.
- `src/services/sendgrid/single-sends.ts`: Single Sends, schedules, and stats.
- `src/services/sendgrid/suppressions.ts`: unsubscribe groups and suppressions.
- `src/services/sendgrid/senders.ts`: verified and marketing senders.

The public `SendGridService` API should remain stable so tool handlers and downstream users do not need to know about internal resource clients.

## Safety Standards

Tool descriptions must clearly state whether a tool is read-only, mutating, or destructive.

Destructive tools must require `confirm_delete: true` and must call `requireDestructiveConfirmation` before calling SendGrid.

Template edits should create inactive versions by default. Direct version patches are allowed only for advanced workflows and must be described as mutating.

Bulk sends must require either `suppression_group_id` or `custom_unsubscribe_url`.

Do not log full SendGrid error objects, request bodies, API keys, recipient data, or account identifiers.

## Schema Standards

Tool schemas must be closed with `additionalProperties: false`.

Required arguments belong in the JSON schema, not only in handler code.

Handlers may enforce cross-field rules that JSON schema cannot express, such as requiring one of two optional fields.

Arrays must reject empty values unless SendGrid explicitly accepts empty arrays for that operation.

String arguments must reject empty or whitespace-only values.

## Type Standards

Prefer explicit TypeScript interfaces for stable SendGrid shapes used across files.

Use `Record<string, any>` only where SendGrid accepts open-ended payloads or returns resource-specific bodies that the server passes through.

Keep MCP tool-layer types separate from SendGrid API types.

Do not add a runtime validation library unless schemas start requiring nested validation that the current local validator cannot express clearly.

## Test Standards

Tests must not call live SendGrid APIs.

Every SendGrid service method should have a mocked request-shape test.

Every advertised tool should have at least one valid handler invocation test.

Every destructive tool family should have a test proving confirmation is required before SendGrid is called.

Coverage thresholds are enforced in `vitest.config.ts`. Raising coverage is preferred; lowering thresholds requires a specific reason in the pull request.

## MCP Response Standards

Read-only list tools should prefer bounded responses. Use the pagination model exposed by the SendGrid endpoint instead of inventing one:

- `page_size` and `page_token` for cursor-based SendGrid Marketing endpoints.
- `limit` and `offset` for offset-based suppression endpoints.
- Endpoint-specific filters for APIs without pagination, such as Segment v2 `ids`, `parent_list_ids`, and `no_parent_list_id`.

List tools that return a transformed collection should return:

```json
{
  "result": [],
  "_metadata": {}
}
```

Use `_metadata` for pagination tokens, applied limits, offsets, and redaction flags.

List tools that pass through a SendGrid response object may preserve the SendGrid response shape when it is already predictable and includes metadata.

Large or privacy-sensitive list tools must use safe defaults. Suppression list tools default to `limit: 50` and redact `email` fields unless `include_emails: true` is provided.

Get tools should return full resource detail when the endpoint is normally used for inspection. If a resource may contain campaign content or recipient targeting details, expose a summary by default and require an explicit detail flag.

Tool descriptions must state non-obvious defaults, redaction behavior, and whether content details are omitted by default.

## Comment Standards

Prefer clear names and small functions over comments.

Keep comments only when they explain a non-obvious constraint, external API behavior, or safety decision.

Comments must be factual, neutral, concise, and current.

Do not add comments that restate code, describe obvious TypeScript syntax, or predict future work.

Use issues or pull requests for planned work instead of `TODO` or `FIXME` comments.

## Dependency Standards

Use official SendGrid packages for SendGrid API access.

Keep MCP SDK, TypeScript, ESLint, Prettier, Vitest, and SendGrid packages current unless a specific version breaks the build or runtime.

Run `npm outdated` and `npm audit --audit-level=moderate` before releases.

Do not add dependencies for small helpers that are clear in local code.

## Release Gates

Run this before merging or publishing:

```bash
npm run check
npm pack --dry-run
```

`npm run check` verifies formatting, linting, type checks, mocked coverage tests, build output, and audit status.
