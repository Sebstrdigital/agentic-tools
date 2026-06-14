# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

agentic-tools — a shareable collection of custom Claude Code agents, commands, and reference docs by Sebstrdigital. Installed into `~/.claude/` via `install.sh`.

## Repository

- Remote: git@github.com:Sebstrdigital/agentic-tools.git
- Branch: main

## Structure

```
agents/          → installs to ~/.claude/agents/
docs/            → installs to ~/.claude/docs/
skills/          → category-first source; installs to ~/.claude/skills/
install.sh       → installer script
```

## File Conventions

Every `.md` file has YAML frontmatter with:
- `source_id: seb-claude-tools` — identifies files from this repo (used by installer for safe updates)
- `version: 1.0.0` — semver for tracking updates

Agents and commands also have `name` and `description` fields in their frontmatter.

## Installer (`install.sh`)

Bash script that copies agents, commands, and docs into `~/.claude/`. Safe install logic:

1. If target file has matching `source_id` → compare versions, update or skip
2. If target file exists but has no/different `source_id` → install with `sebstrdigital-` prefix
3. If no target file exists → install directly

The script checks both the original filename and the prefixed filename on subsequent runs.

## Content Groups

**Swiss Design UI Toolkit** — workflow chain: `/ui` or `/component` or `/page` → `/refine` → `/prd`

**Agentic Design Patterns Toolkit** — `/patterns`, `/agent-review`, `/agent-audit` all depend on docs in `docs/agentic-patterns/`

## Adding New Files

When adding new agents, skills, or docs:
1. Include YAML frontmatter with `source_id: seb-claude-tools` and `version: 1.0.0`
2. Add `name` and `description` fields for agents and skills
3. Update the README tables
4. The installer picks up new files automatically (no script changes needed)

## DuaLoop Commands

The `/dua`, `/dua-prd`, and `/tdd` commands are NOT in this repo — they are installed separately from the [DuaLoop](https://github.com/Sebstrdigital/DuaLoop) project.
