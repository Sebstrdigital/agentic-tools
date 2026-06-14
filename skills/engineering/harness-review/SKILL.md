---
name: harness-review
description: "Deep review of an agentic harness against the 6 harness design patterns, agentic patterns, and anti-patterns. Evidence-based with file:line citations. Covers type alignment, agent design, orchestration, safety, and observability. Triggers on: harness review, review harness, audit harness, harness quality."
source_id: seb-claude-tools
version: 1.0.0
---

# Harness Review

Comprehensive review of an agentic harness implementation against the 6 harness design patterns, 21 agentic design patterns, and combined anti-pattern catalogs. Evidence-based — every finding cites a specific file and line number.

## Usage

- `/harness-review` — Review the current project as a harness
- `/harness-review <path>` — Review a specific harness directory

## Arguments

$ARGUMENTS - Optional: path to the harness directory. Defaults to current project root.

## Instructions

You are an expert harness architect reviewing an agentic harness implementation. Your job is to evaluate whether the harness is well-designed for its purpose, correctly implements its declared pattern, and avoids known failure modes.

### Reference Documents (READ FIRST)

Read these before starting the review:

**Harness patterns:**
- `~/.claude/docs/harness-patterns/harness-types.md` — 6 harness design patterns
- `~/.claude/docs/harness-patterns/harness-selection-guide.md` — Selection criteria and anti-patterns

**Agentic patterns:**
- `~/.claude/docs/agentic-patterns/patterns-master-summary.md` — 21 design patterns
- `~/.claude/docs/agentic-patterns/patterns-anti-patterns.md` — 26 anti-patterns

**Skill conventions (if Claude Code harness):**
- `~/.claude/docs/skill-authoring-guide.md` — Skill format and quality

### Step 1: Discover the Harness

Search the project (or $ARGUMENTS path) for:

- **Harness declaration** — `harness-architecture.md`, `harness-spec.md`, README, CLAUDE.md
- **Agent definitions** — skill files, LangGraph nodes, CrewAI agents, system prompts
- **Tool implementations** — MCP servers, tool functions, API wrappers
- **Orchestration** — graph definitions, skill chains, pipelines, state machines
- **State management** — progress files, state schemas, checkpoints
- **Human-in-the-loop** — approval gates, review interfaces, notification hooks
- **Configuration** — env files, config modules, secrets management
- **Tests** — test files, evaluation scripts, fixtures

Classify the harness:
```
**Declared harness type:** [From architecture doc or inferred]
**Platform:** [Claude Code / LangGraph / CrewAI / Custom / Mixed]
**Agent count:** [N]
**Tool count:** [N]
**Has spec docs:** [Yes/No — architecture.md, spec.md, interview.md]
```

### Step 2: Run the Review (6 Domains, 28 Checks + Type-Specific)

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with evidence.

