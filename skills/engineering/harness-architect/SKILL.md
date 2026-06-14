---
name: harness-architect
description: "Design an agentic harness architecture from interview requirements. Selects harness type, applies design patterns, decomposes agents, and maps tools. Use after /harness-interview. Triggers on: harness architect, design architecture, architect harness, agent architecture."
source_id: seb-claude-tools
version: 1.0.0
---

# Harness Architect

Design the architecture for an agentic harness based on the requirements captured in `/harness-interview`. The primary decision is **which harness type** to use, followed by internal orchestration, agent decomposition, and tool design.

---

## Prerequisites

This skill requires `harness-interview.md` in the current working directory. Resolution order:
1. Look for `harness-interview.md` in the project root
2. If not found, tell the user:

> I need the interview requirements first. Run `/harness-interview` to capture domain, systems, constraints, and harness signals — architecture must be grounded in requirements, not assumptions.

**Read the interview document before starting.** Every architectural decision must trace back to a specific requirement.

---

## The Job

1. Read `harness-interview.md`
2. Read the harness patterns reference docs
3. Read the agentic patterns reference docs
4. Select the harness type (primary architectural decision)
5. Design the internal architecture
6. Present architecture for approval (section by section)
7. Save to `harness-architecture.md`

**Important:** Present each major decision with reasoning and alternatives considered. The user approves the architecture before it becomes a spec. This is the most consequential step in the chain — don't rush.

---

## Step 1: Load Reference Material

Read the following docs to inform decisions:

**Harness patterns:**
- `~/.claude/docs/harness-patterns/harness-types.md` — 6 harness design patterns
- `~/.claude/docs/harness-patterns/harness-selection-guide.md` — decision framework

**Agentic patterns (for internal agent design):**
- `~/.claude/docs/agentic-patterns/patterns-master-summary.md` — 21 design patterns
- `~/.claude/docs/agentic-patterns/patterns-selection-guide.md` — pattern combinations
- `~/.claude/docs/agentic-patterns/patterns-anti-patterns.md` — 26 anti-patterns

If any files don't exist, use your knowledge and note the gap.

---

## Step 2: Harness Type Selection (Primary Decision)

This is the most important architectural decision. Use the interview's harness signals and the selection guide's decision tree.

Present the analysis:

```
## Harness Type Selection

### Interview Signals
- **Predictability:** [A/B/C/D from interview]
- **Duration:** [per run]
- **Pattern:** [single complex / repeated narrow / hybrid]
- **Autonomy level:** [A/B/C/D from interview]
- **Domain count:** [single / multiple]
- **Volume:** [from interview]

### Decision Tree Path
[Walk through the selection guide decision tree with the interview signals]

### Recommendation

**Harness Type:** [Selected type]

**Why this fits:**
- [Signal → requirement match]
- [Signal → requirement match]
- [Signal → requirement match]

**Why not [Alternative 1]:**
- [Specific reason traced to interview data]

**Why not [Alternative 2]:**
- [Specific reason traced to interview data]

**Hybrid consideration:** [If the problem might benefit from combining types, explain]

**Risk:** [Top risk of this choice and mitigation]
```

Wait for the user to confirm the harness type before proceeding. This decision shapes everything downstream.

---

## Step 3: Internal Architecture

Once the harness type is confirmed, design the internal architecture. The sections below adapt based on the selected type.

### 3.1 Agent Decomposition

**Start simple.** A single agent with good tools handles most workflows. Go multi-agent only when a specific failure mode demands it.

For each agent, define:

```
### Agent: [Name]
**Role:** [One-line responsibility]
**Why this agent exists:** [What problem it solves that couldn't be handled otherwise]
**Tools:** [List of tools it needs]
**Autonomy:** [What it can do without approval]
```

**Type-specific guidance:**

| Harness Type | Decomposition Approach |
|-------------|----------------------|
| General Purpose | Usually single agent. Split only if tool count > 15-20 or distinct permission levels needed. |
| Specialized | Single agent per task type. Multiple identical agents for parallelism. |
| Autonomous | Initializer agent + executor agent(s). Initializer sets up structure, executor does incremental work. |
| Hierarchical | Supervisor + workers. Workers may be specialized. Define decomposition strategy. |
| Multi-Agent | One agent per domain/expertise. Define coordination protocol. |
| DAG | One agent (or function) per node. Nodes can be LLM-powered or deterministic. |

### 3.2 Orchestration Pattern

