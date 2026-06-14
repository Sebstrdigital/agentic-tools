---
name: ux-audit
description: "UX audit for SaaS products. Scans codebase for user-facing touchpoints, applies established UX frameworks (Fogg, JTBD, progressive disclosure), produces an information architecture map and optional interactive playground visualization. Triggers on: ux audit, audit onboarding, review ux, experience audit, ux review."
source_id: seb-claude-tools
version: 1.0.0
---

# UX Audit

Audit a product's user-facing experience by scanning the codebase, applying established UX frameworks, and producing an actionable information architecture report with optional interactive visualization.

---

## Phase 1: Product Context

Before scanning, you need product context.

**Resolution order:**
1. If `$ARGUMENTS` contains a product description, use it as seed context
2. Look for `docs/product-context.md` in the project root
3. If neither exists, tell the user:

> I need product context to run the audit. You have two options:
> 1. Run `/product-context` to create a `docs/product-context.md` through a guided interview
> 2. Pass a brief product description as an argument: `/ux-audit AI email support agent that creates drafts in Gmail`

**Do not proceed without product context.** The frameworks require understanding the aha moment, value proposition, and user journey to evaluate touchpoint placement.

---

## Phase 2: Codebase Scan

Search the codebase for every user-facing surface. Be thorough — audit quality depends on completeness.

### What to find:

| Surface Type | Where to Look |
|---|---|
| **Pages/routes** | App router directories, page files, route handlers |
| **Email templates** | Email sending functions, template files, transactional email code |
| **Modals/dialogs** | Dialog components, confirmation prompts, alert components |
| **Loading states** | Skeleton screens, spinners, progress indicators, processing pages |
| **Empty states** | Zero-data views, first-run states, placeholder content |
| **Error states** | Error boundaries, error pages, toast notifications |
| **In-product copy** | Tooltips, help text, onboarding hints, banners, coach marks |
| **Navigation copy** | Menu items, breadcrumbs, button labels, CTAs |
| **External touchpoints** | Content created in third-party tools (emails, drafts, notifications in external apps) |

### For each surface, extract:
- **File path and location**
- **User-facing copy** (actual text the user reads, not variable names)
- **Purpose** (what information it communicates or what action it prompts)
- **Trigger** (when does the user encounter this — always, first-run only, conditional?)
- **Skippable?** (can the user miss this entirely?)

---

## Phase 3: Framework Analysis

Apply each framework to every touchpoint. Score placements and flag violations.

### Framework 1: Fogg Behavior Model (B = MAP)

For every CTA or desired user action, evaluate:
- **Motivation:** Does the user have a reason to act at this point? Has motivation been established?
- **Ability:** Is the action easy enough given the context? Is friction minimized?
- **Prompt:** Is the CTA clear, visible, and well-timed? Does it arrive when motivation and ability converge?

**Flag:** CTAs where motivation hasn't been established, or where friction is unnecessarily high, or where prompts are poorly timed.

### Framework 2: JTBD / Hulick "Fireball" Principle

For all user-facing copy, evaluate:
- Does it describe the **transformation** (what the user becomes) or the **feature** (what the product does)?
- Is the user's **before state** acknowledged?
- Would Samuel Hulick say this describes "throwing fireballs" or "the fire flower"?

**Flag:** Copy that leads with features, technical jargon, or product internals instead of user outcomes.

### Framework 3: Progressive Disclosure

For the overall flow, evaluate:
- Is information revealed **at the moment the user needs it**, or front-loaded?
- Is there **cognitive overload** at any touchpoint? (More than 3-5 new concepts at once)
- Are advanced concepts hidden until the user is ready?

**Flag:** Touchpoints that dump too much information, or critical information that arrives too early (before context) or too late (after the user needed it).

### Framework 4: Complementary Touchpoints

For the full set of surfaces, evaluate:
- Does **each surface have a unique communication job**? Or are multiple surfaces saying the same thing?
- Is any **critical information gated behind a skippable surface**? (e.g., only explained in an email the user might not read)
- Can the **product stand alone** without any single touchpoint?

**Principle:** Emails deepen context; the product must stand alone. No single skippable surface should be load-bearing for comprehension.

**Flag:** Load-bearing skippable surfaces. Redundant surfaces that waste attention. Surfaces with no clear unique job.

### Framework 5: Time-to-Value

Evaluate:
- What is the **estimated time from signup to first perceived value**?
- Are there **unnecessary steps** between signup and value?
- Are **waiting periods used productively** (education, expectation-setting) or wasted (bare spinners)?
- Is there a clear **"bridge"** that actively directs the user from setup to where value appears?

**Flag:** Dead waiting periods. Missing bridges. Unnecessary steps. Value that takes too long to arrive.

### Framework 6: Teaching Methodology (Do > Show > Tell)

For each concept the user must learn, evaluate:
- Is it taught through **action** (user does it)? Best retention.
- Through **demonstration** (user sees it)? Good retention.
- Through **text** (user reads about it)? Lowest retention.

**Principle (Superhuman):** Interactive > Visual > Text. Users learn by doing, not by reading.

**Flag:** Concepts taught only through text that could be taught through demonstration or action. Missed opportunities for "learn by doing."

