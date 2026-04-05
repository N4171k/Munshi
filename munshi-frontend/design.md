# Munshi — Frontend Design System

> A refined, editorial design language for a personal finance intelligence platform.

---

## 1. Design Philosophy

Munshi is a personal finance AI companion — it handles sensitive, emotionally-loaded data (money, debt, savings, goals). The design must feel **trustworthy, calm, and intelligent** without being cold or clinical.

**Aesthetic Direction: Refined Dark Editorial**
Think private banking meets modern editorial magazine. Dense with information, yet visually quiet. Numbers and data are the heroes — the UI steps back and lets them breathe. Every element earns its place.

**Core Pillars:**
- **Clarity over decoration** — every visual choice serves comprehension
- **Confident density** — rich data without clutter, inspired by Bloomberg Terminal aesthetics made approachable
- **Warm intelligence** — dark backgrounds that feel like a late-night work session, not a hacker screen
- **Subtle motion** — animations reveal meaning, never distract

---

## 2. Color Palette

```css
:root {
  /* Backgrounds */
  --bg-base:        #0E0F13;   /* near-black base canvas */
  --bg-surface:     #15171E;   /* card / panel surface */
  --bg-elevated:    #1C1F2A;   /* modals, dropdowns */
  --bg-hover:       #22263300; /* hover state on interactive items */

  /* Borders */
  --border-subtle:  #2A2D3A;   /* dividers, card edges */
  --border-strong:  #3E4257;   /* focused inputs, active states */

  /* Text */
  --text-primary:   #F0F0F5;   /* headings, key figures */
  --text-secondary: #8B8FA8;   /* labels, captions, secondary info */
  --text-muted:     #4E5268;   /* placeholders, disabled */

  /* Brand Accent — Amber/Gold */
  --accent:         #E8A838;   /* primary CTA, highlights, active nav */
  --accent-dim:     #E8A83820; /* accent backgrounds, tinted surfaces */
  --accent-hover:   #F5BC55;   /* hover on accent elements */

  /* Semantic Colors */
  --positive:       #3DD68C;   /* income, growth, savings */
  --negative:       #F26D6D;   /* expenses, losses, warnings */
  --neutral:        #6B9CF5;   /* informational, stocks, neutral change */

  /* Chart Palette */
  --chart-1:        #E8A838;
  --chart-2:        #3DD68C;
  --chart-3:        #6B9CF5;
  --chart-4:        #F26D6D;
  --chart-5:        #A78BFA;
}
```

**Rationale:** The amber/gold accent is deliberate — gold evokes wealth and value without the cliché of green. It creates a premium, boutique finance feel distinct from generic fintech blue.

---

## 3. Typography

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

:root {
  /* Display — for large headings, hero numbers, page titles */
  --font-display: 'DM Serif Display', Georgia, serif;

  /* UI / Body — for all interface text, labels, paragraphs */
  --font-ui:      'Outfit', sans-serif;

  /* Monospace — for numbers, figures, amounts, code, IDs */
  --font-mono:    'DM Mono', 'Courier New', monospace;
}
```

### Type Scale

| Role              | Font          | Size     | Weight | Usage                              |
|-------------------|---------------|----------|--------|------------------------------------|
| `--text-hero`     | DM Serif Disp | 3.5rem   | 400    | Landing headline, empty states     |
| `--text-h1`       | DM Serif Disp | 2rem     | 400    | Page titles                        |
| `--text-h2`       | Outfit        | 1.25rem  | 600    | Section headings, card titles      |
| `--text-h3`       | Outfit        | 1rem     | 500    | Widget labels, sub-headings        |
| `--text-body`     | Outfit        | 0.9375rem| 400    | General body copy, descriptions    |
| `--text-small`    | Outfit        | 0.8125rem| 400    | Captions, timestamps, metadata     |
| `--text-figure`   | DM Mono       | varies   | 500    | All monetary values, percentages   |
| `--text-label`    | Outfit        | 0.75rem  | 500    | Form labels, tags (ALL CAPS)       |

**Key Rule:** All monetary values (`₹12,400`, `+2.4%`, `-₹340`) **always** use `DM Mono`. This creates an instant visual language — the eye learns to scan for numbers.

---

## 4. Spacing & Layout

### Grid
- **Desktop:** 12-column grid, `1280px` max content width, `24px` gutters
- **Tablet:** 8-column, `16px` gutters
- **Mobile:** 4-column, `16px` gutters, sidebar collapses to hamburger drawer

### Spacing Scale (8pt base)
```
4px   — micro gaps (icon-to-label)
8px   — tight spacing (inner card padding, tag gaps)
12px  — compact rows (transaction list items)
16px  — default element spacing
24px  — card padding, section gaps
32px  — between major sections
48px  — page-level vertical rhythm
64px  — hero / landing section breathing room
```

### Layout Architecture
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area         │
│                         │                            │
│  [Logo + Brand]         │  [Page Header]             │
│  [Nav Items]            │  [Board / Page Content]    │
│  ─────────────────      │                            │
│  [User Profile]         │                            │
│  [Settings]             │                            │
└─────────────────────────────────────────────────────┘
```