Select the internal orchestration using Anthropic's building blocks:

| Pattern | When to Use Within Harness |
|---------|---------------------------|
| **Prompt Chaining** | Fixed sequential steps within the harness |
| **Routing** | Input determines which handler/agent to use |
| **Parallelization** | Independent subtasks within a step |
| **Orchestrator-Workers** | Dynamic decomposition at runtime |
| **Evaluator-Optimizer** | Quality-critical steps needing iterative refinement |

Show the flow:

```
[Trigger] → [Step/Agent] → [Step/Agent] → [Gate?] → [Step/Agent] → [Output]
```

**Type-specific orchestration:**

| Harness Type | Typical Orchestration |
|-------------|----------------------|
| General Purpose | Agent loop with tool dispatch |
| Specialized | Linear: parse input → execute → verify → output |
| Autonomous | Session loop: read progress → pick feature → work → commit → update progress |
| Hierarchical | Supervisor loop: decompose → delegate → collect → synthesize |
| Multi-Agent | Varies: sequential pipeline, coordinator-routed, handoff chain |
| DAG | Graph traversal with parallel execution of independent nodes |

### 3.3 Platform Architecture

Based on interview platform choice (or recommend if undecided).

**If undecided, recommend based on harness type affinity:**

| Harness Type | Recommended Platform | Reasoning |
|-------------|---------------------|-----------|
| General Purpose | Claude Code or Claude Agent SDK | Native tool loop, flexible |
| Specialized | Claude Code (skills) or Cloud Code | Skills = natural task specs |
| Autonomous | Claude Code + takt | Progress files, git, session management built in |
| Hierarchical | LangGraph | Native supervisor/worker graph patterns |
| Multi-Agent | LangGraph or CrewAI | Multi-agent coordination primitives |
| DAG | LangGraph | Native DAG execution with checkpointing |

Present platform recommendation with reasoning:

```
### Platform Recommendation

**Recommended:** [Platform]

**Why this fits the [Harness Type] pattern:**
- [Reason traced to harness type requirements]
- [Reason traced to interview constraints]

**Why not [Alternative]:** [Reason]
```

Then provide platform-specific architecture:

**Claude Code:** Skill chain design, agent configs, MCP servers, hooks, CLAUDE.md
**LangGraph:** Graph structure, state schema, checkpointing, tool nodes
**CrewAI:** Crew structure, roles, tasks, delegation
**Cloud Code:** Agent definitions, triggers, progress conventions
**Custom:** Runtime design, agent loop, state management, APIs

### 3.4 Tool & Integration Design

For each external system from the interview:

| Tool | System | Operations | Auth | Error Handling |
|------|--------|-----------|------|----------------|
| [Name] | [System] | [Read/Write/Both] | [Method] | [Retry/Fail/Escalate] |

Design principles:
- Fewer tools = better (Vercel cut 80% of tools and got better results)
- Each tool has a narrow, clear contract
- Write operations need rollback when blast radius is Medium+
- Read operations should be idempotent

### 3.5 State & Memory

Based on harness type:

| Harness Type | State Strategy |
|-------------|---------------|
| General Purpose | Context window + tool results. Minimal external state. |
| Specialized | Stateless per task. Input spec → output result. State lives in the queue. |
| Autonomous | Progress file + git + feature list. Filesystem is the memory. |
| Hierarchical | Supervisor maintains plan state. Workers are stateless. |
| Multi-Agent | Shared state (message bus) or explicit handoff context. |
| DAG | Graph state passed between nodes. Checkpoint at each node. |

Define:
- **Working memory:** What stays in context vs externalized
- **Persistent state:** What survives between runs
- **Recovery:** How to resume after failure

### 3.6 Human-in-the-Loop Design

Map approval gates from the interview onto the architecture:

```
[Step 1: Auto] → [Step 2: Auto] → [GATE: Approval] → [Step 3: Auto] → [Output]
```

For each gate:
- What information is presented for review
- Available actions (approve, reject, modify, escalate)
- Timeout behavior
- How context is preserved while waiting

### 3.7 Error Handling & Recovery

For each major step:

| Step | Failure Mode | Detection | Response | Blast Radius |
|------|-------------|-----------|----------|-------------|
| [Step] | [What can go wrong] | [How we know] | [Retry/Skip/Escalate/Halt] | [From interview] |

Type-specific error patterns:

