---
name: harness-spec
description: "Generate a detailed implementation specification from a harness architecture. Produces agent specs, tool contracts, state schemas, and implementation roadmap. Use after /harness-architect. Triggers on: harness spec, harness specification, implementation spec, agent spec."
source_id: seb-claude-tools
version: 1.0.0
---

# Harness Spec

Generate a detailed, implementation-ready specification from the harness architecture. This spec is the fork point — it can feed into `/harness-build` for direct scaffolding, or into `/feature` → `/sprint` → `start takt` for autonomous implementation.

---

## Prerequisites

This skill requires both source documents. Resolution order:
1. Look for `harness-architecture.md` in the current working directory
2. Look for `harness-interview.md` in the current working directory
3. If either is missing:

> I need the architecture document. Run `/harness-architect` first (which requires `/harness-interview` before it).

**Read both documents before starting.** The architecture provides the what, the interview provides the why. Note the harness type — it determines spec structure.

---

## The Job

1. Read `harness-architecture.md` and `harness-interview.md`
2. Note the harness type — adapt spec depth per type
3. Expand each architectural decision into implementation detail
4. Present spec sections for review (not all at once)
5. Save to `harness-spec.md`

**Important:** This spec must be detailed enough that someone (or takt) can build the harness without clarifying questions. Every interface, every contract, every schema — specified.

---

## Spec Sections

Adapt depth and focus based on the harness type selected in the architecture.

### Section 1: Agent Specifications

For each agent in the architecture:

```markdown
### Agent: [Name]

**Role:** [One-line responsibility]
**Harness type context:** [How this agent fits the selected harness pattern]
**Platform implementation:** [Skill file / LangGraph node / CrewAI agent / etc.]

#### System Prompt
[Full system prompt or template with {{variables}}]

#### Tools
| Tool | Description | Input | Output | Side Effects |
|------|-------------|-------|--------|-------------|
| [name] | [what it does] | [schema] | [schema] | [writes, sends, deletes] |

#### Permissions
- **Can do without approval:** [list]
- **Requires human approval:** [list]
- **Cannot do:** [list]

#### Context Requirements
- **Needs access to:** [files, APIs, conversation history, previous agent output]
- **Context window budget:** [estimated tokens]

#### Success Criteria
[How to verify this agent works correctly]

#### Error Behavior
- **On tool failure:** [retry N / skip / escalate / halt]
- **On uncertain output:** [ask human / fallback / log and continue]
- **On timeout:** [behavior]
```

**Type-specific agent specs:**

| Harness Type | Agent Spec Emphasis |
|-------------|-------------------|
| General Purpose | System prompt quality, tool selection logic, verification loop |
| Specialized | Input schema validation, narrow tool set, output verification criteria |
| Autonomous | Session startup protocol, progress file format, feature list structure, commit conventions |
| Hierarchical | Supervisor's decomposition strategy, worker dispatch logic, result aggregation |
| Multi-Agent | Coordination protocol, handoff format, shared state access rules |
| DAG | Node function contract, input/output schemas, dependency declarations |

### Section 2: Tool Contracts

For each tool in the architecture:

```markdown
### Tool: [Name]

**System:** [External system it connects to]
**Agent(s):** [Which agents use it]

#### Interface
**Input:**
[Schema — JSON Schema, Pydantic model, or TypeScript type depending on platform]

**Output:**
[Schema]

**Errors:**
[Error types with retryable flag]

#### Authentication
- **Method:** [API key / OAuth / service account]
- **Configuration:** [env var name or secret store path]

#### Constraints
- **Rate limit:** [requests per interval]
- **Payload size:** [max]
- **Timeout:** [max execution time]

#### Rollback
- **Reversible:** [Yes/No]
- **Method:** [How to undo if blast radius > Low]
```

**Platform adaptation:**
- Claude Code / MCP → MCP tool specification format
- LangGraph → Python function signature with Pydantic models
- CrewAI → CrewAI tool class definition
- Custom → REST/gRPC/function contract

### Section 3: Orchestration Specification

```markdown
## Orchestration

**Harness Type:** [From architecture]
**Orchestration Pattern:** [From architecture]
**Runtime:** [Platform-specific]
```

**Type-specific orchestration spec:**

**General Purpose:**
```markdown
### Agent Loop
- Max iterations: [N]
- Loop detection: [strategy]
- Verification trigger: [when to self-check]
- Exit conditions: [what ends the loop]
```

**Specialized:**
```markdown
### Task Pipeline
- Input validation: [schema check]
- Execution: [tool sequence]
- Output verification: [success criteria]
- Parallel capacity: [N concurrent tasks]
```

**Autonomous:**
```markdown
### Session Protocol
1. Startup: [pwd, read progress, read features, run tests]
2. Feature selection: [priority logic]
3. Work loop: [implement, test, commit cycle]
4. Progress update: [what to write to progress file]
5. Continuation: [when to end session vs continue]

### Progress File Format
[Exact schema for the progress file]

### Feature List Format
[Exact schema for the feature tracker]
```

**Hierarchical:**
```markdown
### Supervisor Protocol
- Decomposition strategy: [how to break down tasks]
- Worker dispatch: [matching logic]
- Result validation: [what supervisor checks]
- Re-planning: [when to adjust the plan]

### Worker Protocol
- Task acceptance: [input format]
- Execution: [work loop]
- Result format: [output schema]
- Escalation: [when to send back to supervisor]
```

