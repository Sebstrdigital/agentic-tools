---
source_id: seb-claude-tools
version: 1.0.0
---

# Skill Authoring Guide

Reference for writing Claude Code skills. Used by `/harness-build` when generating Claude Code harness skills, and as a general guide for creating new skills.

---

## File Format

Claude Code skills are folders with a required `SKILL.md` file:

```text
~/.claude/skills/<skill-name>/SKILL.md
```

Project-scoped skills can also live in:

```text
.claude/skills/<skill-name>/SKILL.md
```

Existing command files in `~/.claude/commands/*.md` still work and create slash commands, but new reusable workflows should usually be skills because skills can auto-trigger, bundle supporting files, and keep large references out of context until needed.

### Required Frontmatter

```yaml
---
name: skill-name
description: "What the skill does. Include trigger keywords at end. Triggers on: keyword1, keyword2, keyword3."
source_id: seb-claude-tools
version: 1.0.0
---
```

**Fields:**
- `name` — lowercase, hyphenated, matches the skill directory name.
- `description` — one line that says what the skill does and when Claude should use it. Include trigger keywords when helpful.
- `source_id` — always `seb-claude-tools` for repo-managed skills
- `version` — semver, used by installer to decide update vs skip

The skill directory name becomes the slash command: `~/.claude/skills/deploy/SKILL.md` creates `/deploy`.

### Arguments

If the skill accepts arguments, end the file with:
```
$ARGUMENTS - Optional: description of what arguments do
```

For deterministic or repeatable work, prefer bundled files inside the skill folder:

```text
skill-name/
├── SKILL.md
├── references/
├── scripts/
└── assets/
```

Keep `SKILL.md` lean. Put long checklists, detailed examples, and variant-specific guidance into supporting files and tell Claude when to read them.

---

## Structural Patterns

### Pattern 1: Interview Skill
For skills that gather information through guided Q&A.

```markdown
# Skill Name

[One-line description of what it produces through the interview]

## Prerequisites
[Guard clause — what must exist before this runs]

## The Job
[Numbered list of high-level steps]

**Important:** This is an interview, not a monologue. Ask questions in batches, wait for answers, then continue.

## Interview Flow

### Batch 1: [Topic]
Ask:
1. **[Question]** [Context to help the user answer]
2. **[Question]** [Context]

**Why these questions:** [Reasoning — helps Claude adapt if answers are unexpected]

After answers, reflect back:
> **Captured:** [Summary]
> Anything to add or correct?

### Batch 2: [Topic]
[Same pattern]

## Output
[File format and location]

## Checklist
[Verification before saving]

## After [Skill Name]
[Handoff to next skill in chain]
```

**Key conventions:**
- 2-3 questions per batch, never dump all at once
- Always reflect back after each batch
- Include "Why these questions" so Claude can adapt
- Bold the questions for scannability

### Pattern 2: Phased Skill
For skills with distinct sequential phases requiring user approval between them.

```markdown
# Skill Name

[Description]

## Phase 1 — [Name]
[What happens, what to present, wait for approval]

## Phase 2 — [Name]
[Depends on Phase 1 approval]

## Phase 3 — [Name]
[Final output]

## Rules
[Hard constraints that apply across all phases]
```

**Key conventions:**
- Each phase ends with a user checkpoint
- Never skip a phase
- Rules section for non-negotiable constraints

### Pattern 3: Chain Skill
For skills that are part of a multi-skill workflow.

```markdown
# Skill Name

[Description — mention where it fits in the chain]

## Prerequisites
[Guard clause referencing previous skill's output file]

## The Job
[Steps, referencing input from previous skill]

## [Sections]
[Skill-specific work]

## Output
[File format and location]

## After [Skill Name]
[Explicit handoff: "Run /next-skill to..."]
```

**Key conventions:**
- Prerequisites check for input file from previous skill
- If prerequisite missing, tell user which skill to run first
- Output file is named predictably so next skill can find it
- Handoff explicitly names the next skill(s)

### Pattern 4: Generator Skill
For skills that produce files/code as output.

```markdown
# Skill Name

[Description]

## Prerequisites
[What must exist]

## Step 1: Pre-Generation Confirmation
[Show what will be generated, get approval]

## Step 2: Generate
[Platform/format-specific generation rules]

## Step 3: Verification
[Check generated output against requirements]

## Rules
[Quality constraints on generated output]
```

**Key conventions:**
- Always confirm before generating
- Verify after generating
- Mark unknowns as TODO, never guess

---

## Guard Clauses

Every chain skill needs a guard clause that checks for prerequisites:

```markdown
## Prerequisites

This skill requires `[file]`. Resolution order:
1. Look for `[file]` in the current working directory
2. If not found, tell the user:

> I need [what's missing]. Run `/previous-skill` first — [reason why it's needed].
```

**Rules:**
- Check for the file, not just assume it exists
- Tell the user exactly what to run
- Explain why the prerequisite matters (not just "run X first")

---

## Handoff Patterns

### Simple Handoff (one next step)
```markdown
## After [Skill Name]

Tell the user:
> [Output] saved to `[file]`. Run `/next-skill` to [what happens next].
```

### Fork Handoff (multiple paths)
```markdown
## After [Skill Name]

Tell the user:
> [Output] saved to `[file]`. You have two paths:
>
> **Path A:** Run `/skill-a` to [description]
> **Path B:** Run `/skill-b` to [description]
>
> Which path do you want?
```

### Terminal Handoff (end of chain)
```markdown
## After [Skill Name]

Tell the user:
> [Output] saved to `[file]`. [Summary of what was produced].
>
> Optional next steps:
> - Run `/review-skill` to [review]
> - Run `/audit-skill` to [audit]
```

---

## Output Conventions

- Always save to a predictable file path
- Use the current working directory unless the skill has a specific convention
- Filename should be descriptive and consistent (e.g., `harness-interview.md`, `harness-architecture.md`)
- Include metadata at the top of output files:

```markdown
# [Title]: [Name]
**Date:** YYYY-MM-DD
**Source:** [input file if part of chain]
**Status:** [Draft/Approved/Complete]
```

---

## Checklist Pattern

Every skill should verify its work before saving:

```markdown
## Checklist

Before saving:

- [ ] [Verification item]
- [ ] [Verification item]
- [ ] [Verification item]
```

**Good checklist items:**
- Trace outputs back to inputs ("Every agent traces to an interview requirement")
- Verify completeness ("All systems from interview have tool designs")
- Check quality ("Success criteria are specific and measurable")
- Verify format ("Saved to correct location")

**Bad checklist items:**
- Vague ("Looks good")
- Redundant with the skill's own steps ("Asked questions")

---

## Writing Style for Skills

- **Imperative, direct.** "Ask:" not "You should ask:"
- **Bold questions** in interviews for scannability
- **Tables** for structured data (system maps, decision matrices)
- **Code blocks** for output templates and examples
- **Quotes** (`>`) for reflect-back summaries and handoff messages
- Keep instructions to Claude concise — it's a skilled agent, not a beginner
- Include "Why" sections so Claude can adapt when answers are unexpected
- Use `**Important:**` for hard constraints, not for emphasis

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Dumping all questions at once | Batch 2-3, wait for answers |
| No guard clause on chain skills | Always check for prerequisite files |
| Vague output format | Show exact markdown template |
| No checklist | Add verification before saving |
| Missing handoff | Always tell user what to do next |
| Over-constraining Claude | Give guidelines, not scripts — Claude should adapt |
| No "Why" on questions/decisions | Include reasoning so Claude can handle edge cases |
