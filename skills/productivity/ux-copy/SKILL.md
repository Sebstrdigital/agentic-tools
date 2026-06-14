---
name: ux-copy
description: "Write UX copy for SaaS products. Takes product context and optional UX audit as input, defines voice/tone, then produces copy for every user-facing surface. Applies microcopy frameworks (Three Cs, Grice's maxims, PAS, Yifrah), CTA formulas, and surface-specific patterns. Triggers on: write copy, ux copy, write microcopy, onboarding copy, copy review, rewrite copy."
source_id: seb-claude-tools
version: 1.0.0
---

# UX Copy

Write production-ready UX copy for every user-facing surface. Understands the product deeply, defines voice and tone, and produces copy that drives action — not copy that describes features.

---

## Phase 1: Product Context

Before writing copy, you need product context.

**Resolution order:**
1. If `$ARGUMENTS` contains a product description or specific surface to write for, use it as seed context
2. Look for `docs/product-context.md` in the project root
3. If neither exists, tell the user:

> I need product context to write effective copy. You have two options:
> 1. Run `/product-context` to create a `docs/product-context.md` through a guided interview
> 2. Pass a brief product description as an argument: `/ux-copy AI email support agent that creates drafts in Gmail`

**Do not proceed without product context.** Copy that doesn't understand the product will be generic and ineffective.

---

## Phase 2: UX Audit Context (Optional)

Check for a recent UX audit:
1. Look for `tasks/ux-audit-*.md` files (most recent by date)
2. If found, load the touchpoint map, information architecture, and recommendations
3. If not found, proceed — but note that copy will be written without architectural guidance

When an audit exists, use its touchpoint map as the surface inventory. When it doesn't, scan the codebase for surfaces (same scan as `/ux-audit` Phase 2).

---

## Phase 3: Voice & Tone Definition

Before writing any copy, establish the product's voice and tone system.

### 3A: Voice (Constant)

Voice is the product's personality — it stays the same everywhere. Define 4 traits using this format:

| Trait | Description | This, not that |
|---|---|---|
| [Trait 1] | [What it means in practice] | [Desired quality], not [opposite extreme] |
| [Trait 2] | ... | ... |
| [Trait 3] | ... | ... |
| [Trait 4] | ... | ... |

**How to derive traits:** Read the product context — especially the fireball description, the primary user profile, and trust concerns. The voice should match how the user would describe an ideal colleague who does this job.

**Example** (for a support automation tool targeting small business owners):
| Trait | Description | This, not that |
|---|---|---|
| Competent | Knows what it's doing, doesn't need hand-holding | Confident, not boastful |
| Warm | Feels like a colleague, not a robot | Friendly, not cutesy |
| Concise | Respects the user's time | Brief, not curt |
| Transparent | Explains what it's doing and why | Honest, not defensive |

### 3B: Tone Map (Variable)

Tone shifts with context. Define tone across these scenarios using a spectrum:

| Scenario | Tone | Energy | Formality | Example |
|---|---|---|---|---|
| **First impression** (landing, signup) | Confident, warm | High | Low | "Your inbox, handled." |
| **Teaching** (onboarding, tooltips) | Helpful, clear | Medium | Low | "Green label means it's ready to send." |
| **Waiting** (loading, processing) | Reassuring, calm | Low | Low | "Scanning your inbox for patterns..." |
| **Celebrating** (success, milestones) | Warm, understated | Medium | Low | "You're all set." |
| **Alerting** (needs attention, errors) | Direct, supportive | Medium | Medium | "This one needs your input." |
| **Error/failure** | Honest, helpful | Low | Medium | "Something went wrong. Your data is safe." |
| **Upselling** (upgrade, features) | Matter-of-fact | Low | Low | "You've used 450 of 500 emails this month." |

**Present the voice and tone system to the user for approval before writing surface copy.**

---

## Phase 4: Copy Principles

Apply these principles to every piece of copy. Do not list them in the output — just follow them.

### Principle 1: Three Cs (Clear, Concise, Useful)

Every piece of copy must be:
- **Clear** — One interpretation only. No ambiguity.
- **Concise** — Minimum words for maximum meaning. Cut filler.
- **Useful** — Helps the user do something or understand something. If it doesn't, cut it.

### Principle 2: Grice's Maxims

- **Quantity** — Say enough but not too much
- **Quality** — Only say what's true
- **Relation** — Only say what's relevant right now
- **Manner** — Say it plainly, in order, without ambiguity

