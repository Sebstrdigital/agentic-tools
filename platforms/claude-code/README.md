# Claude Code Adapter

Claude Code is the currently supported platform.

## Installed Paths

`install.sh` writes repo-managed files to:

- `agents/*.md` -> `~/.claude/agents/`
- `commands/*.md` -> `~/.claude/commands/`
- `docs/*/*.md` -> matching `~/.claude/docs/<subdir>/`
- `docs/*.md` -> `~/.claude/docs/`
- `skills/<skill-name>/*.md` -> `~/.claude/skills/<skill-name>/`

## Compatibility

Managed files use:

- `source_id: seb-claude-tools`
- `version: 1.0.0`

Future cross-platform work should introduce `seb-ai-tools` with
`seb-claude-tools` as an accepted alias so existing installs keep updating.

## Cleanup

The installer removes retired repo-managed agents from `~/.claude/agents/`.
It only removes files that contain this repo's `source_id`; user-owned files
with the same names are left untouched.
