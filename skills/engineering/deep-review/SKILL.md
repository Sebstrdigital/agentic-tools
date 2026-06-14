---
name: deep-review
description: "World-class code review chain — 4 parallel specialized reviewers covering framework correctness, resource safety, security, and adversarial absence detection. Runs on diff against base branch. Goal: zero findings should survive for any external reviewer."
source_id: seb-claude-tools
version: 1.0.0
---

# Deep Review — Zero-Escape Code Review Chain

Four specialized reviewers run in parallel on the feature branch diff. Each adopts a distinct persona and checks a non-overlapping dimension. Findings are aggregated, deduplicated, and classified.

**Standard: After this review passes, an external reviewer should find nothing except taste preferences.**

## Usage

- `/deep-review` — Review current branch diff against base (auto-detects main/dev)
- `/deep-review <base-branch>` — Review diff against a specific base branch

## Arguments

$ARGUMENTS — Optional: base branch to diff against. Defaults to auto-detect (dev if exists, otherwise main).

## Instructions

You are a review orchestrator. You never review code yourself — you spawn 4 specialized agents and aggregate their findings.

### Step 0: Setup

1. Detect the base branch:
   ```bash
   git rev-parse --verify origin/dev 2>/dev/null && echo "dev" || echo "main"
   ```
   Use $ARGUMENTS if provided, otherwise use the detected base.

2. Generate the diff:
   ```bash
   git diff <base>...HEAD > /tmp/deep-review.diff
   ```

3. Count changed lines. If <10 lines changed, warn the user this is a very small diff.

4. Read the project's CLAUDE.md for conventions and rules.

### Step 1: Spawn 4 Reviewers in Parallel

Launch all 4 agents simultaneously using `Agent` tool with `run_in_background: true`. Each gets the same diff but a different focused mandate. Use `model: "sonnet"` and `mode: "bypassPermissions"` for all.

**IMPORTANT:** Each reviewer prompt must include:
- The absolute path to the diff file
- The absolute path to the project root
- The absolute path to CLAUDE.md
- Instructions to read `~/.claude/docs/deep-review/<pass-name>.md` for their full checklist
- Instructions to write findings to `/tmp/deep-review-<pass-name>.json`

Reviewer prompts (keep under 500 bytes each — full instructions are on disk):

```
# Deep Review: <Pass Name>

## Project: <absolute path>
## Diff: /tmp/deep-review.diff
## Conventions: <path to CLAUDE.md>

Read ~/.claude/docs/deep-review/<pass-name>.md for your checklist.
Read the diff from /tmp/deep-review.diff.
Read CLAUDE.md for project rules.
For every finding, read the FULL file (not just the diff) to get execution context.
Write findings to /tmp/deep-review-<pass-name>.json
```

The 4 passes:
1. `framework` — Framework & Tool Correctness
2. `resources` — Resource & Runtime Safety
3. `security` — Security & Access Control
4. `absence` — Adversarial Absence Detection

### Step 2: Aggregate Findings

After all 4 agents complete, `TaskStop` each one immediately.

Read all 4 JSON files. Merge into a single report:

1. **Deduplicate** — if two passes flag the same file:line, keep the higher severity and merge the descriptions.
2. **Classify severity** — each finding is `must-fix` or `suggestion`.
3. **Sort** — must-fix first, then by file path.

### Step 3: Triage Findings

You (the orchestrator) now triage every aggregated finding into one of three buckets. This is classification, not review — do not re-read the code, work only from the finding's evidence and the project's CLAUDE.md.

For each finding, apply the decision tree top-down. First match wins:

| # | Condition | Bucket |
|---|---|---|
| 1 | Security / auth / tenancy / RLS breach | 🔴 **block** |
| 2 | Data loss, corruption, or wrong results reaching user or DB | 🔴 **block** |
| 3 | Crash on a reachable user path | 🔴 **block** |
| 4 | Resource leak under normal load (conn pool, file handle, memory) | 🔴 **block** |
| 5 | Explicit CLAUDE.md hard-rule violation | 🔴 **block** |
| 6 | Test-only or dev-only impact | 🟡 **followup** |
| 7 | Polish: wrong error code (400-vs-500), log hygiene, message wording | 🟡 **followup** |
| 8 | "Consider adding X" / hypothetical edge case / speculative hardening | 🟡 **followup** |
| 9 | Consistency / parity fix with no user-visible failure mode | 🟡 **followup** |
| 10 | Reviewer cites code that doesn't exist or misread the flow | ⚪ **dismiss** |
| 11 | Duplicate of another finding after dedup failed to catch it | ⚪ **dismiss** |
| 12 | Contradicts CLAUDE.md rule or framework docs | ⚪ **dismiss** |

For each finding, set:
- `triage`: `"block" | "followup" | "dismiss"`
- `triage_reason`: one-line explanation referencing which row above matched

**Regression detection.** For every finding, check whether it targets lines introduced by a prior commit on the current branch whose message contains `deep-review`, `round 2`, or `US-00` (takt-style). If so, set `regression_from_fix: true`. This is the real convergence signal — a regression from a fix is legitimate new information, not reviewer drift.

**Convergence bias.** If a `deep-review-report.json` already exists at the project root (this is a re-run), bias toward `followup` for any finding that is NOT flagged `regression_from_fix`. The rationale: on re-runs, the top real issues are already gone, and reviewer attention drifts to lower-tier issues that would otherwise be noise. Only escalate to `block` on a re-run if (a) `regression_from_fix` is true, or (b) the finding matches rows 1–5 unambiguously.

