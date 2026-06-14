---
name: harness-build
description: "Generate harness scaffolding and runnable artifacts from a harness spec. Produces agent files, tool implementations, configs, and project structure adapted to harness type and platform. Use after /harness-spec. Triggers on: harness build, build harness, generate harness, scaffold harness."
source_id: seb-claude-tools
version: 1.0.0
---

# Harness Build

Generate the actual runnable harness from the specification. Produces all files needed to operate the agentic harness — adapted to both the harness type and the target platform.

---

## Prerequisites

This skill requires the spec document. Resolution order:
1. Look for `harness-spec.md` in the current working directory
2. If not found, look for `harness-architecture.md` (can work from architecture, less precise)
3. If neither found:

> I need the harness specification. Run `/harness-spec` first (which requires `/harness-architect` → `/harness-interview`).

Also read `harness-interview.md` and `harness-architecture.md` if available for naming and context.

**When generating Claude Code skills, also read:**
- `~/.claude/docs/skill-authoring-guide.md` — skill format conventions

---

## The Job

1. Read `harness-spec.md` (and supporting docs)
2. Identify harness type and platform from spec
3. Confirm output plan with user
4. Generate all artifacts
5. Verify consistency with spec
6. Present summary

**Important:** Generate working scaffolding, not boilerplate. Mark unknowns as TODO with specific context. Never guess at business logic. Under-generate rather than generate wrong code.

---

## Step 1: Pre-Generation Confirmation

```
## Build Plan

**Harness Type:** [From spec]
**Platform:** [From spec]
**Output directory:** [Suggest based on harness name]

**Will generate:**
- [ ] [N] agent files ([format per platform])
- [ ] [N] tool implementations ([format per platform])
- [ ] Orchestration config ([type-specific])
- [ ] State management ([type-specific])
- [ ] Configuration files
- [ ] Test scaffolding
- [ ] README with setup instructions

**Phase scope:** Phase 1 (MVP) only, unless you say otherwise.

Proceed?
```

Wait for confirmation.

---

## Step 2: Generate by Harness Type × Platform

The generation matrix — what gets produced depends on both harness type and platform:

### General Purpose Harness

**Claude Code:**
- Main skill file (system prompt + tool instructions + loop behavior)
- MCP server stubs for custom tools
- `CLAUDE.md` with harness conventions
- Hook configs for verification loops

**LangGraph:**
- `agent.py` — ReAct agent with tool binding
- `tools/` — tool implementations
- `state.py` — agent state schema
- `config.py` — settings

**CrewAI / Custom:**
- Agent definition with tools and role
- Tool implementations
- Configuration

---

### Specialized Harness

**Claude Code:**
- Task-specific skill file (narrow system prompt, limited tools, strict output format)
- Input validation logic in skill
- Parallel runner skill (if batch processing specified)
- MCP server stubs for domain tools

**LangGraph:**
- `pipeline.py` — linear task pipeline
- `schema.py` — input/output validation schemas
- `tools/` — domain-specific tools only
- `runner.py` — batch execution with parallelism

**CrewAI / Custom:**
- Narrow agent definition
- Task schema
- Batch runner

---

### Autonomous Harness

**Claude Code:**
- Initializer skill — creates project structure, feature list, progress file, init script
- Executor skill — session startup protocol, work loop, progress update, commit
- Progress file template (`harness-progress.md`)
- Feature list template (`harness-features.json`)
- Continuation hook (reinjects prompt on exit)
- `CLAUDE.md` with session conventions

**LangGraph:**
- `initializer.py` — project setup graph
- `executor.py` — work session graph with checkpointing
- `state.py` — progress and feature state
- `continuation.py` — session management

**Custom:**
- Initializer and executor scripts
- Progress file manager
- Session continuation logic

---

### Hierarchical Harness

**Claude Code:**
- Supervisor skill (decomposition, delegation, synthesis)
- Worker skills (one per worker type)
- Agent definitions for workers (spawned as subagents)
- Task queue file format

**LangGraph:**
- `supervisor.py` — supervisor graph node
- `workers/` — worker graph nodes
- `planner.py` — task decomposition logic
- `state.py` — plan state + worker results
- `graph.py` — full supervisor-worker graph

**CrewAI:**
- Crew definition with hierarchical process
- Agent definitions per role
- Task definitions
- Manager agent config

---

### Multi-Agent Harness

**Claude Code:**
- Agent definitions (one per specialist)
- Coordinator skill (routing logic)
- Handoff protocol in CLAUDE.md
- Shared state file format

