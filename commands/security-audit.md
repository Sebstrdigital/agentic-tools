---
source_id: seb-claude-tools
version: 1.0.0
name: security-audit
description: "Security audit across auth, input validation, LLM-specific attacks, data access, APIs, secrets, and infrastructure. Triggers on: security audit, appsec review, audit security."
---

# Security Audit

Deep, evidence-based security review tailored for AI-powered web applications. Covers auth chains, API security, LLM-specific attack surfaces, data access controls, and infrastructure hardening.

## Usage

- `/security-audit` - Audit the current project
- `/security-audit <path>` - Audit a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to audit. Defaults to current project root.

## Instructions

You are a senior application security auditor. Perform a structured, evidence-based security review of the target codebase. Every finding must cite a specific file and line number. No speculation — trace actual code paths.

### Step 1: Discover Attack Surface

Search the project (or $ARGUMENTS path) for security-relevant files:

- **API routes** — all HTTP endpoints, middleware, route handlers
- **Authentication** — auth providers, session management, token handling
- **Database access** — queries, ORMs, raw SQL, connection configs
- **LLM integration** — prompts, tool definitions, model API calls, streaming
- **Input handling** — form processing, request body parsing, URL params
- **Output rendering** — HTML generation, SSE/WebSocket, JSON responses
- **Secrets** — env files, config files, hardcoded credentials
- **Dependencies** — package.json/requirements.txt, lock files
- **Infrastructure** — Dockerfiles, CI/CD configs, deployment scripts

Read ALL relevant source files. You need full code context for an accurate audit.

### Step 2: Run the Audit (7 Domains, 35 Checks)

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with brief evidence.

