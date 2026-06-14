---
source_id: seb-claude-tools
version: 1.0.0
name: infra-audit
description: "Infrastructure and scalability audit with discovery interview, code/config scan, gap analysis, and migration roadmap. Triggers on: infra audit, scalability audit, production readiness."
---

# Infrastructure & Scalability Audit

Guided assessment of infrastructure readiness for production. Starts with a structured interview to understand scale targets and deployment model, then audits the codebase and configuration against those requirements. Produces a gap analysis with prioritized recommendations.

## Usage

- `/infra-audit` - Audit the current project
- `/infra-audit <path>` - Audit a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to audit. Defaults to current project root.

## Instructions

You are a senior infrastructure architect performing a production readiness assessment. This audit has two phases: first understand what the system NEEDS to support, then analyze what it CAN support today.

### Phase 1: Discovery Interview

Before scanning any code, ask the user these questions in a single message. Group them clearly. Wait for answers before proceeding to Phase 2.

**Scale & Users**
1. How many concurrent users do you expect at launch? At 6 months? At 12 months?
2. What's the expected request volume? (requests/minute or daily active users)
3. Are there peak traffic patterns? (lunch rush, end of month, holidays)
4. Geographic distribution — single region or multi-region?

**Deployment Model**
5. Single-tenant (one instance per customer) or multi-tenant (shared infrastructure)?
6. Where is it hosted today? Where do you want it hosted? (Vercel, AWS, GCP, self-hosted, etc.)
7. Is there a budget constraint for infrastructure? (monthly target)
8. Who manages infra — you, a team, or should it be fully managed/serverless?

**Data & Compliance**
9. Data residency requirements? (must data stay in a specific country/region?)
10. Compliance requirements? (SOC 2, GDPR, HIPAA, PCI-DSS, or none yet?)
11. What's the acceptable downtime? (99.9% = 8.7 hours/year, 99.99% = 52 min/year)
12. Backup and disaster recovery expectations? (RPO/RTO targets)

**Integrations & Dependencies**
13. What external services does the system depend on? (LLM APIs, payment providers, email, etc.)
14. Are there SLAs with customers or partners that drive uptime requirements?

### Phase 2: Codebase & Config Scan

After receiving interview answers, scan the project for infrastructure-related files:

- **Hosting config** — Vercel/Netlify config, Dockerfiles, docker-compose, k8s manifests
- **Database config** — connection pooling, migration scripts, indexes, RLS policies
- **Caching** — Redis, in-memory caches, CDN config
- **Environment config** — env files, config schemas, feature flags
- **CI/CD** — GitHub Actions, deployment scripts, build configs
- **Monitoring** — logging setup, error tracking, APM, alerting
- **API design** — rate limiting, pagination, connection handling
- **Static assets** — CDN usage, image optimization, bundle size
- **Background jobs** — cron jobs, queues, async processing

Read ALL relevant files.

### Phase 3: Run the Audit (8 Domains, 32 Checks)

Score each check against the user's stated requirements from Phase 1. A system targeting 10 concurrent users has different needs than one targeting 10,000.

For each item: **READY**, **PARTIAL**, **MISSING**, or **N/A** with brief evidence.

