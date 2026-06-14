# Skill Stewardship

Skill Stewardship is a small module for observing skill usage and suggesting
skill lifecycle work. It is not itself a skill.

The module is intentionally quiet:

- It does not install hooks by default.
- It does not create live skills.
- It does not mutate existing skills.
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

## Privacy

The hook stores counters, timestamps, and event names. It does not store full
prompts, full transcripts, or command output.