### Principle 3: Outcomes Over Features (Hulick Fireball)

Write about what the user **becomes**, not what the product **does**.

| Bad | Good |
|---|---|
| "AI-powered email classification" | "Know which emails need you and which don't" |
| "Automated draft generation" | "Open your inbox to find replies already written" |
| "Machine learning from your edits" | "It learns your style — fewer edits every week" |

### Principle 4: Verb + Value CTAs

CTAs follow: **[Action verb] + [Value the user gets]**

| Bad | Good |
|---|---|
| "Submit" | "Start free trial" |
| "Next" | "Connect your inbox" |
| "Click here" | "See it in action" |
| "Learn more" | "See how it works" |

### Principle 5: State → Motivation → Action (Yifrah)

For microcopy at decision points:
1. Acknowledge the user's **current state** (what they see/feel)
2. Provide **motivation** (why they should act)
3. Prompt the **action** (clear CTA)

### Principle 6: Error Golden Formula

For every error state: **What happened** + **Why it happened** (if useful) + **What to do next**

| Bad | Good |
|---|---|
| "Error 403" | "We couldn't connect to your inbox. Try signing in with Google again." |
| "Something went wrong" | "The knowledge base couldn't load. Refresh the page to try again." |

---

## Phase 5: Surface-by-Surface Copy

Write copy for each surface, grouped by journey stage. For each surface, provide:

### Output Format Per Surface

```
### [Surface Name] — [Type: page/email/in-product/modal]
**Tone:** [from tone map]
**User state:** [what the user just did, what they're feeling]
**Job:** [the single communication job of this surface]

**Copy:**

[Heading]
[Subheading/body]
[CTA]
[Supporting text / microcopy]

**Rationale:** [1 sentence: why this copy, which principle drives it]
```

### Surface-Specific Patterns

Apply these patterns based on surface type:

#### Landing Page / Hero
- **Headline:** Outcome statement (fireball, not fire flower). Max 8 words.
- **Subhead:** Expand on the how, still outcome-focused. 1-2 sentences.
- **CTA:** Verb + value. Low commitment language for first CTA.
- **Social proof:** Near CTA, not above fold. Numbers > testimonials at this stage.

#### Signup / Pre-Auth Page
- **Headline:** Restate the value, not "Sign up"
- **Trust points:** Address top 2-3 trust concerns from product context. Use specifics ("We only read emails sent to your support address") not generics ("Your data is safe").
- **Scope disclosure:** If OAuth or permissions are involved, show exactly what you access and what you don't — before the user hits the consent screen.
- **CTA:** Name the action, not the mechanism ("Connect your Gmail" not "Authorize with OAuth")

#### Loading / Processing States
- **Progress copy:** Tell the user what's happening, not just "Loading..."
- **Education opportunity:** If wait > 5 seconds, teach something useful
- **Reassurance:** For longer waits, set expectations ("This usually takes about 30 seconds")
- **Animation > static text** where possible

#### Success / Confirmation States
- **Celebrate briefly** — one line, then move to what's next
- **Bridge to value:** Tell the user exactly where value will appear and what to expect
- **Set expectations:** When will the first [value event] happen? What should they look for?

#### Welcome / Onboarding Email
- **Subject line:** Confirm what just happened + what's next (not "Welcome to [Product]")
- **One job per email.** If you need to say more, it's a second email.
- **Scannable:** Bold key phrases. Bullet points. No walls of text.
- **CTA:** One primary action. Deep link to the exact right place.

#### In-Product / Tooltips / Coach Marks
- **Maximum 15 words** per tooltip
- **Trigger on first encounter only** — don't re-explain to returning users
- **Action-oriented:** "Click send to approve this draft" not "This is the send button"

#### Error States
- **Apply Error Golden Formula** (what + why + what to do)
- **Never blame the user** — "We couldn't connect" not "You entered wrong credentials"
- **Always provide a next step** — even if it's "try again" or "contact support"
- **Use the product's voice** — errors shouldn't suddenly become robotic

#### Empty States
- **Acknowledge the blankness** — don't just show nothing
- **Explain what will appear here** and what triggers it
- **Provide an action** to fill the state if possible
- **Motivate:** Frame the empty state as "about to get good" not "nothing here yet"

