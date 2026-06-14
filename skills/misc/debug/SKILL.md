---
name: debug
description: "Debug session tracker. Creates a breadcrumb trail file during debugging so you can close sessions and resume without losing context. Triggers on: debug, start debugging, fix bug, investigate issue."
source_id: seb-claude-tools
version: 1.0.0
---

# Debug Session Tracker

Maintain a lightweight breadcrumb trail during debugging so sessions can be closed and resumed without losing context.

## On Start

1. **Check for existing session:** Look for `debug-active.md` in the project root
   - **If it exists:** Read it, summarize the current state to the user, and continue from where things left off. Do NOT create a new file.
   - **If it doesn't exist:** Create `debug-active.md` with the initial template below.

2. **Initial template:**

```markdown
# Active Debug Session

**Started:** [date]
**Repo:** [current repo/project name]
**Symptom:** [user-described problem]

## Current Hypothesis

[What we think is causing the issue]

## Trail

### Step 1
**Tried:** [what was done]
**Result:** [what happened]
**Next:** [what to try next]
```

## During Debugging

Update `debug-active.md` at these natural checkpoints:

- After reading code and forming or changing a hypothesis
- After running tests and seeing results
- After attempting a fix (whether it worked or not)
- After discovering something unexpected
- Before pivoting to a different approach

**Keep entries short** — 2-3 lines per step. This is a working trail, not documentation.

Always update **Current Hypothesis** when your understanding changes.

Always end the latest step with a **Next** line — this is what a fresh session reads to know what to do.

## On Resolution

When the bug is fixed:

1. Note the root cause in a final trail entry
2. Commit the fix (the commit message is the permanent record)
3. **Delete `debug-active.md`** — the file only exists during active debugging
4. Confirm deletion to the user

## Rules

- Never let `debug-active.md` grow beyond ~50 lines. If it's getting long, summarize older steps into a single "Summary so far" block and keep only the last 3-4 detailed steps.
- The file is disposable. The commit history is the real record.
- Do not create the file for trivial fixes that take one step.
- If the user says "pause" or ends the session without resolving, make sure the latest **Next** line clearly describes what to try when resuming.