### Framework 7: Bridge Design (Grammarly/Loom pattern)

For products where value appears outside the app, evaluate:
- Is there a **deliberate bridge** from the setup UI to the external context where value appears?
- Does the product **actively direct** users to the exact place and moment of first value?
- Or does it leave users to **discover value on their own**?

**Flag:** Missing or weak bridges. "Go to your inbox" without specificity. No follow-up when value is delivered.

---

## Phase 4: Scoring

For each piece of information or concept that needs to be communicated to the user, assign:

| Score | Meaning | Criteria |
|---|---|---|
| **Good** (green) | Well-placed | Right information, right time, right surface, right teaching method |
| **Questionable** (yellow) | Misplaced or suboptimal | Information exists but timing, surface, or method could improve |
| **Bad** (red) | Missing or harmful | Critical info missing, on wrong surface, gated behind skippable touchpoint, causes confusion |

---

## Phase 5: Output

### 5A: Markdown Report

Save to `tasks/ux-audit-YYYY-MM-DD.md` with this structure:

```markdown
# UX Audit: [Product Name]
**Date:** YYYY-MM-DD
**Product context:** docs/product-context.md

## Executive Summary
[3-5 sentences: overall health, biggest wins, biggest problems]

## Touchpoint Map
| # | Surface | Type | Skippable? | Unique Job | Key Content |
|---|---------|------|------------|------------|-------------|
| 1 | [name] | page/email/etc | yes/no | [its job] | [what it says] |

## Information Architecture
| Information Item | Currently At | Should Be At | Score | Framework Violated | Note |
|---|---|---|---|---|---|
| [concept/info] | [surface] | [surface] | 🟢/🟡/🔴 | [which framework] | [why] |

## Framework Analysis

### Fogg B=MAP Violations
- [violation + which touchpoint + recommendation]

### Fireball Principle Violations
- [copy that describes features not outcomes + recommendation]

### Progressive Disclosure Issues
- [overloaded or mistimed touchpoints]

### Complementary Touchpoint Issues
- [redundancies, load-bearing skippables, jobless surfaces]

### Time-to-Value Issues
- [dead time, missing bridges, unnecessary steps]

### Teaching Method Issues
- [text-only concepts that could be interactive]

### Bridge Design Issues
- [missing or weak bridges to external value]

## Recommendations (Prioritized)
1. **[Critical]** [recommendation] — Affects: [touchpoints] — Frameworks: [which]
2. **[Important]** [recommendation] — ...
3. **[Nice-to-have]** [recommendation] — ...

## Information Placement Matrix
Shows every concept/information item and where it appears across surfaces.

| Concept | Landing | Signup | Onboarding | Email | In-Product | Score |
|---|---|---|---|---|---|---|
| [concept] | ✓/— | ✓/— | ✓/— | ✓/— | ✓/— | 🟢/🟡/🔴 |
```

### 5B: Playground Visualization (Optional)

After saving the report, ask:

> Want me to generate an interactive playground visualization of the user journey?

If yes, generate a **single-file HTML playground** following the playground plugin conventions:

#### Visualization Requirements:

**Layout:** SVG canvas (main area) + sidebar (controls + issues list) + prompt output (bottom)

**Journey Flow (main canvas):**
- Touchpoints as **rounded rectangle nodes** arranged left-to-right chronologically
- Node color indicates type: blue (page), amber (email), green (in-product), purple (external)
- Edges between nodes showing user flow (solid = primary path, dashed = conditional/optional)
- Timing annotations on edges ("immediate", "1-2 min", "hours/days")
- Each node shows: name, type badge, number of information items, worst score indicator

**Information Items:**
- Click a node to expand and see all information items placed at that touchpoint
- Each item shows its placement score (green/yellow/red dot)
- Items flagged as "should move" show a subtle arrow indicating recommended destination

**Issues Panel (sidebar):**
- List of all flagged issues, grouped by severity (red → yellow)
- Each issue shows: description, affected node, framework source
- Clicking an issue highlights the affected node(s) on the canvas

**Controls (sidebar):**
- Framework filter toggles (show/hide issues by framework)
- Score filter (show only red / yellow / all)
- Toggle information items visibility on nodes
- Presets: "All issues", "Critical only", "By framework"

**Prompt Output:**
- Natural language summary of current view + all user comments
- Copy button
- Updates live as user clicks and comments

**Technical specs:**
- Single HTML file, all CSS/JS inline, no external dependencies
- Dark theme, system font for UI, monospace for technical details
- SVG-based rendering for the journey canvas
- Click-to-comment on nodes (for user annotation)
- Responsive — sidebar collapses on narrow viewports

After writing the HTML file, open it with `open <filename>.html`.

---

## Important Notes

- **Do not skip the scan.** Read actual source files. Do not guess what copy says — extract it.
- **Score conservatively.** Only mark green if placement genuinely follows framework principles. When in doubt, mark yellow.
- **Be specific in recommendations.** "Improve the onboarding" is useless. "Move label explanation from Email 2 to the confirmation page carousel during KB generation wait" is actionable.
- **The audit is descriptive, not prescriptive.** Present findings and recommendations. Do not implement changes.

$ARGUMENTS - Optional: product description to seed the audit (alternative to docs/product-context.md)
