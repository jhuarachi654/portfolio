# PRD — Johanna Huarachi Portfolio Rebuild

**Status:** Draft for review — nothing has been built yet.
**Date:** June 12, 2026

---

## 1. Overview

Rebuild johanna-huarachi.com (currently a Framer site) as a hand-coded **Vite + React + Tailwind CSS** portfolio. The Framer export has been mined into foundation files; this rebuild replaces Framer's generated markup with a clean, fast, fully-owned codebase and a refreshed design system.

**Who:** Johanna Huarachi — Multidisciplinary Designer & Builder, MDes Interaction Design @ CCA (graduating August 2026), based in SF, prev. PROS & DNC.

**Primary goal of the site:** Land design roles. Make case studies easy for recruiters/hiring managers to scan. Demonstrate craft through the site itself.

---

## 2. Source material (already extracted)

| Location | Contents |
|---|---|
| `content/*.md` | Text from all 10 pages, one file per page, with `<!-- section: -->` markers. FAQ answers recovered from the Framer JS bundle are merged into `index.md`. |
| `design-tokens.md` | Current-site values + target design system with proposed Tailwind config. |
| `public/images/<project>/` | 110 unique images (best-resolution variant of each), organized by the page that uses them. `manifest.tsv` maps each file to its Framer ID and alt text. |
| `reference/drawing-board.html` | **The working Doodle Board** — complete self-contained HTML with Supabase backend. This is the source of truth for the `/draw` React component. Do not deviate from its behavior. |
| `sitesucker-export/` | Original Framer export — reference only, not used at runtime. |

---

## 3. Design system

See `design-tokens.md` for the full token table and Tailwind config. Key decisions:

| Decision | Value |
|---|---|
| Display / headings | **Domine** (serif) — H1, H2, modal titles, case study chapter headers, empty-state prose |
| Body / UI | **Space Grotesk** (sans) — everything else |
| Primary color | Navy `#1E4B9A` |
| Accent color | Teal `#29C4B0` (replaces current-site red `#CD392A`) |
| Background | White `#FFFFFF` with 20px horizontal line grid overlay (navy, 8% opacity) |
| Corners | Sharp (`border-radius: 0`) globally, intentional exceptions per component (see `design-tokens.md`) |
| Cursor | Custom sparkle SVG on portfolio pages; `grab`/`grabbing` on draw board; `crosshair` on draw canvas |

---

## 4. Site map

```
/                         Home
/work                     Featured Work index
/work/fare-finder         Case study — PROS Fare Finder Map
/work/revenue-management  Case study — PROS Revenue Management
/work/expert-ai           Case study — Expert.ai filtering redesign
/work/dnc                 Case study — Democratic National Committee
/about                    About
/play                     Side projects & explorations
/draw                     Collaborative Drawing Board (Supabase-backed)
/contact                  Contact
```

**URL note:** Current flat URLs (e.g. `/fare-finder.html`) move under `/work/`. If backward-compatibility matters, alias both routes in the router — no server config needed for a client-side SPA.

**Cards-only projects** (on home + /work, no case-study page yet): Popple, SnapSplit, Love Lives in SF, Canopy. These stay as project cards with external links or "case study coming soon." Do not create stub pages.

---

## 5. Component inventory

Derived from recurring Framer sections and `reference/drawing-board.html`.

### Global
- `Nav` — logo ("Johanna Huarachi"), links (Home / Works / About / Play / Draw / Contact), Resume button
- `Footer` — email · LinkedIn · "Made with Iced Hojichas, genuine thought, and delight"
- `LineGridBackground` — `repeating-linear-gradient` at 20px, applied to `<body>` or a fixed underlay
- `SparkleCustomCursor` — SVG cursor, desktop only (pointer-events override on mobile/touch)
- `Button` — primary navy / accent teal, sharp corners, two sizes (default 44px, small 38px)
- `TagChip` — small label, sharp corners, navy border or teal fill

### Home page (`/`)
- `Hero` — "Hi, I'm Johanna, a ___" with rotating descriptor (see §6)
- `TagRow` — "Based in SF" · "MDes @ CCA" · "Figma Campus Leader"
- `ProjectCard` — thumbnail, title, description, tag chips; used on home grid and `/work`
- `FAQAccordion` — five questions, expand/collapse (see content/index.md for all Q&A)
- `SocialLinks` — email + LinkedIn

