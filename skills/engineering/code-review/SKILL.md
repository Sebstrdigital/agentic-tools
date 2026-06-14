---
name: code-review
description: "General code quality review covering structure, naming, complexity, error handling, type safety, testing, and dependencies. Evidence-based with file:line citations."
source_id: seb-claude-tools
version: 1.0.0
---

# Code Review

General code quality review for any project. Covers structure, readability, maintainability, error handling, type safety, test quality, and dependency health. Evidence-based — every finding cites a specific file and line number.

## Usage

- `/code-review` - Review the current project
- `/code-review <path>` - Review a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to review. Defaults to current project root.

## Instructions

You are a senior software engineer performing a structured code quality review. Your goal is to find real problems that affect maintainability, reliability, and developer experience — not to enforce style preferences. Every finding must cite a specific file and line number. No speculation.

### Step 1: Discover the Codebase

Search the project (or $ARGUMENTS path) for:

- **Entry points** — main files, API routes, app bootstrapping
- **Core business logic** — the functions doing the actual work (not boilerplate)
- **Data models** — types, schemas, database models
- **Utilities & helpers** — shared functions, constants
- **Error handling** — try/catch blocks, error boundaries, fallback logic
- **Tests** — test files, test utilities, fixtures
- **Config** — package.json / pyproject.toml / go.mod, tsconfig, lint config

Use `get_file_outline` before reading full files. Focus your deep reads on the most complex or business-critical files. You do not need to read every file — focus on breadth first, then depth where issues appear.

### Step 2: Run the Review (5 Domains, 25 Checks)

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with brief evidence.

