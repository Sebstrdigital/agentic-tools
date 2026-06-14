---
name: harness-interview
description: "Guided interview to capture requirements for an agentic harness. Covers domain, systems, platform, autonomy, scale, and harness-type signals. First step in the harness toolkit chain. Triggers on: harness interview, design harness, agentic harness, automation interview, agent architecture interview."
source_id: seb-claude-tools
version: 1.0.0
---

# Harness Interview

Guided interview to capture everything needed to architect an agentic harness. Produces a structured requirements document that feeds into `/harness-architect`.

---

## The Job

1. Run a guided interview in 6 phases (2-3 questions per batch, wait for answers)
2. Reflect back what was captured after each phase
3. Allow revisions and backtracking
4. Compile findings into `harness-interview.md`
5. Hand off to `/harness-architect`

**Important:** This is an interview, not a monologue. Ask questions in batches, wait for answers, reflect back what you heard, then continue. If an answer reveals something that affects a previous phase, flag it and offer to revise.

---

## Interview Flow

### Phase 1: Domain & Problem

Understand what we're automating and why.

Ask:

1. **What domain or industry is this for?** Give me the context — what does the business do, who are the stakeholders?
2. **What specific workflow or problem are we automating?** Walk me through the current manual process, step by step. What triggers it, what are the steps, what's the output?
3. **Why automate now?** What are the pain points — cost, speed, errors, scale limitations? What's the cost of doing nothing?

**Why these questions:** The domain and manual workflow define the agent's job. The "why now" surfaces constraints and priorities that shape every downstream decision.

After answers, reflect back:

> **Captured:** [Summary of domain, workflow steps, and motivation]
> Anything to add or correct before we move on?

### Phase 2: Systems & Data

Map the technical landscape the harness must operate in.

Ask:

1. **What systems, APIs, databases, or tools does this workflow touch?** List everything — internal systems, SaaS platforms, file stores, communication channels. For each, note if you have API access or if it's manual-only today.
2. **What data does the workflow consume and produce?** What goes in, what comes out, and what format is it in?
3. **What's the data readiness situation?** Is data clean and accessible, or siloed and messy? Are there authentication hurdles (OAuth, API keys, service accounts)?

**Why these questions:** The system map determines tool design. Data readiness is the #1 blocker for agentic systems — surface it early.

After answers, reflect back:

> **Systems mapped:** [List of systems with access status]
> **Data flow:** [Input → Processing → Output summary]
> **Data risks:** [Any readiness concerns flagged]

### Phase 3: Workflow Nature & Harness Signals

Capture the signals that determine which harness type fits. These questions directly feed the harness selection decision in `/harness-architect`.

Ask:

1. **How predictable is the workflow?** Think about it on a spectrum:
   - A. **Fully predictable** — same steps every time, I could draw it as a flowchart
   - B. **Mostly predictable** — standard path with some conditional branches
   - C. **Partially dynamic** — the general shape is known but details vary per run
   - D. **Fully dynamic** — the agent needs to figure out what to do based on the situation
2. **How long does one run of this workflow take?** (Minutes, hours, days? Single session or needs to span multiple sessions?)
3. **Is this one type of task repeated many times, or a complex task done once?** (e.g., "process 200 invoices/day" vs "build a feature over 3 days")

**Why these questions:** These are the primary signals for harness type selection:
- Predictable + known steps → DAG Harness
- Narrow + repeatable + parallel → Specialized Harness
- Single domain + dynamic → General Purpose Harness
- Multi-session + self-directed → Autonomous Harness
- Cross-domain + specialists needed → Multi-Agent Harness
- Ambiguous + needs decomposition → Hierarchical Harness

After answers, reflect back:

> **Workflow nature:** [Predictable/dynamic, duration, single/batch]
> **Initial harness signal:** [Which harness type(s) these signals point toward — preliminary, will be confirmed in architect step]

### Phase 4: Platform & Constraints

