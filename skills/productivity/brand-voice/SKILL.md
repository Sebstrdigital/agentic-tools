---
name: brand-voice
description: "Define a product's brand voice and tone system. Guided interview that produces voice traits, tone map, customer language inventory, and competitive positioning. Used by /ux-copy for writing surface copy. Triggers on: brand voice, define voice, voice and tone, tone of voice, brand personality."
source_id: seb-claude-tools
version: 1.0.0
---

# Brand Voice

Define a product's voice and tone system through a guided interview. Produces a structured `docs/brand-voice.md` that captures personality traits, tone mapping, customer language, and competitive voice positioning.

---

## Prerequisites

This skill requires `docs/product-context.md`. Resolution order:
1. Look for `docs/product-context.md` in the project root
2. If not found, tell the user:

> I need product context before defining voice. Run `/product-context` first — voice must be grounded in who the user is and what transformation the product delivers.

**Read the product context file before starting.** The interview questions adapt based on what's already known (primary user, fireball, trust concerns, aha moment).

---

## The Job

1. Read `docs/product-context.md`
2. Run a guided interview (batches of 2-3 questions, wait for answers)
3. Synthesize findings into voice traits + tone map
4. Present for approval
5. Save to `docs/brand-voice.md`

**Important:** This is an interview, not a monologue. Ask questions in batches, wait for answers, then continue. Reflect back what you heard before moving to the next batch.

---

## Interview Flow

### Batch 1: Brand Personality Orientation

Use the product context to seed this conversation. You already know the primary user, their before/after state, and the fireball.

Ask:

1. **If your product were a colleague sitting next to the user, how would the user describe their personality?** Not what they do — who they are. (e.g., "calm, knows their stuff, doesn't waste my time, speaks up when something's wrong")
2. **What should your product never sound like?** Think of brands, people, or tones that would feel wrong for your users. (e.g., "never like a pushy salesperson", "never like a corporate FAQ", "never like it's trying too hard to be funny")

**Why these questions:** The first surfaces natural personality language. The second defines the boundary — the "not that" side of voice traits. Together they bracket the voice space.

### Batch 2: Customer Language

Ask:

1. **How do your users describe the problem your product solves — in their own words?** Not how you'd describe it in a pitch. What do they actually say? (e.g., "I'm drowning in emails", "I can't go on vacation without the inbox exploding", "I spend my mornings just answering the same questions")
2. **What words do your users use for key concepts?** Think about the terminology gap between your product and your user's world. (e.g., Do they say "knowledge base" or "answers"? "Draft" or "reply"? "Agent" or "assistant"?)
3. **Are there any words or phrases your product should never use?** Technical jargon, industry terms, competitor language, or anything that would confuse or alienate your user.

**Why these questions:** The product's vocabulary should mirror the user's vocabulary, not the builder's. These answers become a word list that `/ux-copy` uses directly.

### Batch 3: Competitive Voice Position

Ask:

