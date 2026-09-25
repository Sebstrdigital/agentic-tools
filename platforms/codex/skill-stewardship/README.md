# Codex Skill Stewardship

This adapter documents how the Skill Stewardship module can be wired into
Codex hooks. It is not installed automatically yet.

## Advisory Hook

Use the hook script in advisory mode first. For project-local testing, add this
to `.codex/hooks.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/codex-session.js",
            "statusMessage": "Tracking skill stewardship signals"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/codex-session.js",
            "statusMessage": "Tracking skill stewardship signals"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/codex-session.js",
            "statusMessage": "Tracking skill stewardship signals"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/agentic-tools/modules/skill-stewardship/hooks/codex-session.js",
            "statusMessage": "Checking skill stewardship suggestions"
          }
        ]
      }
    ]
  }
}
```

Codex runs command hooks from the session working directory. Use an absolute
script path or a git-root-resolving command in project hooks.

After adding or changing hooks, open `/hooks` in Codex and trust the hook
definition before expecting it to run.

## Default Behavior

The default mode is advisory. It writes suggestions only. It does not block
Codex, create skills, or update installed skills.

The hook writes:

```text
.agentic-tools/skill-stewardship/state.json
.agentic-tools/skill-stewardship/suggestions.md
```

## Drafts

When draft generation is added, Codex drafts should stay quarantined in:

```text
.agentic-tools/skill-stewardship/drafts/
```

Promoting a draft to Codex means copying it into `.agents/skills/` for
repo-scoped use or `$HOME/.agents/skills/` for personal use.

## Guardrails

- no auto-published generated skills
- no live skill mutation from a hook
- no scheduled audit loop
- no transcript storage by default
- no plugin packaging until the hook and draft flow prove useful
