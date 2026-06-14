---
name: prd
description: "Generate a Product Requirements Document (PRD) from a UI POC. Use after /ui, /component, or /page to create implementation-ready specs. Triggers on: create prd, write prd, document this, spec this out, ready for dev."
source_id: seb-claude-tools
version: 1.0.0
---

# PRD Generator for UI POCs

Convert UI proof-of-concepts into detailed Product Requirements Documents that are clear, actionable, and suitable for implementation.

---

## The Job

1. Analyze the UI POC generated in this conversation
2. Ask 3-5 essential clarifying questions (with lettered options)
3. Generate a structured PRD based on the POC and answers
4. Save to `tasks/prd-[component-name].md`

**Important:** Do NOT start implementing. Just create the PRD.

---

## Step 1: Analyze the POC

Before asking questions, analyze the most recent POC in the conversation:

```
Analyzing POC...

Found: [Component/Page Name]
Type: [component | page | section]
Design System: Swiss Design
Key Elements:
- [Element 1]
- [Element 2]
- [Element 3]
```

If no POC exists, ask: "Which UI would you like me to document? You can describe it or paste the code."

---

## Step 2: Clarifying Questions

Ask only critical questions where the POC is ambiguous. Focus on:

- **Purpose:** What problem does this UI solve?
- **Users:** Who will use this?
- **Interactions:** What behaviors are needed beyond static display?
- **Integration:** Where does this fit in the larger application?
- **Scope:** What should it NOT do?

### Format Questions Like This:

```
1. What is the primary purpose of this UI?
   A. Marketing/conversion (landing page, pricing)
   B. Data display/management (dashboard, table)
   C. User input/forms (contact, login)
   D. Navigation/wayfinding (header, nav)
   E. Other: [please specify]

2. What level of interactivity is needed?
   A. Static display only
   B. Basic interactions (hover, click)
   C. Form handling with validation
   D. Complex state management
   E. Real-time updates

3. What is the implementation scope?
   A. HTML/CSS only (static prototype)
   B. React component (interactive)
   C. Full page with routing
   D. Design system component (reusable)

4. What browsers/devices must be supported?
   A. Modern browsers only (Chrome, Firefox, Safari, Edge)
   B. Include older browsers (IE11+)
   C. Mobile-first required
   D. Desktop-only acceptable
```

This lets users respond with "1A, 2B, 3D, 4C" for quick iteration.

---

## Step 3: PRD Structure

Generate the PRD with these sections:

### 1. Introduction/Overview
Brief description of the UI component/page and the problem it solves.

Include:
- Component/page name
- Design system: Swiss Design
- POC status: Complete

### 2. Goals
Specific, measurable objectives (bullet list).

### 3. User Stories
Each story needs:
- **Title:** Short descriptive name
- **Description:** "As a [user], I want [feature] so that [benefit]"
- **Acceptance Criteria:** Verifiable checklist of what "done" means

Each story should be small enough to implement in one focused session.

**Format:**
```markdown
### US-001: [Title]
**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- [ ] Specific verifiable criterion
- [ ] Another criterion
- [ ] Typecheck/lint passes
- [ ] **[UI stories]** Verify in browser using Chrome integration
```

**Important:**
- Acceptance criteria must be verifiable, not vague. "Works correctly" is bad. "Button shows hover state with inverted colors" is good.
- **For any story with UI changes:** Always include "Verify in browser using Chrome integration" as acceptance criteria.

### 4. Design Specifications

Extract from POC:

**Typography:**
| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Helvetica Neue | 900 | var(--text-4xl) | 1.1 |
| Body | Helvetica Neue | 400 | var(--text-base) | 1.6 |

**Colors:**
| Token | Value | Usage |
|-------|-------|-------|
| --color-black | #000000 | Primary text |
| --accent | #ff0000 | CTAs, active states |

**Spacing:**
| Token | Value | Usage |
|-------|-------|-------|
| --space-4 | 1rem | Button padding |

### 5. Functional Requirements
Numbered list of specific functionalities:
- "FR-1: The component must display [element] with [style]"
- "FR-2: When a user hovers, the component must [behavior]"
- "FR-3: On mobile viewports (<640px), the component must [adaptation]"

Be explicit and unambiguous.

### 6. Interaction Specifications

**States:**
| Element | Default | Hover | Focus | Active | Disabled |
|---------|---------|-------|-------|--------|----------|
| Button | Black bg | Inverted | Red outline | Pressed | Gray |

**Transitions:**
| Property | Duration | Easing |
|----------|----------|--------|
| background-color | 150ms | ease |

**Keyboard:**
| Key | Action |
|-----|--------|
| Tab | Move focus |
| Enter | Activate |

### 7. Responsive Specifications

**Breakpoints:**
| Name | Width | Changes |
|------|-------|---------|
| Mobile | < 640px | [changes] |
| Tablet | 640-1023px | [changes] |
| Desktop | 1024px+ | [changes] |

### 8. Accessibility Requirements

- WCAG Level: AA
- Contrast: 4.5:1 minimum
- Keyboard: Fully navigable
- Screen reader: [ARIA requirements]
- Focus: Visible indicators

### 9. Non-Goals (Out of Scope)
What this component will NOT include. Critical for managing scope.

### 10. Technical Considerations
- Framework: [React, Vue, vanilla]
- Dependencies: [any required]
- Integration: [where it fits]
- File structure recommendation

### 11. Success Metrics
How will success be measured?
- "Matches Swiss Design system exactly"
- "All states implemented and verified"
- "Responsive at all breakpoints"
- "Accessibility audit passes"

### 12. Open Questions
Remaining questions or areas needing clarification.

---

## Writing for Developers

The PRD reader may be a junior developer or AI agent. Therefore:

- Be explicit and unambiguous
- Reference specific design tokens (not raw values)
- Provide the POC code as reference
- Number requirements for easy reference
- Include visual verification steps

---

## Output

- **Format:** Markdown (`.md`)
- **Location:** `tasks/`
- **Filename:** `prd-[component-name].md` (kebab-case)

---

## Checklist

Before saving the PRD:

- [ ] Analyzed POC from conversation
- [ ] Asked clarifying questions with lettered options
- [ ] Incorporated user's answers
- [ ] User stories are small and specific
- [ ] All UI stories include "Verify in browser" criterion
- [ ] Design specs extracted from POC (typography, colors, spacing)
- [ ] Functional requirements are numbered and unambiguous
- [ ] Interaction states documented
- [ ] Responsive behavior specified
- [ ] Accessibility requirements included
- [ ] Non-goals section defines clear boundaries
- [ ] Saved to `tasks/prd-[component-name].md`

---

## After PRD Generation

Offer these follow-up options:
- "Refine a specific section"
- "Generate implementation tasks/tickets"
- "Create a test plan"
- "Generate component API documentation"

$ARGUMENTS - Optional: specific component/page name to document, or "all" to document everything
