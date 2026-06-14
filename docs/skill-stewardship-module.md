---
source_id: seb-claude-tools
version: 1.0.0
---

# Skill Stewardship Module

## Purpose

Skill stewardship is infrastructure around skills, not another group of
skills. Its job is to quietly care for the skill system over time:

- Notice when a repeated workflow may deserve a new skill.
- Suggest improvements to skills that show repeated friction.
- Suggest splitting a skill when it has become multiple jobs.
- Suggest retiring or redirecting stale and overlapping skills.
- Keep approved updates reversible.

It must not interrupt normal work unless the user has opted into gating. It
must not silently create, install, or mutate live skills.

## Capabilities

### Discover

Identify a repeated workflow that may deserve a new skill.

### Improve

Suggest small changes to an existing skill: narrower triggers, clearer
prerequisites, better output shape, less bloat, or missing references.

### Split

Suggest splitting a skill when one skill has become two or more distinct jobs.

### Redirect

Suggest redirects when two skills overlap or when one skill supersedes another.

### Retire

Suggest retiring stale skills that no longer have a clear job.

### Verify

Record whether an approved skill change helped in the next relevant use case.

## Non-Goals

- No database.
- No service process.
- No daemon or scheduled audit loop.
- No autonomous live skill updates.
- No auto-publishing generated skills.
- No broad transcript mining by default.
- No skill about every small habit.
- No complex scoring model before simple evidence exists.

## Module Shape

Keep the module separate from the skill source tree:

```text
modules/
└── skill-stewardship/
    ├── README.md
    └── hooks/
```

Platform adapters decide how to install or configure it:

```text
platforms/
└── claude-code/
    └── skill-stewardship/
```

The skills remain the product. The module observes and proposes.

## Claude Code V1

The first Claude Code implementation should have only three moving parts:

1. One hook script that tracks lightweight session signals.
2. One local state file.
3. One suggestion output file.

Suggested local paths:

```text
.agentic-tools/
└── skill-stewardship/
    ├── state.json
    ├── suggestions.md
    ├── drafts/
    └── backups/
```

`state.json` should stay small and local. It should record counters and
timestamps, not full prompts or large transcript excerpts.

## Signals

Track deterministic signals first:

- Session or task start time.
- Turn count.
- Tool count.
- Whether a skill was invoked.
- Whether a slash skill was manually invoked.
- Whether the user dismissed a suggestion.

Do not treat task length alone as proof that a skill should exist. Long work
can be novel, sensitive, or one-off.

## Creation Gate

Before suggesting a new skill, require all of the following:

- The workflow is repeatable across future tasks, not just long.
- The procedure contains concrete computer actions, tool usage, commands, or
  file edits.
- The candidate does not duplicate an existing skill.
- The candidate clears a conservative confidence threshold.

If any check is unclear, write a review note instead of a draft.

## Suggestions

Suggestions should appear only at natural stopping points.

Good:

> This looks repeatable. Create a draft skill?

Actions:

- Show why
- Not now
- Create draft

Avoid mid-task interruptions unless the user has explicitly opted into hard
gates.

## Draft Creation

New skills must be draft-first.

Drafts should not install to `~/.claude/skills/` and should not auto-trigger.
They should be written to a quarantined location until reviewed:

```text
.agentic-tools/skill-stewardship/drafts/<skill-name>/SKILL.md
```

Promotion requires an explicit user decision.

Generated drafts must not be published or installed automatically, even when
the model is highly confident.

## Skill Improvement

Skill improvements should produce a patch or draft, not silently overwrite a
live skill.

For repo-managed skills, git history is the rollback layer.

For installed personal skills outside a git repo, keep one backup layer before
applying an approved update:

```text
.agentic-tools/skill-stewardship/backups/<skill-name>/previous/
```

One backup layer is enough. Each approved update replaces the previous backup.

## Measuring Improvement

Do not try to prove quality automatically in V1.

Record enough context to compare later:

- Skill name.
- Previous version path or git commit.
- Proposed version path.
- Triggering task summary.
- User verdict: improved, worse, unclear.

If an update does not help, roll back to the previous version.

## Odysseus Lessons

Odysseus proves that autoskill generation and improvement can work, but its
implementation is a full product subsystem: live skill storage, multi-user
ownership, UI controls, prompt injection policy, teacher escalation, and a
nightly audit loop.

Agentic Tools should borrow only the quiet guardrails:

- Use a confidence floor before creating a draft.
- Track provenance such as source, confidence, status, and last review time.
- Check for duplicates, trivial skills, and overly broad triggers.
- Keep publish/draft state explicit.
- Rotate manual or offline reviews by least-recently-checked when that exists.
- Never delete, publish, or rewrite live skills without explicit approval.

Do not copy the always-on extractor, auto-publish path, database-backed
lifecycle, or scheduled audit loop into this repo.

## Privacy

Session-local suggestions can be on by default.

Cross-session pattern tracking must be opt-in, local-only, and easy to clear.
Stored data should be redacted and short-lived.

## Implementation Order

1. Document the module boundary.
2. Add a dry-run Claude Code hook that only writes suggestion candidates.
3. Add draft skill generation behind explicit approval.
4. Add one-backup-layer update support for non-git installed skills.
5. Consider stricter gates only after the suggestion quality is proven.
