# Security Policy

## Supported Versions

Security fixes are handled for the current stable API version:

| Version | Status    |
| ------- | --------- |
| v2      | Supported |
| v1      | Legacy    |

## Reporting a Vulnerability

Please do not report security vulnerabilities in public GitHub issues.

Email reports to `ubeydeozdmr@gmail.com` with:

- A clear description of the issue.
- Steps to reproduce or a proof of concept.
- The affected endpoint, route, dataset file, or package if known.
- Potential impact.
- Any suggested fix or mitigation.

You should receive an initial response as soon as reasonably possible. Confirmed issues will be fixed privately first, then disclosed in release notes or repository history when appropriate.

## Scope

In scope:

- Vulnerabilities in API routes, validation, caching, rate limiting, logging, or deployment configuration represented in this repository.
- Exposure of secrets or sensitive operational data.
- Dependency vulnerabilities that affect the production service.

Out of scope:

- Denial-of-service tests that generate excessive traffic against the production API.
- Social engineering, phishing, or physical attacks.
- Reports based only on missing security headers without a practical exploit.
- Public dataset inaccuracies unless they create a security or privacy issue.

## Operational Privacy

Application logs are designed to avoid request bodies, response bodies, cookies, authorization headers, API keys, and full query parameter values. If you find a path that leaks sensitive data into logs, report it as a security issue.