### Case study pages (`/work/*`)
- `CaseStudyHero` — title (Domine H1), role / timeline / tools meta row
- `SectionHeading` — Domine H2 for chapter titles
- `StatCallout` — large number + label (e.g. "40% / 60%")
- `ImageFigure` — image + optional caption
- `QuoteBlock` — pull quote
- `NextProject` — footer nav between case studies

### Drawing Board (`/draw`) — see §7 for full spec
- `DrawBoard` — the entire page; wraps all sub-components
- `CanvasWorld` — 4000×3000 pan/zoom world
- `StickyNote` — individual drawing card (canvas + name + tape)
- `Toolbar` — zoom controls + "Draw something" button
- `DrawModal` — bottom sheet (mobile) / centered modal (≥600px)
  - `DrawCanvas` — freehand canvas
  - `DrawTools` — color swatches, brush size dots, Pen/Clear buttons
  - `NameInput` — optional name field
  - `DrawModalActions` — Preview → / Post / Back buttons
- `VisitorBadge` — "N visitors have drawn here"
- `HintBanner` — "drag to pan · use + − to zoom" (fades after 4s)

---

## 6. Hero — rotating descriptor

The hero headline reads: **"Hi, I'm Johanna, a ___"** where `___` cycles through:

```
product_designer
design_advocate
design_builder
```

Implementation: a CSS or JS text-rotation component that swaps the word every ~2–3s with a fade or clip animation. The underscore-separated format is intentional (matches the aesthetic of the current site tag labels). Use Domine bold for the rotating word at display scale.

---

## 7. Drawing Board — React conversion spec

**Source of truth:** `reference/drawing-board.html` — preserve every behavior exactly.

### Supabase connection

```
SUPABASE_URL = https://jwjpnwxzpjtjigquuism.supabase.co
SUPABASE_KEY = sb_publishable_HIcPdHfVH7_58p5skQFVNg_DNqCKa7R  (publishable anon key)
```

Store both in `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`.

Tables:

| Table | Columns |
|---|---|
| `drawings` | `id`, `name`, `image_url` (base64 PNG data URL), `position_x`, `position_y`, `rotation`, `created_at` |
| `visitors` | `created_at` |

### State & behavior to preserve (do not simplify away)

| Feature | Detail |
|---|---|
| **Canvas world** | `4000 × 3000px`, `transform-origin: 0 0`, CSS transform (`translate + scale`) |
| **Pan — mouse** | `mousedown` → track delta → `mousemove` → `mouseup`; cursor switches `grab` → `grabbing` |
| **Pan — touch** | Single touch pans; 2-finger pinch zooms around the pinch midpoint |
| **Zoom buttons** | Factor `1.35` per step; zoom around viewport center; range `0.15–3.0` |
| **Recenter** | `fitToContent()` — fits all sticky bounding box to viewport with 8% padding; falls back to cluster origin `(1200, 900)` if board is empty |
| **Sticky placement** | `findFreeSlot()` — spiral search outward from cluster origin `(1200, 900)` in `STICKY_W=240 × STICKY_H=270` grid units; overlap detection via `placedRects[]` |
| **Sticky render** | 220px wide card, `#FFFEF5` background, `2px` radius, navy box-shadow, teal tape `(41,196,176,0.35)`, `196×196` canvas element with `drawImage()`, Space Grotesk 11px name below |
| **Modal flow** | draw-view → Preview → preview-view → Post or ← Edit |
| **Draw canvas** | `devicePixelRatio` scaling on resize; pen: `lineCap/lineJoin: round`; dot on mousedown; line on mousemove |
| **Colors** | 6 swatches: `#1E4B9A` · `#29C4B0` · `#E84545` · `#F5A623` · `#6B5CE7` · `#222222` |
| **Sizes** | 3 brush sizes: `3px` · `6px` · `12px` |
| **Post** | Saves to `drawings` table; generates fallback name `visitor_XX`; fires-and-forgets a row into `visitors`; pans to the new sticky; re-enables button |
| **Polling** | `setInterval` every 8s — fetches last 5 drawings, appends any new ones (id diff) |
| **Empty state** | Domine italic "Be the first to leave your mark" + teal Space Grotesk uppercase label; hides when first sticky renders |
| **Hint banner** | Fades after 4s or on first pan/zoom/scroll interaction |
| **Responsive modal** | `align-items: flex-end` on mobile → `align-items: center` at ≥600px; modal gains `border-radius: 16px` at ≥600px (intentional exception to sharp-corner rule) |

