# Agentic Tools

Custom agentic AI agents, Claude Code skills, and reference docs by [@Sebstrdigital](https://github.com/Sebstrdigital).

## What's Included

### Agents

Active agents live in `agents/` and are installed by `./install.sh`.

| Agent | Description |
|-------|-------------|
| `scout` | Read-only reconnaissance worker for codebase investigation, execution tracing, external repo/doc surveys, and evidence-backed findings. |
| `builder` | Standard implementation worker for scoped stories, fixes, tests, and refactors with clear validation commands. |
| `heavy` | Senior implementation worker for hard debugging, ambiguous root-cause hunts, cross-cutting refactors, and security-sensitive work. |
| `skeptic` | Adversarial read-only reviewer that tries to refute diffs, claims, and validations before work is accepted. |
| `grunt` | Mechanical-work worker for low-judgment tasks such as renames, doc syncs, formatting sweeps, bulk searches, and known-file installs. |

Retired repo-managed agents are removed from installed Claude Code agents by `install.sh` when they contain this repo's `source_id`.

### Skills

Skills live in category-first folders under `skills/` and are installed by `./install.sh` to `~/.claude/skills/<skill-name>/`. This follows the Matt Pocock-style layout:

```text
skills/
├── engineering/
├── productivity/
└── misc/
```

Source paths are:

- `skills/engineering/<skill-name>/`
- `skills/productivity/<skill-name>/`
- `skills/misc/<skill-name>/`

Each skill has a required `SKILL.md`. Supporting files live beside it.

**Engineering**

| Skill | Description |
|-------|-------------|
| `agent-audit` | Quick pass/fail pre-deployment audit for agentic systems. |
| `agent-review` | Deep agentic architecture review with pattern scoring, anti-pattern scanning, and recommendations. |
| `code-review` | General code quality review across structure, naming, complexity, error handling, and type safety/testing. |
| `data-integrity-audit` | Audit AI-generated query results from user question through displayed answer. |
| `deep-review` | Four-pass code review chain covering framework correctness, resource safety, security, and adversarial absence detection. |
| `harness-interview` | Guided interview capturing domain, systems, platform, autonomy, scale, and harness-type signals. |
| `harness-architect` | Selects harness type, designs agent decomposition, orchestration, and tool map. |
| `harness-spec` | Generates an implementation-ready specification for a harness. |
| `harness-build` | Generates runnable scaffolding adapted to harness type and platform. |
| `harness-review` | Deep review of harness implementations against harness patterns and anti-patterns. |
| `infra-audit` | Interview-based infrastructure assessment with gap analysis and migration roadmap. |
| `patterns` | Diagnose problems and analyze architectures against agentic design patterns. |
| `project-audit` | Full audit orchestrator that runs applicable audits and produces `docs/audits/` output. |
| `security-audit` | Security audit across auth, input validation, LLM-specific attacks, data access, APIs, secrets, and infrastructure. |
| `spec` | Adversarial spec interview for long autonomous runs, including takt/factory handoff material. |

**Productivity**

| Skill | Description |
|-------|-------------|
| `orchestrator` | Senior-architect delegation mode for decomposing non-trivial work, routing worker agents, and reviewing output. |
| `ui` | Generate complete HTML+CSS pages in International Typographic Style. |
| `component` | Generate self-contained UI components such as buttons, cards, modals, and tables. |
| `page` | Generate full page layouts such as landing, pricing, dashboard, and blog pages. |
| `refine` | Iterate on generated POCs until the design is approved. |
| `prd` | Convert approved UI POCs into implementation-ready Product Requirements Documents. |
| `product-context` | Guided interview that captures product identity, value proposition, aha moment, and user journey. |
| `brand-voice` | Guided interview that produces voice traits, tone map, customer language inventory, and competitive positioning. |
| `ux-audit` | SaaS UX audit that scans user-facing touchpoints and applies established UX frameworks. |
| `ux-copy` | Writes production-ready UX copy for user-facing surfaces using microcopy and CTA frameworks. |

**Misc**

| Skill | Description |
|-------|-------------|
| `client-proposal` | Generate client-facing proposals with a built-in review for internal leaks. |
| `debug` | Track a debugging session with a breadcrumb file so work can be resumed without losing context. |
| `skill-review` | Review Claude Code skill files for format, interaction design, chain integration, and effectiveness. |

### Reference Docs

Reference docs live in `docs/` and are installed by `./install.sh`.

| Doc | Used By |
|-----|---------|
| `docs/agentic-patterns/patterns-master-summary.md` | `patterns`, `agent-review`, `agent-audit`, `harness-architect` |
| `docs/agentic-patterns/patterns-selection-guide.md` | `patterns`, `agent-review`, `harness-architect` |
| `docs/agentic-patterns/patterns-anti-patterns.md` | `patterns`, `agent-review`, `agent-audit`, `harness-architect` |
| `docs/harness-patterns/harness-types.md` | `harness-architect`, `harness-review` |
| `docs/harness-patterns/harness-selection-guide.md` | `harness-architect`, `harness-review` |
| `docs/skill-authoring-guide.md` | `harness-build`, `skill-review`, skill authors |
| `docs/deep-review/framework.md` | `deep-review` |
| `docs/deep-review/resources.md` | `deep-review` |
| `docs/deep-review/security.md` | `deep-review` |
| `docs/deep-review/absence.md` | `deep-review` |
| `docs/deep-review/research-dimensions.md` | `deep-review` |
| `docs/skill-stewardship-module.md` | Skill stewardship module design and non-goals |

### Platforms

Claude Code is the supported platform today. The repo includes a first platform manifest and adapter docs as a starting point for targeting Claude Code, Codex, OpenCode, and Pi-mono.

| File | Purpose |
|------|---------|
| `manifest/platform-matrix.yaml` | Declares supported/planned platforms, install targets, artifact types, and retired repo-managed artifacts. |
| `platforms/claude-code/README.md` | Documents the current Claude Code install paths and compatibility rules. |

### Modules

Modules are optional infrastructure around the agent/skill system. They are not installed by default.
They must stay advisory unless a user explicitly opts into stronger behavior.

| Module | Purpose |
|--------|---------|
| `modules/skill-stewardship/` | Advisory skill lifecycle module for suggesting new skills, improvements, splits, redirects, retirements, and later verification. |
| `platforms/claude-code/skill-stewardship/` | Claude Code hook wiring notes for the Skill Stewardship module. |

## Installation

```bash
git clone git@github.com:Sebstrdigital/agentic-tools.git
cd agentic-tools
./install.sh
```

The installer copies:

- `agents/*.md` -> `~/.claude/agents/`
- `docs/*/*.md` -> matching `~/.claude/docs/<subdir>/`
- `docs/*.md` -> `~/.claude/docs/`
- `skills/<category>/<skill-name>/*.md` -> `~/.claude/skills/<skill-name>/`

It also removes repo-managed legacy command files from `~/.claude/commands/` after their source files migrate to skills. User-owned commands are left untouched.

Safe install behavior:

- If a file with the same name already exists and came from this repo (`source_id: seb-claude-tools`), it gets updated with version tracking.
- If a file with the same name exists but belongs to something else, it installs with a `sebstrdigital-` prefix to avoid conflicts.
- If no conflict exists, it installs directly.

After installing, restart Claude Code to pick up changes.

## Updating

Pull the latest and re-run the installer:

```bash
cd agentic-tools
git pull
./install.sh
```

The installer shows version changes, for example `v1.0.0 -> v1.1.0`, and skips files that are already up to date.

## File Structure

```text
agentic-tools/
├── agents/
│   ├── builder.md
│   ├── grunt.md
│   ├── heavy.md
│   ├── scout.md
│   └── skeptic.md
├── docs/
├── manifest/
│   └── platform-matrix.yaml
├── modules/
│   └── skill-stewardship/
├── platforms/
│   └── claude-code/
│       ├── README.md
│       └── skill-stewardship/
├── skills/
│   ├── engineering/
│   ├── misc/
│   └── productivity/
├── CLAUDE.md
├── install.sh
└── README.md
```

## Metadata

Repo-managed agent, doc, and skill files include YAML frontmatter with:

- `source_id: seb-claude-tools` to identify files from this repo.
- `version: 1.0.0` to track updates.

The installer uses this metadata to update repo-managed files in place while avoiding unmanaged local files.

## License

[MIT](LICENSE)
