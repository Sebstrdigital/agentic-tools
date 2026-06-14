---
source_id: seb-claude-tools
version: 1.0.0
---

# Spec format — tasks/spec-<name>.md

```markdown
# Spec: <name>

## Goal (falsifiable)
One paragraph. Must contain a check an agent can run WITHOUT the user
watching: a command, an observable behavior, a measurable state. If success
can't be checked unattended, the goal is not run-ready.

## Non-goals / scope edges
Precise boundaries. Each edge states WHERE it applies
("new edit action only — existing cancellation flow unchanged").

## Stories
### US-001: <title>
**Description:** As a <user>, I want <feature> so that <benefit>.
**Acceptance criteria:** (behavioral, max 3-4)
- [ ] <observable outcome>
**Depends on:** [] | [US-000]
**Complexity:** simple | complex

## Guardrails
Pre-loaded constraints from known failure modes of this repo/reviewer, e.g.:
- Escape user-supplied HTML in emails
- Omitted optional fields must not null-overwrite existing data
- Atomic eligibility check before state transition

## Run budget
- Max iterations per story: <n>   (default 6; 3 is too tight for medium cards)
- Park when: <conditions — e.g. same must_fix recurs twice; new must_fix
  introduced by a fix; any design decision surfaces>
- Escalate to human when: <conditions>

## Open decisions
MUST BE EMPTY before an autonomous run. Anything here = not run-ready.
```

## sprint.json emission (takt)

Reuse the takt schema verbatim — the whole execution chain consumes it:

```json
{
  "project": "<name>",
  "branchName": "takt/<kebab>",
  "description": "<goal paragraph>",
  "userStories": [{
    "id": "US-001",
    "title": "...",
    "description": "As a <user>...",
    "acceptanceCriteria": ["...", "..."],
    "priority": 1,
    "size": "small|medium|large",
    "complexity": "simple|complex",
    "passes": false,
    "startTime": "",
    "endTime": "",
    "dependsOn": [],
    "knownIssues": []
  }],
  "waves": []
}
```

Story ids are `US-###` — takt's wave/archive logic assumes this format.
Guardrails have no native field: prepend them to `description` of each
affected story ("Guardrails: ...") so workers always see them.

When emitting sprint.json, ALSO emit `.takt/scenarios.json` — BDD scenarios
derived from each story's catch-AC, format
`{ "id", "storyId", "given", "when", "then", "type": "behavioral|contract|edge" }`.
Scenarios stay hidden from workers; only the verifier reads them
(anti-gaming — preserve this split).

## Factory card body emission (dua-factory)

The factory's story schema is NOT takt's. The card body carries a fenced JSON
block with stories shaped (src/foreman/types.ts):

```json
{ "id": "US-001", "title": "...", "body": "...", "depends_on": [] }
```

Only `id` and `title` are validated; everything the worker must know —
description, acceptance criteria, guardrails, scope edges — goes INTO the
free-text `body` field (snake_case `depends_on`, not `dependsOn`). Unknown
keys are silently ignored, so emitting takt fields here LOSES the AC.
Do not emit `test_command` — the factory strips it from card-sourced stories
as an injection guard. Free-text card comments are ignored by the rework
flow; only body content survives re-triggering.