**Domain 1: Harness Type Alignment (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Harness type is explicitly declared | Architecture doc, README, or code comments state which of the 6 types this is. If not declared, infer and flag the gap. |
| 2 | Implementation matches declared type | The actual code/skills implement the characteristics of the declared type. A "Specialized Harness" that accepts open-ended queries is misaligned. A "DAG Harness" with dynamic routing has drifted. |
| 3 | Type-specific required components present | Check against the type's component list from harness-types.md. E.g., Autonomous must have progress file + session protocol + self-verification. Specialized must have input validation + narrow tools. |
| 4 | Complexity matches problem | The harness type isn't over-engineered (Hierarchical for a simple pipeline) or under-engineered (General Purpose for what should be a DAG). Compare to the selection guide's decision tree. |
| 5 | Type-specific anti-patterns avoided | Check against the selection guide's anti-pattern table. Premature Multi-Agent? DAG for Dynamic Work? Autonomous Without Verification? General Purpose for Batch? |

**Domain 2: Agent Design (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 6 | Agent decomposition is justified | If multi-agent: each agent has a clear reason to exist (distinct domain, security boundary, permission level). If single agent: the tool count and prompt complexity are manageable. |
| 7 | System prompts are focused | Prompts are clear, not overloaded. Each prompt fits its agent's role. No prompt tries to do everything. Reasonable length (<2000 tokens for focused agents, <4000 for general purpose). |
| 8 | Tool sets are minimal | Each agent has only the tools it needs. No agent has access to tools it shouldn't use. Consolidation opportunities are flagged. Reference: "Vercel cut 80% of tools and got better results." |
| 9 | Permissions are scoped | Write/delete/send operations require appropriate authorization level. Read-only agents don't have write tools. High blast-radius tools have explicit approval gates. |
| 10 | Agent boundaries are clear | No overlapping responsibilities between agents. Each agent's scope is well-defined. A reader can tell which agent handles what without ambiguity. |

**Domain 3: Orchestration & Flow (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 11 | Orchestration pattern matches harness type | The internal flow pattern is appropriate. Sequential chain in a DAG? Router in a Hierarchical? Check against the type-specific orchestration table. |
| 12 | All paths are handled | Happy path, error path, edge cases, and early termination all have defined behavior. No "what happens if X?" gaps in the flow. |
| 13 | No unbounded loops | Every loop (retry, agent loop, reflection) has a max iteration limit. Infinite loop detection exists for dynamic orchestration. |
| 14 | State transitions are explicit | Moving between steps/agents is clearly defined. No implicit assumptions about what state the next step will find. Transitions are documented or codified. |
| 15 | Parallelism is correct | If parallel execution exists: independent branches are truly independent (no shared mutable state). Fan-in aggregation handles partial failures. If no parallelism: check if there are missed opportunities. |

**Domain 4: Safety & Reliability (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 16 | Human gates at high blast-radius steps | Every step rated Medium+ blast radius in the interview has a corresponding approval gate. No high-risk operations execute without oversight. |
| 17 | Error handling at external calls | Every API call, database query, file operation, and LLM call has explicit error handling. Errors aren't swallowed. Retries have limits. |
| 18 | Rollback for write operations | Write operations to external systems have compensating actions when blast radius > Low. Or: operations are idempotent so re-running is safe. |
| 19 | Input validation at boundaries | Data entering the harness from users, APIs, or external systems is validated before processing. Schema validation, type checking, size limits. |
| 20 | Output validation before acting | LLM outputs are checked for format, safety, and correctness before being used in downstream actions. No raw LLM output used in tool calls without validation. |

**Domain 5: State & Memory (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 21 | State strategy matches harness type | General Purpose: context window + minimal external. Specialized: stateless per task. Autonomous: progress file + git. Hierarchical: plan state. DAG: per-node checkpoints. |
| 22 | Recovery mechanism exists | After a crash or timeout, the harness can resume from the last successful checkpoint. Not starting over from scratch every time. |
| 23 | Context window is managed | For LLM-based agents: context doesn't grow unbounded. Compaction, summarization, or windowing is in place. Long conversations don't degrade quality. |
| 24 | Persistent state is clean | Stored data has timestamps, is validated, and can be corrected. No accumulation of stale/incorrect state over time. Cleanup mechanisms exist. |

**Domain 6: Observability & Evaluation (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 25 | Actions are logged | Every significant action (tool call, decision, state change) is logged with enough context to reconstruct what happened. Audit trail exists. |
| 26 | Success metrics are measured | The harness tracks metrics that map to declared success criteria. Not just "did it finish" but "did it produce the right result." |
| 27 | Alerts exist for failures | Human notification when the harness fails, gets stuck, or produces low-confidence output. Not silent failure. |
| 28 | Evaluation baseline exists | There is a way to measure if the harness quality is improving or degrading over time. Golden test cases, benchmark inputs, or quality scorecards. |

### Step 3: Type-Specific Deep Checks

Based on the detected harness type, run additional checks:

**General Purpose (3 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| GP-1 | Loop termination is robust | Agent loop has max iterations AND semantic exit conditions. Not just "run until the model says done." |
| GP-2 | Tool selection is guided | System prompt or tool descriptions guide correct tool selection. No ambiguous tools with overlapping descriptions. |
| GP-3 | Verification before completion | Agent self-checks output before declaring done. Not "one-shot and hope." |

**Specialized (3 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| SP-1 | Input schema is strict | Task inputs are validated against a schema. Malformed inputs are rejected with clear messages, not processed and failed. |
| SP-2 | Parallel execution is safe | If tasks run in parallel: no shared mutable state between tasks. Each task has an isolated sandbox/context. |
| SP-3 | Output verification is automated | Each task's output is checked against success criteria automatically. Not relying on human review for batch processing. |

**Autonomous (4 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| AU-1 | Progress file exists and is structured | A progress tracking file records completed work, blockers, decisions, and next actions. Format is consistent and machine-readable. |
| AU-2 | Session startup protocol defined | Every new session starts by reading progress, checking state, and orienting before doing new work. Not jumping straight into work. |
| AU-3 | Self-verification before marking complete | Agent runs tests or validation before declaring a feature/task complete. "Declares victory prematurely" is the #1 autonomous harness failure. |
| AU-4 | Regression protection | Working features aren't broken by new work. Git checkpoints, test suites, or rollback capabilities protect prior progress. |

**Hierarchical (3 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| HI-1 | Decomposition strategy is sound | Supervisor breaks down tasks at appropriate granularity. Not too coarse (workers still confused) or too fine (overhead exceeds value). |
| HI-2 | Worker results are validated | Supervisor checks worker output before incorporating it. Bad worker output doesn't propagate unchecked. |
| HI-3 | Plan updates based on results | Supervisor adjusts the plan when worker results reveal new information. Not blind sequential execution of the original plan. |

**Multi-Agent (3 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| MA-1 | Handoff protocol is explicit | Context passed between agents is defined. No "the next agent will figure it out." Handoff includes relevant state, not raw conversation history. |
| MA-2 | No infinite routing | Agent-to-agent routing has cycle detection or max-hop limits. Two agents can't ping-pong forever. |
| MA-3 | Conflict resolution exists | When agents disagree or produce conflicting outputs, there's a resolution mechanism (coordinator decision, voting, human escalation). |

**DAG (3 extra checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| DAG-1 | Dependencies are correct | The dependency graph accurately reflects real data dependencies. No missing edges (parallel when should be sequential) or unnecessary edges (sequential when could be parallel). |
| DAG-2 | Node retry doesn't corrupt state | Retrying a failed node doesn't duplicate side effects or leave inconsistent state. Nodes are idempotent or have rollback. |
| DAG-3 | Failure propagation is controlled | A failed node doesn't silently block all downstream nodes. Failure strategy is explicit: retry, skip with default, halt branch, halt all. |

### Step 4: Anti-Pattern Cross-Reference

Check against the 26 agentic anti-patterns from the patterns catalog. Focus on the ones most relevant to the detected harness type:

| Harness Type | Priority Anti-Patterns |
|-------------|----------------------|
| General Purpose | God Agent, Tool Ambiguity, Unnecessary Iterations |
| Specialized | Premature Multi-Agent, Over-Privileged Tools, Happy Path Testing |
| Autonomous | Stateless Assumptions, Memory Pollution, No Regression Testing |
| Hierarchical | Unclear Delegation, Information Silos, Handoff Without Context |
| Multi-Agent | Circular Reference, Information Silos, Handoff Without Context |
| DAG | Missing Error Boundaries, Parallel Bottleneck, Single Point of Failure |

```
## Anti-Pattern Scan

✅ Clean: [Anti-patterns checked and not found]
⚠️ Watch: [Close to an anti-pattern, with mitigation notes]
❌ Detected: [Anti-patterns found, with file:line evidence]
```

### Step 5: Classify and Prioritize

For each FAIL or PARTIAL, assign severity:

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Harness type mismatch, missing safety gate on high blast-radius operation, no error handling on external calls. Fix before any production use. |
| **HIGH** | Missing type-specific component, unbounded loops, no recovery mechanism. Will cause failures under real conditions. |
| **MEDIUM** | Suboptimal pattern choice, missing observability, weak validation. Works but will be hard to maintain or debug. |
| **LOW** | Minor convention violation, missing documentation, optimization opportunity. Polish items. |

### Step 6: Output Format

Save to `docs/audits/harness-review.md` (or $ARGUMENTS path).

```markdown
# Harness Review: [Harness Name]

**Date:** [date]
**Reviewer:** Claude (Harness Review v1)
**Scope:** [files reviewed]
**Harness Type:** [declared] → [actual alignment]
**Platform:** [detected]

---

## Results Summary

| Result   | Count |
|----------|-------|
| PASS     | X     |
| PARTIAL  | Y     |
| FAIL     | Z     |

**Quality Score:** X/[total checks] (XX%)
- Base checks: X/28
- Type-specific checks: X/[3-4]

**Verdict:** PRODUCTION READY / READY WITH CAVEATS / NEEDS WORK / SIGNIFICANT REDESIGN NEEDED

---

## Harness Type Assessment

**Declared:** [Type]
**Alignment:** [Aligned / Drifted / Misclassified]
**Assessment:** [1-2 sentences on whether the type choice is correct]

---

## Findings by Severity

### Critical
[List or "None found"]

### High
[List with file:line and fix recommendations]

### Medium
[List]

### Low
[List]

---

## Detailed Checklist

### Domain 1: Harness Type Alignment
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Type declared | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 2: Agent Design
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 6 | Decomposition justified | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 3: Orchestration & Flow
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 11 | Pattern matches type | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 4: Safety & Reliability
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 16 | Human gates | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 5: State & Memory
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 21 | State strategy | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Domain 6: Observability & Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 25 | Actions logged | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

### Type-Specific: [Type Name]
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| [XX]-1 | [Check] | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

---

## Anti-Pattern Scan

### Detected Issues
| Severity | Anti-Pattern | Location | Recommendation |
|----------|-------------|----------|----------------|
| [level] | [name] | [file:line] | [fix] |

### Clean Areas
[Anti-patterns checked and not found]

---

## Architecture Diagram (Current)

[ASCII diagram of the current harness flow]

---

## Recommendations

### Critical Fixes (Before Production)
1. **[Check #]** — [Specific fix with file references]

### Quick Wins (Low Effort, High Impact)
1. **[Area]** — [What to change]

### Strategic Improvements (Higher Effort)
1. **[Area]** — [Recommendation with rationale]

### What's Working Well
[3-5 specific callouts of well-implemented patterns]
```

### Guidelines

1. **Evidence-based**: Every finding cites a specific file and line number. No speculation about what might go wrong.
2. **Type-aware**: Evaluate against the harness type's specific requirements, not generic best practices. A Specialized Harness doesn't need dynamic routing.
3. **Proportional**: Don't recommend adding complexity that the harness type doesn't call for. A DAG doesn't need autonomous session management.
4. **Harness-first, then agentic**: First check harness type alignment and type-specific components. Then apply the broader agentic pattern checks. Type alignment issues are more critical than missing optional patterns.
5. **Acknowledge good design**: A harness that correctly identifies its type and implements it cleanly deserves recognition, even if some agentic patterns are missing.
6. **Escalation path**: If the harness type is wrong for the problem, recommend the correct type. Don't just say "type mismatch" — say what it should be and why.
