# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub Issue.
2. Email the maintainer at: **security@luissambrano.dev** (or open a [private security advisory](https://github.com/LuisSambrano/badge-scanner/security/advisories/new)).
3. Include steps to reproduce, impact assessment, and any suggested fix.

We will acknowledge your report within **48 hours** and work on a fix within **7 days**.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| < 1.0   | ❌        |

## Security Practices

This project follows these security practices:

- Environment variables for all secrets (never hardcoded)
- Input validation on all API endpoints
- Row Level Security (RLS) on all Supabase tables
- HTTPS-only communication
- Regular dependency audits via Dependabot