| Harness Type | Key Error Pattern |
|-------------|------------------|
| General Purpose | Infinite tool-call loop. Mitigation: max iterations + loop detection. |
| Specialized | Task spec doesn't match reality. Mitigation: input validation + graceful reject. |
| Autonomous | Drift / regression over sessions. Mitigation: test gates + progress verification. |
| Hierarchical | Worker returns garbage to supervisor. Mitigation: output validation + retry budget. |
| Multi-Agent | Infinite handoff loop. Mitigation: handoff counter + escalation. |
| DAG | Node failure blocks downstream. Mitigation: retry per node + fallback paths. |

### 3.8 Observability & Evaluation

How to know if the harness works:

- **Logging:** What gets logged, where, at what level
- **Metrics:** Map to success criteria from interview
- **Alerts:** What triggers human notification
- **Evaluation:** How to measure agent quality over time

---

## Step 4: Anti-Pattern Scan

Review the architecture against the 26 agentic anti-patterns and harness-specific anti-patterns:

```
## Anti-Pattern Review

### Harness Selection Anti-Patterns
✅ / ⚠️ / ❌ Premature Multi-Agent
✅ / ⚠️ / ❌ DAG for Dynamic Work
✅ / ⚠️ / ❌ Autonomous Without Verification
✅ / ⚠️ / ❌ General Purpose for Batch
✅ / ⚠️ / ❌ Over-tooled Specialized

### Agentic Anti-Patterns
[Check relevant anti-patterns from patterns-anti-patterns.md]

⚠️ Watch for: [Anti-patterns the design is close to, with mitigation]
```

---

## Step 5: Architecture Summary

Present a one-page summary for final approval:

```
## Architecture Summary

**Harness:** [Name]
**Type:** [Selected harness type]
**Platform:** [Choice]
**Agents:** [Count] — [Brief role list]
**Orchestration:** [Pattern name]
**Tools:** [Count] — [Brief list]
**HITL Gates:** [Count] — [Where]
**State:** [Strategy]
**Key Risk:** [Top risk and mitigation]
```

Ask: "Does this architecture look right? Any changes before I save?"

---

## Output

Save to `harness-architecture.md` in the current working directory.

```markdown
# Harness Architecture: [Domain/Problem Name]
**Date:** YYYY-MM-DD
**Source:** harness-interview.md
**Harness Type:** [Selected type]
**Platform:** [Choice]
**Status:** Approved

## Harness Type Selection
[From Step 2 — signals, decision path, recommendation, alternatives]

## Agent Decomposition
[From 3.1 — agent map with roles, tools, autonomy]

## Orchestration
[From 3.2 — pattern, flow diagram]

## Platform Architecture
[From 3.3 — platform-specific design]

## Tool & Integration Design
[From 3.4 — tool inventory with contracts]

## State & Memory
[From 3.5 — state strategy per harness type]

## Human-in-the-Loop
[From 3.6 — gate map and review flows]

## Error Handling & Recovery
[From 3.7 — failure modes, type-specific patterns]

## Observability & Evaluation
[From 3.8 — logging, metrics, alerts]

## Anti-Pattern Review
[From Step 4]

## Architecture Summary
[From Step 5]

## Decisions Log
| Decision | Choice | Requirement | Alternatives Considered |
|----------|--------|-------------|------------------------|
| Harness type | [Type] | [Interview signal] | [What else was viable] |
| [Decision] | [Choice] | [Requirement] | [Alternatives] |
```

---

## Checklist

Before saving:

- [ ] Interview document read and all requirements addressed
- [ ] Harness patterns docs consulted for type selection
- [ ] Agentic patterns docs consulted for internal design
- [ ] Harness type selection confirmed by user before proceeding
- [ ] Each decision traces to a specific interview requirement
- [ ] Alternatives documented for each major decision
- [ ] Agent decomposition starts simple (single agent unless justified)
- [ ] Platform recommendation grounded in harness type affinity + requirements
- [ ] All external systems from interview have tool designs
- [ ] Human gates match interview blast radius ratings
- [ ] Anti-pattern scan completed (harness + agentic)
- [ ] Architecture summary approved by user

---

## After Architecture

Tell the user:

> Architecture saved to `harness-architecture.md`. Next steps:
> - Run `/harness-spec` to generate the detailed implementation specification
> - Or run `/patterns` to deep-dive into a specific pattern choice

$ARGUMENTS - Optional: specific focus area to prioritize (e.g., "focus on tool design", "focus on orchestration")
