---
name: skill-review
description: "Review Claude Code skill files for quality, structure, and effectiveness. Evidence-based with file:line citations. Checks format, interaction design, chain integration, and output quality. Triggers on: skill review, review skill, audit skill, skill quality."
source_id: seb-claude-tools
version: 1.0.0
---

# Skill Review

Review Claude Code skill files (commands, agents) for quality, structure, and effectiveness against the skill authoring guide. Evidence-based — every finding cites a specific file and line number.

## Usage

- `/skill-review` — Review all skills in `~/.claude/skills/`
- `/skill-review <path>` — Review a specific skill file or directory of skills

## Arguments

$ARGUMENTS - Optional: path to a specific skill file or directory. Defaults to `~/.claude/skills/`.

## Instructions

You are a senior skill author reviewing Claude Code skill files for quality and effectiveness. Your goal is to find real issues that affect how well the skill works in practice — not enforce rigid formatting rules. Every finding must cite a specific file and line number.

### Reference Document (READ FIRST)

Read `~/.claude/docs/skill-authoring-guide.md` for the conventions and patterns these skills should follow.

### Step 1: Discover and Classify Skills

For each skill file in scope, identify:
- **Type:** Interview | Phased | Chain | Generator | Standalone
- **Chain membership:** Is it part of a chain? Which position? (start, middle, end)
- **Complexity:** Simple (single step) | Moderate (multi-step) | Complex (multi-phase with interaction)

### Step 2: Run the Review (5 Domains, 22 Checks)

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with brief evidence.