---

## 5. Component Design Specs

### Cards / Board Panels

```
Background:    var(--bg-surface)
Border:        1px solid var(--border-subtle)
Border-radius: 12px
Padding:       24px
Shadow:        0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)

Hover state:
  Border-color: var(--border-strong)
  Shadow:       0 2px 8px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.3)
  Transition:   border-color 200ms ease, box-shadow 200ms ease
```

Card titles use `--text-h3` in `--text-secondary`. The actual data dominates visually.

---

### Transaction List Items

```
Layout:     horizontal flex, space-between
Height:     56px
Border-b:   1px solid var(--border-subtle)
Padding:    0 16px

Left:
  [Category Icon 32px] → [Title + Subtitle stack]

Right:
  [Amount in DM Mono] → colored var(--positive) or var(--negative)
  [Date in --text-muted --text-small]

Hover:
  Background: var(--bg-elevated)
  Transition: background 150ms ease
```

---

### Form Inputs

```
Background:     var(--bg-elevated)
Border:         1px solid var(--border-subtle)
Border-radius:  8px
Padding:        10px 14px
Font:           Outfit 0.9375rem
Color:          var(--text-primary)

Focus:
  Border-color: var(--accent)
  Box-shadow:   0 0 0 3px var(--accent-dim)
  Outline:      none

Label:
  Font:   Outfit 0.75rem 500 UPPERCASE
  Color:  var(--text-secondary)
  Letter-spacing: 0.08em
  Margin-bottom: 6px
```

---

### Buttons

```
Primary:
  Background:    var(--accent)
  Color:         #0E0F13
  Font:          Outfit 0.875rem 600
  Padding:       10px 20px
  Border-radius: 8px
  Hover:         background var(--accent-hover), transform translateY(-1px)
  Active:        transform translateY(0)

Secondary / Ghost:
  Background:    transparent
  Border:        1px solid var(--border-strong)
  Color:         var(--text-primary)
  Hover:         background var(--bg-elevated)

Destructive:
  Background:    transparent
  Color:         var(--negative)
  Border:        1px solid var(--negative)40
  Hover:         background var(--negative)15
```

---

### Charts (Recharts / Chart.js)

```
Background:       transparent (inherits card bg)
Grid lines:       var(--border-subtle) — dashed, 1px
Axis text:        var(--text-muted), DM Mono 0.75rem
Tooltip bg:       var(--bg-elevated)
Tooltip border:   var(--border-strong)
Tooltip text:     var(--text-primary), DM Mono for values

Line charts:      2px stroke, rounded linecap, gradient fill below
Bar charts:       var(--border-subtle) gap between bars, 6px border-radius top
Pie/Donut:        3px gap between segments, inner label in DM Serif Display
```

