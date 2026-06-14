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