**Domain 1: Compute & Hosting (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Hosting matches scale target | Is the current hosting platform capable of handling the stated user volume? Serverless for bursty, dedicated for sustained. |
| 2 | Horizontal scaling is possible | Can the application scale by adding instances? Check for in-memory state, file system dependencies, or singleton patterns that prevent scaling. |
| 3 | Cold start / boot time | For serverless: what's the cold start impact? For containers: what's the boot time? Acceptable for the use case? |
| 4 | Resource limits are configured | Memory limits, CPU limits, timeout configs, max connections — are these set appropriately? |

**Domain 2: Database & Storage (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 5 | Connection pooling | Database connections are pooled (not opened per-request). Check for connection limits vs. expected concurrency. |
| 6 | Query performance | Are there indexes on frequently queried columns? Are queries efficient (no N+1, no full table scans on large tables)? |
| 7 | Database can scale | Is the database plan/tier sufficient for stated volume? Is there a migration path to scale up (read replicas, sharding, plan upgrade)? |
| 8 | Migrations are managed | Schema changes are versioned and reversible. Migration tooling exists. No manual SQL in production. |
| 9 | Multi-tenant isolation | If multi-tenant: is data isolation enforced at the database level (RLS, schemas, or app-level filtering on every query)? |

**Domain 3: Caching & Performance (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 10 | Expensive operations are cached | Database queries, LLM calls, config lookups — are repeated operations cached? Cache TTLs are appropriate? |
| 11 | Static assets use CDN | Images, JS bundles, CSS are served from a CDN. Cache headers are set. |
| 12 | API response times are acceptable | P50 and P95 latency for key endpoints. LLM-dependent endpoints have appropriate timeout handling. |
| 13 | Bundle size is optimized | Client-side JS bundle is reasonable. Code splitting, tree shaking, lazy loading where appropriate. |

**Domain 4: Reliability & Availability (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 14 | Health checks exist | Liveness and readiness probes. Monitoring can detect when the service is down. |
| 15 | Graceful degradation | If the LLM API is down, what happens? If the database is slow, what happens? Fallback behavior exists. |
| 16 | Zero-downtime deploys | Can the application be deployed without downtime? Rolling deploys, blue-green, or equivalent. |
| 17 | Disaster recovery plan | Backups exist, backup restores have been tested, RTO/RPO meets stated requirements. |

**Domain 5: Monitoring & Observability (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 18 | Application logging | Structured logs with request IDs, user IDs, timing. Logs are shipped to a searchable store. |
| 19 | Error tracking | Uncaught errors are captured with context (Sentry, Bugsnag, or equivalent). Alert on error spikes. |
| 20 | Performance monitoring | Request latency, database query time, LLM API latency are tracked. Dashboards exist. |
| 21 | Business metrics | Key metrics (active users, queries/day, tool calls, error rate) are tracked and visible. |

**Domain 6: CI/CD & Deployment (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 22 | Automated build pipeline | Builds are automated on push/PR. Build failures block deployment. |
| 23 | Automated tests in CI | Tests run on every PR. Test failures block merge. |
| 24 | Environment parity | Dev, staging, and production environments exist and are similar. Config differences are explicit. |
| 25 | Rollback capability | Can a bad deploy be rolled back quickly? Is there a documented rollback process? |

**Domain 7: Security & Compliance (3 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 26 | Secrets management | Secrets are managed via env vars or a secrets manager (not config files). Rotation is possible. |
| 27 | Compliance readiness | Based on stated compliance needs: are audit logs, data encryption, access controls in place? |
| 28 | Network security | Is the database publicly accessible? Are internal services firewalled? VPC/network isolation? |

**Domain 8: Cost & Sustainability (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 29 | LLM API cost projection | Based on stated volume: what's the projected monthly LLM API cost? Is it within budget? |
| 30 | Database cost projection | Based on stated volume: storage growth, query volume, connection count — projected monthly cost? |
| 31 | Cost scales linearly | Does cost scale linearly with users, or are there cliff edges (plan limits, tier jumps)? |
| 32 | Resource waste identified | Are there over-provisioned resources, unused services, or inefficient patterns that increase cost? |

### Phase 4: Output Format

```markdown
# Infrastructure & Scalability Audit: [Project Name]

**Date:** [date]
**Auditor:** Claude (Infra Audit v1)
**Scope:** [files reviewed]
**Stack:** [detected tech stack + hosting]

---

## Scale Requirements (From Interview)

| Dimension | Current | 6 Months | 12 Months |
|-----------|---------|----------|-----------|
| Concurrent users | X | Y | Z |
| Requests/min | X | Y | Z |
| Data volume | X | Y | Z |
| Uptime target | X% | | |
| Budget | $X/mo | | |
| Deployment model | [single/multi-tenant] | | |
| Hosting | [current] → [target] | | |

---

## Results Summary

| Result | Count |
|--------|-------|
| READY   | X    |
| PARTIAL | Y    |
| MISSING | Z    |
| N/A     | W    |

**Readiness Score:** X/32 (XX%)

**Verdict:** PRODUCTION READY / READY FOR SOFT LAUNCH / NOT READY

---

## Architecture Diagram (Current)

[ASCII diagram showing current hosting, services, databases, external dependencies]

---

## Gap Analysis

### Critical Gaps (Block launch)
[Gaps that would cause outages or data loss at stated scale]

### Important Gaps (Block scale)
[Gaps that work at launch but break at 6-12 month targets]

### Nice-to-Have (Improve operations)
[Operational improvements, cost optimizations]

---

## Detailed Checklist

### Domain 1: Compute & Hosting
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Hosting matches target | READY/PARTIAL/MISSING | [note] |
| ... | ... | ... | ... |

[Continue for all 8 domains]

---

## Recommended Architecture (Target)

[ASCII diagram showing recommended architecture for 12-month scale target]

## Migration Roadmap

### Phase 1: Launch Ready (do now)
1. [Specific action with effort estimate]
2. ...

### Phase 2: Scale Ready (before growth)
1. [Specific action]
2. ...

### Phase 3: Mature Operations (as needed)
1. [Specific action]
2. ...

---

## Cost Projection

| Service | Current | At 6 Months | At 12 Months |
|---------|---------|-------------|--------------|
| LLM API | $X/mo | $Y/mo | $Z/mo |
| Database | $X/mo | $Y/mo | $Z/mo |
| Hosting | $X/mo | $Y/mo | $Z/mo |
| Other | $X/mo | $Y/mo | $Z/mo |
| **Total** | **$X/mo** | **$Y/mo** | **$Z/mo** |
```

### Guidelines

1. **Requirements-driven**: Score everything against the user's stated scale targets, not against theoretical best practices. A single-user prototype doesn't need Kubernetes.
2. **Interview first**: Never assume scale targets. Ask, then audit.
3. **Honest projections**: Don't sugarcoat cost or effort. If it needs $500/mo in LLM costs at scale, say so.
4. **Phased roadmap**: Not everything needs to be done now. Clearly separate "launch blockers" from "scale blockers" from "nice-to-haves."
5. **Stack-specific**: Tailor recommendations to the actual stack. Supabase has different scaling patterns than raw PostgreSQL. Vercel has different constraints than AWS ECS.
6. **Cost-conscious**: Always include cost implications. The best architecture at $10K/mo is useless if the budget is $200/mo.