---

### Chatbot Interface

The chatbot is a conversational AI panel — it needs warmth within the overall dark theme.

```
Container:
  Width:          380px (right drawer or embedded panel)
  Background:     var(--bg-surface)
  Border-left:    1px solid var(--border-subtle)

Message Bubbles:
  User:
    Background:   var(--accent-dim)
    Border:       1px solid var(--accent)30
    Text:         var(--text-primary), Outfit
    Alignment:    right

  AI (Munshi):
    Background:   var(--bg-elevated)
    Border:       1px solid var(--border-subtle)
    Text:         var(--text-primary), Outfit
    Alignment:    left
    Markdown:     headings → Outfit 600, code → DM Mono, bold → --accent

Typing indicator:
  3 dots, staggered pulse animation, color: var(--text-muted)

Input bar:
  Pinned to bottom
  Background: var(--bg-elevated)
  Border-top: 1px solid var(--border-subtle)
```

---

### Navigation Sidebar

```
Width:         240px
Background:    var(--bg-surface)
Border-right:  1px solid var(--border-subtle)

Logo area:
  Height:      64px
  Padding:     0 24px
  Font:        DM Serif Display 1.25rem
  Accent dot:  var(--accent) ● beside wordmark

Nav Items:
  Height:      44px
  Padding:     0 16px
  Border-radius: 8px
  Font:        Outfit 0.9375rem 400
  Icon:        20px, var(--text-secondary)
  Gap (icon-label): 12px

  Default:   color var(--text-secondary)
  Hover:     background var(--bg-elevated), color var(--text-primary)
  Active:    background var(--accent-dim), color var(--accent),
             left border 3px solid var(--accent), icon color var(--accent)
```

---

### Loader

Avoid generic spinners. Use a **pulsing ring in amber** or a **skeleton shimmer** that matches card shapes exactly.

```
Skeleton shimmer:
  Background gradient: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-hover)    50%,
    var(--bg-elevated) 75%
  )
  Background-size:    200% 100%
  Animation:          shimmer 1.5s infinite
  Border-radius:      matches target component
```

---

### Popup / Modal

```
Overlay:       rgba(0,0,0,0.7) backdrop, blur(4px)
Modal:
  Background:    var(--bg-elevated)
  Border:        1px solid var(--border-strong)
  Border-radius: 16px
  Padding:       32px
  Max-width:     480px
  Shadow:        0 24px 64px rgba(0,0,0,0.6)

Entry animation:
  From: opacity 0, scale 0.96, translateY(8px)
  To:   opacity 1, scale 1,    translateY(0)
  Duration: 200ms cubic-bezier(0.16, 1, 0.3, 1)
```

---

### Toggle Switch

```
Track width:    44px, height: 24px
Border-radius:  12px
Off:            background var(--border-strong)
On:             background var(--accent)

Thumb:
  Size:         18px circle
  Background:   white
  Shadow:       0 1px 3px rgba(0,0,0,0.4)
  Transition:   transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)
                (slight overshoot spring feel)
```

---

## 6. Motion & Animation Principles

### Rules
1. **Function first** — animations communicate state change, not decoration
2. **Fast exits, slower entrances** — 150ms out / 250ms in
3. **One easing** — use `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out) for most UI elements
4. **Spring for physical objects** — toggles, drag-and-drop use spring physics

### Page Transitions (Framer Motion)
```js
// Page enter variant
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit:    { opacity: 0, y: -8,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
}
```

### Dashboard Card Stagger (Framer Motion)
```js
const container = {
  animate: { transition: { staggerChildren: 0.06 } }
}
const card = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  }
}
```

### Number Counters
All key financial figures (balance, total expenses, portfolio value) should animate from 0 to their value on mount using a counting animation — reinforces the feeling that data just arrived and was calculated live.

### Chart Draws
- Line charts: stroke-dashoffset draw-in animation, 600ms
- Bar charts: height scales from 0, staggered 40ms per bar
- Donut: conic-gradient or SVG stroke animation, 500ms

---

## 7. Iconography

**Primary:** Lucide React (stroke-based, 1.5px, consistent)
**Supplementary:** React Icons for brand logos (stocks, platforms)

```
Default icon size:   20px
Nav icon size:       20px
Card header icon:    16px
Inline/label icon:   14px

