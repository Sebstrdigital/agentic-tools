---
name: component
description: "Swiss Design component generator — self-contained UI components (buttons, cards, modals, tables, etc.) with design tokens."
source_id: seb-claude-tools
version: 1.0.0
---

# Swiss Design Component Generator

Generate individual UI components following Swiss Design principles. Each component is self-contained with design tokens included.

## Available Components

Use: `/component <name>` where name is one of:

| Component | Description |
|-----------|-------------|
| `button` | Primary, secondary, ghost, and icon buttons |
| `card` | Content cards with image, text, and action variants |
| `input` | Text inputs, textareas, selects with labels and validation |
| `nav` | Horizontal and vertical navigation with active states |
| `header` | Page headers with logo, nav, and optional CTA |
| `footer` | Site footers with links, newsletter, and credits |
| `modal` | Dialog overlays with backdrop and close behavior |
| `table` | Data tables with sorting and responsive patterns |
| `tabs` | Tabbed content with keyboard navigation |
| `accordion` | Expandable content sections |

---

## Design Tokens (include in every component)

```css
:root {
  --font-primary: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.333rem;
  --text-xl: 1.777rem;
  --text-2xl: 2.369rem;

  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-700: #404040;
  --color-gray-500: #737373;
  --color-gray-300: #b3b3b3;
  --color-gray-100: #e6e6e6;
  --accent: #ff0000;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;

  --transition: 0.15s ease;
}
```

---

## Component Specifications

### button
```
Variants: primary (black bg), secondary (outlined), ghost (text only), icon
States: default, hover (invert colors), focus (accent outline), disabled (gray)
Sizes: small (text-xs, py-2 px-4), medium (text-sm, py-3 px-6), large (text-base, py-4 px-8)
Style: uppercase, bold, letter-spacing 0.05em, square corners, 2px border
```

### card
```
Structure: optional image (top), content area, optional actions (bottom)
Variants: default (border), elevated (dark bg), minimal (no border, subtle bg)
Image: aspect-ratio 16/9 or 4/3, grayscale or high contrast
Spacing: padding space-5, gap space-4 between elements
No shadows - use 1px border or background contrast
```

### input
```
Structure: label (above, bold), input field, optional helper/error text
Variants: underline (border-bottom only), bordered (full border), filled (gray bg)
States: default, focus (accent border, 2px), error (red border), disabled
Label: text-sm, font-weight-bold, uppercase optional for short labels
Input: text-base, py-3, full width, no border-radius
```

### nav
```
Variants: horizontal (desktop), vertical (sidebar), mobile (slide-out)
Active state: font-weight-bold + underline (2px, accent color)
Hover: underline appears
Spacing: gap space-6 horizontal, gap space-3 vertical
Style: text-sm uppercase or text-base sentence case
No dropdowns on hover - click to expand if needed
```

### header
```
Structure: logo (left), nav (center or right), CTA button (right)
Height: space-16 to space-20
Position: fixed or static
Border: 1px bottom border, no shadow
Mobile: hamburger icon, slide-out nav
Logo: text-based or simple geometric mark
```

### footer
```
Structure: main links (columns), secondary links, newsletter, credits
Layout: 3-4 column grid on desktop, stacked on mobile
Spacing: py-12 to py-16, generous gaps
Background: black or gray-100
Links: text-sm, regular weight, underline on hover
Credits: text-xs, gray-500, bottom
```

### modal
```
Structure: backdrop (semi-transparent black), dialog box, close button
Width: max-width 500px (small), 700px (medium), 900px (large)
Backdrop: rgba(0,0,0,0.8), click to close
Dialog: white bg, p-6 to p-8, square corners
Close: X icon top-right or text button bottom
Animation: fade in backdrop, slide up dialog
Focus trap: keep focus inside modal when open
```

### table
```
Structure: thead with th cells, tbody with td cells
Header: uppercase, text-xs, font-bold, bg gray-100, border-bottom 2px
Rows: border-bottom 1px, py-4
Hover: subtle bg change (gray-50)
Responsive: horizontal scroll or card layout on mobile
Sorting: arrow icons in headers, active column bold
Alignment: text left, numbers right
```

### tabs
```
Structure: tab list (horizontal), tab panels (content areas)
Tab style: text buttons, active has underline (2px accent) and bold
Spacing: gap space-6 between tabs, pt-6 for panel
Keyboard: arrow keys navigate, Enter/Space activate
ARIA: role="tablist", role="tab", role="tabpanel", aria-selected
Animation: none or subtle fade
No background on tabs - underline only
```

### accordion
```
Structure: list of items, each with header (trigger) and panel (content)
Header: full-width button, text left, icon right (+ or arrow)
Panel: collapsible with smooth height transition
Style: border-bottom 1px between items
Icon: rotates on open (arrow) or changes (+ to -)
Spacing: header py-4, panel py-4 pb-6
ARIA: aria-expanded, aria-controls, proper button element
Multiple open: allow by default unless specified
```

---

## Output Requirements

1. Generate complete, working HTML + CSS
2. Include design tokens at the top
3. Add all interactive states (hover, focus, active, disabled)
4. Include ARIA attributes for accessibility
5. Make it responsive (mobile-first)
6. Add brief usage example in HTML comment

$ARGUMENTS - Component name and optional customization (e.g., "button primary large", "card with image", "input with validation states")
