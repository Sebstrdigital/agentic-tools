---
name: refine
description: "POC refinement loop — iterate on generated UI POCs with visual, structural, and interactive adjustments until approved."
source_id: seb-claude-tools
version: 1.0.0
---

# POC Refinement Loop

Iterate on a generated POC to improve, adjust, or expand it until the design is approved.

## Trigger

Use `/refine` after generating a POC with `/ui`, `/component`, or `/page` to enter a refinement loop.

## Important: No PRD Until Approved

**Do NOT suggest or generate a PRD until the user explicitly says they are happy with the design.**

The refinement loop continues until:
- User says "done", "approved", "looks good", "ready for PRD", or similar
- User explicitly runs `/prd`

Never preemptively offer PRD generation. Focus on getting the design right first.

---

## Refinement Options

When triggered, present these options:

### Visual Adjustments
```
1. Colors      - Change accent color, adjust contrast
2. Typography  - Modify sizes, weights, spacing
3. Spacing     - Adjust padding, margins, gaps
4. Layout      - Change grid, alignment, proportions
```

### Content Changes
```
5. Copy        - Update text content, headlines, labels
6. Images      - Add/change placeholder images
7. Icons       - Add or modify icons
8. Data        - Add more realistic sample data
```

### Structural Changes
```
9. Add section    - Insert new section/component
10. Remove section - Delete existing section
11. Reorder       - Change section/element order
12. Variants      - Generate additional variants
```

### Interactive Enhancements
```
13. States     - Add hover, focus, active states
14. Animation  - Add transitions, micro-interactions
15. Mobile     - Improve responsive behavior
16. A11y       - Enhance accessibility
```

### Quick Actions
```
A. Darker     - Switch to dark mode version
L. Lighter    - Increase whitespace
B. Bolder     - More contrast, heavier type
M. Minimal    - Strip to essentials
```

---

## Refinement Process

### Step 1: Identify Current POC
```
Analyzing the most recent POC in this conversation...

Found: [Component/Page Name]
Type: [component | page | section]
Elements: [list of key elements]
```

### Step 2: Request Feedback
```
What would you like to refine?

You can:
- Choose a number/letter from the options above
- Describe the change in natural language
- Paste a reference image URL for inspiration
- Say "done" to finish refinement
```

### Step 3: Apply Changes
```
Applying refinement...

Changes made:
- [Change 1]
- [Change 2]

[Updated code output]
```

### Step 4: Continue or Complete
```
Refinement applied.

Options:
- Continue refining (describe next change)
- "/prd" to generate documentation
- "done" to finalize
```

---

## Natural Language Refinements

Accept natural language requests like:
- "Make the button bigger"
- "Use blue instead of red"
- "Add more padding around the cards"
- "Make it look more minimal"
- "Add a dark mode version"
- "The headline should be larger"
- "Add hover effects to all links"
- "Make it work better on mobile"
- "Add an image to the hero section"
- "Change the grid to 3 columns"

---

## Comparison Mode

When significant changes are made, offer:

```
Show comparison?
- Side by side (before/after)
- Diff view (changes highlighted)
- New only (just show updated version)
```

---

## Version Tracking

Keep track of iterations:

```
POC Versions:
v1 - Initial generation
v2 - Changed accent color to blue
v3 - Added hero image
v4 - Increased heading sizes
     ← Current

Commands:
- "revert to v2" - Go back to earlier version
- "compare v1 v4" - See what changed
```

---

## Swiss Design Guardrails

When refining, maintain Swiss Design principles:

**Warn if request violates principles:**
```
Note: Adding a shadow would deviate from Swiss Design.
- Swiss approach: Use a 1px border or background contrast instead

Proceed with:
1. Shadow (as requested)
2. Border (Swiss alternative)
3. Background contrast (Swiss alternative)
```

**Auto-corrections:**
- Round corners → Suggest square or 2px max
- Gradients → Suggest solid colors
- Decorative elements → Suggest removal
- Centered layouts → Suggest asymmetric option

---

## Handoff Trigger

**Only when user explicitly approves the design** (says "done", "approved", "happy with this", "ready for PRD", etc.):

```
POC approved.

When you're ready to document for development, run:
  /prd

Or continue refining with more feedback.
```

**Do NOT ask "Would you like to generate a PRD?" or suggest documentation until explicitly requested.**

---

## Behavior

1. Always show current state before asking for refinements
2. Apply changes incrementally
3. Maintain Swiss Design principles (warn on deviations)
4. Track version history for easy rollback
5. Offer PRD generation when refinement is complete

$ARGUMENTS - Optional: specific refinement request (e.g., "darker colors", "add mobile nav", "more whitespace")