**LangGraph:**
- `agents/` — one module per agent
- `coordinator.py` — routing/dispatch
- `handoff.py` — context transfer
- `graph.py` — multi-agent graph

**CrewAI:**
- Crew with sequential/parallel process
- Agent definitions per role
- Task definitions with dependencies

---

### DAG Harness

**Claude Code:**
- Skill per major node (if nodes are complex)
- Orchestrator skill that executes the graph
- Node definitions with dependencies

**LangGraph:**
- `graph.py` — full DAG definition with nodes and edges
- `nodes/` — one function per node
- `state.py` — graph state with per-node results
- `config.py` — retry and fallback settings

**Custom:**
- Graph definition (YAML or code)
- Node implementations
- Execution engine with topological sort
- Checkpoint manager

---

## Step 3: Supporting Files (All Types)

#### README.md
```markdown
# [Harness Name]

[Description from interview]

## Harness Type
[Type] — [one-line explanation of why]

## Quick Start
[Platform-specific setup and run instructions]

## Architecture
[Brief overview with link to harness-architecture.md]

## Agents
| Agent | Role | Tools |
|-------|------|-------|
| [Name] | [Role] | [Tool list] |

## Configuration
| Variable | Description | Required |
|----------|-------------|----------|
| [NAME] | [Purpose] | [Yes/No] |
```

#### .env.example
Generated from spec configuration section. No real secrets.

#### Test Scaffolding
- Test files for each agent
- Test files for each tool (mock external systems)
- Integration test skeleton for end-to-end flow
- Type-specific test patterns:

| Harness Type | Key Test |
|-------------|----------|
| General Purpose | Tool selection accuracy, loop termination |
| Specialized | Input validation, output correctness, parallel safety |
| Autonomous | Progress persistence, session resume, regression detection |
| Hierarchical | Decomposition quality, worker result aggregation |
| Multi-Agent | Handoff correctness, no infinite routing |
| DAG | Dependency order, parallel execution, node retry |

---

## Step 4: Consistency Verification

```
## Verification

Checking generated files against spec...

✅ Agents: [N/N] generated
✅ Tools: [N/N] generated (M with TODOs for business logic)
✅ Orchestration: Matches spec [type]-specific protocol
✅ State: Schema matches spec
✅ Config: All env vars in .env.example
✅ Human gates: [N/N] implemented
✅ Tests: Scaffolding covers all components
⚠️ TODOs: [N] items requiring manual implementation
❌ [Any issues]
```

---

## Step 5: Summary

```
## Build Complete

**Harness type:** [Type]
**Platform:** [Platform]
**Output:** [directory path]
**Files:** [count]

### Generated
| File | Type | Status |
|------|------|--------|
| [path] | [Agent/Tool/Config/Test] | [Complete / TODOs] |

### TODOs
1. [ ] [file:line] — [What and why it couldn't be auto-generated]

### Next Steps
- [ ] Review generated files
- [ ] Fill in TODOs
- [ ] Set up environment (cp .env.example .env)
- [ ] Run tests
- [ ] [Type-specific next steps]
```

---

## Rules

- **Never generate credentials or secrets** — placeholders only
- **Mark unknowns as TODO** with enough context to implement (reference spec section)
- **Follow platform conventions** — generated code should look native, not templated
- **Preserve spec traceability** — comment references to spec sections
- **MVP only** — don't generate Phase 2+ unless explicitly asked
- **Test scaffolding must be runnable** — structure and assertions correct even if TODOs exist
- **Claude Code skills must follow `skill-authoring-guide.md`** — correct frontmatter, guard clauses, handoffs

---

## Checklist

Before presenting as complete:

- [ ] Pre-generation plan confirmed by user
- [ ] Generation adapts to harness type (not generic scaffolding)
- [ ] Generation adapts to platform (not generic code)
- [ ] All agents from spec have files
- [ ] All tools have implementations or marked stubs
- [ ] Orchestration matches spec's type-specific protocol
- [ ] State management matches spec
- [ ] Human gates implemented per spec
- [ ] README with setup instructions
- [ ] .env.example with all variables
- [ ] Test scaffolding for all components
- [ ] Consistency verification passed
- [ ] TODOs are specific and actionable
- [ ] No secrets in generated files
- [ ] Claude Code skills follow authoring guide (if applicable)

---

## After Build

Tell the user:

> Harness generated in `[directory]`. Review the files and fill in [N] TODOs.
>
> Quality checks:
> - `/agent-review` — review against agentic design patterns
> - `/agent-audit` — deployment readiness checklist

$ARGUMENTS - Optional: specific component to (re)generate (e.g., "tools only", "regenerate supervisor")
