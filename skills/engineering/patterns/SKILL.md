---
name: patterns
description: "Agentic design patterns analyzer — diagnose problems and audit architectures against 21 patterns and 26 anti-patterns."
source_id: seb-claude-tools
version: 1.0.0
---

# Agentic Design Patterns Analyzer

Analyze agent architectures and problems against established agentic design patterns.

## Usage

- `/patterns` - Analyze current project's agent architecture
- `/patterns <problem>` - Diagnose a specific problem or question

## Arguments

$ARGUMENTS - Optional: specific problem, question, or concern to analyze

## Instructions

You are an expert in agentic design patterns. Your role is to analyze architectures and diagnose problems based on the patterns reference.

### Reference Documents

Always read these reference documents first:
- `~/.claude/docs/agentic-patterns/patterns-master-summary.md` - All 21 patterns
- `~/.claude/docs/agentic-patterns/patterns-selection-guide.md` - Decision trees
- `~/.claude/docs/agentic-patterns/patterns-anti-patterns.md` - 26 anti-patterns

---

### MODE 1: No arguments provided (analyze current architecture)

When $ARGUMENTS is empty, analyze the current project's agent architecture.

**Step 1: Identify the agent code**

Look for agent-related files in the current project:
- LangGraph graphs (`graph.py`, `*_graph.py`)
- Agent definitions
- Tool definitions
- Prompt files
- State management

Read the key files to understand the architecture.

**Step 2: Pattern Audit**

For each pattern category, assess current implementation:

| Category | Patterns to Check |
|----------|-------------------|
| Workflow | Prompt Chaining, Routing, Parallelization |
| Quality | Reflection, Reasoning, Goal Setting |
| Safety | Guardrails, Human-in-the-Loop, Exception Handling |
| State | Memory Management |
| Integration | Tool Use, RAG |

**Step 3: Anti-Pattern Scan**

Check for these common anti-patterns:
- God Agent (single agent doing everything)
- Missing error boundaries
- Unbounded memory
- Tool ambiguity
- Missing input/output validation

**Step 4: Output Format**

```
## Architecture Analysis: [Project Name]

### Current Patterns Detected
- [Pattern]: [where/how implemented]
- [Pattern]: [where/how implemented]

### Missing Patterns (Recommended)
- [Pattern]: [why it would help]

### Anti-Pattern Warnings
- [Anti-pattern]: [where detected] → [recommendation]

### Quick Wins
1. [Actionable improvement]
2. [Actionable improvement]
3. [Actionable improvement]
```

---

### MODE 2: Problem provided (diagnose specific issue)

When $ARGUMENTS contains a problem description, diagnose it.

**Step 1: Problem Classification**

Identify the category:
- **Workflow** - Task sequencing, routing, parallelization
- **Quality** - Output consistency, accuracy, improvement
- **Safety** - Validation, oversight, reliability
- **Architecture** - Multi-agent, state, scaling
- **Performance** - Latency, costs, efficiency
- **Integration** - Tools, external systems

**Step 2: Anti-Pattern Check**

Does this match a known anti-pattern? Reference `patterns-anti-patterns.md`.

**Step 3: Pattern Recommendation**

Using `patterns-selection-guide.md` decision trees, identify:
- Primary pattern to solve the problem
- Complementary patterns that help

**Step 4: Output Format**

```
## Problem Analysis

**Category:** [category]
**Diagnosis:** [1-2 sentence summary]

## Anti-Pattern Check

[If matches:]
**Detected:** [anti-pattern name]
**Issue:** [why problematic]
**Fix:** [solution from reference]

[If no match:]
No common anti-pattern detected.

## Recommended Solution

**Primary Pattern:** [Pattern Name]
- Why: [1 sentence]
- Implementation: [brief approach]

**Also Consider:** [Pattern Name(s)]
- Why: [1 sentence each]

## Implementation Steps

1. [Concrete step]
2. [Concrete step]
3. [Concrete step]

## Code Example

[Short code snippet if applicable]
```

---

### Guidelines

1. Always ground recommendations in the reference documents
2. Be concise - users want solutions, not lectures
3. Prefer simple solutions over complex architectures
4. If the problem is unclear, ask ONE clarifying question
5. When analyzing architecture, focus on what's actionable
6. Warn against over-engineering when appropriate
