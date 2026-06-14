---
source_id: seb-claude-tools
version: 1.0.0
---

# Question bank — the five axes

Work each axis until its EXIT condition holds. Use AskUserQuestion with
concrete options; free-text "Other" is always available. Don't ask what you
can read from the repo — verify there first, then ask only what's left.

## 1. Falsifiability
- "The run finishes at 3am with nobody watching. What single check proves it
  succeeded?"
- "Is that check runnable by an agent (command / API call / UI assertion)?"
- "What would a PLAUSIBLE failure look like that still passes that check?"
EXIT: the Goal section contains at least one unattended-runnable success
check, and the user has seen and rejected (or covered) the plausible-failure
case.

## 2. AC sufficiency
Per story:
- "Would a wrong implementation pass these AC?" (e.g. hardcoded value,
  happy-path only, weakened test)
- "Which AC catches the laziest possible implementation?"
- "What's the nastiest input/state this story must survive?"
EXIT: every story has at least one AC that a lazy/wrong implementation would
FAIL, that AC is machine-checkable (a named test, command, or concrete
assertion — "handles errors gracefully" does not qualify), and edge inputs
are either covered by an AC or explicitly out of scope.

## 3. Scope edges
- "What existing behavior is adjacent to this change and must NOT move?"
- "State each scope note with its boundary: does 'don't do X' apply globally
  or only to the new path?" (global-sounding notes regress existing code)
- "If the worker finds related broken code, fix or report?"
EXIT: every non-goal names its boundary; adjacent-behavior protection is
explicit.

## 4. Run budget
- "How many fix iterations per story before parking?" (default 6; 3 parks
  medium cards one fix short)
- "Which outcomes should PARK instead of retry?" (recurring must_fix, fix
  introduces new must_fix, any design decision surfacing)
- "Who/what gets notified on park, and what context must the park reason
  carry?"
EXIT: max iterations chosen, park conditions listed, escalation target named.

## 5. Guardrails
- "What has review flagged repeatedly in this repo?" (check retro.md, munin,
  past review comments — bring evidence to the question)
- "Any security-shaped surface here (user input, HTML, auth, money, PII)?"
- "Concurrency/consistency: can two actors touch this state at once, and
  which pattern is acceptable here?" (pin the pattern NOW — unpinned
  concurrency design is the canonical unconvergeable card)
EXIT: known repo failure modes are listed as guardrails; any concurrency or
security surface has a pinned pattern or an explicit park condition.
