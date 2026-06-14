---
name: agent-audit
description: "Quick 23-point pass/fail pre-deployment audit for agentic systems — checks architecture, safety, tools, memory, and testing."
source_id: seb-claude-tools
version: 1.0.0
---

# Agentic Pre-Deployment Audit

Quick pass/fail checklist auditing an agentic system against 23 critical quality gates derived from the 26 anti-patterns catalog.

## Usage

- `/agent-audit` - Audit the current project's agent architecture
- `/agent-audit <path>` - Audit a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to audit. Defaults to current project root.

## Instructions

You are an agentic systems quality auditor. Run a fast, evidence-based audit against the deployment readiness checklist.

### Reference Document

Read `~/.claude/docs/agentic-patterns/patterns-anti-patterns.md` - specifically the "Quick Anti-Pattern Checklist" at the bottom.

### Step 1: Discover and Read Key Files

Search the project (or $ARGUMENTS path) for agent-related files. Focus on:
- Agent graph/pipeline definition
- Prompt templates
- Tool/function definitions
- Error handling code
- Input/output validation
- Memory management
- Test files (scan for coverage breadth)

### Step 2: Run the 23-Point Checklist

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with brief evidence.

**Architecture (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | No God Agent | Are responsibilities separated into distinct modules/agents? |
| 2 | Complexity matches problem | Is the architecture appropriately complex (not over/under-engineered)? |
| 3 | No circular agent references | Are agent/function call chains acyclic? Are there max-depth limits? |
| 4 | Error boundaries in place | Do components fail independently? Is there try/except around external calls? |

**Prompting (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 5 | Focused prompt instructions | Are system prompts reasonable length (<1500 tokens)? Are they clear? |
| 6 | Explicit goals | Do prompts state what the agent should achieve (not just how)? |
| 7 | Reflection has clear criteria | If reflection exists, does it have specific evaluation criteria? |
| 8 | Complex tasks use structured reasoning | Do multi-step tasks use CoT or step-by-step instructions? |

**Memory & State (3 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 9 | Memory has bounds and cleanup | Is conversation history capped? Is there summarization or truncation? |
| 10 | State is explicitly managed | Is state passed between components (not assumed from prior calls)? |
| 11 | No memory pollution risk | Is stored data validated? Are there timestamps? Can bad data be corrected? |

**Tools (3 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 12 | Tool descriptions are unambiguous | Are tool/function descriptions clear about when to use them? |
| 13 | Tool errors are handled gracefully | Do tool calls have try/except? Do they return meaningful error messages? |
| 14 | Tools have minimal necessary permissions | Are tools scoped to minimum needed access (no raw SQL, no admin-level access)? |

**Delegation (2 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 15 | Delegation rules are explicit | If routing exists, are rules clearly defined (not vague)? |
| 16 | Context passes between components | On handoffs, is relevant context carried forward? |

**Safety (3 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 17 | Inputs are validated | Is user input sanitized/validated before processing? Length limits? |
| 18 | Outputs are validated | Is LLM output checked before sending to user (format, safety, hallucination)? |
| 19 | Fallbacks exist for critical services | Do external dependencies (LLM API, email, DB) have fallback behavior? |

**Performance (2 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 20 | Model selection is cost-appropriate | Is the cheapest sufficient model used? Are expensive models justified? |
| 21 | Iterations have bounds | Do all loops (retry, reflection, polling) have max iteration limits? |

**Testing (2 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 22 | Tests cover edge cases and failures | Do tests include error paths, empty inputs, malformed data? |
| 23 | Regression tests exist | Are there golden test cases that guard against regressions? |

### Step 3: Score and Output

```markdown
# Agentic Deployment Audit: [Project Name]

**Date:** [date]
**Auditor:** Claude (Anti-Pattern Checklist v1)

---

## Results Summary

| Result | Count |
|--------|-------|
| PASS   | X     |
| PARTIAL| Y     |
| FAIL   | Z     |

**Readiness Score:** X/23 (XX%)

**Verdict:** READY / READY WITH CAVEATS / NOT READY

---

## Detailed Checklist

### Architecture
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | No God Agent | PASS/PARTIAL/FAIL | [file:line - brief note] |
| 2 | Complexity matches problem | ... | ... |
| 3 | No circular references | ... | ... |
| 4 | Error boundaries | ... | ... |

### Prompting
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 5 | Focused instructions | ... | ... |
| 6 | Explicit goals | ... | ... |
| 7 | Reflection criteria | ... | ... |
| 8 | Structured reasoning | ... | ... |

### Memory & State
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 9 | Memory bounds | ... | ... |
| 10 | State management | ... | ... |
| 11 | No memory pollution | ... | ... |

### Tools
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 12 | Unambiguous descriptions | ... | ... |
| 13 | Graceful error handling | ... | ... |
| 14 | Minimal permissions | ... | ... |

### Delegation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 15 | Explicit rules | ... | ... |
| 16 | Context passing | ... | ... |

### Safety
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 17 | Input validation | ... | ... |
| 18 | Output validation | ... | ... |
| 19 | Fallbacks exist | ... | ... |

### Performance
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 20 | Cost-appropriate models | ... | ... |
| 21 | Bounded iterations | ... | ... |

### Testing
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 22 | Edge case coverage | ... | ... |
| 23 | Regression tests | ... | ... |

---

## Critical Fixes Required

[Only if FAIL items exist]

1. **[Check #]**: [Specific fix with file references]
2. ...

## Recommended Improvements

[For PARTIAL items]

1. **[Check #]**: [Improvement suggestion]
2. ...
```

### Guidelines

1. **Fast**: This audit should take 2-3 minutes, not 10. Read efficiently.
2. **Binary-leaning**: When in doubt between PASS and PARTIAL, lean PARTIAL. When in doubt between PARTIAL and FAIL, check twice.
3. **Evidence required**: Every result must cite at least one file. "PASS - no evidence" is not acceptable.
4. **Proportional severity**: A missing edge case test is PARTIAL. A missing error boundary on external API calls is FAIL.
5. **Skip N/A items**: If a check is genuinely not applicable (e.g., "no circular references" when there's only one agent), mark PASS with note "N/A - single agent".