Determine where and how this harness will run.

Ask:

1. **Do you have a platform preference?** Options include:
   - **Claude Code** — prompt-driven harness with skills, agents, and MCP servers. Best for developer workflows and tool-heavy automation.
   - **Cloud Code** — Anthropic's hosted agent runtime. Best for production deployments without infrastructure management.
   - **LangGraph** — Python graph-based state machines. Most control, best for complex stateful workflows.
   - **CrewAI** — role-based multi-agent teams. Fastest setup for team-of-agents patterns.
   - **Custom loop** — your own orchestration code. Full control, full responsibility.
   - **Undecided** — that's fine, the architect step will recommend based on requirements.
2. **What are the hard constraints?** Budget ceiling, latency requirements (real-time / near-real-time / batch), compliance (GDPR, HIPAA, SOC2), existing infrastructure you must use?
3. **What's the deployment environment?** Cloud provider, container orchestration, CI/CD, or does this run locally?

**Why these questions:** Platform choice shapes implementation. Constraints eliminate options early. Some harness types have natural platform affinities (e.g., DAG → LangGraph, Autonomous → Claude Code + takt).

If the user says "undecided," note it — don't push. The architect step will recommend based on the full picture.

After answers, reflect back:

> **Platform:** [Choice or "undecided — architect will recommend"]
> **Constraints:** [List of hard constraints]
> **Environment:** [Deployment context]

### Phase 5: Autonomy & Safety

Define the boundaries of agent authority.

Ask:

1. **Which decisions MUST have human approval before the agent acts?** Think about where an error would be costly, embarrassing, or irreversible. Examples: sending money, publishing content, deleting data, contacting customers.
2. **What's the blast radius of an agent error?** Rate each major workflow step:
   - **Low** — easily correctable, internal only
   - **Medium** — requires effort to fix, may affect users
   - **High** — expensive/hard to reverse, external impact
   - **Critical** — regulatory, financial, or safety consequences
3. **What's your desired level of autonomy?**
   - A. **Fully autonomous** — agent runs end-to-end, human reviews output
   - B. **Approval gates** — agent pauses at defined checkpoints for human sign-off
   - C. **Supervised** — human-in-the-loop at every major step
   - D. **Advisory** — agent suggests, human executes

**Why these questions:** Over-permissioned agents are a top failure pattern. Under-permissioned agents defeat the purpose. The autonomy level also influences harness type — fully autonomous points toward Autonomous Harness, supervised points toward General Purpose.

After answers, reflect back:

> **Approval gates:** [List of steps requiring human approval]
> **Risk map:** [Step → blast radius rating]
> **Autonomy level:** [A/B/C/D with notes]

### Phase 6: Scale & Success

Define what done looks like.

Ask:

1. **How often does this workflow run?** On-demand (triggered by event), scheduled (daily/weekly), continuous, or variable?
2. **What volume or throughput is expected?** How many runs per day/week? How much data per run? Will this scale over time?
3. **What specific, measurable outcomes define success?** Not "works well" — give me numbers. Examples: "Processes 50 invoices/day with <2% error rate", "Reduces response time from 4 hours to 15 minutes", "Handles 80% of tickets without escalation."
4. **What is MVP scope vs full vision?** What's the smallest version that delivers value? What does the full version look like?

**Why these questions:** Without measurable success criteria, you can't evaluate if the harness works. MVP scope prevents over-engineering the first iteration. Volume and frequency also influence harness type — high volume + repeatable = Specialized.

After answers, reflect back:

> **Frequency:** [Schedule/trigger pattern]
> **Scale:** [Volume expectations]
> **Success criteria:** [Numbered list of measurable outcomes]
> **MVP:** [Minimal scope]
> **Full vision:** [Complete scope]

---

## Optional: Domain Research

**This is NOT default.** Only activate when the user explicitly requests research during the interview.

Triggers: "research this", "look into X", "what's out there for Y", "find APIs for Z"