1. **Name 2-3 products your users might compare you to** (direct competitors or adjacent products they've used). Don't worry if they're not perfect comparisons.
2. **How would you describe how those products communicate?** (e.g., "Zendesk feels corporate and enterprise-y", "Freshdesk is helpful but overwhelming", "Gmail is neutral and invisible")
3. **What emotional territory do you want to own that they don't?** (e.g., "We want to feel like a relief, not another tool to learn")

**Why these questions:** Voice must be distinct. If every competitor sounds competent and professional, "competent and professional" is table stakes, not differentiation.

### Batch 4: Emotional States & Edge Cases

Present a table of key journey moments (derived from product context) and ask the user to describe the desired emotional tone at each:

> Based on your product context, here are the key moments in the user journey. For each one, how should the product feel to the user?

| Moment | User is feeling... | Product should feel... |
|---|---|---|
| First visit (landing page) | [pre-fill from context: curious, skeptical] | ? |
| Signup / permissions | [anxious, evaluating trust] | ? |
| Waiting / processing | [uncertain, impatient] | ? |
| First value moment | [surprised, delighted] | ? |
| Needs their input | [interrupted, mildly annoyed] | ? |
| Something went wrong | [frustrated, worried] | ? |
| Ongoing daily use | [routine, efficient] | ? |

Ask:

1. **Fill in the "Product should feel" column** — use feeling words, not feature descriptions. (e.g., "reassuring", "like a tap on the shoulder", "invisible")
2. **Is there a moment where humor is appropriate?** If so, where? If not, that's fine — not every product needs humor.

---

## Synthesis

After completing the interview, synthesize into the following deliverables. Present them to the user for approval before saving.

### Synthesis Step 1: Voice Traits (3-4 traits)

Derive from Batches 1-3. Each trait follows the PatternFly format:

| Trait | Description | Do | Don't |
|---|---|---|---|
| [Trait name] | [What it means in 1 sentence] | [Specific writing behavior] | [The opposite extreme to avoid] |

**Derivation rules:**
- **Maximum 4 traits.** If you have more, merge overlapping ones.
- **Apply the table-stakes test:** Could a direct competitor claim this exact trait? If yes, make it more specific or replace it.
- **Each trait must have a constraining "Don't"** that's genuinely tempting to violate — not a strawman.
- **Traits must be grounded in Batch 1 answers** — use the user's language, not framework jargon.

### Synthesis Step 2: Tone Map

Derive from Batch 4. Position each moment on the NN/G four dimensions:

| Moment | Formality | Humor | Enthusiasm | Directness | Example line |
|---|---|---|---|---|---|
| First visit | Low | None | High | Medium | [write one] |
| Signup | Low | None | Medium | High | [write one] |
| Waiting | Low | None | Low | Medium | [write one] |
| First value | Low | Light | Medium | Low | [write one] |
| Needs input | Medium | None | Low | High | [write one] |
| Error | Medium | None | None | High | [write one] |
| Daily use | Low | Subtle | Low | High | [write one] |

**NN/G Dimensions reference:**
- **Formality:** Formal ↔ Casual
- **Humor:** Funny ↔ Serious
- **Respectfulness:** Respectful ↔ Irreverent (mapped here as general register)
- **Enthusiasm:** Enthusiastic ↔ Matter-of-fact

### Synthesis Step 3: Word List

Derive from Batch 2. Two columns:

| We say | We don't say | Why |
|---|---|---|
| [user's word] | [internal/jargon word] | [reason] |

### Synthesis Step 4: Competitive Voice Position

Derive from Batch 3. A brief paragraph or 2x2 map positioning the product's voice relative to competitors:

```
Formal ←→ Casual
  ↑
Serious    [Competitor A]     [Competitor B]
  |
  |                    ★ [Our product]
  |
Playful    [Competitor C]
  ↓
```

**Present all four synthesis outputs to the user for approval before saving.**

---

## Output

Save to `docs/brand-voice.md` with this structure:

```markdown
# Brand Voice: [Product Name]
**Date:** YYYY-MM-DD
**Product context:** docs/product-context.md

## Voice Traits

| Trait | Description | Do | Don't |
|---|---|---|---|
| [Trait] | [Description] | [Behavior] | [Anti-behavior] |

## Tone Map

| Moment | Formality | Humor | Enthusiasm | Directness | Example |
|---|---|---|---|---|---|
| [Moment] | [Level] | [Level] | [Level] | [Level] | [Line] |

## Word List

| We say | We don't say | Why |
|---|---|---|
| [Word] | [Word] | [Reason] |

## Competitive Voice Position

[Paragraph or 2x2 positioning map]

## Customer Language

### How users describe the problem
[Verbatim quotes or paraphrased language from Batch 2]

### Emotional vocabulary
[Feeling words users associate with the before/after states]

## Voice Validation Checklist

Use this when reviewing copy:

| # | Check |
|---|---|
| 1 | Does it match at least 2 of our 4 voice traits? |
| 2 | Does the tone match the moment from our tone map? |
| 3 | Does it use "We say" vocabulary, not "We don't say"? |
| 4 | Could a competitor publish this without it feeling wrong? (Should fail) |
| 5 | Read aloud — does it sound like a person talking? |
| 6 | Does it avoid every word on the "We don't say" list? |
```

---

## After Generation

Tell the user:

> Brand voice saved to `docs/brand-voice.md`. You can now run `/ux-copy` to write surface copy using this voice and tone system.

---

## Important Notes

- **3-4 traits maximum.** More traits = less useful guide. If the interview surfaces 6+ candidates, force prioritization.
- **Traits must fail the table-stakes test.** "Trustworthy" is not a voice trait — it's a hygiene factor. Every brand claims trustworthiness. Find what's specific.
- **The user knows their customer.** Frameworks inform the structure, but the user's instincts about language and personality override framework prescriptions. Present synthesis as a proposal, not a verdict.
- **Voice ≠ Tone.** Voice is constant (personality). Tone shifts with context (emotional register). The skill must produce both, clearly separated.
- **Customer language is gold.** The word list from Batch 2 is often the most immediately actionable output. It directly feeds `/ux-copy` vocabulary choices.
- **Don't skip the "Don't" column.** Traits without constraints are aspirational mush. "Friendly but not sycophantic" is actionable. "Friendly" alone is not.

$ARGUMENTS - Optional: product name or brief description to seed the interview