**Domain 1: Code Structure & Organization (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Module boundaries are clear | Each file/module has a single clear responsibility. No god files that do everything. Business logic is not mixed with infrastructure (e.g., DB queries inside UI components). |
| 2 | Dependency direction is consistent | Dependencies flow in one direction (e.g., UI → service → data layer). No circular imports. Lower-level modules don't import from higher-level ones. |
| 3 | No dead code | No unused functions, commented-out code blocks, unreachable branches, or orphaned files. Dead code is deleted, not commented. |
| 4 | Constants and config are centralized | Magic numbers, hardcoded strings, and config values live in dedicated files. Not scattered inline across the codebase. |
| 5 | File naming is consistent | Files follow a consistent naming convention (snake_case, camelCase, kebab-case) appropriate for the language/ecosystem. No mixed conventions without reason. |

**Domain 2: Naming & Readability (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 6 | Variable and function names are descriptive | Names communicate purpose without needing comments. No single-letter vars outside loops/lambdas. No misleading names (e.g., `data`, `temp`, `doStuff`). |
| 7 | Functions do one thing | Functions have a single clear purpose reflected in their name. No functions named `processAndFormatAndSave`. Long functions are a red flag. |
| 8 | Boolean variables and functions use positive phrasing | `isEnabled`, `hasPermission`, `canDelete` — not `notDisabled`, `noPermissionMissing`. Double negatives in conditionals are a red flag. |
| 9 | Comments explain WHY, not WHAT | Comments describe intent, business rules, or non-obvious decisions — not restate what the code already says. Stale comments that contradict code are a critical fail. |
| 10 | API and function signatures are self-documenting | Parameters are named clearly. Functions with >3 params use named options/objects. No boolean flag parameters that change function behavior. |

**Domain 3: Complexity & Maintainability (6 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 11 | Functions are an appropriate length | Functions are readable in one screen. Flag anything over ~50 lines as needing decomposition unless it's a data definition or migration. |
| 12 | Nesting depth is controlled | Max 3-4 levels of nesting. Deep nesting (if inside if inside if inside for) is a red flag. Early returns are preferred over nested else blocks. |
| 13 | DRY principle is followed | No significant copy-pasted logic (3+ identical or near-identical blocks). Shared logic is extracted into named functions/utilities. |
| 14 | No premature abstraction | Abstractions exist to remove duplication or manage complexity — not to anticipate hypothetical future needs. Overly generic utilities with one caller are a red flag. |
| 15 | Async/concurrency is handled correctly | Promises are awaited or properly chained. No fire-and-forget where result matters. Parallel operations use Promise.all / equivalent. No accidental sequential execution of independent async calls. |
| 16 | State mutations are controlled | Mutations are localized and predictable. No shared mutable state across unrelated modules. Immutable patterns preferred where practical. |

**Domain 4: Error Handling & Robustness (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 17 | Errors are handled, not swallowed | No bare `catch {}` blocks that discard errors silently. Errors are either handled with fallback logic, re-thrown with context, or logged with sufficient detail. |
| 18 | Error messages are actionable | Thrown errors include context about what failed and (where possible) what to do about it. `new Error("failed")` with no context is a red flag. |
| 19 | External calls have error handling | All calls to external APIs, databases, and file system operations have explicit error handling. Network calls have timeout handling. |
| 20 | Validation happens at boundaries | Inputs from users, external APIs, and environment variables are validated at the boundary — before being passed deep into the system. No validation of internal invariants that should already be correct. |
| 21 | Partial failures are handled | In multi-step operations (e.g., write to DB then send email), failure of later steps doesn't leave the system in a corrupt partial state. Rollback or compensating actions exist. |

**Domain 5: Type Safety, Testing & Dependencies (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 22 | Type safety is enforced | TypeScript/type hints used throughout. No `any` casts, `as unknown as X`, or `@ts-ignore` without explanation. Strict mode enabled. |
| 23 | Tests cover business logic | Core business logic (calculations, transformations, decision logic) has unit tests. Tests assert meaningful outcomes, not just that functions exist. |
| 24 | Tests are independent and deterministic | Tests do not depend on execution order. No shared mutable state between tests. No tests that pass randomly and fail sometimes. |
| 25 | Dependencies are intentional | No unused dependencies in package.json / requirements / go.mod. No packages included "just in case." Dependency versions are pinned (lockfile exists and is committed). |

### Step 3: Classify Findings

For each FAIL or PARTIAL, assign a severity:

| Severity | Criteria |
|----------|----------|
| **HIGH** | Real bug risk, data corruption potential, or significant maintenance burden that will compound over time. |
| **MEDIUM** | Code smell that makes the codebase harder to change safely. Likely to cause bugs eventually. |
| **LOW** | Convention violation or readability issue. No immediate risk but worth cleaning up. |

### Step 4: Output Format

Save the output to `docs/audits/06-code-review.md` (or the path specified in $ARGUMENTS).

```markdown
# Code Review: [Project Name]

**Date:** [date]
**Reviewer:** Claude (Code Review v1)
**Scope:** [directories and files reviewed]
**Stack:** [detected tech stack]

---

## Results Summary

| Result  | Count |
|---------|-------|
| PASS    | X     |
| PARTIAL | Y     |
| FAIL    | Z     |

**Quality Score:** X/25 (XX%)

**Verdict:** PRODUCTION QUALITY / ACCEPTABLE WITH CAVEATS / NEEDS ATTENTION

---

## Findings by Severity

### High
[List or "None found"]

### Medium
[List with file:line references and remediation steps]

### Low
[List]

---

## Detailed Checklist

### Domain 1: Code Structure & Organization
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Module boundaries | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

[Continue for all 5 domains]

---

## Top Refactoring Priorities

Rank the top 3-5 improvements by impact:
1. **[File or area]** — [what to change and why it matters]
2. ...

## What's Working Well

[3-5 specific callouts of code that is well-structured, tested, or clearly written]
```

### Guidelines

1. **Evidence-based**: Every finding must cite a specific file and line number. No "the codebase probably has X."
2. **Business-critical first**: Prioritize review of code that handles money, auth, user data, and core flows. Don't spend equal time on utility functions and payment logic.
3. **Distinguish bugs from style**: A fire-and-forget promise is a potential bug. A function named `getData` is a style issue. Treat them differently.
4. **Acknowledge good code**: A review that only lists problems is less useful than one that identifies what's working well too.
5. **Stack-aware**: Tailor checks to the actual ecosystem. React patterns differ from Express patterns. TypeScript strictness differs from Python type hints.
6. **No false positives**: Only report issues you can evidence. If you didn't see a pattern, don't flag it.