When triggered:

1. Use web search to research the requested topic
2. Present findings in a structured summary
3. Ask if findings change any previous answers
4. Continue the interview

Common research requests:
- Domain-specific automation tools already on the market
- Available APIs for systems mentioned in Phase 2
- Compliance requirements for the domain
- Platform comparison for their specific use case

---

## Completion

After all phases, compile the full interview. Before saving, present a final summary:

```
## Interview Summary

**Domain:** [one-line]
**Problem:** [one-line]
**Workflow nature:** [predictable/dynamic, duration, single/batch]
**Harness signal:** [preliminary type recommendation]
**Platform:** [choice or undecided]
**Autonomy:** [level]
**MVP:** [one-line]
**Key success metric:** [the most important one]

Ready to save? Anything to add or change?
```

---

## Output

Save to `harness-interview.md` in the current working directory.

```markdown
# Harness Interview: [Domain/Problem Name]
**Date:** YYYY-MM-DD
**Status:** Complete

## Domain & Problem
### Domain
[Industry, business context, stakeholders]

### Current Workflow
[Step-by-step manual process — trigger, steps, output]

### Pain Points & Motivation
[Why automate, cost of inaction]

## Systems & Data
### System Map
| System | Type | Access | Auth | Notes |
|--------|------|--------|------|-------|
| [Name] | [API/DB/SaaS/File] | [Yes/No/Partial] | [Method] | [Limitations] |

### Data Flow
**Input:** [What goes in, format, source]
**Processing:** [Transformations, decisions]
**Output:** [What comes out, format, destination]

### Data Readiness
[Clean/messy, siloed/accessible, blockers]

## Workflow Nature & Harness Signals
**Predictability:** [A/B/C/D — fully predictable to fully dynamic]
**Duration:** [Minutes/hours/days per run]
**Pattern:** [Single complex task / repeated narrow tasks / hybrid]
**Preliminary harness signal:** [Which type(s) these signals point toward]

## Platform & Constraints
**Platform:** [Choice or "undecided"]
**Budget:** [Ceiling or "flexible"]
**Latency:** [Real-time / near-real-time / batch]
**Compliance:** [Requirements or "none identified"]
**Environment:** [Cloud/local, infrastructure details]

## Autonomy & Safety
**Autonomy Level:** [A/B/C/D with description]

### Approval Gates
| Step | Blast Radius | Human Approval Required |
|------|-------------|------------------------|
| [Step] | [Low/Med/High/Critical] | [Yes/No] |

### Escalation
[What happens when the agent is uncertain]

## Scale & Success
**Frequency:** [On-demand / scheduled / continuous]
**Volume:** [Throughput expectations]
**Timeline:** [MVP target, full vision target]

### Success Criteria
1. [Measurable outcome]
2. [Measurable outcome]
3. [Measurable outcome]

### MVP Scope
[Minimal valuable version]

### Full Vision
[Complete scope]

## Research Findings
[If any research was conducted, summarized here. Otherwise: "No research requested."]

## Open Questions
[Unresolved items or things to explore in the architect phase]
```

---

## Checklist

Before saving:

- [ ] All 6 core phases completed (research is optional)
- [ ] Each phase reflected back and confirmed by user
- [ ] System map includes access status and auth method for each system
- [ ] Harness signals captured (predictability, duration, pattern)
- [ ] Blast radius rated for each major workflow step
- [ ] Success criteria are specific and measurable (numbers, not adjectives)
- [ ] MVP scope is clearly separated from full vision
- [ ] Platform choice recorded (or explicitly marked undecided)
- [ ] Open questions captured for architect phase

---

## After Interview

Tell the user:

> Interview saved to `harness-interview.md`. Run `/harness-architect` to design the agent architecture based on these requirements.

$ARGUMENTS - Optional: domain or problem name to seed the interview (e.g., "invoice processing", "customer support triage")
