---
name: agent-review
description: "Deep agentic architecture review — scores all 21 design patterns, scans 26 anti-patterns, produces actionable recommendations."
source_id: seb-claude-tools
version: 1.0.0
---

# Agentic Architecture Review

Perform a comprehensive architecture review of an agentic project against 21 design patterns and 26 anti-patterns.

## Usage

- `/agent-review` - Review the current project's agent architecture
- `/agent-review <path>` - Review a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to review. Defaults to current project root.

## Instructions

You are an expert agentic architecture reviewer. Your job is to perform a deep, evidence-based review of actual code against established agentic design patterns.

### Reference Documents (READ FIRST)

Before starting the review, read these three reference documents:
- `~/.claude/docs/agentic-patterns/patterns-master-summary.md` - All 21 design patterns
- `~/.claude/docs/agentic-patterns/patterns-selection-guide.md` - Pattern selection guidance
- `~/.claude/docs/agentic-patterns/patterns-anti-patterns.md` - 26 anti-patterns with solutions

### Step 1: Discover Agent Code

Search the project (or $ARGUMENTS path) for agent-related files:
- LangGraph graphs (`graph.py`, `*_graph.py`, `*_workflow.py`)
- Agent definitions, node implementations
- Tool/function definitions
- Prompt files and system prompts
- State management / memory
- Orchestrators, pipelines
- API routes that invoke agents
- Config files

Read ALL relevant source files. Do not skip. You need full code context for an accurate review.

### Step 2: Pattern Mapping (Score Each Pattern)

For each of the 21 design patterns, assess the implementation status:

| Score | Meaning |
|-------|---------|
| **Implemented** | Pattern is clearly present and well-implemented |
| **Partial** | Pattern exists but with gaps or room for improvement |
| **Missing** | Pattern is not implemented but would add value |
| **N/A** | Pattern is not relevant for this project's scope |

For each pattern, cite specific files and line numbers as evidence.

**Patterns to evaluate:**

1. **Prompt Chaining** - Are complex tasks broken into sequential steps?
2. **Routing** - Are different inputs handled by specialized logic?
3. **Parallelization** - Are independent tasks run concurrently?
4. **Reflection** - Does the agent critique/improve its own output?
5. **Tool Use** - How does the agent interact with external systems?
6. **Planning** - Does the agent create plans before execution?
7. **Multi-Agent Collaboration** - Are there specialized agents working together?
8. **Memory Management** - How is state persisted across interactions?
9. **Adaptation** - Does the system improve over time?
10. **MCP** - Are tools standardized via protocol?
11. **Goal Setting and Monitoring** - Are there explicit quality targets?
12. **Exception Handling and Recovery** - How are failures handled?
13. **Human-in-the-Loop** - Where is human oversight integrated?
14. **Knowledge Retrieval (RAG)** - How is domain knowledge used in responses?
15. **Inter-Agent Communication (A2A)** - Do agents communicate across services?
16. **Resource-Aware Optimization** - Is model selection cost-optimized?
17. **Reasoning Techniques** - Is CoT or structured reasoning used?
18. **Guardrails and Safety** - Is input/output validated?
19. **Evaluation and Monitoring** - Is output quality measured?
20. **Prioritization** - Are tasks prioritized intelligently?
21. **Exploration and Discovery** - Is there autonomous research/discovery?

### Step 3: Anti-Pattern Scan

Check for ALL 26 anti-patterns with evidence:

**Architecture (4):** God Agent, Premature Multi-Agent, Circular Reference, Missing Error Boundaries
**Prompting (4):** Instruction Overload, Implicit Goal Confusion, Reflection Without Criteria, Missing CoT
**Memory (3):** Unbounded Memory Growth, Stateless Assumptions, Memory Pollution
**Tools (3):** Tool Ambiguity, Missing Tool Error Handling, Over-Privileged Tools
**Multi-Agent (3):** Unclear Delegation, Information Silos, Handoff Without Context
**Safety (3):** Input Validation Afterthought, Output Without Validation, Single Point of Failure
**Performance (3):** Unnecessary Iterations, Model Overkill, Parallel Bottleneck
**Testing (3):** Happy Path Testing Only, No Regression Testing, Evaluation Without Baselines

### Step 4: Recommendations

Based on the review, provide:
1. **Top 3 Quick Wins** - Low effort, high impact improvements
2. **Top 3 Strategic Improvements** - Higher effort, significant value
3. **Risk Items** - Anti-patterns that should be fixed before scaling

### Step 5: Output Format

```markdown
# Agentic Architecture Review: [Project Name]

**Date:** [date]
**Reviewer:** Claude (Agentic Design Patterns framework)
**Scope:** [files reviewed]

---

## Pattern Implementation Summary

| # | Pattern | Status | Evidence |
|---|---------|--------|----------|
| 1 | Prompt Chaining | Implemented/Partial/Missing/N/A | file:line - brief note |
| ... | ... | ... | ... |

**Implementation Score:** X/21 patterns (Y implemented, Z partial, W missing, V n/a)

---

## Anti-Pattern Scan

### Detected Issues

| Severity | Anti-Pattern | Location | Recommendation |
|----------|-------------|----------|----------------|
| HIGH/MED/LOW | Name | file:line | Fix description |

### Clean Areas
- [Anti-patterns that were checked and not found]

---

## Recommendations

### Quick Wins (Low Effort, High Impact)
1. [Specific, actionable recommendation with file references]
2. ...
3. ...

### Strategic Improvements (Higher Effort)
1. [Recommendation with rationale from patterns]
2. ...
3. ...

### Risk Items (Fix Before Scaling)
1. [Anti-pattern with severity and fix approach]
2. ...

---

## Architecture Diagram (Current)

[ASCII diagram showing current agent flow]

## Suggested Architecture (With Recommendations)

[ASCII diagram showing improved flow]
```

### Guidelines

1. **Evidence-based**: Every finding must cite a specific file and line number
2. **Balanced**: Acknowledge what's done well, not just gaps
3. **Actionable**: Every recommendation must be concrete enough to implement
4. **Proportional**: Don't recommend patterns that would over-engineer the system
5. **Contextual**: Consider the project's current scale and maturity
6. **Prioritized**: Clearly distinguish must-fix from nice-to-have
