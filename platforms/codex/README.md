# Codex Adapter

Codex support is adapter-ready but not installed by `install.sh` yet.

## Current Mapping

Codex uses different local paths from Claude Code:

- Repo skills: `.agents/skills/<skill-name>/SKILL.md`
- User skills: `$HOME/.agents/skills/<skill-name>/SKILL.md`
- Project hooks: `.codex/hooks.json`
- User hooks: `$HOME/.codex/hooks.json`

Codex can also package reusable workflows as plugins. Skills remain the
authoring format; plugins are the distribution unit when we want to bundle
skills with hooks, MCP config, apps, or marketplace metadata.

## Skills

This repo still stores source skills in category folders:

```text
skills/<category>/<skill-name>/SKILL.md
```

For Codex, copy or symlink selected skills into one of Codex's skill roots:

```text
.agents/skills/<skill-name>/SKILL.md
```

or:

```text
$HOME/.agents/skills/<skill-name>/SKILL.md
```

Do not flatten all skills automatically until conflict behavior and platform
metadata are tested. Codex does not merge duplicate skill names.

## Hooks

Use project-local hooks while testing repo behavior, and user hooks only for
personal cross-repo behavior. Codex requires non-managed hooks to be reviewed
and trusted with `/hooks`.

Skill Stewardship uses:

```text
modules/skill-stewardship/hooks/codex-session.js
```

See `platforms/codex/skill-stewardship/README.md` for the hook config.

## Guardrails

Codex support must follow the same module boundary as Claude Code:

- no automatic live skill creation
- no automatic publish/install
- no scheduled audit loop
- no transcript storage by default
- suggestions and drafts stay local until explicitly promoted