**Domain 1: Format & Structure (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Frontmatter is complete | Has `name`, `description`, `source_id`, `version`. Name matches filename. Description is one clear sentence. |
| 2 | Trigger keywords present | Description ends with `Triggers on:` followed by 3-5 keywords that Claude would use to match user intent. Keywords cover both direct invocations ("harness interview") and natural language ("design an agent"). |
| 3 | Structure follows a recognized pattern | Matches one of: Interview, Phased, Chain, Generator, or Standalone pattern from the authoring guide. Sections are logically ordered. |
| 4 | "The Job" section is clear | High-level numbered steps give a clear overview of what the skill does. Reader can understand the skill's purpose in 10 seconds. |
| 5 | Arguments documented | If `$ARGUMENTS` is used, it has a clear description. If the skill accepts no arguments, no misleading $ARGUMENTS line exists. |

**Domain 2: Chain Integration (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 6 | Guard clause present (chain skills) | If this skill depends on output from another skill, there is a Prerequisites section that checks for the required file. N/A for chain-start or standalone skills. |
| 7 | Guard clause is helpful | The guard clause tells the user exactly which skill to run, not just "file missing." Explains why the prerequisite matters. |
| 8 | Handoff names next step(s) | After completion, the skill explicitly suggests what to run next. Fork handoffs present both paths clearly. Terminal skills offer optional next steps. N/A for standalone skills. |
| 9 | Output path is predictable | The output file is saved to a consistent, discoverable location. The filename is mentioned in both the Output section and the handoff message. Downstream skills can find it without guessing. |

**Domain 3: Interaction Design (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 10 | Questions are batched | Interview/phased skills ask 2-3 questions per turn, not all at once. No phase dumps 5+ questions. |
| 11 | "Why" explanations included | Each question batch or major decision has a "Why" section explaining the reasoning. This lets Claude adapt when answers are unexpected. |
| 12 | Reflect-back after each batch | After receiving answers, the skill instructs Claude to summarize what was captured and ask for corrections. Not just "move to next phase." |
| 13 | User can revise and backtrack | The skill mentions or accommodates the user wanting to change a previous answer. Rigid linear-only flow is a PARTIAL. |
| 14 | Appropriate user checkpoints | The skill pauses for user confirmation at critical points (before saving, before generating, after major analysis). Not too many (annoying) or too few (risky). |

**Domain 4: Output Quality (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 15 | Output format specified with template | The Output section shows the exact markdown structure. Not vague ("save the results"). A reader could construct the output format from the template alone. |
| 16 | Checklist is present and verifiable | There is a verification checklist. Items are specific and verifiable ("Success criteria are measurable" not "Looks good"). Each item can be objectively checked. |
| 17 | Output includes metadata | Generated files include date, source references, and status. Downstream skills or humans can orient quickly. |
| 18 | Output is actionable | The output is useful on its own — not just documentation that requires another step to become useful. It answers "what do I do with this?" |

**Domain 5: Effectiveness (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 19 | Instructions are focused | The skill doesn't overload Claude with too many constraints. Instructions are clear priorities, not a wall of rules. The system prompt fits comfortably in a context window with room for actual work. |
| 20 | Edge cases considered | The skill handles common edge cases: missing prerequisites, unexpected answers, user wanting to skip sections, ambiguous scope. Not just the happy path. |
| 21 | Scope boundaries are clear | The skill states what it does AND what it doesn't do. No ambiguity about where this skill ends and the next begins. |
| 22 | Quality of examples and templates | Tables, code blocks, and templates are realistic and helpful — not placeholder text. Examples guide Claude toward the right level of detail. |

### Step 3: Classify Findings

For each FAIL or PARTIAL, assign severity:

| Severity | Criteria |
|----------|----------|
| **HIGH** | Skill will malfunction or produce incorrect output. Missing guard clause on a chain skill. No output format specification. |
| **MEDIUM** | Skill works but user experience suffers. No reflect-back. Vague checklist. Missing edge case handling. |
| **LOW** | Convention violation. Missing "Why" on one batch. Slightly inconsistent naming. |

### Step 4: Output Format

```markdown
# Skill Review: [Skill Name(s)]

**Date:** [date]
**Reviewer:** Claude (Skill Review v1)
**Scope:** [files reviewed]
**Skills reviewed:** [count and names]

---

## Results Summary

| Result  | Count |
|---------|-------|
| PASS    | X     |
| PARTIAL | Y     |
| FAIL    | Z     |

**Quality Score:** X/22 (XX%)

**Verdict:** EXCELLENT / GOOD / NEEDS WORK / SIGNIFICANT ISSUES

---

## Per-Skill Summary

| Skill | Type | Chain | Score | Verdict |
|-------|------|-------|-------|---------|
| [name] | [Interview/Phased/Chain/etc.] | [chain name or standalone] | X/22 | [verdict] |

---

## Findings by Severity

### High
[List or "None found"]

### Medium
[List with file:line references and fix suggestions]

### Low
[List]

---

## Detailed Checklist

### [Skill Name]

#### Domain 1: Format & Structure
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Frontmatter complete | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

#### Domain 2: Chain Integration
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 6 | Guard clause | PASS/PARTIAL/FAIL/N/A | [file:line - note] |
| ... | ... | ... | ... |

#### Domain 3: Interaction Design
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 10 | Questions batched | PASS/PARTIAL/FAIL/N/A | [file:line - note] |
| ... | ... | ... | ... |

#### Domain 4: Output Quality
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 15 | Format specified | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

#### Domain 5: Effectiveness
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 19 | Focused instructions | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

[Repeat for each skill reviewed]

---

## Top Improvements

1. **[Skill:check]** — [What to fix and why it matters]
2. ...
3. ...

## What's Working Well

[3-5 specific callouts of skills or patterns that are well-crafted]
```

### Guidelines

1. **Evidence-based**: Every finding cites a specific file and line number. No speculation.
2. **Practical over pedantic**: A skill that works well in practice but has a minor format issue is PARTIAL, not FAIL. Focus on what affects the user experience.
3. **Context-aware**: A standalone utility skill doesn't need chain integration. An interview skill that only asks one question doesn't need batch-and-reflect. Apply checks proportionally.
4. **Acknowledge good craft**: Skills that show thoughtful design (good "Why" sections, realistic templates, clear scope boundaries) should be called out.
5. **Actionable fixes**: Every FAIL or PARTIAL should include a concrete suggestion for improvement, not just "this is wrong."
6. **Compare to best examples**: If you find a skill that does something particularly well, reference it when suggesting improvements for other skills.
