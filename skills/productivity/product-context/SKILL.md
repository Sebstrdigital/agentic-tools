---
name: product-context
description: "Create a product-context.md file for use with /ux-audit and other product-aware skills. Guided interview that captures product identity, value proposition, aha moment, and user journey. Triggers on: create product context, product context, describe product."
source_id: seb-claude-tools
version: 1.0.0
---

# Product Context Generator

Create a structured `docs/product-context.md` file that captures the essential product identity, value proposition, and user journey for use by product-aware skills like `/ux-audit`.

---

## The Job

1. Check if `docs/product-context.md` already exists
2. If it exists, offer to update it or start fresh
3. Run a guided interview with the user
4. Generate the file

**Important:** This is an interview, not a monologue. Ask questions in batches of 2-3, wait for answers, then continue.

---

## Interview Flow

### Batch 1: Identity

Ask these together:

1. **What is the product name?**
2. **In one sentence, what does it do?** (Not features — what outcome does the user get?)
3. **Who is the primary user?** (Role, not demographics. "Small hotel owner managing their own inbox" not "35-54 year old business owner")

### Batch 2: Value & Aha Moment

Ask these together:

1. **What is the "before state"?** (What is the user's life like without this product? What frustrates them?)
2. **What is the "after state"?** (What does their life look like once they're using it successfully?)
3. **When does the user first feel the value?** (The specific moment — not "when they sign up" but "when they see the first AI draft in their Gmail inbox")
   - Where does this moment happen? (In your app? In an external tool? In email?)
   - How long after signup does it typically occur?

### Batch 3: What Users Need to Learn

Ask:

1. **What are the 3-5 key concepts a user must understand to get value?** (e.g., "drafts appear in Gmail", "green label means ready to send", "editing a draft teaches the AI")
2. **What are the main trust concerns?** (What makes users hesitate? e.g., "will it send emails without my permission?", "can I disconnect easily?")

### Batch 4: Journey & Constraints

Ask:

1. **What are the main touchpoints in the user journey?** (Landing page → signup → onboarding → first value → ongoing use. Be specific about what exists today.)
2. **Are there technical constraints that affect UX?** (Loading times, external dependencies, third-party tools, background processing, etc.)
3. **Anything else that shapes the experience?** (Pricing model, trial period, competitive landscape, etc.)

---

## Output Format

Generate the file with this structure:

```markdown
# Product Context

## Product
- **Name:** [name]
- **One-liner:** [what it does — outcome, not features]
- **Primary user:** [role description]

## Value Proposition
- **Before state:** [user's life without the product]
- **After state:** [user's life with the product]
- **The fireball:** [describe the transformation in the user's words, not product jargon — per Samuel Hulick's principle: describe what it feels like to throw fireballs, not what the fire flower does]

## Aha Moment
- **The moment:** [specific description of when value is first felt]
- **Where it happens:** [in-app / external tool / email / etc.]
- **Time from signup:** [estimated range]
- **Proxy metric:** [how you could measure whether the user experienced it]

## Key Concepts to Teach
1. [Concept] — [why it matters]
2. [Concept] — [why it matters]
3. ...

## Trust Concerns
1. [Concern] — [what reassurance is needed]
2. [Concern] — [what reassurance is needed]
3. ...

## User Journey (Current State)
| Step | Touchpoint | Type | Purpose |
|------|-----------|------|---------|
| 1 | [name] | page/email/in-product | [what it does today] |
| 2 | ... | ... | ... |

## Technical Constraints
- [Constraint and its UX impact]
- ...

## Additional Context
[Anything else relevant — pricing, competition, etc.]
```

---

## Save Location

- **Path:** `docs/product-context.md` (relative to project root)
- Create the `docs/` directory if it doesn't exist

---

## After Generation

Tell the user:

> Product context saved to `docs/product-context.md`. You can now run `/ux-audit` to analyze your user experience against established frameworks.

$ARGUMENTS - Optional: product name or brief description to seed the interview
