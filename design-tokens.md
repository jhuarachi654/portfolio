# Design Tokens

Two sources are documented here:

1. **Current site** — values extracted from the Framer export, for reference.
2. **New design system** — the target values for the rebuild, including confirmed direction from `reference/drawing-board.html`.

---

## 1. Current site (extracted from Framer export)

### Colors

| Token | Value | Framer usage |
|---|---|---|
| Navy (primary) | `#1E4B9A` / `rgb(30, 75, 154)` | All headings + body text via style presets |
| Navy dark | `rgb(22, 43, 85)` / `#162B55` | Hover / darker brand shade |
| Red (old accent) | `rgb(205, 57, 42)` / `#CD392A` | Being replaced by teal in rebuild |
| Pink (old accent tint) | `rgb(253, 236, 233)` / `#FDECE9` | Being replaced by teal-tint in rebuild |
| White | `#FFFFFF` | Page background, cards |
| Gray 500 | `rgb(113, 113, 123)` / `#71717B` | Secondary text, borders |
| Gray 200 | `rgb(228, 228, 231)` / `#E4E4E7` | Dividers |
| Gray 100 | `rgb(244, 244, 245)` / `#F4F4F5` | Subtle surfaces |
| Gray 50 | `rgb(250, 250, 250)` / `#FAFAFA` | Off-white surfaces |
| Zinc 800 | `rgb(39, 39, 42)` / `#27272A` | Near-black text |
| Warm paper | `rgb(248, 246, 243)` / `#F8F6F3` | Background on project pages |
| Blue link | `#416BCC` | Links |

### Typography (Framer)

Families used: **Space Grotesk** (sans, dominant) and **Domine** (serif, display headings).

| Role | Family | Size | Weight | Line height |
|---|---|---|---|---|
| Display / hero | Space Grotesk | 112px (76–96px at breakpoints) | 700 | 0.9em |
| H1 | Domine | 34px | 700 | 1.4em |
| H2 | Domine | 28px | 700 | 1.4em |
| H3 / large body | Space Grotesk | 20px | 700 | 1.5em |
| Body emphasis | Space Grotesk | 16px | 700 | 1.6em |
| Body / captions | Space Grotesk | 13px | 400 | 1.2em |

Paragraph spacing: `30px`.

### Spacing (Framer)

Gap scale used: `2, 4, 6, 8, 10, 16, 24, 32, 48, 64px` — effectively 8px-based with small 2/4/6 steps for tag clusters.

Common paddings: `0 20px` (mobile gutter), `64px 0` and `48px 0` (section rhythm), `12px` / `14px` (buttons, tags).

### Border radii (Framer — not carrying over)

`4px` tags · `8px` cards · `40–100px` pills · `50%` dots. Replaced with sharp corners in the rebuild.

---

## 2. New design system (target for rebuild)

### Colors

| Token name | Value | Usage |
|---|---|---|
| `navy` | `#1E4B9A` | Primary brand: headings, body text, borders, interactive states |
| `navy-dark` | `#162B55` | Hover / pressed states |
| `teal` | `#29C4B0` | Accent: highlights, tags, focus rings, CTAs |
| `teal-grid` | `rgba(29,195,176,0.12)` | Drawing board canvas grid lines (28px) |
| `teal-tape` | `rgba(41,196,176,0.35)` | Drawing board sticky note tape |
| `teal-tint` | `#E5F8F5` | Soft accent surface (replaces old pink `#FDECE9`) |
| `paper` | `#FFFFFF` | Default background |
| `paper-warm` | `#FFFEF5` | Drawing board canvas, sticky note background |
| `secondary` | `#71717B` | Secondary text, helper labels |
| `border` | `rgba(30,75,154,0.15)` | Subtle navy borders (from drawing board) |

Draw palette (6 swatches, drawing board modal):
`#1E4B9A` · `#29C4B0` · `#E84545` · `#F5A623` · `#6B5CE7` · `#222222`

### Typography

