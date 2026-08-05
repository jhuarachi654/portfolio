# Case Study Design System

`src/pages/work/ExpertAIPage.tsx` is the **master reference** for case study design, layout, and styling. When building or editing any case study page (Fare Finder, DNC, Revenue Management, Expert.ai, or future ones), match these standards unless the user explicitly says otherwise. When a rule below doesn't cover a new situation, check in with the user rather than inventing a new pattern.

## Typography

- **Chapter titles** (e.g. "3. Research"): number span — `font-landing-heading`, `28px`, `weight 300`, `color: var(--color-navy)`; heading — `font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal`, `font-display`, `28px`. Every chapter has this number+heading row followed by the bordered divider bar (see "Layout patterns" below).
- **Subheadings** (`SubHeading` component): `24px`, `font-landing-heading`, `weight 400`, `lineHeight: normal`, color `var(--color-cs-heading)`.
- **Body text** (`BodyText` component): `15px`, `font-landing-body`, `color: var(--color-secondary)`, `lineHeight: normal`. Note: on case study pages, the site-wide `.cs-page p {...} !important` rule silently forces the *actual* rendered `<p>` values to `font-weight: var(--type-body-weight)` (350), `line-height: var(--type-body-line-height)` (1.7), `color: #222225` regardless of inline/BodyText styles — this is the true computed body-text style and is now also the standard for `.case-study-card-description` on the landing page, for consistency across the whole site.
- **Small uppercase labels** (tags, stat labels, quote roles, option labels like "Wireframe Tests"): `cs-caption-label` class + inline `fontWeight: 600`, `12px`, `color: var(--color-secondary)`, `tracking-[0.12em] uppercase`.
- **Image/figure captions**: `cs-caption` class — `13px` (forced via CSS), `weight 500`, `color: var(--color-secondary)`, `opacity: 0.7`, centered.
- **Wireframe-test carousel labels** (the caption identifying which option/state is showing inside a sliding `ImageCarousel`, e.g. "Destinations," "Entry Point"): use `cs-caption` below the image, not `cs-caption-label` above it. This is now the standard everywhere, including option cards that pair a label with Pros/Cons (Expert.ai's `AccessibilityExplorer`, RM's `MyMarketsExplorer`/`AIPlacementExplorer`) — those used to keep the older bold `cs-caption-label`-above-image pattern, but were brought in line with the rest. The image itself also stays borderless in this pattern (no `1px solid` wrapper).
- **"TL:DR"-style meta labels**: match `ChallengeBanner`'s label exactly — `font-sans font-semibold tracking-[0.12em] uppercase`, `12px`, `color: var(--color-cs-heading)`, `opacity: 0.5`.
- **`line-height: 'normal'` is the standard everywhere** on case study pages — never 1.4/1.6/1.7 etc. For `<h1>/<h2>/<h3>` this requires the `cs-lh-normal` class, since a site-wide `!important` rule otherwise locks heading line-height regardless of inline style.

## Color

- **Blue accent**: `#416BCC` — used for icons, arrow callouts, Asterisk bullets, and stat numbers. This is the accent color everywhere on case study pages (not `var(--color-navy)`, which reads darker and should not be introduced for new accents).
- **Real body/bullet-text color**: `#222225` (hardcoded) — used for primary bullet/quote copy (ConstraintCard, FeedbackCard, "New Guidelines" list, Pros/Cons, quote text). `var(--color-secondary)` renders lighter/grayer and is reserved for secondary/supporting text (descriptions, captions) — don't use it for primary bullet copy.

## Cards & containers

