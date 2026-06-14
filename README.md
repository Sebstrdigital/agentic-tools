# Claude Tools

Custom Claude Code agents, commands, skills, and reference docs by [@Sebstrdigital](https://github.com/Sebstrdigital).

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

### Commands

All command files live in `commands/` and are installed by `./install.sh`.

**Swiss Design UI Toolkit** (`/ui`, `/component`, `/page` -> `/refine` -> `/prd`)

| Command | Description |
|---------|-------------|
| `/ui` | Generate complete HTML+CSS pages in International Typographic Style. |
| `/component` | Generate self-contained UI components such as buttons, cards, modals, and tables. |
| `/page` | Generate full page layouts such as landing, pricing, dashboard, and blog pages. |
| `/refine` | Iterate on generated POCs until the design is approved. |
| `/prd` | Convert approved UI POCs into implementation-ready Product Requirements Documents. |

**UX Copy Toolkit** (`/product-context` -> `/ux-audit` and/or `/brand-voice` -> `/ux-copy`)

| Command | Description |
|---------|-------------|
| `/product-context` | Guided interview that captures product identity, value proposition, aha moment, and user journey. |
| `/ux-audit` | SaaS UX audit that scans user-facing touchpoints and applies established UX frameworks. |
| `/brand-voice` | Guided interview that produces voice traits, tone map, customer language inventory, and competitive positioning. |
| `/ux-copy` | Writes production-ready UX copy for user-facing surfaces using microcopy and CTA frameworks. |

**Client Work**

| Command | Description |
|---------|-------------|
| `/client-proposal` | Generate client-facing proposals with a built-in review for internal leaks. |

**Debugging**

| Command | Description |
|---------|-------------|
| `/debug` | Track a debugging session with a breadcrumb file so work can be resumed without losing context. |

**Harness Design Toolkit** (`/harness-interview` -> `/harness-architect` -> `/harness-spec` -> `/harness-build`)

| Command | Description |
|---------|-------------|
| `/harness-interview` | Guided interview capturing domain, systems, platform, autonomy, scale, and harness-type signals. |
| `/harness-architect` | Selects harness type, designs agent decomposition, orchestration, and tool map. |
| `/harness-spec` | Generates an implementation-ready specification for a harness. |
| `/harness-build` | Generates runnable scaffolding adapted to harness type and platform. |
| `/harness-review` | Deep review of harness implementations against harness patterns and anti-patterns. |
| `/skill-review` | Review Claude Code skill files for format, interaction design, chain integration, and effectiveness. |

**Agentic Design Patterns Toolkit**

| Command | Description |
|---------|-------------|
| `/patterns` | Diagnose problems and analyze architectures against agentic design patterns. |
| `/agent-review` | Deep agentic architecture review with pattern scoring, anti-pattern scanning, and recommendations. |
| `/agent-audit` | Quick pass/fail pre-deployment audit for agentic systems. |

**Project Audit Suite** (`/project-audit` orchestrates the focused audits)

| Command | Description |
|---------|-------------|
| `/project-audit` | Full audit orchestrator that runs applicable audits and produces `docs/audits/` output. |
| `/security-audit` | Security audit across auth, input validation, LLM-specific attacks, data access, APIs, secrets, and infrastructure. |
| `/data-integrity-audit` | Audit of AI-generated query results from user question through displayed answer. |
| `/infra-audit` | Interview-based infrastructure assessment with gap analysis and migration roadmap. |
| `/code-review` | General code quality review across structure, naming, complexity, error handling, and type safety/testing. |
| `/deep-review` | Four-pass code review chain covering framework correctness, resource safety, security, and adversarial absence detection. |

### Skills

Skills live in `skills/` and are installed by `./install.sh`.

| Skill | Description |
|-------|-------------|
| `orchestrator` | Senior-architect delegation mode for decomposing non-trivial work, routing worker agents, and reviewing output. |
| `spec` | Adversarial spec interview for long autonomous runs, including spec output and takt/factory handoff material. |

Supporting files:

- `skills/orchestrator/DELEGATION-TEMPLATE.md`
- `skills/spec/QUESTION-BANK.md`
- `skills/spec/SPEC-FORMAT.md`

### Reference Docs

Reference docs live in `docs/` and are installed by `./install.sh`.

| Doc | Used By |
|-----|---------|
| `docs/agentic-patterns/patterns-master-summary.md` | `/patterns`, `/agent-review`, `/agent-audit`, `/harness-architect` |
| `docs/agentic-patterns/patterns-selection-guide.md` | `/patterns`, `/agent-review`, `/harness-architect` |
| `docs/agentic-patterns/patterns-anti-patterns.md` | `/patterns`, `/agent-review`, `/agent-audit`, `/harness-architect` |
| `docs/harness-patterns/harness-types.md` | `/harness-architect`, `/harness-review` |
| `docs/harness-patterns/harness-selection-guide.md` | `/harness-architect`, `/harness-review` |
| `docs/skill-authoring-guide.md` | `/harness-build`, `/skill-review`, skill authors |
| `docs/deep-review/framework.md` | `/deep-review` |
| `docs/deep-review/resources.md` | `/deep-review` |
| `docs/deep-review/security.md` | `/deep-review` |
| `docs/deep-review/absence.md` | `/deep-review` |
| `docs/deep-review/research-dimensions.md` | `/deep-review` |

### Platforms

Claude Code is the supported platform today. The repo now includes a first
platform manifest and adapter docs as a starting point for a future `ai-tools`
layout that can target Claude Code, Codex, OpenCode, and Pi-mono.

| File | Purpose |
|------|---------|
| `manifest/platform-matrix.yaml` | Declares supported/planned platforms, install targets, artifact types, and retired repo-managed agents. |
| `platforms/claude-code/README.md` | Documents the current Claude Code install paths and compatibility rules. |

## Installation

```bash
git clone git@github.com:Sebstrdigital/claude-tools.git
cd claude-tools
./install.sh
```

The installer copies:

- `agents/*.md` -> `~/.claude/agents/`
- `commands/*.md` -> `~/.claude/commands/`
- `docs/*/*.md` -> matching `~/.claude/docs/<subdir>/`
- `docs/*.md` -> `~/.claude/docs/`
- `skills/<skill-name>/*.md` -> `~/.claude/skills/<skill-name>/`

Safe install behavior:

- If a file with the same name already exists and came from this repo (`source_id: seb-claude-tools`), it gets updated with version tracking.
- If a file with the same name exists but belongs to something else, it installs with a `sebstrdigital-` prefix to avoid conflicts.
- If no conflict exists, it installs directly.

After installing, restart Claude Code to pick up changes.

## Updating

Pull the latest and re-run the installer:

```bash
cd claude-tools
git pull
./install.sh
```

The installer shows version changes, for example `v1.0.0 -> v1.1.0`, and skips files that are already up to date.

## File Structure

```text
claude-tools/
├── agents/
│   ├── builder.md
│   ├── grunt.md
│   ├── heavy.md
│   ├── scout.md
│   └── skeptic.md
├── commands/
│   ├── agent-audit.md
│   ├── agent-review.md
│   ├── brand-voice.md
│   ├── client-proposal.md
│   ├── code-review.md
│   ├── component.md
│   ├── data-integrity-audit.md
│   ├── debug.md
│   ├── deep-review.md
│   ├── harness-architect.md
│   ├── harness-build.md
│   ├── harness-interview.md
│   ├── harness-review.md
│   ├── harness-spec.md
│   ├── infra-audit.md
│   ├── page.md
│   ├── patterns.md
│   ├── prd.md
│   ├── product-context.md
│   ├── project-audit.md
│   ├── refine.md
│   ├── security-audit.md
│   ├── skill-review.md
│   ├── ui.md
│   ├── ux-audit.md
│   └── ux-copy.md
├── docs/
│   ├── agentic-patterns/
│   │   ├── patterns-anti-patterns.md
│   │   ├── patterns-master-summary.md
│   │   └── patterns-selection-guide.md
│   ├── deep-review/
│   │   ├── absence.md
│   │   ├── framework.md
│   │   ├── research-dimensions.md
│   │   ├── resources.md
│   │   └── security.md
│   ├── harness-patterns/
│   │   ├── harness-selection-guide.md
│   │   └── harness-types.md
│   └── skill-authoring-guide.md
├── skills/
│   ├── orchestrator/
│   │   ├── DELEGATION-TEMPLATE.md
│   │   └── SKILL.md
│   └── spec/
│       ├── QUESTION-BANK.md
│       ├── SKILL.md
│       └── SPEC-FORMAT.md
├── manifest/
│   └── platform-matrix.yaml
├── platforms/
│   └── claude-code/
│       └── README.md
├── CLAUDE.md
├── install.sh
└── README.md
```

## Metadata

Repo-managed agent, command, doc, and skill files include YAML frontmatter with:

- `source_id: seb-claude-tools` to identify files from this repo.
- `version: 1.0.0` to track updates.

The installer uses this metadata to update repo-managed files in place while avoiding unmanaged local files.

## License

[MIT](LICENSE)