**Nothing is silently dropped.** Every finding must land in exactly one bucket, and all three buckets are persisted in Step 4. Dismissals are kept for human audit, not discarded.

### Step 4: Write Outputs

**File 1: `deep-review-report.json`** at project root.

```json
{
  "base": "<base-branch>",
  "head": "<current-branch>",
  "date": "<ISO date>",
  "run_number": 1,
  "passes": {
    "framework": { "must_fix": N, "suggestion": N },
    "resources": { "must_fix": N, "suggestion": N },
    "security": { "must_fix": N, "suggestion": N },
    "absence": { "must_fix": N, "suggestion": N }
  },
  "triage_counts": {
    "block": N,
    "followup": N,
    "dismiss": N
  },
  "findings": [
    {
      "pass": "framework",
      "file": "lib/example.ts",
      "line": 42,
      "severity": "must-fix",
      "triage": "block",
      "triage_reason": "Row 1: tenant isolation — missing orgId scope on query",
      "regression_from_fix": false,
      "finding": "Short description",
      "evidence": "What the code does and why it's wrong",
      "fix": "What the correct code should be"
    }
  ],
  "verdict": "CLEAN | BLOCKERS | CLEAN_WITH_FOLLOWUPS",
  "summary": "N block, N followup, N dismiss across 4 passes"
}
```

If the report already exists, increment `run_number` rather than resetting it.

**File 2: `<sanitized-branch>-followups.md`** at project root.

Sanitize the branch name by replacing `/` with `-` (e.g., `takt/api-v1-hardening` → `takt-api-v1-hardening-followups.md`).

If the file does NOT exist, create it:

```markdown
# Follow-ups: <branch>

Generated by /deep-review triage. Every non-blocking finding lands here so nothing is silently lost.

## Run 1 — <ISO date>

### Actual Follow-ups (N)

Real issues that should be addressed in a future PR or sprint.

1. **[pass]** `file:line` — <finding summary>
   - **Why deferred:** <triage_reason>
   - **Evidence:** <evidence>
   - **Suggested fix:** <fix>

### Potential Dismissals (N)

Findings that look like false positives, reviewer misreads, or duplicates. Kept here for human audit — review later to calibrate reviewer quality.

1. **[pass]** `file:line` — <finding summary>
   - **Why dismissed:** <triage_reason>
   - **Original finding:** <evidence>
```

If the file already exists (re-run), **append** a new `## Run N — <ISO date>` block at the bottom. Do not modify existing runs.

### Step 5: Print Report

```markdown
## Deep Review Report

**Branch:** <branch> vs <base>
**Date:** <date>
**Run:** N

### Results by Pass
| Pass | Must-Fix | Suggestions |
|------|----------|-------------|
| Framework & Tool Correctness | N | N |
| Resource & Runtime Safety | N | N |
| Security & Access Control | N | N |
| Adversarial Absence Detection | N | N |
| **Total** | **N** | **N** |

### Triage
| Bucket | Count |
|---|---|
| 🔴 Block | N |
| 🟡 Follow-up | N |
| ⚪ Potential Dismiss | N |

### 🔴 Blockers (fix in this PR)
1. **[framework]** `file:line` — description
   Evidence: ...
   Fix: ...
   Triage: Row X — <reason>
   <if regression_from_fix: ⚠️ **Regression from prior deep-review fix**>

### 🟡 Follow-ups & ⚪ Potential Dismissals
N follow-ups and N potential dismissals written to `<sanitized-branch>-followups.md`.

### Verdict: CLEAN | BLOCKERS | CLEAN_WITH_FOLLOWUPS
```

**Verdict rules:**
- `CLEAN` — zero findings in any bucket
- `BLOCKERS` — ≥1 block finding (list all in the printed report)
- `CLEAN_WITH_FOLLOWUPS` — zero blocks, but followups and/or dismissals exist

If verdict is `CLEAN_WITH_FOLLOWUPS`, the PR is shippable — the follow-ups file is a backlog, not a gate.

### Guidelines

1. **Never review code yourself** — you orchestrate and triage only. Triage is classification from evidence, not re-reading the code.
2. **All 4 passes run in parallel** — do not run sequentially.
3. **Full file context** — reviewers read changed files end-to-end, not just diff hunks.
4. **Evidence required** — every finding must cite file:line and explain the causal chain.
5. **No false positives on must-fix** — uncertain = suggestion.
6. **CLAUDE.md is law** — any explicit hard-rule violation is automatic `block` (Row 5).
7. **The absence pass is critical** — LLMs naturally miss what's NOT there. The dedicated absence reviewer compensates for this blind spot.
8. **Nothing is silently dropped** — every finding lands in `block`, `followup`, or `dismiss`, and all three are persisted. Dismissals go to the follow-ups file under "Potential Dismissals" for human audit.
9. **Convergence bias on re-runs** — after run 1, only `regression_from_fix` or unambiguous rows 1–5 escalate to `block`. Everything else is `followup`. This prevents the "fix forever" loop.
10. **The follow-ups file is a backlog, not a gate** — `CLEAN_WITH_FOLLOWUPS` ships. Only `BLOCKERS` holds the PR.