- **Standard card**: `border: 1px solid rgba(var(--color-navy-rgb),0.2)`, `border-radius: 8px`. This is the only card style — no 12px radius or 0.15 border-opacity variants.
- **Icon sizing** inside cards/headings: `fontSize: 'clamp(20px, 3vw, 28px)'`, color `#416BCC`.
- **Bullet marker**: blue `Asterisk` icon (phosphor, `size={16}`, `weight="bold"`, `#416BCC`) — the standard bullet glyph for lists, replacing arrows/dots/checkmarks.
- **Arrow callouts** (`→` before a takeaway/insight paragraph): `color: '#416BCC'`, `fontSize: 18`, paired with body text at `15px`.
- **Dividers before callouts**: `<hr>` with `borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)'`, `margin: '24px 0 16px'`.
- **Hero image/video box**: `border: 1px solid rgba(var(--color-navy-rgb),0.2)`, `padding: 32` (framing the media with a visible matte, not edge-to-edge), **no box-shadow**. On dark-background heroes (RM's `#12213a`, DNC's navy gradient) drop the border opacity to `0.1` — at `0.2` it reads as a visible dark ring since there's less contrast than on light backgrounds like Expert.ai's. Exception: Revenue Management's hero Lottie stays edge-to-edge with no padding — deliberate call, don't "fix" it back to padded. No pre-heading tagline label (e.g. "PROS", "Democratic National Committee") above the H1 — the H1 is the first thing in the text block, directly under the hero media.
- **"Explore more work" card** (shared `NextProject` component, used site-wide): `border: 1px solid`, no shadow.
- **Persona cards** (`PersonaCard`, used in Revenue Management and Fare Finder): type badge → 64–80px circular avatar → name → location/role row (`MapPin`/`Gear` icons, `13px`, `rgba(var(--color-navy-rgb),0.4)` icon color, `var(--color-secondary)` text) → divider → Goals/Needs lists. The "Goals:"/"Needs:" list labels use the plain `FeedbackCard`-style label — `font-landing-body`, `15px`, `color: var(--color-secondary)`, not bold — not the bold `cs-serif-label` style (that one is reserved for card titles like `ConstraintCard` and one-off list labels like "New Guidelines").

## Spacing

- **Gap between subsections within a chapter**: `marginTop: 108` on the wrapping div.
- **Gap between the chapter divider bar and the first subsection**: `32px` — smaller than the 108px used between later subsections. Hand-roll the chapter's number+heading+divider block directly in the page (don't route it through the shared `SectionHeading` component when there's no `heading` text) and bake the `32px` in as `marginBottom` on the divider div itself, so the gap holds regardless of what the first child happens to be.
- **Gap for "content + visual" two-column grids** (text next to image/video): `gap: 32`.
- **Gap for item lists** (bullets, feedback lists, quote stacks): `gap: 12`.
- **Gap for stat/quote card-grid pairs**: `gap: 16` (both the grid gap and the vertical margin between two stacked grids of this type).

## Layout patterns

- Every chapter section: number+heading row → bordered divider bar (`borderTop/Left/Right: 1px solid rgba(var(--color-navy-rgb),0.2)`, `borderRadius: '12px 12px 0 0'`, `height: 32`) → first subsection at `32px` below the divider → later subsections within the same chapter at `marginTop: 108` from each other. No chapter should skip the divider bar.
- Two-column grids that need to stay horizontal on tablet (not just desktop) get a dedicated class and a matching `@media (min-width: 768px) and (max-width: 1199px)` exception in `index.css`, since a blanket rule otherwise collapses all two-column grids to one column at tablet width. See `index.css` near the end of the file for the existing exception list (`ea-accessibility-grid`, `ea-solution-grid`, `ea-comparison-grid`, `ea-unexpected-find-grid`, `ea-feedback-grid`, `ea-takeaways-grid`, etc.) as the pattern to extend.
- **Full-width single-column figures** (diagrams, flowcharts, or screenshots that span the whole section width — not part of a two-column grid) get the `cs-fullwidth-figure` class, which narrows them to `90%` width (centered) on tablet and desktop via `@media (min-width: 768px)`, staying full width on mobile. Same mechanism as `ea-quotes-container`. Don't apply this to images that are already one side of a two-column content+visual grid, and don't apply it to grids (e.g. persona-card pairs) — figures only.

## Process notes

- Don't invent new styles (new border-radii, new colors, new spacing values) without checking in first — reuse what's listed above, or ask.
- When asked to "match a reference image," apply the copy/content changes verbatim but flag anything in the reference that would introduce a new style not listed here, and confirm before adding it.
- Don't add a kicker label (`cs-caption-label`) above a subsection heading when it just repeats the chapter's own name (e.g. a "Research" kicker inside the "3. Research" chapter) — the chapter title already establishes that context, so it's redundant. Kicker labels are for naming the specific feature/artifact below them (e.g. "Wireframe Tests"), not for restating the chapter.
