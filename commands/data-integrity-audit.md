---
source_id: seb-claude-tools
version: 1.0.0
name: data-integrity-audit
description: "Audit AI-generated query results from user question through displayed answer, checking data flow, calculations, and output faithfulness. Triggers on: data integrity audit, result correctness, audit query results."
---

# Data Integrity & Result Correctness Audit

Deep audit of AI-generated query results, calculations, and data presentations. Specifically targets systems where an LLM generates queries, processes financial/numerical data, and presents results to users — verifying the full chain from user question to displayed answer.

## Usage

- `/data-integrity-audit` - Audit the current project
- `/data-integrity-audit <path>` - Audit a specific sub-project or directory

## Arguments

$ARGUMENTS - Optional: path to a specific sub-project or module to audit. Defaults to current project root.

## Instructions

You are a data integrity auditor specializing in AI-powered data applications. Your job is to trace every path where data flows from a database through an LLM to a user, and identify where correctness can break. Every finding must cite specific files and line numbers.

### Step 1: Map the Data Pipeline

Search the project (or $ARGUMENTS path) for:

- **Query builders** — functions that construct database queries (SQL, ORM, Supabase, etc.)
- **Tool/function definitions** — tool schemas the LLM uses to request data
- **Tool executors** — functions that receive LLM tool calls and run queries
- **Data transformers** — functions that aggregate, format, or sanitize query results before returning to the LLM
- **System prompt** — instructions about how to interpret and present data
- **Response formatters** — code that processes LLM output before showing to user
- **Date/time handling** — timezone conversions, period resolution, date boundaries
- **Currency/number handling** — formatting, rounding, integer vs. float conventions
- **Eval/test files** — existing tests for data correctness

Read ALL relevant source files. Build a complete picture of: User Question → LLM → Tool Call → Query → Database → Result → LLM → Response → User.

### Step 2: Run the Audit (6 Domains, 30 Checks)

For each item, determine: **PASS**, **PARTIAL**, or **FAIL** with brief evidence.

