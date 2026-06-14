---
name: project-audit
description: "Full project audit orchestrator. Runs security, data integrity, infra, code review, and (if agent pipeline detected) agentic architecture audits in parallel. Produces docs/audits/ with overview and optional playground visualization."
source_id: seb-claude-tools
version: 1.0.0
---

# Project Audit

Full-stack project audit that orchestrates all audit disciplines in parallel. Produces a complete `docs/audits/` report suite with an overview and optional interactive playground.

## Usage

- `/project-audit` - Run a full audit on the current project
- `/project-audit <path>` - Run a full audit on a specific sub-project

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or directory. Defaults to current project root.

## Instructions

You are an audit orchestrator. Your job is to coordinate a comprehensive project review across security, data integrity, infrastructure, code quality, and (when applicable) agentic architecture. You spawn specialized audit agents in parallel and synthesize their results into a unified report.

---

### Phase 1: Agent Pipeline Detection

Before asking the user anything, scan the project for evidence of an agentic or LLM pipeline:

Search for imports, dependencies, or usage of:
- `anthropic`, `@anthropic-ai/sdk`
- `langchain`, `langgraph`, `langsmith`
- `openai` (used for agent/tool-calling patterns, not just completions)
- `crewai`, `autogen`, `llamaindex`
- Agent graphs, tool-calling schemas, system prompts, tool executors

Check `package.json`, `pyproject.toml`, `requirements.txt`, import statements in source files.

Determine: **AGENT PIPELINE: YES / NO**

---

### Phase 2: Upfront Interview (Single Message)

Before asking questions, scan the project to pre-fill what you already know:
- Read package.json / pyproject.toml to detect hosting config, key dependencies
- Check for Vercel/Netlify/Docker config files to infer current hosting
- Look for existing CLAUDE.md or README for project description and scale hints

Then ask the user only what you couldn't determine. Present it conversationally — not as a numbered form. Maximum 5 questions. Group them naturally. Example format:

```
## Project Audit — Quick Setup

**Agent pipeline detected:** YES — agent-review + agent-audit will run.
(Correct me if wrong, or tell me if you want to scope to a sub-directory.)

**Code review:** Run it? It can be lengthy on large codebases. (yes/no)

**A few infra questions** — I detected [Vercel + Supabase / Docker / etc.] as your current setup.

- What's your scale target? (e.g., how many users/tenants at launch and in 12 months?)
- Single-tenant or multi-tenant? Any migration planned?
- Any compliance requirements? (or "none yet" is fine)
- Uptime expectation — best-effort or hard SLA?
```

Adapt the questions to what the project actually needs clarification on. Don't ask about things you can determine from the code. Don't use numbered lists — use bullets or plain sentences. Wait for answers before proceeding to Phase 3.

---

### Phase 3: Parallel Audit Execution

After receiving answers, spawn ALL applicable audit agents simultaneously using the Agent tool. Each agent must:
- Read the corresponding skill file for full instructions
- Write its output to `docs/audits/` in the project root
- Return a brief summary (score + verdict + top 3 findings)

**Always run (spawn in parallel):**

**Agent A — Security Audit**
- Instructions: read `~/.claude/skills/security-audit/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Output: `docs/audits/03-security-audit.md`
- Return: score X/35, verdict, top 3 findings

**Agent B — Data Integrity Audit**
- Instructions: read `~/.claude/skills/data-integrity-audit/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Output: `docs/audits/04-data-integrity-audit.md`
- Return: score X/30, verdict, top 3 findings

**Agent C — Infrastructure & Scalability Audit**
- Instructions: read `~/.claude/skills/infra-audit/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Context to pass: the full interview answers from Phase 2 (scale targets, hosting, budget, compliance, etc.) — Agent C should skip its own Phase 1 interview and proceed directly to Phase 2 (codebase scan) using these answers
- Output: `docs/audits/05-infra-audit.md`
- Return: score X/32, verdict, top 3 gaps

**Run if AGENT PIPELINE: YES (spawn in parallel with A, B, C):**

**Agent D — Agentic Architecture Review**
- Instructions: read `~/.claude/skills/agent-review/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Output: `docs/audits/01-agent-review.md`
- Return: pattern implementation score, top anti-patterns found, top 3 recommendations

