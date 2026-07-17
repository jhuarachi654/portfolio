import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../contexts/ThemeContext"
import Footer from "../components/Footer"
import { useVisitorNumber } from "../hooks/useVisitorNumber"
import { renderGodRaysFrame, GOD_RAYS_GRAIN_SVG_URL } from "../components/GodRays"

// Exact same prop values HomePage.tsx passes to <GodRays> on the landing hero.
const HERO_GOD_RAYS_COLORS = ["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]
const HERO_GOD_RAYS_NOISE_SCALE = 0.2
const HERO_GOD_RAYS_NOISE_STRENGTH = 0.7
const HERO_GOD_RAYS_BLUR = 18
const HERO_GOD_RAYS_GRAIN_OPACITY = 0.52

let godRaysGrainImg: HTMLImageElement | null = null
function getGodRaysGrainImg(): HTMLImageElement {
  if (!godRaysGrainImg) {
    godRaysGrainImg = new Image()
    godRaysGrainImg.src = GOD_RAYS_GRAIN_SVG_URL
  }
  return godRaysGrainImg
}

const SUPABASE_URL = "https://jwjpnwxzpjtjigquuism.supabase.co"
const SUPABASE_KEY = "sb_publishable_HIcPdHfVH7_58p5skQFVNg_DNqCKa7R"

// Card canvas dimensions (logical px, rendered at 2×) — portrait
const CW = 360
const CH = 500
const CDPR = 2

// ASCII art area — below the info panel
const ASCII_Y    = 160   // info panel height; drawing starts here
const ASCII_COLS = 88
const ASCII_ROWS = 48
const ASCII_FS   = 4.5

// Sampled at a finer grid than the base cards, just for the gradient card,
// so the source drawing's finer strokes actually register instead of being
// averaged away — more detail, not a footprint-preserving swap this time.
const GRADIENT_ASCII_COLS = Math.round(ASCII_COLS * 1.3)
const GRADIENT_ASCII_ROWS = Math.round(ASCII_ROWS * 1.3)

// Center the ASCII art vertically in the drawing panel
const LINE_H_CONST = ASCII_FS * 1.35
const DRAW_AREA_H  = CH - (ASCII_Y + 8) - 10
const DRAW_Y = ASCII_Y + 8 + Math.max(0, Math.round((DRAW_AREA_H - ASCII_ROWS * LINE_H_CONST) / 2))

const ASCII_RAMP = [' ', '·', '.', '`', "'", ',', ':', ';', '-', '~', 'i', 'l', '+', 'x', 'r', 't', '*', 'n', 'u', 'z', '%', '$', '#', '@']

// Shared with the gradient card's hover-twinkle effect so the mask lines up
// exactly with what renderCard() draws — same ramp shift, same "leave
// spaces alone" rule.
const GRADIENT_CONCENTRATE_STEPS = 6
function concentrateChar(ch: string): string {
  if (ch === " ") return ch
  const i = ASCII_RAMP.indexOf(ch)
  if (i < 0) return ch
  return ASCII_RAMP[Math.min(ASCII_RAMP.length - 1, i + GRADIENT_CONCENTRATE_STEPS)]
}

const CARD_COLORS = [
  { hex: "#1E4B9A", name: "Navy",   ink: "#ffffff" },
  { hex: "#E84545", name: "Red",    ink: "#ffffff" },
  { hex: "#F5A623", name: "Amber",  ink: "#1a1a1a" },
  { hex: "#6B5CE7", name: "Purple", ink: "#ffffff" },
  { hex: "#1a1a1a", name: "Black",  ink: "#ffffff" },
  { hex: "#FFFEF5", name: "Cream",  ink: "#1E4B9A" },
]

const ADJECTIVES = ["Dusty","Deep","Pale","Muted","Soft","Icy","Steel","Misty","Faded","Frosted","Smoky","Slate","Powder","Stormy","Glacial","Twilight","Midnight","Cool","Washed","Dusky"]
const NOUNS      = ["Cerulean","Cobalt","Indigo","Teal","Periwinkle","Sapphire","Navy","Azure","Turquoise","Aqua","Denim","Violet","Lavender","Ultramarine","Prussian","Mint","Cyan","Slate","Iris","Marine"]

// Every (adjective, noun) pair, so we can hand out names without repeats
// instead of re-rolling randomly and hoping for no collision.
const NAME_COMBOS = ADJECTIVES.flatMap(a => NOUNS.map(n => `${a} ${n}`))

// Picks a name not already used by any currently-loaded drawing. `used` is
// the live set of names already on the board — with 400 combos and no
// server-side uniqueness constraint, this is a best-effort guarantee
// scoped to what the client has loaded, not a hard database-level lock.
function randomName(used: Set<string>): string {
  const available = NAME_COMBOS.filter(n => !used.has(n))
  const pool = available.length > 0 ? available : NAME_COMBOS
  return pool[Math.floor(Math.random() * pool.length)]
}

// Deterministic whimsical name from a string seed (used to fix old visitor_## names)
function seededName(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  const adj = ADJECTIVES[Math.abs(h) % ADJECTIVES.length]
  const noun = NOUNS[Math.abs(h >> 8) % NOUNS.length]
  return `${adj} ${noun}`
}

// Returns display name — replaces old auto-generated visitor_## style names
function resolveVisitorName(name: string, id: string): string {
  if (!name || /^visitor[_\s#-]*\d+$/i.test(name) || name === "Mystery Visitor") return seededName(id)
  return name
}

const fmtDate = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date()
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`
}

type Drawing = { id: string; name: string; image_url: string; created_at?: string; card_color?: string; visitor_number?: number }

// ── localStorage ownership tracking ──────────────────────────────────────────
const OWNED_KEY = "jw_draw_owned"

function getOwned(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(OWNED_KEY) ?? "[]")) }
  catch { return new Set() }
}

function addOwned(id: string) {
  const s = getOwned(); s.add(id)
  localStorage.setItem(OWNED_KEY, JSON.stringify([...s]))
}

// ── Convert raw drawing PNG (white bg, colored ink) to ASCII ────────────────
async function imageUrlToAscii(imageUrl: string, cols: number = ASCII_COLS, rows: number = ASCII_ROWS): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement("canvas")
      c.width = img.naturalWidth; c.height = img.naturalHeight
      const ctx = c.getContext("2d", { willReadFrequently: true })!
      ctx.drawImage(img, 0, 0)
      const cw = c.width, ch = c.height
      const cellW = cw / cols
      const cellH = ch / rows
      const lines: string[] = []
      for (let row = 0; row < rows; row++) {
        let line = ""
        for (let col = 0; col < cols; col++) {
          const x = Math.floor(col * cellW)
          const y = Math.floor(row * cellH)
          const w = Math.max(1, Math.ceil(cellW))
          const h = Math.max(1, Math.ceil(cellH))
          const data = ctx.getImageData(x, y, w, h).data
          let inked = 0
          const total = w * h
          for (let i = 0; i < total; i++) {
            const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3]
            // Count non-white, opaque pixels as ink (threshold 230 catches light pencil strokes)
            if (a > 64 && (r < 230 || g < 230 || b < 230)) inked++
          }
          const density = inked / total
          // amplify: thin pen strokes have low density per cell, boost so they register well
          const idx = Math.min(ASCII_RAMP.length - 1, Math.floor(Math.pow(density, 0.22) * ASCII_RAMP.length))
          line += ASCII_RAMP[idx]
        }
        lines.push(line)
      }
      resolve(lines)
    }
    img.onerror = () => resolve([])
    img.src = imageUrl
  })
}

// ── ASCII conversion — single getImageData for the whole canvas ──────────────
function canvasToAscii(drawCanvas: HTMLCanvasElement): string[] {
  const ctx = drawCanvas.getContext("2d", { willReadFrequently: true })!
  const cw  = drawCanvas.width
  const ch  = drawCanvas.height
  const { data } = ctx.getImageData(0, 0, cw, ch)
  const cellW = cw / ASCII_COLS
  const cellH = ch / ASCII_ROWS
  const lines: string[] = []

  for (let row = 0; row < ASCII_ROWS; row++) {
    let line = ""
    for (let col = 0; col < ASCII_COLS; col++) {
      const x = Math.floor(col * cellW)
      const y = Math.floor(row * cellH)
      const w = Math.max(1, Math.ceil(cellW))
      const h = Math.max(1, Math.ceil(cellH))
      let drawn = 0
      for (let py = y; py < y + h && py < ch; py++)
        for (let px = x; px < x + w && px < cw; px++)
          if (data[(py * cw + px) * 4 + 3] > 24) drawn++
      const density = drawn / (w * h)
      const idx = Math.min(ASCII_RAMP.length - 1, Math.floor(Math.pow(density, 0.22) * ASCII_RAMP.length))
      line += ASCII_RAMP[idx]
    }
    lines.push(line)
  }
  return lines
}

// Tracks the latest render call issued per canvas — if a second call starts
// on the same canvas before an earlier one finishes (StrictMode re-invoking
// an effect, rapid re-opens, etc.), the earlier one notices it's been
// superseded and stops drawing instead of tearing the shared canvas.
const cardRenderTokens = new WeakMap<HTMLCanvasElement, number>()

// ── Card canvas renderer — portrait layout ────────────────────────────────────
// Returns layout info measured at render time — callers (twinkle effects,
// coordinate mapping) use these instead of re-deriving their own.
async function renderCard(
  canvas: HTMLCanvasElement,
  opts: { color: typeof CARD_COLORS[0]; cardNum: number; ascii: string[]; name?: string; date?: string; gradient?: boolean; gradientTime?: number; centerOnContent?: boolean }
): Promise<{ charW: number; drawX: number; drawY: number; asciiLineH: number; asciiFS: number }> {
  const { color, cardNum, ascii, name, date, gradient, gradientTime = 40, centerOnContent = true } = opts
  const { hex, ink: rawInk } = color
  // On the gradient variant the flat card color no longer sets contrast, so
  // ink is forced to pure white regardless of the color swatch.
  const ink = gradient ? "#FFFFFF" : rawInk

  const myToken = (cardRenderTokens.get(canvas) ?? 0) + 1
  cardRenderTokens.set(canvas, myToken)
  const stillCurrent = () => cardRenderTokens.get(canvas) === myToken

  canvas.width  = CW * CDPR
  canvas.height = CH * CDPR
  const ctx = canvas.getContext("2d")!
  ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)

  // Background
  if (gradient) {
    // The actual GodRays shader (same colors/noiseScale/noiseStrength/
    // blurAmount the hero passes in HomePage.tsx), rendered to one static
    // frame instead of animated — not a hand-approximated gradient.
    const glCanvas = document.createElement("canvas")
    // Render well above card resolution so the blur pass has real detail to
    // work with (matches the hero rendering at full viewport size, not a
    // tiny canvas).
    glCanvas.width = CW * 3
    glCanvas.height = CH * 3
    renderGodRaysFrame(glCanvas, {
      colors: HERO_GOD_RAYS_COLORS,
      noiseScale: HERO_GOD_RAYS_NOISE_SCALE,
      noiseStrength: HERO_GOD_RAYS_NOISE_STRENGTH,
      time: gradientTime,
    })

    ctx.save()
    ctx.filter = `blur(${HERO_GOD_RAYS_BLUR}px)`
    ctx.drawImage(glCanvas, -6, -6, CW + 12, CH + 12)
    ctx.restore()

    // Same overlay-blended turbulence grain asset as the live hero (identical
    // SVG data URL + opacity), not a re-derived noise pattern.
    const grainImg = getGodRaysGrainImg()
    if (!grainImg.complete) {
      await new Promise<void>(resolve => {
        grainImg.onload = () => resolve()
        grainImg.onerror = () => resolve()
      })
    }
    if (!stillCurrent()) return { charW: 0, drawX: 0, drawY: 0, asciiLineH: 0, asciiFS: 0 }
    const pattern = ctx.createPattern(grainImg, "repeat")!
    ctx.save()
    ctx.globalCompositeOperation = "overlay"
    ctx.globalAlpha = HERO_GOD_RAYS_GRAIN_OPACITY
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, CW, CH)
    ctx.restore()

    // Dark overlay over the gradient only — drawn before any of the white
    // text/ornaments below so it tints the background, not the content.
    ctx.save()
    ctx.fillStyle = "rgba(6, 10, 26, 0.15)"
    ctx.fillRect(0, 0, CW, CH)
    ctx.restore()
  } else {
    ctx.fillStyle = hex
    ctx.fillRect(0, 0, CW, CH)
  }

  // On the gradient card, push the white text/ornament opacity up since the
  // flat per-element alphas below were tuned against a solid card color,
  // not a gradient.
  const boost = (a: number) => gradient ? Math.min(1, a + 0.25) : a

  // Dot grid texture — skipped on the gradient card, which already has its
  // own grain texture and doesn't need the notebook-paper dot pattern too.
  if (!gradient) {
    ctx.fillStyle = ink
    ctx.globalAlpha = 0.045
    for (let x = 16; x < CW; x += 16)
      for (let y = 16; y < CH; y += 16) {
        ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill()
      }
    ctx.globalAlpha = 1
  }

  // Corner brackets
  const M = 10, B = 14
  ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.globalAlpha = boost(0.28)
  ctx.beginPath(); ctx.moveTo(M, M + B); ctx.lineTo(M, M); ctx.lineTo(M + B, M); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(CW - M - B, M); ctx.lineTo(CW - M, M); ctx.lineTo(CW - M, M + B); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(M, CH - M - B); ctx.lineTo(M, CH - M); ctx.lineTo(M + B, CH - M); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(CW - M - B, CH - M); ctx.lineTo(CW - M, CH - M); ctx.lineTo(CW - M, CH - M - B); ctx.stroke()
  ctx.globalAlpha = 1

  await document.fonts.load(`bold 22px Domine`)
  if (!stillCurrent()) return { charW: 0, drawX: 0, drawY: 0, asciiLineH: 0, asciiFS: 0 }

  const LEFT = 20
  const PANEL_W = CW - LEFT * 2
  ctx.fillStyle = ink

  // Three small diamonds ornament
  const oy = 28
  for (let i = 0; i < 3; i++) {
    const ox = LEFT + i * 14
    ctx.globalAlpha = boost(i === 1 ? 0.55 : 0.22)
    ctx.save(); ctx.translate(ox + 3, oy); ctx.rotate(Math.PI / 4)
    ctx.fillRect(-3.5, -3.5, 7, 7)
    ctx.restore()
  }
  ctx.globalAlpha = 1

  // Title
  ctx.font = "bold 20px Domine, Georgia, serif"
  ctx.globalAlpha = boost(0.95)
  ctx.fillText("Johanna's Drawing Board", LEFT, oy + 38)

  // Thin rule
  const RULE_Y = oy + 50
  ctx.globalAlpha = boost(0.15); ctx.fillRect(LEFT, RULE_Y, PANEL_W, 0.6); ctx.globalAlpha = 1

  // Name + date row — measured (not guessed) so the gap above this row
  // (from the rule) and below it (to the dotted divider) are both an
  // actual 12px of visible whitespace, regardless of font metrics.
  const GAP = 12
  ctx.font = "600 16px 'Space Grotesk', sans-serif"
  const nameMetrics = ctx.measureText(name || "Mystery Visitor")
  const nameAscent = nameMetrics.actualBoundingBoxAscent || 12
  const nameDescent = nameMetrics.actualBoundingBoxDescent || 4
  const rowBaseline = RULE_Y + GAP + nameAscent

  if (name) {
    ctx.globalAlpha = boost(0.88)
    let displayName = name
    while (displayName.length > 1 && ctx.measureText(displayName).width > PANEL_W) {
      displayName = displayName.slice(0, -1)
    }
    ctx.fillText(displayName, LEFT, rowBaseline)
  }

  // Date — right-aligned across from the name, on the same line
  const RIGHT = CW - LEFT
  ctx.textAlign = "right"
  ctx.font = "500 9px 'Space Grotesk', sans-serif"
  ctx.globalAlpha = boost(0.38)
  ctx.fillText("DATE ISSUED", RIGHT, rowBaseline - 12)
  ctx.font = "500 14px 'Space Grotesk', sans-serif"
  ctx.globalAlpha = boost(0.75)
  ctx.fillText(fmtDate(date), RIGHT, rowBaseline)
  ctx.textAlign = "left"

  // JH stamp (top-right)
  const SX = CW - 28, SY = 38, SR = 15
  ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = boost(0.22)
  ctx.beginPath(); ctx.arc(SX, SY, SR, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(SX, SY, SR - 4, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = ink; ctx.globalAlpha = boost(0.3)
  ctx.font = "700 9px 'Space Grotesk', sans-serif"
  ctx.textAlign = "center"; ctx.fillText("JH", SX, SY + 3); ctx.textAlign = "left"
  ctx.globalAlpha = 1

  // Horizontal divider between info and drawing area — 12px of measured
  // whitespace below the name/date row's lowest descender.
  const DIVY = rowBaseline + nameDescent + GAP
  ctx.strokeStyle = ink; ctx.lineWidth = 0.7; ctx.globalAlpha = boost(0.2)
  ctx.setLineDash([3, 4])
  ctx.beginPath(); ctx.moveTo(20, DIVY); ctx.lineTo(CW - 20, DIVY); ctx.stroke()
  ctx.setLineDash([])

  // Diamond at center of divider
  ctx.globalAlpha = boost(0.28); ctx.save()
  ctx.translate(CW / 2, DIVY); ctx.rotate(Math.PI / 4)
  ctx.fillStyle = ink; ctx.fillRect(-4, -4, 8, 8)
  ctx.restore(); ctx.globalAlpha = 1

  // Drawing area now expands up to just below the (measured, movable)
  // divider instead of a fixed constant, so the two stay in sync.
  const drawAreaTop = DIVY + 8
  const drawAreaH = CH - drawAreaTop - 10

  // Drawing area: ruled lines — skipped on the gradient card, where they'd
  // just add clutter behind the ASCII art.
  const lineH = ASCII_FS * 1.35
  if (!gradient) {
    ctx.strokeStyle = ink; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.07
    for (let row = 0; row <= ASCII_ROWS; row++) {
      const ry = drawAreaTop + 4 + row * lineH
      ctx.beginPath(); ctx.moveTo(14, ry); ctx.lineTo(CW - 14, ry); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // Measure charW and compute centered drawX — bold and packed tighter on
  // the gradient card; measured in the same weight/size it's drawn in so
  // spacing stays correct.
  let asciiFS = gradient ? ASCII_FS * 1.6 : ASCII_FS
  let asciiLineH = gradient ? asciiFS * 1.05 : asciiFS * 1.35
  const setAsciiFont = (fs: number) => {
    ctx.font = gradient
      ? `bold ${fs}px 'Courier New', Courier, monospace`
      : `${fs}px 'Courier New', Courier, monospace`
    if (gradient && "letterSpacing" in ctx) {
      // Minimal space between characters — negative tracking pulls the
      // already-tight monospace glyphs even closer together.
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-0.5px"
    }
  }
  setAsciiFont(asciiFS)
  let charW = ctx.measureText("M").width
  const gridCols = gradient ? (ascii[0]?.length || ASCII_COLS) : ASCII_COLS
  const gridRows = gradient ? (ascii.length || ASCII_ROWS) : ASCII_ROWS
  let drawX = Math.round((CW - gridCols * charW) / 2)

  // Re-center vertically for the gradient card's font — DRAW_Y is baked
  // around the base ASCII_FS/ASCII_ROWS, so a different font/grid needs its
  // own centered start position within the same drawing-area bounds.
  let drawY = gradient
    ? drawAreaTop + Math.max(0, Math.round((drawAreaH - gridRows * asciiLineH) / 2))
    : DRAW_Y

  // On the gradient card, center on the drawing's actual content bounds
  // instead of the full grid — most drawings only fill a fraction of it,
  // so centering the whole grid left the real art looking off-center
  // inside its empty margins. Callers doing live input mapping (the
  // composer) opt out via centerOnContent:false — a stable, content-
  // independent origin is required there, since these coordinates double
  // as the mouse-to-canvas mapping and can't drift as strokes are added.
  if (gradient && centerOnContent && ascii.length > 0) {
    let minRow = Infinity, maxRow = -1, minCol = Infinity, maxCol = -1
    for (let row = 0; row < ascii.length; row++) {
      for (let col = 0; col < ascii[row].length; col++) {
        if (ascii[row][col] !== " ") {
          if (row < minRow) minRow = row
          if (row > maxRow) maxRow = row
          if (col < minCol) minCol = col
          if (col > maxCol) maxCol = col
        }
      }
    }
    if (maxRow >= 0) {
      // Some drawings' content bounds are wider/taller than the card at the
      // base font size — shrink the font (never enlarge) so the whole
      // drawing actually fits instead of getting clipped at the card edge.
      const availW = CW - 28
      const availH = drawAreaH - 8
      const contentW0 = (maxCol - minCol + 1) * charW
      const contentH0 = (maxRow - minRow + 1) * asciiLineH
      const fitScale = Math.min(1, availW / contentW0, availH / contentH0)
      if (fitScale < 1) {
        asciiFS *= fitScale
        asciiLineH = gradient ? asciiFS * 1.05 : asciiFS * 1.35
        setAsciiFont(asciiFS)
        charW = ctx.measureText("M").width
      }

      const contentW = (maxCol - minCol + 1) * charW
      const contentH = (maxRow - minRow + 1) * asciiLineH
      drawX = Math.round((CW - contentW) / 2) - minCol * charW
      drawY = drawAreaTop + Math.max(0, Math.round((drawAreaH - contentH) / 2)) - minRow * asciiLineH
    }
  }

  // On the gradient card, thin/sparse marks read as near-invisible flecks
  // against the gradient, so bump every non-space glyph a few steps up the
  // density ramp — the art reads as bolder/more filled-in overall rather
  // than relying on the thinnest characters in the ramp.
  const concentrate = (ch: string) => gradient ? concentrateChar(ch) : ch

  // ASCII art in drawing area
  if (ascii.length > 0) {
    ctx.fillStyle = ink; ctx.globalAlpha = 1
    for (let row = 0; row < ascii.length; row++) {
      for (let col = 0; col < ascii[row].length; col++) {
        const ch = concentrate(ascii[row][col])
        if (ch === " ") continue
        const x = drawX + col * charW
        const y = drawY + row * asciiLineH
        if (x > CW - 10 || y > CH - 10) continue
        ctx.fillText(ch, x, y)
      }
    }
    ctx.globalAlpha = 1
  }

  ctx.globalAlpha = 1
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  return { charW, drawX, drawY, asciiLineH, asciiFS }
}

// ── Masonry column count — matches WorkGrid's landing-page breakpoints ────────
function useNumCols() {
  const get = () => window.innerWidth < 541 ? 1 : window.innerWidth < 768 ? 2 : 3
  const [n, setN] = useState(get)
  useEffect(() => {
    const update = () => setN(get())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return n
}

// ── Gallery card — renders ASCII card client-side from raw drawing PNG ────────
function GalleryCard({ drawing, idx, onZoom }: { drawing: Drawing; idx: number; onZoom: (i: number) => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const tiltRef    = useRef<HTMLDivElement>(null)
  const rafRef     = useRef(0)
  const asciiRef   = useRef<string[]>([])
  const drawXRef   = useRef(14)
  const drawYRef   = useRef(DRAW_Y)
  const asciiLineHRef = useRef(ASCII_FS * 1.35)
  const asciiFSRef = useRef(ASCII_FS)
  const color = CARD_COLORS.find(c => c.hex === drawing.card_color) ?? CARD_COLORS[idx % CARD_COLORS.length]
  // Every card now uses the gradient treatment; only the shader's time
  // offset varies per card so they don't all render identically.
  const isGradient = true

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false

    imageUrlToAscii(drawing.image_url, GRADIENT_ASCII_COLS, GRADIENT_ASCII_ROWS).then(async ascii => {
      if (cancelled || !canvasRef.current) return
      asciiRef.current = ascii
      const { drawX, drawY, asciiLineH, asciiFS } = await renderCard(canvasRef.current, { color, cardNum: drawing.visitor_number ?? idx + 1, ascii, name: resolveVisitorName(drawing.name, drawing.id), date: drawing.created_at, gradient: true, gradientTime: 40 + idx * 23 })
      drawXRef.current = drawX
      drawYRef.current = drawY
      asciiLineHRef.current = asciiLineH
      asciiFSRef.current = asciiFS
    })

    return () => { cancelled = true }
  }, [drawing.image_url, idx])

  // startTwinkle's RAF loop is only ever started/stopped from mouse
  // enter/leave handlers — if the card unmounts while still hovered (fast
  // scroll, pagination, filter change), nothing else would ever cancel it,
  // leaving an orphaned rAF loop running forever against a detached canvas.
  // Over a long session this accumulates and is a real memory-growth/crash
  // risk, so cancel on unmount too.
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const startTwinkle = () => {
    const overlay = overlayRef.current
    if (!overlay) return
    // overlay logical size matches card
    overlay.width  = CW * CDPR
    overlay.height = CH * CDPR
    const ctx = overlay.getContext("2d")!
    ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)

    // Flash the same glyph renderCard drew (same font/position/
    // concentration) instead of masking it out with a flat color, so it
    // lines up and reads as a shimmer against the gradient.
    const asciiFS = asciiFSRef.current
    const asciiLineH = asciiLineHRef.current
    const drawX = drawXRef.current
    const drawY = drawYRef.current
    ctx.font = `bold ${asciiFS}px 'Courier New', Courier, monospace`
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-0.5px"
    const charW = ctx.measureText("M").width
    const cells: { ch: string; x: number; y: number }[] = []
    asciiRef.current.forEach((line, row) => {
      for (let col = 0; col < line.length; col++) {
        const ch = concentrateChar(line[col])
        if (ch !== " ") cells.push({ ch, x: drawX + col * charW, y: drawY + row * asciiLineH })
      }
    })
    if (cells.length === 0) return

    let last = 0
    const FPS = 10
    const INTERVAL = 1000 / FPS
    const tick = (now: number) => {
      if (now - last < INTERVAL) { rafRef.current = requestAnimationFrame(tick); return }
      last = now
      ctx.clearRect(0, 0, CW, CH)
      ctx.fillStyle = "#ffffff"
      const count = Math.floor(cells.length * 0.10)
      for (let i = 0; i < count; i++) {
        const c = cells[Math.floor(Math.random() * cells.length)]
        ctx.globalAlpha = 0.7 + Math.random() * 0.3
        ctx.fillText(c.ch, c.x, c.y)
      }
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stopTwinkle = () => {
    cancelAnimationFrame(rafRef.current)
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.getContext("2d")!.clearRect(0, 0, overlay.width, overlay.height)
  }

  return (
    <div
      className="draw-card-enter"
      style={{
        position: "relative",
        cursor: "zoom-in",
        animationDelay: `${Math.min(idx, 8) * 60}ms`,
      }}
      onMouseEnter={() => {
        const el = tiltRef.current
        if (el) el.style.boxShadow = "0 12px 36px rgba(58,58,62,0.16), 0 2px 6px rgba(58,58,62,0.08)"
        startTwinkle()
      }}
      onMouseLeave={() => {
        const el = tiltRef.current
        if (el) el.style.boxShadow = ""
        stopTwinkle()
      }}
      onClick={() => onZoom(idx)}
    >
      {/* Separate wrapper for the hover float-tilt so it never shares the
          `animation` shorthand with the outer element's card-pop entrance —
          toggling one shorthand between two different animations on hover
          in/out restarts card-pop from its `backwards`-filled (invisible)
          state every time you stop hovering, causing the card to flash
          empty for its entrance duration + stagger delay.

          The card's visual chrome (radius/shadow/clipping) lives here too,
          not on the outer div — it needs to rotate along with the tilt, or
          the flat outer box stays put while the tilted content pokes out
          past its edges, exposing the page background in the gap. */}
      <div
        ref={tiltRef}
        className="draw-card-tilt"
        style={{
          position: "relative", width: "100%", height: "100%",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 2px 16px rgba(58,58,62,0.10), 0 1px 3px rgba(58,58,62,0.06)",
          // Inline `transition` fully overrides the CSS class's own
          // `transition: transform ...` (inline always wins for the whole
          // shorthand), so both properties need to be listed here together.
          transition: "box-shadow 0.22s, transform 0.4s ease-out",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CW * CDPR}
          height={CH * CDPR}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        <canvas
          ref={overlayRef}
          width={CW * CDPR}
          height={CH * CDPR}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DrawPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const numCols = useNumCols()
  const { myNumber: myVisitorNumber, totalCount: visitorCount } = useVisitorNumber()
  const [drawings, setDrawings]   = useState<Drawing[]>([])
  const [shuffled, setShuffled]   = useState<Drawing[]>([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [cardColor, setCardColor] = useState(CARD_COLORS[0])
  const [brushSize, setBrushSize] = useState(3)
  const [posting, setPosting]     = useState(false)
  const [page, setPage]           = useState(1)
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [ownedIds, setOwnedIds]   = useState<Set<string>>(() => getOwned())
  const zoomCanvasRef             = useRef<HTMLCanvasElement>(null)
  const zoomOverlayRef            = useRef<HTMLCanvasElement>(null)
  const zoomAsciiRef              = useRef<string[]>([])
  const zoomRafRef                = useRef(0)
  const zoomDrawXRef              = useRef(14)
  const zoomDrawYRef              = useRef(DRAW_Y)
  const zoomAsciiLineHRef         = useRef(ASCII_FS * 1.35)
  const zoomAsciiFSRef            = useRef(ASCII_FS)
  const PER_PAGE = 12

  const cardCanvasRef  = useRef<HTMLCanvasElement>(null)
  // pre-rendered base card (no ASCII) — composited onto card canvas for fast live updates
  const baseCanvasRef  = useRef<HTMLCanvasElement | null>(null)
  // in-memory canvas tracking raw strokes — not mounted in DOM
  const offscreenRef   = useRef<HTMLCanvasElement | null>(null)
  // measured charW of Courier New at ASCII_FS — set after first render, used for coordinate mapping
  const charWRef       = useRef(ASCII_FS * 0.6)
  const drawXRef       = useRef(14)
  const drawYRef       = useRef(DRAW_Y)
  const asciiLineHRef  = useRef(ASCII_FS * 1.35)
  const asciiFSRef     = useRef(ASCII_FS)
  const brushSizeRef   = useRef(brushSize)
  brushSizeRef.current = brushSize
  const isDrawing      = useRef(false)
  const lastPos        = useRef({ x: 0, y: 0 })
  const asciiRef       = useRef<string[]>([])
  const drawingsRef    = useRef<Drawing[]>([])
  drawingsRef.current  = drawings

  const visible = shuffled.slice(0, page * PER_PAGE)
  const hasMore = shuffled.length > visible.length

  // ── Data ──────────────────────────────────────────────────────────────
  const load = async (): Promise<number> => {
    setLoading(true)
    let count = 0
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/drawings?select=id,name,image_url,created_at,visitor_number&order=created_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      )
      const data = await res.json()
      if (Array.isArray(data)) { setDrawings(data); setShuffled(data); count = data.length }
    } catch {}
    setLoading(false)
    return count
  }

  const shuffle = () => setShuffled(prev => [...prev].sort(() => Math.random() - 0.5))

  const LINE_H = LINE_H_CONST

  // Synchronous: composite pre-rendered base + current ASCII onto card canvas.
  const renderAsciiOnBase = useCallback(() => {
    const card = cardCanvasRef.current
    const base = baseCanvasRef.current
    if (!card || !base) return
    const ctx = card.getContext("2d")!
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(base, 0, 0)
    if (asciiRef.current.length === 0) return
    ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)
    const fs = asciiFSRef.current
    ctx.font = `bold ${fs}px 'Courier New', Courier, monospace`
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-0.5px"
    const charW = ctx.measureText("M").width
    const lh = asciiLineHRef.current
    ctx.fillStyle = "#ffffff"
    ctx.globalAlpha = 1
    const dx = drawXRef.current
    const dy = drawYRef.current
    for (let row = 0; row < asciiRef.current.length; row++) {
      for (let col = 0; col < asciiRef.current[row].length; col++) {
        const ch = concentrateChar(asciiRef.current[row][col])
        if (ch === " ") continue
        const x = dx + col * charW
        const y = dy + row * lh
        if (x > CW - 10 || y > CH - 10) continue
        ctx.fillText(ch, x, y)
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }, [cardColor])

  // Modal open / edit init — creates offscreen canvas and loads existing drawing if editing
  useEffect(() => {
    if (!modalOpen) return
    asciiRef.current = []
    offscreenRef.current = null
    let cancelled = false

    ;(async () => {
      const canvas = cardCanvasRef.current
      if (!canvas) return
      const { charW, drawX, drawY, asciiLineH, asciiFS } = await renderCard(canvas, {
        color: cardColor,
        cardNum: myVisitorNumber ?? drawingsRef.current.length + 1,
        ascii: [],
        name: "Mystery Visitor",
        gradient: true,
        gradientTime: 40,
        centerOnContent: false,
      })
      if (cancelled) return
      charWRef.current = charW
      drawXRef.current = drawX
      drawYRef.current = drawY
      asciiLineHRef.current = asciiLineH
      asciiFSRef.current = asciiFS

      const off = document.createElement("canvas")
      off.width  = Math.ceil(ASCII_COLS * charW)
      off.height = Math.ceil(ASCII_ROWS * LINE_H)
      offscreenRef.current = off

      // Load existing drawing when editing
      if (editingId) {
        const drawing = drawingsRef.current.find(d => d.id === editingId)
        if (drawing) {
          await new Promise<void>(resolve => {
            const img = new Image()
            img.onload = () => {
              off.getContext("2d")!.drawImage(img, 0, 0, off.width, off.height)
              asciiRef.current = canvasToAscii(off)
              resolve()
            }
            img.onerror = () => resolve()
            img.src = drawing.image_url
          })
          if (cancelled) return
          const { drawX: dx2, drawY: dy2, asciiLineH: lh2, asciiFS: fs2 } = await renderCard(canvas, {
            color: cardColor,
            cardNum: myVisitorNumber ?? drawingsRef.current.length + 1,
            ascii: asciiRef.current,
            name: "Mystery Visitor",
            gradient: true,
            gradientTime: 40,
            centerOnContent: false,
          })
          if (cancelled) return
          drawXRef.current = dx2
          drawYRef.current = dy2
          asciiLineHRef.current = lh2
          asciiFSRef.current = fs2
        }
      }

      if (cancelled) return
      const base = document.createElement("canvas")
      base.width  = canvas.width
      base.height = canvas.height
      base.getContext("2d")!.drawImage(canvas, 0, 0)
      baseCanvasRef.current = base
    })()

    return () => { cancelled = true }
  }, [modalOpen, editingId])

  // Color change — re-render card with existing drawing preserved
  useEffect(() => {
    if (!modalOpen || !baseCanvasRef.current) return
    let cancelled = false

    ;(async () => {
      const canvas = cardCanvasRef.current
      if (!canvas) return
      const { charW, drawX, drawY, asciiLineH, asciiFS } = await renderCard(canvas, {
        color: cardColor,
        cardNum: myVisitorNumber ?? drawingsRef.current.length + 1,
        ascii: asciiRef.current,
        name: "Mystery Visitor",
        gradient: true,
        gradientTime: 40,
        centerOnContent: false,
      })
      if (cancelled) return
      charWRef.current = charW
      drawXRef.current = drawX
      drawYRef.current = drawY
      asciiLineHRef.current = asciiLineH
      asciiFSRef.current = asciiFS

      const base = document.createElement("canvas")
      base.width  = canvas.width
      base.height = canvas.height
      base.getContext("2d")!.drawImage(canvas, 0, 0)
      baseCanvasRef.current = base
    })()

    return () => { cancelled = true }
  }, [cardColor])

  // ── Drawing directly on card canvas ───────────────────────────────────
  const getCardPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = cardCanvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const src    = "touches" in e ? e.touches[0] : e
    return {
      x: ((src.clientX - rect.left)  / rect.width)  * CW,
      y: ((src.clientY - rect.top)   / rect.height) * CH,
    }
  }

  const toOff = (p: { x: number; y: number }) => {
    const off = offscreenRef.current
    return {
      x: p.x - drawXRef.current,
      y: Math.min(Math.max(0, p.y - drawYRef.current), off ? off.height - 1 : 0),
    }
  }

  const onDrawStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true
    const p = getCardPos(e)
    lastPos.current = p
    const off = offscreenRef.current
    if (off) {
      const o = toOff(p)
      const ctx = off.getContext("2d")!
      ctx.lineCap = "round"; ctx.lineJoin = "round"
      ctx.strokeStyle = "#000"; ctx.fillStyle = "#000"
      ctx.lineWidth = brushSizeRef.current
      ctx.beginPath(); ctx.arc(o.x, o.y, brushSizeRef.current / 2, 0, Math.PI * 2); ctx.fill()
      asciiRef.current = canvasToAscii(off)
    }
    renderAsciiOnBase()
  }

  const onDrawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return
    const p = getCardPos(e)
    const off = offscreenRef.current
    if (off) {
      const o = toOff(p)
      const prev = toOff(lastPos.current)
      const ctx = off.getContext("2d")!
      ctx.lineCap = "round"; ctx.lineJoin = "round"
      ctx.strokeStyle = "#000"; ctx.fillStyle = "#000"
      ctx.lineWidth = brushSizeRef.current
      ctx.beginPath()
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(o.x, o.y)
      ctx.stroke()
      asciiRef.current = canvasToAscii(off)
    }
    lastPos.current = p
    renderAsciiOnBase()
  }

  const onDrawEnd = () => {
    isDrawing.current = false
  }

  const clearDrawing = () => {
    const off = offscreenRef.current
    if (off) off.getContext("2d")!.clearRect(0, 0, off.width, off.height)
    asciiRef.current = []
    renderAsciiOnBase()
  }

  // ── Delete ────────────────────────────────────────────────────────────
  const deleteCard = async (id: string) => {
    try {
      const delRes = await fetch(`${SUPABASE_URL}/rest/v1/drawings?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      })
      if (!delRes.ok) {
        console.warn("Delete failed — status:", delRes.status, await delRes.text())
        return
      }
      setDrawings(prev => prev.filter(d => d.id !== id))
      setShuffled(prev => prev.filter(d => d.id !== id))
      setZoomedIdx(null)
    } catch (err) { console.warn("Delete failed:", err) }
  }

  // ── Post ──────────────────────────────────────────────────────────────
  const post = async () => {
    setPosting(true)
    try {
      const off = offscreenRef.current
      // Save the raw offscreen drawing (black strokes on transparent bg) as image_url.
      // imageUrlToAscii reads this to re-render the card in the gallery.
      // Saving the rendered card canvas would cause imageUrlToAscii to mistake
      // the colored card background for ink, filling every cell with '@'.
      const imageUrl = off ? off.toDataURL("image/png") : ""
      if (!imageUrl) return

      if (editingId) {
        // PATCH existing entry
        await fetch(`${SUPABASE_URL}/rest/v1/drawings?id=eq.${editingId}`, {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json", Prefer: "return=representation",
          },
          body: JSON.stringify({ image_url: imageUrl, card_color: cardColor.hex }),
        })
        setDrawings(prev => prev.map(d => d.id === editingId ? { ...d, image_url: imageUrl, card_color: cardColor.hex } : d))
        setShuffled(prev => prev.map(d => d.id === editingId ? { ...d, image_url: imageUrl, card_color: cardColor.hex } : d))
        setEditingId(null)
        setModalOpen(false)
      } else {
        // POST new entry
        const res = await fetch(`${SUPABASE_URL}/rest/v1/drawings`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json", Prefer: "return=representation",
          },
          body: JSON.stringify({ name: randomName(new Set(drawingsRef.current.map(d => d.name))), image_url: imageUrl, card_color: cardColor.hex, position_x: 0, position_y: 0, rotation: 0, visitor_number: myVisitorNumber }),
        })
        const saved = await res.json()
        const d: Drawing = Array.isArray(saved) ? saved[0] : saved
        addOwned(d.id)
        setOwnedIds(getOwned())
        setDrawings(prev => [d, ...prev])
        setShuffled(prev => [d, ...prev])
        setPage(1)
        setModalOpen(false)
      }
    } catch (err) { console.warn("Post failed:", err) }
    setPosting(false)
  }

  useEffect(() => { load() }, [])

  // Shared by the automatic post-render trigger and the hover handler below
  // — extracted so the popup doesn't rely solely on a genuine mouseenter
  // event, which never fires if the modal happens to open with the cursor
  // already sitting inside its bounds (opening via click very often leaves
  // the cursor stationary right where the popup appears, unlike the
  // gallery card where hovering always requires real pointer movement).
  const startZoomTwinkle = () => {
    const overlay = zoomOverlayRef.current
    if (!overlay) return
    cancelAnimationFrame(zoomRafRef.current)
    overlay.width = CW * CDPR; overlay.height = CH * CDPR
    const ctx = overlay.getContext("2d")!
    ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)

    const asciiFS = zoomAsciiFSRef.current
    const asciiLineH = zoomAsciiLineHRef.current
    const drawX = zoomDrawXRef.current
    const drawY = zoomDrawYRef.current
    ctx.font = `bold ${asciiFS}px 'Courier New', Courier, monospace`
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-0.5px"
    const charW = ctx.measureText("M").width
    const cells: { ch: string; x: number; y: number }[] = []
    zoomAsciiRef.current.forEach((line, row) => {
      for (let col = 0; col < line.length; col++) {
        const ch = concentrateChar(line[col])
        if (ch !== " ") cells.push({ ch, x: drawX + col * charW, y: drawY + row * asciiLineH })
      }
    })
    if (cells.length === 0) return
    let last = 0
    const tick = (now: number) => {
      if (now - last < 100) { zoomRafRef.current = requestAnimationFrame(tick); return }
      last = now
      ctx.clearRect(0, 0, CW, CH)
      ctx.fillStyle = "#ffffff"
      const count = Math.floor(cells.length * 0.10)
      for (let i = 0; i < count; i++) {
        const c = cells[Math.floor(Math.random() * cells.length)]
        ctx.globalAlpha = 0.7 + Math.random() * 0.3
        ctx.fillText(c.ch, c.x, c.y)
      }
      ctx.globalAlpha = 1
      zoomRafRef.current = requestAnimationFrame(tick)
    }
    zoomRafRef.current = requestAnimationFrame(tick)
  }

  const stopZoomTwinkle = () => {
    cancelAnimationFrame(zoomRafRef.current)
    zoomOverlayRef.current?.getContext("2d")?.clearRect(0, 0, CW * CDPR, CH * CDPR)
  }

  useEffect(() => {
    if (zoomedIdx === null || !zoomCanvasRef.current) return
    const drawing = visible[zoomedIdx]
    if (!drawing) return
    const color = CARD_COLORS.find(c => c.hex === drawing.card_color) ?? CARD_COLORS[zoomedIdx % CARD_COLORS.length]
    // Render zoom at device pixel ratio for sharp display on retina screens
    const dpr = Math.min(window.devicePixelRatio || 2, 3)
    const canvas = zoomCanvasRef.current
    canvas.width  = CW * dpr
    canvas.height = CH * dpr
    let cancelled = false
    cancelAnimationFrame(zoomRafRef.current)
    zoomAsciiRef.current = []
    imageUrlToAscii(drawing.image_url, GRADIENT_ASCII_COLS, GRADIENT_ASCII_ROWS).then(async ascii => {
      if (cancelled || !zoomCanvasRef.current) return
      zoomAsciiRef.current = ascii
      const { drawX: zdx, drawY: zdy, asciiLineH: zlh, asciiFS: zfs } = await renderCard(zoomCanvasRef.current, { color, cardNum: drawing.visitor_number ?? zoomedIdx + 1, ascii, name: resolveVisitorName(drawing.name, drawing.id), date: drawing.created_at, gradient: true, gradientTime: 40 + zoomedIdx! * 23 })
      zoomDrawXRef.current = zdx
      zoomDrawYRef.current = zdy
      zoomAsciiLineHRef.current = zlh
      zoomAsciiFSRef.current = zfs
      if (!cancelled) startZoomTwinkle()
    })
    return () => { cancelled = true; stopZoomTwinkle() }
  }, [zoomedIdx])

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  const openModal = () => { setModalOpen(true); setCardColor(CARD_COLORS[0]) }

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      document.body.classList.add("overlay-open")
      return () => {
        document.body.style.overflow = prevOverflow
        document.body.classList.remove("overlay-open")
      }
    }
  }, [modalOpen])

  // Light cursor while zoom lightbox is open
  useEffect(() => {
    if (zoomedIdx !== null) {
      document.body.classList.add("overlay-open")
      return () => document.body.classList.remove("overlay-open")
    }
  }, [zoomedIdx])

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100%", fontFamily: "Space Grotesk, sans-serif", position: "relative" }}>

      <div className="footer-curtain">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="draw-header">
        <div className="draw-header-top">
          <div className="draw-header-left">
            <h1 className="draw-headline">Drawing Board</h1>
            <p className="play-body">Leave your mark. Draw something and join the gallery of everyone who's stopped by.</p>
          </div>
          <div className="draw-header-actions">
            <button onClick={openModal} className="draw-btn-primary">
              <span>Draw a card</span>
            </button>
            <button onClick={shuffle} className="draw-btn-secondary">
              <span>Shuffle</span>
            </button>
          </div>
        </div>
        <div className="draw-divider">
          {visitorCount != null && (
            <span className="draw-count">
              Total visitors: {visitorCount}
            </span>
          )}
          <div className="draw-divider-line" />
        </div>
      </div>

      {/* ── Gallery grid ─────────────────────────────────────────────── */}
      <div className="draw-body">
        {loading ? (
          <div className="draw-empty">Loading gallery…</div>
        ) : drawings.length === 0 ? (
          <div className="draw-empty">
            <p className="draw-empty-text">Be the first to leave your mark</p>
          </div>
        ) : (
          <>
            <div className="draw-grid">
              {(() => {
                const cols: { drawing: Drawing; globalIdx: number }[][] = Array.from({ length: numCols }, () => [])
                visible.forEach((d, i) => cols[i % numCols].push({ drawing: d, globalIdx: i }))
                return cols.map((col, ci) => (
                  <div key={ci} className="draw-grid-col">
                    {col.map(({ drawing: d, globalIdx }) => (
                      <GalleryCard key={d.id} drawing={d} idx={globalIdx} onZoom={(i) => setZoomedIdx(i)} />
                    ))}
                  </div>
                ))
              })()}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 48 }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    background: "transparent", border: "1.5px solid rgba(58,58,62,0.2)",
                    color: "#3A3A3E", borderRadius: 12, padding: "10px 28px",
                    fontFamily: "Space Grotesk, sans-serif", fontSize: 12, fontWeight: 600,
                    cursor: "none", letterSpacing: "0.06em", textTransform: "uppercase",
                  }}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      </div>

      {/* ── Zoom lightbox ────────────────────────────────────────────── */}
      {zoomedIdx !== null && visible[zoomedIdx] && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
          onClick={() => setZoomedIdx(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomedIdx(null)}
            style={{
              position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%",
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 16, cursor: "none",
            }}
          >✕</button>

          {/* Prev arrow — side on desktop, bottom-left on mobile */}
          <button
            onClick={e => { e.stopPropagation(); setZoomedIdx(i => i !== null ? Math.max(0, i - 1) : null) }}
            disabled={zoomedIdx === 0}
            className="draw-zoom-arrow draw-zoom-arrow--prev"
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "50%", width: 44, height: 44,
              color: "#fff", fontSize: 18, cursor: "none",
              opacity: zoomedIdx === 0 ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >‹</button>

          {/* Next arrow — side on desktop, bottom-right on mobile */}
          <button
            onClick={e => { e.stopPropagation(); setZoomedIdx(i => i !== null ? Math.min(visible.length - 1, i + 1) : null) }}
            disabled={zoomedIdx === visible.length - 1}
            className="draw-zoom-arrow draw-zoom-arrow--next"
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "50%", width: 44, height: 44,
              color: "#fff", fontSize: 18, cursor: "none",
              opacity: zoomedIdx === visible.length - 1 ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >›</button>

          {/* Center column */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            onClick={e => e.stopPropagation()}
          >
            {/* "That's yours" badge */}
            {ownedIds.has(visible[zoomedIdx].id) && (
              <div style={{
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 100, padding: "5px 14px",
                color: "#fff", fontSize: 11, fontWeight: 600,
                fontFamily: "Space Grotesk, sans-serif",
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
              }}>
                THAT'S YOURS
              </div>
            )}

            {/* Card container — floats continuously (not gated behind
                hover like the gallery cards) since it's already the one
                "selected" card being shown off in the lightbox. */}
            <div
              className="draw-zoom-card"
              style={{ width: "100%", maxWidth: 432, borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", position: "relative" }}
              onMouseEnter={startZoomTwinkle}
              onMouseLeave={() => {
                stopZoomTwinkle()
                document.body.classList.remove("cursor-on-light-card")
              }}
            >
              <canvas ref={zoomCanvasRef} style={{ display: "block", width: "100%", height: "auto" }} />
              <canvas ref={zoomOverlayRef} width={CW * CDPR} height={CH * CDPR} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
            </div>

            {/* Action row for owned cards */}
            {ownedIds.has(visible[zoomedIdx].id) && (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="draw-btn-lightbox"
                  onClick={() => {
                    setEditingId(visible[zoomedIdx!].id)
                    setZoomedIdx(null)
                    setModalOpen(true)
                    setCardColor(CARD_COLORS[0])
                  }}
                >
                  <span>Edit drawing</span>
                </button>
                <button
                  className="draw-btn-lightbox draw-btn-lightbox--icon"
                  onClick={() => deleteCard(visible[zoomedIdx!].id)}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      , document.body)}

      {/* ── Modal ────────────────────────────────────────────────────── */}
      {modalOpen && createPortal(
        <div
          className="draw-modal-backdrop"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className="draw-modal-inner"
            style={{
              background: isDark ? "#0F1923" : "#fff", borderRadius: 16,
              width: "100%", maxWidth: 440, maxHeight: "95dvh", overflowY: "auto",
              padding: "24px 20px 20px",
              boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.55)" : "0 32px 80px rgba(20,40,100,0.22)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="draw-modal-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--font-landing-heading)", fontWeight: 400, fontStyle: "italic",
                  fontSize: 26, letterSpacing: "-0.02em", color: "var(--color-cs-heading)", margin: "0 0 4px",
                }}>
                  {editingId ? "Edit your card" : "Leave your mark"}
                </h2>
                <p className="draw-modal-subtitle" style={{
                  fontFamily: "var(--font-landing-body)", fontSize: 13,
                  color: "var(--color-secondary)", margin: 0,
                }}>
                  {editingId ? "Redraw on the card to update your entry." : "Draw directly on the card. Your sketch becomes ASCII art."}
                </p>
              </div>
              <button onClick={closeModal} style={{
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(58,58,62,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(58,58,62,0.12)"}`,
                borderRadius: "50%", width: 32, height: 32, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isDark ? "#ffffff" : "#3A3A3E", fontSize: 13, marginLeft: 12,
              }}>✕</button>
            </div>

            {/* Card — draw directly on it */}
            <div className="draw-modal-canvas-wrap" style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <canvas
                ref={cardCanvasRef}
                width={CW * CDPR}
                height={CH * CDPR}
                style={{ display: "block", width: `${CW}px`, maxWidth: "100%", height: "auto", cursor: "crosshair", touchAction: "none", borderRadius: 12, boxShadow: "0 4px 24px rgba(20,40,100,0.16)" }}
                onMouseDown={onDrawStart}
                onMouseMove={onDrawMove}
                onMouseUp={onDrawEnd}
                onMouseLeave={onDrawEnd}
                onTouchStart={e => { e.stopPropagation(); onDrawStart(e) }}
                onTouchMove={e => { e.stopPropagation(); e.preventDefault(); onDrawMove(e) }}
                onTouchEnd={e => { e.stopPropagation(); onDrawEnd() }}
              />
            </div>

            {/* Controls — Clear and Post sit on one row now, no more
                card-color picker since every card shares the same
                gradient look. */}
            <div className="draw-modal-controls" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={clearDrawing} style={{
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(58,58,62,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(58,58,62,0.12)"}`,
                borderRadius: 12, padding: "13px 20px", fontSize: 13,
                fontFamily: "var(--font-landing-body)",
                color: "var(--color-cs-heading)", fontWeight: 500, flexShrink: 0,
              }}>Clear</button>

              <button
                onClick={post}
                disabled={posting}
                style={{
                  flex: 1, padding: 13, borderRadius: 12, border: "none",
                  background: posting ? "rgba(58,58,62,0.5)" : "#3A3A3E",
                  color: "#fff", fontFamily: "var(--font-landing-body)",
                  fontSize: 14, fontWeight: 500,
                  transition: "background 0.15s",
                }}
              >
                {posting ? "Posting…" : editingId ? "Update card →" : "Add to gallery →"}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
      <Footer />
    </div>
  )
}