**Domain 1: Query Generation Correctness (6 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | Tool schema matches query capability | Every parameter in the tool schema maps to an actual query filter/option. No phantom parameters that are accepted but ignored. |
| 2 | LLM input is validated before query | Tool arguments from the LLM are validated (types, ranges, enum values) before being used in queries. Unsafe casts (`as unknown as X`) are red flags. |
| 3 | Filter parameters are applied correctly | When the LLM passes filters (date range, category, search term), every filter is actually applied to the query. No silent drops. |
| 4 | Default values are safe | Missing/undefined parameters default to sensible values (not "all data" or "no filter"). Check for implicit defaults that change query semantics. |
| 5 | Query pagination is faithful | If results are paginated/limited, totals and summaries reflect the FULL dataset, not just the returned page. |
| 6 | Edge case queries don't break | Empty date ranges, zero results, single-day periods, future dates, boundary dates — verify these produce correct (not misleading) output. |

**Domain 2: Date & Time Integrity (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 7 | Timezone is handled consistently | All date operations use the same timezone. User-facing dates match database-stored dates. Check for UTC vs. local timezone mismatches. |
| 8 | Period resolution is correct | "today", "this week", "last month", "January" — verify each resolves to the correct date boundaries (inclusive/exclusive). |
| 9 | Date boundaries are inclusive/exclusive correctly | Start-of-day and end-of-day boundaries use correct times (00:00:00 vs 23:59:59 vs next day 00:00:00). Off-by-one errors in date ranges. |
| 10 | Comparison periods align correctly | "vs previous week" — verify the comparison period is the same length and correctly offset. No comparing 7 days to 6 days. |
| 11 | Relative dates are resolved server-side | "yesterday" is resolved to an actual date on the server (with correct timezone), not left for the LLM to interpret. |

**Domain 3: Calculation & Aggregation Integrity (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 12 | Aggregations are computed in the database | SUM, AVG, COUNT happen in SQL/database, not in application code or by the LLM. The LLM should never calculate totals itself. |
| 13 | Currency handling preserves precision | Currency stored as integers (no floating point). No rounding errors in aggregations. Verify display formatting matches stored precision. |
| 14 | Tax calculations use correct formula | Tax rates applied correctly (rate * 100 encoding? percentage of what base?). Verify inclusive vs. exclusive tax handling. |
| 15 | Margin/percentage formulas are correct | Gross margin = (Revenue - COGS) / Revenue. Verify the formula in code matches the formula in the system prompt. No numerator/denominator swaps. |
| 16 | Comparison percentages are correct | "Revenue up 14%" — verify the change calculation: (new - old) / old * 100. Check for division by zero when previous period is zero. |

**Domain 4: LLM Output Faithfulness (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 17 | Anti-fabrication guardrails exist | System prompt explicitly instructs against inventing numbers. Check strength and specificity of these instructions. |
| 18 | Tool results are passed faithfully | Data from tool results reaches the LLM without modification that changes meaning. Check sanitization functions — do they strip important fields? |
| 19 | LLM output is not validated against source | Is there any mechanism to cross-check that numbers in the LLM's response match the tool results? If not, this is a gap. |
| 20 | Empty/null results are handled correctly | When queries return no data, the LLM correctly reports "no data" instead of fabricating or using cached data from a different query. |
| 21 | Truncated results are signaled | When results are paginated/limited, does the LLM know it's seeing a subset? Does it avoid stating subset totals as if they're complete? |

**Domain 5: Data Pipeline Trust Chain (5 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 22 | Pre-calculated fields are used as-is | If the database returns pre-calculated values (totals, averages, unit prices), verify the LLM is instructed to use them directly, not re-calculate. |
| 23 | Caching doesn't serve stale data | If tool results are cached (session state, in-memory), verify cache invalidation. A query for "today" shouldn't return yesterday's cached result. |
| 24 | Session context doesn't corrupt queries | Follow-up questions use session state (last period, last metric). Verify this context doesn't leak into unrelated queries or override explicit user parameters. |
| 25 | Multi-tool queries are consistent | When multiple tools are called (e.g., getSales + getExpenses for a P&L), verify they use the same date range and parameters. No mismatched periods. |
| 26 | Data transformation is reversible/auditable | Can you trace a number shown to the user back to the exact database row(s) that produced it? Is the transformation chain clear? |

**Domain 6: Testing & Monitoring (4 checks)**

| # | Check | What to Look For |
|---|-------|-----------------|
| 27 | Eval tests cover data correctness | Are there tests that verify the LLM calls the right tool WITH the right parameters? Not just tool selection, but parameter correctness. |
| 28 | Edge cases are tested | Zero-result queries, boundary dates, single-item results, very large result sets — are these in the test suite? |
| 29 | Regression tests protect against prompt changes | Golden test cases exist that must pass after any prompt modification. Prompt changes are tested, not just deployed. |
| 30 | Production monitoring catches data issues | Are there logs, alerts, or monitoring for: empty tool results, repeated errors, unusual query patterns, response anomalies? |

### Step 3: Classify Findings

For each FAIL or PARTIAL, assign a severity:

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Users will see wrong numbers. Financial decisions made on incorrect data. |
| **HIGH** | Data is sometimes incorrect under specific conditions. Edge case corruption. |
| **MEDIUM** | Data presentation is misleading but underlying numbers are correct. |
| **LOW** | Theoretical correctness risk. Not observed in practice. |

### Step 4: Output Format

```markdown
# Data Integrity Audit: [Project Name]

**Date:** [date]
**Auditor:** Claude (Data Integrity Audit v1)
**Scope:** [files reviewed]
**Data Domain:** [what kind of data — financial, sales, etc.]

---

## Results Summary

| Result | Count |
|--------|-------|
| PASS   | X     |
| PARTIAL| Y     |
| FAIL   | Z     |

**Integrity Score:** X/30 (XX%)

**Verdict:** TRUSTWORTHY / ACCEPTABLE WITH CAVEATS / UNRELIABLE

---

## Data Flow Diagram

[ASCII diagram showing: User Question → LLM → Tool Call → Query → DB → Result → LLM → Response → User]
[Mark each trust boundary and transformation point]

---

## Findings by Severity

### Critical
[List or "None found"]

### High
[List with file:line references, example scenarios, and remediation steps]

### Medium
[List]

### Low
[List]

---

## Detailed Checklist

### Domain 1: Query Generation Correctness
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Schema matches capability | PASS/PARTIAL/FAIL | [file:line - note] |
| ... | ... | ... | ... |

[Continue for all 6 domains]

---

## Highest-Risk Data Paths

Rank the top 3-5 data paths most likely to produce incorrect results, with:
1. The path (user question type → tool → query → transformation → display)
2. Why it's risky
3. What could go wrong (concrete scenario)
4. Recommended fix

## Remediation Priority

1. **[Finding]** — [severity] — [specific fix with file references]
2. ...
```

### Guidelines

1. **Trace, don't theorize**: Follow actual data from DB to user display. Read the SQL, read the transform, read the prompt instruction.
2. **Test with examples**: For critical paths, mentally walk through a specific user question ("What were sales yesterday?") and trace every transformation.
3. **Numbers must match**: If a function calculates a percentage, verify the formula. If a prompt says "use pre-calculated fields," verify the fields exist in the tool result.
4. **Domain-aware**: Understand the business context — currency conventions, tax handling, timezone rules — and verify code matches.
5. **LLM-specific**: The unique risk here is that an LLM is an unreliable narrator. It can state numbers with confidence that don't match the data. Every audit must consider: "Can the LLM fabricate this?"
6. **Actionable**: Every finding must include a specific fix, not just "this could be wrong."