**Agent E — Agentic Deployment Audit**
- Instructions: read `~/.claude/skills/agent-audit/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Output: `docs/audits/02-agent-audit.md`
- Return: readiness score X/23, verdict

**Run if user opted in to code review:**

**Agent F — Code Review**
- Instructions: read `~/.claude/skills/code-review/SKILL.md` and follow exactly
- Scope: project root (or $ARGUMENTS)
- Output: `docs/audits/06-code-review.md`
- Return: score X/25, verdict, top 3 findings

**Important:** All agents write their own output files. You do not rewrite their output. Wait for all agents to complete before Phase 4.

---

### Phase 4: Overview Synthesis

Once all agents have returned, write `docs/audits/00-overview.md`:

```markdown
# Project Audit: [Project Name]

**Date:** [date]
**Orchestrator:** Claude (Project Audit v1)
**Scope:** [project path]
**Stack:** [detected stack]

---

## Audit Suite Results

| Audit | Score | Verdict | Top Finding |
|-------|-------|---------|-------------|
| Agent Architecture Review | X/21 patterns | [verdict] | [top finding] |
| Agent Deployment Audit | X/23 | [verdict] | [top finding] |
| Security Audit | X/35 (XX%) | [verdict] | [top finding] |
| Data Integrity Audit | X/30 (XX%) | [verdict] | [top finding] |
| Infrastructure Audit | X/32 (XX%) | [verdict] | [top finding] |
| Code Review | X/25 (XX%) | [verdict] | [top finding] |

*(Rows marked N/A were not applicable or not run)*

---

## Overall Health

**[HEALTHY / ACCEPTABLE / NEEDS ATTENTION / NOT PRODUCTION READY]**

[2-3 sentence synthesis: what is this project's overall readiness posture?]

---

## Critical Issues (Act Now)

[All CRITICAL/HIGH findings from all audits, ranked by severity. If none: "No critical issues found."]

1. **[Finding]** — [Audit] — [file:line] — [one-line remediation]
2. ...

---

## Top Recommendations by Audit

### Security
[Top 3 from security audit]

### Data Integrity
[Top 3 from data integrity audit]

### Infrastructure
[Top 3 from infra audit]

### Agent Architecture *(if applicable)*
[Top 3 from agent review]

### Code Quality *(if run)*
[Top 3 from code review]

---

## Audit Files

- [01-agent-review.md](./01-agent-review.md) — Agentic Architecture Review *(if run)*
- [02-agent-audit.md](./02-agent-audit.md) — Agentic Deployment Audit *(if run)*
- [03-security-audit.md](./03-security-audit.md) — Security Audit
- [04-data-integrity-audit.md](./04-data-integrity-audit.md) — Data Integrity Audit
- [05-infra-audit.md](./05-infra-audit.md) — Infrastructure & Scalability Audit
- [06-code-review.md](./06-code-review.md) — Code Review *(if run)*
```

---

### Phase 5: Playground Prompt

After writing the overview, ask the user:

```
All audits complete. docs/audits/ has been updated.

Update the playground visualization (docs/audits/playground.html) to include the new audit results?

The playground will show all audit scores, findings, and recommendations in an interactive single-page dashboard.
```

If the user says yes: generate or update `docs/audits/playground.html` as a self-contained single-page app that visualizes all audit results — scores, verdicts, findings by severity, and recommendations — using a clean, professional dashboard layout. Read all current `docs/audits/*.md` files to get the data. The HTML must be fully self-contained (inline CSS + JS, no external dependencies).

---

### Guidelines

1. **Spawn in parallel**: All applicable agents run concurrently. Do not run them sequentially.
2. **Pass context forward**: The infra agent must receive the interview answers so it skips its own interview.
3. **Don't rewrite agent output**: Each agent is responsible for its own file. You synthesize the overview from their return values, not by re-reading their files.
4. **Be honest about gaps**: If an agent fails or returns partial results, note it in the overview rather than fabricating a score.
5. **Overwrite existing audits**: If `docs/audits/` already has files from a previous run, overwrite them — this is a fresh audit.
6. **Conditional agents are strictly gated**: Only run agent-review/agent-audit if evidence of agent pipeline was found. Only run code-review if user opted in.
