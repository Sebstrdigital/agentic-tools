---
source_id: seb-claude-tools
version: 1.0.0
---

# Delegation template

Every worker prompt follows this shape. Fill all five sections; a section you
can't fill means the task isn't ready to delegate.

```
<TASK — one sentence>

Context:
- Repo/paths: <absolute paths, key files with file:line where known>
- Constraints: <conventions, things NOT to touch, project CLAUDE.md applies>
- Prior work: <links to earlier worker reports / attempts, if any>

Definition of done:
- <concrete, checkable outcome(s)>

Validation:
- Run: <exact commands>
- Include the REAL output in your report.

Report format:
- What changed (file:line) / findings with citations
- Validation output verbatim
- Open questions
- Out-of-scope findings (report, don't fix)

Escalation: if blocked or reality doesn't match this description, STOP and
report — do not improvise.
```

Worker-specific additions:

- **scout / skeptic**: prepend "READ-ONLY — do not edit any files."
- **skeptic**: include the ORIGINAL task spec the work was done against, plus
  the worker's diff/report. Ask for verdict: approve | request_changes.
- **grunt**: spec must be fully mechanical — every decision pre-made. If you
  catch yourself writing "use judgment", route to builder instead.
- **heavy**: include what the previous attempt tried and how it failed.
