# Security Policy

## Supported Versions

Security fixes target the latest release on `main`.

## Reporting a Vulnerability

Report security issues privately through GitHub Security Advisories when available. If that is not available, open a minimal issue requesting a private security contact without disclosing exploit details.

Do not include SendGrid API keys, email recipient data, or account identifiers in public issues.

## Runtime Guidance

- Use least-privilege SendGrid API keys.
- Keep destructive tools out of auto-approval lists.
- Rotate exposed API keys immediately.
- Prefer read-only SendGrid scopes for agents that only inspect account state.
