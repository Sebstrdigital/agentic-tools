---
source_id: seb-claude-tools
version: 1.0.0
name: spec
description: Adversarial spec interview for long autonomous runs. Grills the user on goal falsifiability, acceptance-criteria sufficiency, scope edges, run budget, and guardrails, then produces a spec doc plus takt-ready sprint.json and/or a dua-factory card body. Use when preparing work for "start takt" or factory cards, when the user says "create a spec" or "/spec", or before kicking off any unattended run.
---

# /spec — Spec a long autonomous run

Premise: vague guidance oscillates. A factory card once burned 4 autonomous
attempts on vague hints, then merged in ONE attempt after a concrete scope
decision plus pre-loaded guardrails. This interview front-loads that
concreteness so the run doesn't have to discover it.

## Workflow

1. **Intake** — user states the goal in prose. Gather context: project
   CLAUDE.md, CONTEXT.md, docs/adr/ if present. For non-trivial codebases,
   delegate recon to a read-only scout agent rather than reading files inline.
2. **Grill loop** — work the five axes in [QUESTION-BANK.md](QUESTION-BANK.md)
   using AskUserQuestion. This is interrogation, not confirm-or-correct: an
   axis is done when its exit condition holds, not when the user nods. Push
   back on vague answers; always offer concrete options to choose between.
3. **Draft** — write `tasks/spec-<name>.md` per [SPEC-FORMAT.md](SPEC-FORMAT.md).
4. **Adversarial self-check** — for every story ask: "would a wrong or lazy
   implementation pass these acceptance criteria?" If yes, sharpen the AC or
   add a verification scenario. The Open Decisions section must be EMPTY — an
   open decision means the spec is not run-ready; resolve it or convert it to
   an explicit park condition.
5. **Emit** — on user choice: a takt `sprint.json` (schema in SPEC-FORMAT.md,
   consumed by `start takt`), and/or a dua-factory card body (fenced JSON
   story block in the card).
6. **Review** — present the spec to the user. The skill ends at an approved
   spec; it never starts the run itself.

## Hard rules

- Acceptance criteria are behavioral outcomes, max 3-4 per story. "Typecheck
  passes" / "lint passes" are assumed — never listed.
- Scope notes must state their boundary precisely ("new edit action only",
  not "don't touch X") — global-sounding notes regress existing behavior.
- Known recurring review issues for the target repo go in Guardrails up
  front — pre-empt them, don't let the run rediscover them.
- If the user cannot answer a falsifiability question, record that as a park
  condition in the spec — never silently drop it.
- Do not pad: a spec with 2 sharp stories beats 6 mushy ones.