**Multi-Agent:**
```markdown
### Coordination Protocol
- Agent registry: [which agents, capabilities]
- Routing logic: [how work gets to the right agent]
- Handoff format: [context passed between agents]
- Conflict resolution: [when agents disagree]
```

**DAG:**
```markdown
### Graph Definition
[Nodes and edges — can be code, YAML, or visual depending on platform]

### Node Specifications
| Node | Type | Input | Output | Dependencies | Retry | Fallback |
|------|------|-------|--------|-------------|-------|----------|
| [name] | [LLM/function/tool] | [schema] | [schema] | [parent nodes] | [N times] | [action] |

### Parallel Execution
[Which nodes can run concurrently]
```

### Section 4: State Schema

```markdown
## State

### Runtime State
[Schema for the harness's runtime state — adapts per type]

### Persistent State
[What survives between runs/sessions]

### Recovery Protocol
[How to resume after failure — checkpoint strategy]
```

### Section 5: Human-in-the-Loop Specification

For each approval gate:

```markdown
### Gate: [Name]

**Trigger:** [What causes the pause]
**Location:** [After step X, before step Y]

#### Review Interface
- **Presented:** [What the reviewer sees]
- **Format:** [Summary / diff / full output]

#### Actions
| Action | Effect | Continues To |
|--------|--------|-------------|
| Approve | [What happens] | [Next step] |
| Reject | [What happens] | [Back to where] |
| Modify | [What can change] | [Reprocesses from] |

**Timeout:** [Behavior if no response]
**Notification:** [Channel and message]
```

### Section 6: Project Structure

```markdown
## Project Structure

[Tree diagram — adapts per platform and harness type]
```

Provide the complete file tree with one-line descriptions per file.

### Section 7: Configuration & Environment

```markdown
## Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| [NAME] | [Purpose] | [Yes/No] | [Value] |

### Secrets
| Secret | Store | Access Method |
|--------|-------|--------------|
| [Name] | [env/vault/keychain] | [How accessed] |
```

### Section 8: Implementation Roadmap

Break into phases mapping to interview MVP/full vision:

```markdown
## Implementation Roadmap

### Phase 1: MVP
**Goal:** [Maps to interview MVP scope]
**Delivers:** [Which success criteria it validates]
**Components:**
- [ ] [Specific deliverable with file/component name]
- [ ] [Specific deliverable]

### Phase 2: [Next milestone]
**Goal:** [What this adds]
**Depends on:** Phase 1
**Components:**
- [ ] [Specific deliverable]

### Phase N: Full Vision
**Goal:** [Maps to interview full vision]
**Components:**
- [ ] [Remaining deliverables]
```

### Section 9: Testing & Evaluation

```markdown
## Testing

### Unit Tests
| Component | Tests | Method |
|-----------|-------|--------|
| [Tool X] | [API calls, error handling] | [Mock + assert] |
| [Agent Y] | [Tool selection, output format] | [Fixed input + assert] |

### Integration Tests
| Flow | Tests | Method |
|------|-------|--------|
| [Happy path] | [End-to-end completion] | [Test fixtures] |
| [Error recovery] | [Failure → retry → success] | [Inject failures] |
| [Human gate] | [Pause → approve → continue] | [Simulate approval] |

### Evaluation Metrics
| Metric | Target | From Interview |
|--------|--------|---------------|
| [Metric] | [Value] | [Success criterion #N] |
```

---

## Output

Save to `harness-spec.md` in the current working directory.

```markdown
# Harness Specification: [Domain/Problem Name]
**Date:** YYYY-MM-DD
**Source:** harness-architecture.md, harness-interview.md
**Harness Type:** [Type]
**Platform:** [Platform]
**Status:** Approved

## Agent Specifications
[Section 1]

## Tool Contracts
[Section 2]

## Orchestration
[Section 3]

## State
[Section 4]

## Human-in-the-Loop
[Section 5]

## Project Structure
[Section 6]

## Configuration & Environment
[Section 7]

## Implementation Roadmap
[Section 8]

## Testing & Evaluation
[Section 9]
```

---

## Checklist

Before saving:

- [ ] Both source documents read (architecture + interview)
- [ ] Spec adapts to the selected harness type (not generic)
- [ ] Every agent has full spec (prompt, tools, permissions, error behavior)
- [ ] Every tool has input/output/error schemas
- [ ] Orchestration fully defined with type-specific protocol
- [ ] State schema covers runtime + persistent + recovery
- [ ] All human gates have review interface and timeout
- [ ] File structure is complete and platform-appropriate
- [ ] Environment variables and secrets documented
- [ ] Roadmap phases map to interview MVP/full vision
- [ ] Testing covers unit, integration, and evaluation
- [ ] Success metrics trace to interview success criteria
- [ ] Spec is detailed enough to build from without questions (by human or takt)

---

## After Spec

Tell the user:

> Specification saved to `harness-spec.md`. You have two paths:
>
> **Direct build:** Run `/harness-build` to generate the harness scaffolding and runnable artifacts.
>
> **Autonomous build:** Run `/feature` on the spec to create a Feature doc, then `/sprint` → `start takt` to build it autonomously.
>
> Which path?

$ARGUMENTS - Optional: specific section to focus on or regenerate (e.g., "agent specs only", "redo orchestration")
