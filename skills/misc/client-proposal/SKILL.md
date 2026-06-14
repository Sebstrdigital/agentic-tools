---
name: client-proposal
description: "Generate client-facing proposals with built-in leak review. Produces deliverables then runs an interactive checklist against internal-leaks.md rules. Triggers on: client proposal, write proposal, client deliverable, proposal for."
source_id: seb-claude-tools
version: 1.0.0
---

# Client Proposal Generator

Generate client-facing deliverables (proposals, estimates, emails) with a mandatory leak review pass that flags internal information before delivery.

## Arguments

- **source**: GitHub issue URL, feature description, or "from context" to use current conversation
- **language**: `en`, `sv`, or `both` (default: `both`)
- **type**: `proposal` | `estimate` | `email` | `summary` (default: `proposal`)

## Phase 1 — Research

1. Read the source material (issue, PR, conversation context)
2. Identify: scope, deliverables, business value, timeline indicators
3. Read the project CLAUDE.md for tech stack and conventions
4. **Do NOT start writing yet** — present a bullet-point outline and wait for approval

## Phase 2 — Generate

Based on approved outline, generate the deliverable:

- **Proposal**: problem statement, proposed solution, deliverables, pricing, timeline
- **Estimate**: feature breakdown with hour ranges per item, total range, assumptions
- **Email**: professional client communication (match language param)
- **Summary**: executive summary of completed work

Write output to `docs/client/[name]-[type]-[lang].md` in the current project. If `both` languages, generate two files.

### Formatting Rules

- Professional, deliverable-focused language
- Use business value framing, not technical jargon
- Hour ranges, never exact hours (e.g., "8-12 hours", not "10 hours")
- Swedish files must use proper å, ä, ö characters

## Phase 3 — Leak Review

**This phase is mandatory. Never skip it.**

1. Read `~/.claude/lib/internal-leaks.md` for the full rules list
2. Scan every generated file against each rule
3. Present findings as an interactive checklist:

```
## Leak Review

Found 3 items to review:

1. [ ] **Internal hourly rate** (line 14): "based on our rate of 1200 SEK/hr"
   → Keep / Remove / Rephrase?

2. [ ] **Tool reference** (line 23): "tracked in Linear"
   → Keep / Remove / Rephrase?

3. [ ] **Team member name** (line 8): "Johan will handle..."
   → Keep / Remove / Rephrase?

No issues found for: cost calculations, margin data, repo names, Slack channels
```

4. Wait for user decision on each flagged item
5. Apply changes based on user responses
6. Run the scan one more time to confirm clean output

## Phase 4 — Deliver

1. Show final file path(s) and a 3-line summary
2. Ask if the user wants to commit the deliverable

## Rules

- Never generate client deliverables outside this skill's flow — the leak review is non-negotiable
- If source material is thin, ask for more context rather than padding with assumptions
- When in doubt about whether something is internal, flag it — false positives are cheap, leaks are expensive