#### Yellow / Attention States (Needs Input)
- **Be specific** about what's needed — never just "needs attention"
- **Show the gap** — what the AI knows and what it doesn't
- **Lower the effort** — pre-fill what you can, ask only for the missing piece
- **Affirm the value** — "You're teaching it" or "Next time, it'll know this"

---

## Phase 6: Copy Review Checklist

Before presenting the final copy, run every piece through this checklist:

| # | Check | Pass? |
|---|---|---|
| 1 | **Fireball test:** Does it describe the transformation, not the feature? | |
| 2 | **Five-second test:** Could a stranger understand the page purpose in 5 seconds? | |
| 3 | **Jargon scan:** Any technical terms the primary user wouldn't know? | |
| 4 | **Specificity test:** Could this copy apply to a competitor's product? If yes, it's too generic. | |
| 5 | **Action clarity:** Does every CTA tell the user what happens next? | |
| 6 | **Tone match:** Does the tone match the scenario from the tone map? | |
| 7 | **Length check:** Any body text over 25 words per paragraph? Any heading over 8 words? | |
| 8 | **Anxiety check:** At trust-sensitive moments, is reassurance present? | |
| 9 | **Progressive disclosure:** Is anything explained before the user needs it? | |
| 10 | **One job:** Does each surface have exactly one communication job? | |

---

## Phase 7: Output

### 7A: Copy Document

Save to `tasks/ux-copy-YYYY-MM-DD.md` with this structure:

```markdown
# UX Copy: [Product Name]
**Date:** YYYY-MM-DD
**Product context:** docs/product-context.md
**UX audit:** [path if used, or "none"]

## Voice & Tone

### Voice (4 Traits)
| Trait | Description | This, not that |
|---|---|---|
| ... | ... | ... |

### Tone Map
| Scenario | Tone | Energy | Formality | Example |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Copy by Surface

### [Journey Stage 1: Awareness]
[Surface copies...]

### [Journey Stage 2: Signup]
[Surface copies...]

### [Journey Stage 3: Onboarding]
[Surface copies...]

### [Journey Stage 4: First Value]
[Surface copies...]

### [Journey Stage 5: Ongoing Use]
[Surface copies...]

## Copy Review Results
| Surface | Fireball | 5-Sec | Jargon | Specific | Action | Tone | Length | Anxiety | Disclosure | One Job |
|---|---|---|---|---|---|---|---|---|---|---|
| [surface] | pass/fail | ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Anti-Patterns Flagged
- [Any existing copy that violates principles, with location and recommendation]

## Implementation Notes
- [Surface-specific technical notes for developers implementing the copy]
```

### 7B: Quick Mode

If `$ARGUMENTS` specifies a single surface (e.g., `/ux-copy confirmation page`), skip the full audit and write copy for just that surface. Still apply all principles and the tone map.

---

## Anti-Patterns to Avoid

Never write copy that:

1. **Leads with the product name** — "Welcome to [Product]!" (lead with value instead)
2. **Uses "just"** to minimize effort — "Just connect your Gmail" (it implies the task is trivial when it involves trust)
3. **Says "simple" or "easy"** — Let the experience prove it
4. **Uses passive voice for actions** — "Your account has been created" (say "You're in" or "Account ready")
5. **Stacks CTAs** — More than one primary CTA per viewport
6. **Uses internal language** — "tenant", "organization", "knowledge base" (use the user's words)
7. **Over-promises** — "Never answer another email again" (set realistic expectations)
8. **Uses "please"** excessively — One "please" per page maximum. It reads as insecure.
9. **Explains the obvious** — "Click the button below to continue" (the button says what it does)
10. **Uses filler transitions** — "In order to get started..." (just start)
11. **Hedges with "might" / "may"** — Be definitive or be silent
12. **Writes walls of text** — If it's more than 3 lines, break it up or cut it

---

## Important Notes

- **Voice and tone must be approved before writing surface copy.** Present the voice/tone system to the user first. The rest of the copy depends on getting this right.
- **Product context is non-negotiable.** Generic copy is worse than no copy. Every line should be specific to this product, this user, this moment.
- **Read the codebase.** Extract actual current copy from source files. You're replacing real text, not writing in a vacuum. Note what exists so the user can see before/after.
- **One job per surface.** If a surface is trying to do two things, flag it — that's an architecture problem, not a copy problem.
- **The user is the final authority.** Present copy with rationale, but the user knows their customer better than any framework.

$ARGUMENTS - Optional: specific surface to write copy for (e.g., "confirmation page", "welcome email"), or product description