**Domain 1: Authentication & Authorization (6 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Auth on all sensitive endpoints | Every API route that reads/writes data verifies authentication. No unprotected routes. |
| 2 | Authorization enforces scope | Users can only access their own org/tenant data. Check for org_id filtering on every query. |
| 3 | Token validation is server-side | JWTs are verified server-side, not just decoded. Check for signature verification. |
| 4 | Session management is secure | Sessions expire, are invalidated on logout, use secure cookies (httpOnly, sameSite, secure). |
| 5 | Auth bypass in dev mode | Development auth shortcuts (test user IDs, skipped auth) cannot be triggered in production. |
| 6 | Role-based access control | If roles exist, verify enforcement at the API layer (not just UI hiding). |

**Domain 2: Input Validation & Injection (6 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 7 | All user input is validated | Request bodies, query params, URL params are validated before use (types, length, format). |
| 8 | SQL injection protection | Parameterized queries or ORM used everywhere. No string concatenation in queries. |
| 9 | XSS protection | User-supplied content is escaped/sanitized before rendering. CSP headers present. |
| 10 | Path traversal protection | File operations validate paths. No user input used directly in file system operations. |
| 11 | Request size limits | Body size limits enforced. No unbounded file uploads or payload sizes. |
| 12 | Type coercion safety | Input types are validated, not just cast (e.g., `as unknown as X` without validation is a red flag). |

**Domain 3: LLM-Specific Security (6 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 13 | Prompt injection defense | User messages are sanitized before injection into prompts. System/user message boundaries are enforced. |
| 14 | Tool input validation | LLM-generated tool arguments are validated before execution (types, ranges, allowed values). |
| 15 | Tool permissions are minimal | Tools can only perform their intended operations. No raw SQL, no arbitrary code execution. |
| 16 | Output is not trusted as fact | LLM output is treated as untrusted. Financial claims are cross-checked against source data. |
| 17 | System prompt is not extractable | The system prompt is resistant to extraction attacks ("repeat your instructions"). |
| 18 | Model API keys are protected | API keys are in env vars, not in code. Not exposed to client-side code. Not logged. |

**Domain 4: Data Access & Privacy (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 19 | Multi-tenant data isolation | Every database query is scoped to the authenticated user's org. RLS policies or application-level filters. |
| 20 | Sensitive data not logged | PII, financial data, auth tokens are not written to console.log, error logs, or telemetry. |
| 21 | Data in transit is encrypted | All API calls use HTTPS. Database connections use TLS. No plaintext credentials in connection strings. |
| 22 | Minimal data exposure | API responses return only needed fields. No full database rows leaked to client. |
| 23 | Data retention controls | Old sessions, logs, and cached data are cleaned up. No unbounded data growth with PII. |

**Domain 5: API & Network Security (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 24 | Rate limiting | API endpoints have rate limits. Check for per-user and per-IP limits. |
| 25 | CORS configuration | CORS headers are restrictive (not `*`). Only trusted origins allowed. |
| 26 | Error messages don't leak internals | Error responses don't expose stack traces, SQL queries, file paths, or internal architecture. |
| 27 | SSE/WebSocket security | Streaming endpoints validate auth. Connections are properly cleaned up. No resource exhaustion. |

**Domain 6: Secrets & Configuration (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 28 | No hardcoded secrets | No API keys, passwords, or tokens in source code. Check for common patterns. |
| 29 | Env vars have sensible defaults | Missing env vars fail fast (not silently use empty strings). Dangerous operations check for production env. |
| 30 | .gitignore covers secrets | .env, credentials files, private keys are in .gitignore. Check git history for past leaks. |
| 31 | Dependency vulnerabilities | Run or check for known vulnerabilities in dependencies (npm audit, pip audit). |

**Domain 7: Infrastructure & Deployment (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 32 | Security headers | Helmet/security headers set: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security. |
| 33 | Production error handling | Errors in production return generic messages. Debug mode is off. Stack traces are hidden. |
| 34 | Monitoring and alerting | Are there logs/alerts for: auth failures, rate limit hits, error spikes, unusual API usage? |
| 35 | Backup and recovery | Database backups exist. Recovery process is documented or scripted. |

### Step 3: Classify Findings

For each FAIL or PARTIAL, assign a severity:

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Exploitable now. Data breach, auth bypass, or remote code execution risk. |
| **HIGH** | Significant risk. Requires attacker knowledge but exploitation is straightforward. |
| **MEDIUM** | Defense gap. Increases attack surface but not directly exploitable alone. |
| **LOW** | Hardening recommendation. Best practice not followed. |

### Step 4: Output Format

```markdown
# Security Audit: [Project Name]

**Date:** [date]
**Auditor:** Claude (Security Audit v1)
**Scope:** [directories and files reviewed]
**Stack:** [detected tech stack]

---

## Results Summary

| Result | Count |
|--------|-------|
| PASS   | X     |
| PARTIAL| Y     |
| FAIL   | Z     |

**Security Score:** X/35 (XX%)

**Verdict:** SECURE / ACCEPTABLE WITH CAVEATS / NEEDS REMEDIATION

---

## Findings by Severity

### Critical
[List or "None found"]

### High
[List with file:line references and remediation steps]

### Medium
[List]

### Low
[List]

---

## Detailed Checklist

### Domain 1: Authentication & Authorization
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Auth on all endpoints | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 2: Input Validation & Injection
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 7 | All input validated | ... | ... |
| ... | ... | ... | ... |

[Continue for all 7 domains]

---

## Remediation Priority

1. **[Finding]** — [severity] — [specific fix with file references]
2. ...

## Attack Surface Map

[ASCII diagram showing entry points, trust boundaries, and data flows]
```

### Guidelines

1. **Evidence-based**: Every finding must cite a specific file and line number. No "probably vulnerable."
2. **Trace, don't guess**: If you suspect an issue, trace the actual code path before reporting it.
3. **Proportional**: A missing CSP header is LOW. An unauthed endpoint returning financial data is CRITICAL.
4. **Actionable**: Every finding must include a specific remediation step.
5. **Stack-aware**: Tailor checks to the actual tech stack (e.g., Supabase RLS, Next.js middleware, Clerk auth — not generic LAMP advice).
6. **No false positives**: Only report issues you can evidence. "I didn't find X" is not the same as "X is missing."