Default color:       var(--text-secondary)
Active/accent:       var(--accent)
Positive:            var(--positive)
Negative:            var(--negative)
```

Never fill Lucide icons — they are stroke-only. Always use consistent `strokeWidth={1.5}`.

---

## 8. Data Visualization Conventions

| Data Type          | Component         | Convention                                    |
|--------------------|-------------------|-----------------------------------------------|
| Spending over time | Area / Line chart | Gradient fill, `--chart-1` line               |
| Category breakdown | Donut chart       | `--chart-1` through `--chart-5`               |
| Income vs Expense  | Grouped bar       | `--positive` vs `--negative`                  |
| Portfolio growth   | Line chart        | `--chart-3` (blue), add benchmark in dashed   |
| Single KPI         | Stat card         | Big DM Mono figure + delta badge              |

**Delta badges:**
```
Positive: background var(--positive)15, color var(--positive), "▲ 2.4%"
Negative: background var(--negative)15, color var(--negative), "▼ 1.1%"
Font: DM Mono 0.75rem 500
```

---

## 9. Responsive Behavior

| Breakpoint | Width      | Changes                                              |
|------------|------------|------------------------------------------------------|
| `sm`       | < 640px    | Single column layout, bottom tab navigation          |
| `md`       | 640–1024px | Sidebar collapses to icon rail (48px)                |
| `lg`       | 1024–1280px| Full sidebar, 2-col dashboard grid                  |
| `xl`       | > 1280px   | Full sidebar, 3-col dashboard grid, chatbot side panel |

**Hamburger Menu:** On mobile, slides in from left as a full-height drawer. Backdrop overlay, tap-outside dismisses. Entry: `translateX(-100%)` → `translateX(0)`, 280ms ease-out.

---

## 10. Accessibility

- All interactive elements: minimum `44×44px` touch target
- Focus rings: `outline: 2px solid var(--accent); outline-offset: 2px`
- Color is never the sole indicator — always pair with icon or text label
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>` where appropriate
- ARIA labels on icon-only buttons
- Charts include `<title>` and `<desc>` SVG elements for screen readers
- Motion: wrap GSAP/Framer animations in `@media (prefers-reduced-motion: reduce)` guard

---

## 11. File Organization Conventions

```
src/
  styles/
    tokens.css       ← all CSS variables (this file's source of truth)
    globals.css      ← resets, base typography, scrollbar styling
    animations.css   ← keyframe definitions (@keyframes shimmer, etc.)

  Components/
    UI/
      Button.jsx     ← accept variant prop: 'primary' | 'ghost' | 'danger'
      Card.jsx       ← standard surface wrapper with motion entry
      Badge.jsx      ← delta badges, status tags
      ...
```

---

## 12. Voice & Microcopy

Munshi means "secretary / scribe" in Hindi/Urdu — the AI is a knowledgeable assistant, not a cheerleader.

| Context              | Tone                            | Example                                    |
|----------------------|---------------------------------|--------------------------------------------|
| Empty states         | Calm, inviting, no pressure     | "No transactions yet. Add your first one." |
| Errors               | Factual, actionable             | "Couldn't load data. Try refreshing."       |
| AI responses         | Measured, precise, warm         | "Based on your last 3 months..."            |
| Loading states       | Quiet                           | No loading copy — use skeleton only        |
| Success confirmation | Minimal acknowledgment          | "Transaction added." (toast, 2s)           |

---

*This document is the canonical design reference for Munshi frontend. All component decisions should trace back to the tokens and principles defined here.*