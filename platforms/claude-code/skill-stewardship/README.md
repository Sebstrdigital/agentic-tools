# Claude Code Skill Stewardship

This adapter documents how the Skill Stewardship module can be wired into
Claude Code hooks. It is not installed automatically yet.

## Advisory Hook

Use the hook script in advisory mode first:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/claude-code-session.js"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/claude-code-session.js"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/claude-code-session.js"
          }
        ]
      }
    ]
  }
}
```

The hook writes:

```text
.agentic-tools/skill-stewardship/state.json
.agentic-tools/skill-stewardship/suggestions.md
```

## Default Behavior

The default mode is advisory. It writes suggestions only. It does not block
Claude Code, create skills, or update installed skills.

Gated behavior is intentionally left for a later opt-in version.

## Guardrails

The adapter should stay smaller than a full autoskill runtime:

- no daemon
- no scheduled audit loop
- no auto-published generated skills
- no live skill mutation from a hook
- no transcript storage by default

When draft generation is added, it should write only to:

```text
.agentic-tools/skill-stewardship/drafts/
```

The review step should check that a candidate is repeatable, concrete,
non-duplicative, and above a conservative confidence threshold before the user
is asked to promote it.
