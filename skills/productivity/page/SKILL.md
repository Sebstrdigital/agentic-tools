---
name: page
description: "Swiss Design page generator — complete page layouts (landing, pricing, dashboard, blog, etc.) with responsive design."
source_id: seb-claude-tools
version: 1.0.0
---

# Swiss Design Page Generator

Generate complete page layouts following Swiss Design principles. Each page includes all necessary sections with proper structure and responsive design.

## Available Pages

Use: `/page <name>` where name is one of:

| Page | Description |
|------|-------------|
| `landing` | Marketing landing page with hero, features, CTA |
| `pricing` | Pricing plans comparison with feature lists |
| `about` | Company/team page with story and values |
| `contact` | Contact form with info and optional map |
| `login` | Authentication page (login/signup/reset) |
| `dashboard` | Admin dashboard with stats and data |
| `404` | Error page with navigation back |
| `blog` | Blog listing or single post layout |
| `portfolio` | Project showcase grid with filters |
| `product` | Product detail page with images and specs |

---

## Design Tokens (include in every page)

```css
:root {
  /* Typography */
  --font-primary: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Type Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.333rem;
  --text-xl: 1.777rem;
  --text-2xl: 2.369rem;
  --text-3xl: 3.157rem;
  --text-4xl: 4.209rem;
  --text-5xl: 5.61rem;

  /* Colors */
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-900: #1a1a1a;
  --color-gray-700: #404040;
  --color-gray-500: #737373;
  --color-gray-300: #b3b3b3;
  --color-gray-100: #e6e6e6;
  --accent: #ff0000;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;
  --space-12: 6rem;
  --space-16: 8rem;
  --space-20: 10rem;

  /* Layout */
  --container-max: 1200px;
  --grid-gutter: 2rem;
  --section-padding: var(--space-16);
}

/* Base Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: var(--font-primary);
  line-height: 1.6;
  color: var(--color-black);
  background: var(--color-white);
}
img { max-width: 100%; display: block; }
a { color: inherit; }
```

---

## Page Specifications

### landing
```
Sections:
1. Header - logo, nav (3-5 links), CTA button
2. Hero - large headline (text-4xl to text-5xl), subhead, primary CTA, optional secondary CTA
3. Logos/Social proof - client logos in grayscale, simple horizontal row
4. Features - 3-4 features in grid, icon + headline + description each
5. How it works - numbered steps or timeline, 3-4 steps
6. Testimonials - 1-3 quotes with attribution
7. CTA section - centered headline + button, contrasting background (black)
8. Footer - links, newsletter, credits

Layout: Single column, generous section padding (space-16 to space-20)
Hero: Full viewport height option or generous padding
Grid: 12-column, features typically 3 or 4 columns
```

### pricing
```
Sections:
1. Header - same as landing
2. Page header - headline "Pricing" or "Plans", optional subhead
3. Toggle - monthly/yearly switch if applicable
4. Pricing cards - 2-4 plans side by side
5. Feature comparison - table with checkmarks (optional)
6. FAQ - accordion with common questions
7. CTA - "Still have questions? Contact us"
8. Footer

Card structure: plan name, price (large), billing period, feature list, CTA button
Highlight: recommended plan with black background, white text
Layout: 3-column grid for cards, equal height
```

### about
```
Sections:
1. Header
2. Hero - company name or "About Us", brief mission statement
3. Story - 2-column layout, text + image
4. Values/Principles - 3-4 items in grid with icon + title + description
5. Team - grid of team members with photo, name, role
6. Timeline - company history milestones (optional)
7. CTA - join us, contact, or careers link
8. Footer

Team photos: grayscale, square or consistent aspect ratio
Layout: asymmetric text+image sections (5+7 or 4+8 columns)
```

### contact
```
Sections:
1. Header
2. Page header - "Contact" or "Get in Touch"
3. Two-column layout:
   - Left: Contact form (name, email, subject, message, submit)
   - Right: Contact info (email, phone, address), office hours, map placeholder
4. Footer

Form: labels above inputs, full-width fields, bold submit button
Validation: inline error messages below fields
Success: replace form with confirmation message
Layout: 6+6 or 5+7 columns
```

### login
```
Variants: login, signup, forgot password, reset password

Structure:
1. Minimal header - logo only, centered or top-left
2. Centered form card - max-width 400px
3. Form fields - email, password (+ confirm for signup)
4. Submit button - full width, primary style
5. Links - "Forgot password?", "Create account" / "Sign in instead"
6. Optional: social login buttons (secondary style)
7. Minimal footer - copyright only

Layout: vertically centered on viewport, clean background
No sidebar navigation - single focus
```

### dashboard
```
Sections:
1. Top bar - logo, search, user menu/avatar
2. Sidebar - vertical nav with icons + labels, collapsible
3. Main content area:
   - Page title + actions (buttons)
   - Stats row - 3-4 metric cards with number + label
   - Charts/graphs area - placeholder boxes
   - Data table - recent items with pagination
4. No traditional footer - minimal bottom padding

Layout: fixed sidebar (240px), fluid main content
Stats cards: large number (text-3xl), small label (text-xs uppercase)
Table: sortable columns, row actions
Mobile: sidebar becomes slide-out drawer
```

### 404
```
Structure:
1. Minimal header - logo only
2. Centered content:
   - Large "404" (text-5xl, bold)
   - Headline: "Page not found"
   - Brief message: "The page you're looking for doesn't exist."
   - Primary button: "Go home"
   - Optional: search bar or popular links
3. No footer or minimal

Layout: vertically and horizontally centered
Style: bold typography, minimal elements
```

### blog
```
Listing page:
1. Header with nav
2. Page title "Blog" or "Articles"
3. Featured post - large card, full width
4. Post grid - 2-3 columns of article cards
5. Pagination - numbered or load more
6. Footer

Single post:
1. Header
2. Post header - title (text-3xl), date, author, read time
3. Featured image - full width, 16:9
4. Post content - max-width 700px, centered, proper typography
5. Author bio - small card at end
6. Related posts - 2-3 cards
7. Footer

Article cards: image, category tag, title, excerpt, date
Typography: proper heading hierarchy, generous line-height
```

### portfolio
```
Sections:
1. Header
2. Page intro - "Work" or "Projects", brief intro
3. Filter bar - category buttons (All, Branding, Web, etc.)
4. Project grid - 2-3 columns, image-focused cards
5. Footer

Project card: image (hover reveals title), title, category
Click: link to detailed case study or modal
Filter: instant, no page reload (JS toggle visibility)
Grid: masonry optional, or fixed aspect ratios
Hover: subtle zoom or overlay with project name
```

### product
```
Sections:
1. Header
2. Breadcrumb - category > subcategory > product
3. Product section (two columns):
   - Left: image gallery (main + thumbnails)
   - Right: title, price, description, options (size/color), add to cart button
4. Tabs: Description, Specifications, Reviews
5. Related products - 4 product cards
6. Footer

Gallery: main image large, thumbnails below or side
Price: text-2xl, bold
Options: buttons or dropdown for variants
Add to cart: primary button, full width in mobile
```

---

## Output Requirements

1. Generate complete HTML page with all sections
2. Include design tokens and base CSS at top
3. Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
4. Add responsive breakpoints (mobile-first)
5. Include placeholder content (not lorem ipsum - use realistic text)
6. Add ARIA landmarks and accessibility attributes
7. Structure for easy customization

$ARGUMENTS - Page name and optional context (e.g., "landing for a design agency", "pricing with 3 plans", "dashboard for analytics app")