**Font pairing confirmed from `reference/drawing-board.html`:**
- **Domine** (serif) — display headings, modal `h2`s, empty-state prose
- **Space Grotesk** (sans) — everything else: body, UI, labels, buttons, captions

```
@import url('https://fonts.googleapis.com/css2?family=Domine:wght@400;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap');
```

> For self-hosting: download woff2 variants of both at the same weights and serve from `public/fonts/`. Prefer self-hosted over Google Fonts to avoid waterfall request.

Type scale for rebuild (carries over from Framer with Domine taking H1/H2 roles):

| Token | Family | Size | Weight | Line height | Usage |
|---|---|---|---|---|---|
| `display` | Space Grotesk | 76–112px responsive | 700 | 0.9 | Hero descriptor rotation |
| `h1` | Domine | 34px | 700 | 1.4 | Page titles, case study names |
| `h2` | Domine | 28px | 700 | 1.4 | Section headings, modal titles |
| `h3` | Space Grotesk | 20px | 700 | 1.5 | Sub-section headings |
| `body-lg` | Space Grotesk | 16px | 500–600 | 1.6 | Lead text |
| `body` | Space Grotesk | 16px | 400 | 1.6 | Default body |
| `caption` | Space Grotesk | 13px | 400 | 1.2 | Tags, labels, meta |
| `label-sm` | Space Grotesk | 11–12px | 400–500 | 1.0 | Sticky note names, hints |

### Shape

Sharp corners globally: `border-radius: 0` by default.

Intentional exceptions (from drawing board, carry over):
- `2px` — sticky note cards (barely-there softening)
- `1px` — sticky tape
- `8px` — draw canvas inner wrapper, text input, tool buttons
- `10px` — modal action buttons
- `16–20px` — modal sheet (mobile bottom sheet pattern, desktop centered)
- `50% / 100px` — zoom control pill, close button, color swatches

### Grid & rhythm

- **20px line grid background** — page-level, horizontal rules every 20px as a visible texture:
  ```css
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 19px,
    rgba(30,75,154,0.08) 19px,
    rgba(30,75,154,0.08) 20px
  );
  ```
- **Drawing board canvas grid** — 28px square grid in teal at 12% opacity (different from the page grid — this is the canvas world):
  ```css
  background-image:
    linear-gradient(to right, rgba(29,195,176,0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(29,195,176,0.12) 1px, transparent 1px);
  background-size: 28px 28px;
  ```
- **Vertical rhythm**: section spacing in multiples of 20px; component spacing on an 8px scale.

### Cursors

Custom **sparkle SVG cursor** on the main portfolio pages. Exact SVG TBD (design before scaffold). The drawing board overrides to `grab` / `grabbing` on the board view and `crosshair` on the draw canvas — these stay as-is.

Example placeholder approach (replace SVG inline once finalized):

```css
body {
  cursor: url('/cursors/sparkle.svg') 12 12, auto;
}
#board-view { cursor: grab; }
#board-view.panning { cursor: grabbing; }
#draw-area { cursor: crosshair; }
```

### Tailwind config (proposed)

```js
// tailwind.config.js — draft, do not implement yet
export default {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1E4B9A',
          dark: '#162B55',
        },
        teal: {
          DEFAULT: '#29C4B0',
          tint: '#E5F8F5',
          grid: 'rgba(29,195,176,0.12)',
          tape: 'rgba(41,196,176,0.35)',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          warm: '#FFFEF5',
        },
        secondary: '#71717B',
        border: 'rgba(30,75,154,0.15)',
      },
      fontFamily: {
        serif: ['Domine', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
      },
      backgroundImage: {
        'line-grid': 'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(30,75,154,0.08) 19px, rgba(30,75,154,0.08) 20px)',
        'canvas-grid': 'linear-gradient(to right, rgba(29,195,176,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,195,176,0.12) 1px, transparent 1px)',
      },
      backgroundSize: {
        'canvas-grid': '28px 28px',
      },
    },
  },
}
```
