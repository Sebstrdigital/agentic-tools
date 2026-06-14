# Skill Stewardship

Skill Stewardship is a small module for observing skill usage and suggesting
skill lifecycle work. It is not itself a skill.

The module is intentionally quiet:

- It does not install hooks by default.
- It does not create live skills.
- It does not mutate existing skills.
- It does not auto-publish generated skills.
- It does not run a daemon or scheduled audit loop.
- It writes local suggestions that a user can ignore, review, or promote.

## Claude Code V1

The first implementation is one advisory hook script:

```text
modules/skill-stewardship/hooks/claude-code-session.js
```

The hook reads Claude Code hook JSON from stdin, updates a small state file,
and appends a suggestion when a session looks long enough to review and no
skill usage has been observed.

Default output path:

```text
.agentic-tools/skill-stewardship/
├── state.json
└── suggestions.md
```

## Modes

The hook defaults to advisory mode.

```bash
AGENTIC_TOOLS_STEWARD_MODE=advisory
```

Advisory mode only writes local files. A later gated mode may block a Claude
Code stop event, but that should remain opt-in.

## Thresholds

Defaults are deliberately conservative:

- 6 user turns
- 20 tool events
- 30 minutes elapsed

Any one threshold can create a suggestion, but only when no skill usage has
been observed.

Thresholds are only a prompt to review. A long task is not enough to create a
skill. A candidate still needs to look repeatable, concrete, non-duplicative,
and worth preserving.

## Draft Policy

Generated skill candidates belong in draft quarantine, not the live skill
install path:

```text
.agentic-tools/skill-stewardship/drafts/<skill-name>/SKILL.md
```

Promotion is an explicit user action. Repo-managed skills should rely on git
history for rollback; personal installed skills can use one previous-version
backup before an approved update.

## Borrowed Guardrails

Odysseus has a complete autoskill subsystem with extraction, audit, teacher
repair, UI, and scheduled review. This module intentionally keeps only the
small useful parts:

- confidence floor before draft creation
- duplicate and triviality checks
- provenance metadata
- explicit draft/published state
- reversible approved changes

## Privacy

The hook stores counters, timestamps, and event names. It does not store full
prompts, full transcripts, or command output.
