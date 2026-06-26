# Contributing

## Development

Use Node.js 24 or newer.

```bash
npm ci
npm run check
```

## Pull Requests

- Keep changes scoped.
- Add or update mocked tests for every API wrapper or tool behavior change.
- Do not add live SendGrid API calls to the test suite.
- Do not commit API keys or account-specific SendGrid data.
- Run `npm run check` before opening a pull request.

## Comments

Comments must be necessary, precise, and short. Prefer clear names and small functions over explanatory comments.