### Component structure (React)

```
<DrawBoard>
  <VisitorBadge count={drawings.length} />
  <HintBanner />
  <EmptyState visible={drawings.length === 0} />
  <BoardView onPan onPinch>          {/* pan/zoom container */}
    <CanvasWorld transform={…}>      {/* 4000×3000 div with CSS transform */}
      {drawings.map(d => <StickyNote key={d.id} drawing={d} />)}
    </CanvasWorld>
  </BoardView>
  <Toolbar>
    <ZoomControls onZoomIn onZoomOut onRecenter />
    <DrawButton onClick={openModal} />
  </Toolbar>
  <DrawModal open={modalOpen} onClose={closeModal}>
    <DrawView />   {/* or <PreviewView /> based on modal step */}
  </DrawModal>
</DrawBoard>
```

Use `useRef` for canvas, `useCallback` for event handlers. Lift `drawings` state and `panX/panY/scale` into `DrawBoard`. Do not use a global store — all state is local to this page.

---

## 8. Tech stack

| Layer | Choice |
|---|---|
| Bundler | Vite |
| UI | React 18 + TypeScript |
| Styles | Tailwind CSS v4 |
| Routing | `react-router-dom` v6, SPA mode |
| Fonts | Domine + Space Grotesk, self-hosted woff2 or Google Fonts import |
| Images | `public/images/<project>/` originals; compress to WebP + responsive `srcset` before launch |
| Backend | Supabase (drawing board only — direct REST, no SDK needed, matches the reference implementation) |
| Deploy | TBD (Vercel or Cloudflare Pages both work for a static Vite build) |

Content strategy: case-study copy hand-translated from `content/*.md` into JSX. Case studies are too image-heavy and layout-specific to use a generic markdown renderer.

---

## 9. Success criteria

- All 10 pages rebuilt with content parity against `content/*.md`.
- Drawing board behavior exactly matches `reference/drawing-board.html`.
- Lighthouse ≥ 95 performance / ≥ 95 accessibility on home and one case study.
- Home page total transfer weight < 1MB.
- Zero border-radius globally except the documented intentional exceptions.
- Domine used for all H1/H2 and modal headings; Space Grotesk for everything else.
- Hero rotation cycles through `product_designer` → `design_advocate` → `design_builder`.
- Sparkle SVG cursor active on all non-draw pages.

---

## 10. Open questions (answer before scaffold)

1. **Sparkle cursor SVG** — share the SVG art so we can implement it. Until then it'll be a placeholder.
2. **Resume PDF** — link to a hosted URL or a file in `public/`?
3. **Contact form** — wire to a service (Formspree, Resend, etc.) or keep as mailto/social links only?
4. **Hero animation style** — crossfade, slide up, typewriter, or clip-path reveal for the rotating word?
5. **URL backward-compat** — do you need `/fare-finder` (old flat path) to still work alongside `/work/fare-finder`?
6. **Image compression pipeline** — do you want this as part of the build (Vite plugin) or a one-time manual step?

---

## 11. Build phases (after PRD approval)

1. **Scaffold** — Vite + React + TS, Tailwind with token config, font setup, `LineGridBackground`, `SparkleCustomCursor`, `Nav`, `Footer`, routing shell.
2. **Home** — `Hero` with rotating descriptors, `ProjectCard` grid, `FAQAccordion`, `SocialLinks`.
3. **Drawing Board** (`/draw`) — convert `reference/drawing-board.html` to React. This phase is self-contained; build and test it in isolation before integrating.
4. **Case studies** — `Fare Finder` first (richest content, best template), then Revenue Management, Expert.ai, DNC. One component template pass, then fill per-project.
5. **Secondary pages** — `/work` index, `/about`, `/play`, `/contact`.
6. **Polish** — image optimization (WebP + srcset), motion/transitions, accessibility audit, Lighthouse, deploy.
