import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../contexts/ThemeContext"
import Footer from "../components/Footer"

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

// Center the ASCII art vertically in the drawing panel
const LINE_H_CONST = ASCII_FS * 1.35
const DRAW_AREA_H  = CH - (ASCII_Y + 8) - 10
const DRAW_Y = ASCII_Y + 8 + Math.max(0, Math.round((DRAW_AREA_H - ASCII_ROWS * LINE_H_CONST) / 2))

const ASCII_RAMP = [' ', '·', '.', '`', "'", ',', ':', ';', '-', '~', 'i', 'l', '+', 'x', 'r', 't', '*', 'n', 'u', 'z', '%', '$', '#', '@']

const CARD_COLORS = [
  { hex: "#1E4B9A", name: "Navy",   ink: "#ffffff" },
  { hex: "#E84545", name: "Red",    ink: "#ffffff" },
  { hex: "#F5A623", name: "Amber",  ink: "#1a1a1a" },
  { hex: "#6B5CE7", name: "Purple", ink: "#ffffff" },
  { hex: "#1a1a1a", name: "Black",  ink: "#ffffff" },
  { hex: "#FFFEF5", name: "Cream",  ink: "#1E4B9A" },
]

const ADJECTIVES = ["Blooming","Petal","Dewy","Rosy","Wilting","Tangled","Sunlit","Mossy","Thorny","Blushing","Overgrown","Fragrant","Pressed","Drifting","Quiet","Velvety","Tender","Gilded","Wistful","Dreamy"]
const NOUNS      = ["Dahlia","Primrose","Wisteria","Marigold","Foxglove","Larkspur","Clover","Peony","Anemone","Buttercup","Verbena","Cornflower","Snapdragon","Edelweiss","Hellebore","Mallow","Yarrow","Tansy","Meadow","Blossom"]

const randomName = () =>
  `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`

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

type Drawing = { id: string; name: string; image_url: string; created_at?: string; card_color?: string }

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
async function imageUrlToAscii(imageUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement("canvas")
      c.width = img.naturalWidth; c.height = img.naturalHeight
      const ctx = c.getContext("2d", { willReadFrequently: true })!
      ctx.drawImage(img, 0, 0)
      const cw = c.width, ch = c.height
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

// ── Card canvas renderer — portrait layout ────────────────────────────────────
// Returns { charW, drawX } measured at render time — caller uses these for coordinate mapping.
async function renderCard(
  canvas: HTMLCanvasElement,
  opts: { color: typeof CARD_COLORS[0]; cardNum: number; ascii: string[]; name?: string; date?: string }
): Promise<{ charW: number; drawX: number }> {
  const { color, cardNum, ascii, name, date } = opts
  const { hex, ink } = color

  canvas.width  = CW * CDPR
  canvas.height = CH * CDPR
  const ctx = canvas.getContext("2d")!
  ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)

  // Background
  ctx.fillStyle = hex
  ctx.fillRect(0, 0, CW, CH)

  // Dot grid texture
  ctx.fillStyle = ink
  ctx.globalAlpha = 0.045
  for (let x = 16; x < CW; x += 16)
    for (let y = 16; y < CH; y += 16) {
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill()
    }
  ctx.globalAlpha = 1

  // Corner brackets
  const M = 10, B = 14
  ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.28
  ctx.beginPath(); ctx.moveTo(M, M + B); ctx.lineTo(M, M); ctx.lineTo(M + B, M); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(CW - M - B, M); ctx.lineTo(CW - M, M); ctx.lineTo(CW - M, M + B); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(M, CH - M - B); ctx.lineTo(M, CH - M); ctx.lineTo(M + B, CH - M); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(CW - M - B, CH - M); ctx.lineTo(CW - M, CH - M); ctx.lineTo(CW - M, CH - M - B); ctx.stroke()
  ctx.globalAlpha = 1

  await document.fonts.load(`bold 22px Domine`)

  const LEFT = 20
  const PANEL_W = CW - LEFT * 2
  ctx.fillStyle = ink

  // Three small diamonds ornament
  const oy = 28
  for (let i = 0; i < 3; i++) {
    const ox = LEFT + i * 14
    ctx.globalAlpha = i === 1 ? 0.55 : 0.22
    ctx.save(); ctx.translate(ox + 3, oy); ctx.rotate(Math.PI / 4)
    ctx.fillRect(-3.5, -3.5, 7, 7)
    ctx.restore()
  }
  ctx.globalAlpha = 1

  // Thin rule
  ctx.globalAlpha = 0.2; ctx.fillRect(LEFT, oy + 12, PANEL_W, 0.6); ctx.globalAlpha = 1

  // Title
  ctx.font = "bold 20px Domine, Georgia, serif"
  ctx.globalAlpha = 0.95
  ctx.fillText("Johanna's Drawing Board", LEFT, oy + 38)

  // Thin rule
  ctx.globalAlpha = 0.15; ctx.fillRect(LEFT, oy + 50, PANEL_W, 0.6); ctx.globalAlpha = 1

  // Visitor number + name
  ctx.font = "500 11px 'Space Grotesk', sans-serif"
  ctx.globalAlpha = 0.38
  ctx.fillText(`VISITOR · NO. ${String(cardNum).padStart(3, "0")}`, LEFT, oy + 72)
  if (name) {
    ctx.font = "600 16px 'Space Grotesk', sans-serif"
    ctx.globalAlpha = 0.88
    let displayName = name
    while (displayName.length > 1 && ctx.measureText(displayName).width > PANEL_W) {
      displayName = displayName.slice(0, -1)
    }
    ctx.fillText(displayName, LEFT, oy + 92)
  }

  // Date
  ctx.font = "500 11px 'Space Grotesk', sans-serif"
  ctx.globalAlpha = 0.38
  ctx.fillText("DATE ISSUED", LEFT, name ? oy + 114 : oy + 92)
  ctx.font = "400 16px 'Space Grotesk', sans-serif"
  ctx.globalAlpha = 0.82
  ctx.fillText(fmtDate(date), LEFT, name ? oy + 130 : oy + 108)

  // JH stamp (top-right)
  const SX = CW - 28, SY = 38, SR = 15
  ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = 0.22
  ctx.beginPath(); ctx.arc(SX, SY, SR, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(SX, SY, SR - 4, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = ink; ctx.globalAlpha = 0.3
  ctx.font = "700 9px 'Space Grotesk', sans-serif"
  ctx.textAlign = "center"; ctx.fillText("JH", SX, SY + 3); ctx.textAlign = "left"
  ctx.globalAlpha = 1

  // Horizontal divider between info and drawing area
  const DIVY = ASCII_Y - 14
  ctx.strokeStyle = ink; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.2
  ctx.setLineDash([3, 4])
  ctx.beginPath(); ctx.moveTo(20, DIVY); ctx.lineTo(CW - 20, DIVY); ctx.stroke()
  ctx.setLineDash([])

  // Diamond at center of divider
  ctx.globalAlpha = 0.28; ctx.save()
  ctx.translate(CW / 2, DIVY); ctx.rotate(Math.PI / 4)
  ctx.fillStyle = ink; ctx.fillRect(-4, -4, 8, 8)
  ctx.restore(); ctx.globalAlpha = 1

  // Drawing area: ruled lines
  const lineH = ASCII_FS * 1.35
  ctx.strokeStyle = ink; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.07
  for (let row = 0; row <= ASCII_ROWS; row++) {
    const ry = ASCII_Y + 4 + row * lineH
    ctx.beginPath(); ctx.moveTo(14, ry); ctx.lineTo(CW - 14, ry); ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Measure charW and compute centered drawX
  ctx.font = `${ASCII_FS}px 'Courier New', Courier, monospace`
  const charW = ctx.measureText("M").width
  const drawX = Math.round((CW - ASCII_COLS * charW) / 2)

  // ASCII art in drawing area
  if (ascii.length > 0) {
    ctx.fillStyle = ink; ctx.globalAlpha = 1
    for (let row = 0; row < ascii.length; row++) {
      for (let col = 0; col < ascii[row].length; col++) {
        const ch = ascii[row][col]
        if (ch === " ") continue
        const x = drawX + col * charW
        const y = DRAW_Y + row * lineH
        if (x > CW - 10 || y > CH - 10) continue
        ctx.fillText(ch, x, y)
      }
    }
    ctx.globalAlpha = 1
  }

  ctx.globalAlpha = 1
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  return { charW, drawX }
}

// ── Gallery card — renders ASCII card client-side from raw drawing PNG ────────
function GalleryCard({ drawing, idx, onZoom }: { drawing: Drawing; idx: number; onZoom: (i: number) => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef(0)
  const asciiRef   = useRef<string[]>([])
  const drawXRef   = useRef(14)
  const color = CARD_COLORS.find(c => c.hex === drawing.card_color) ?? CARD_COLORS[idx % CARD_COLORS.length]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false

    imageUrlToAscii(drawing.image_url).then(async ascii => {
      if (cancelled || !canvasRef.current) return
      asciiRef.current = ascii
      const { drawX } = await renderCard(canvasRef.current, { color, cardNum: idx + 1, ascii, name: resolveVisitorName(drawing.name, drawing.id), date: drawing.created_at })
      drawXRef.current = drawX
    })

    return () => { cancelled = true }
  }, [drawing.image_url, idx])

  const startTwinkle = () => {
    const overlay = overlayRef.current
    if (!overlay) return
    // overlay logical size matches card
    overlay.width  = CW * CDPR
    overlay.height = CH * CDPR
    const ctx = overlay.getContext("2d")!
    ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)

    const { hex } = color
    // pre-build list of non-space character positions
    const cells: { x: number; y: number; w: number; h: number }[] = []
    const lineH = ASCII_FS * 1.35
    // approximate char width for overlay (monospace ~0.6× font size)
    const charW = ASCII_FS * 0.62
    const ASCII_PX = drawXRef.current
    asciiRef.current.forEach((line, row) => {
      for (let col = 0; col < line.length; col++) {
        if (line[col] !== " ") {
          cells.push({
            x: ASCII_PX + col * charW,
            y: DRAW_Y + row * lineH - ASCII_FS,
            w: charW + 0.5,
            h: ASCII_FS + 1,
          })
        }
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
      ctx.fillStyle = hex
      // mask ~10% of cells per frame, nearly opaque so masked chars clearly vanish
      const count = Math.floor(cells.length * 0.10)
      for (let i = 0; i < count; i++) {
        const c = cells[Math.floor(Math.random() * cells.length)]
        ctx.globalAlpha = 0.82 + Math.random() * 0.15
        ctx.fillRect(c.x, c.y, c.w, c.h)
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
      style={{
        borderRadius: 12, overflow: "hidden", position: "relative",
        boxShadow: "0 2px 16px rgba(30,75,154,0.10), 0 1px 3px rgba(30,75,154,0.06)",
        transition: "transform 0.22s cubic-bezier(.25,.8,.25,1), box-shadow 0.22s",
        cursor: "zoom-in",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = "translateY(-4px) scale(1.01)"
        el.style.boxShadow = "0 12px 36px rgba(30,75,154,0.16), 0 2px 6px rgba(30,75,154,0.08)"
        startTwinkle()
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ""; el.style.boxShadow = ""
        stopTwinkle()
      }}
      onClick={() => onZoom(idx)}
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
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DrawPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
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
  const PER_PAGE = 12

  const cardCanvasRef  = useRef<HTMLCanvasElement>(null)
  // pre-rendered base card (no ASCII) — composited onto card canvas for fast live updates
  const baseCanvasRef  = useRef<HTMLCanvasElement | null>(null)
  // in-memory canvas tracking raw strokes — not mounted in DOM
  const offscreenRef   = useRef<HTMLCanvasElement | null>(null)
  // measured charW of Courier New at ASCII_FS — set after first render, used for coordinate mapping
  const charWRef       = useRef(ASCII_FS * 0.6)
  const drawXRef       = useRef(14)
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
        `${SUPABASE_URL}/rest/v1/drawings?select=id,name,image_url,created_at&order=created_at.desc`,
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
    ctx.font = `${ASCII_FS}px 'Courier New', Courier, monospace`
    const charW = ctx.measureText("M").width
    const lh = ASCII_FS * 1.35
    ctx.fillStyle = cardColor.ink
    ctx.globalAlpha = 1
    const dx = drawXRef.current
    for (let row = 0; row < asciiRef.current.length; row++) {
      for (let col = 0; col < asciiRef.current[row].length; col++) {
        const ch = asciiRef.current[row][col]
        if (ch === " ") continue
        const x = dx + col * charW
        const y = DRAW_Y + row * lh
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

    ;(async () => {
      const canvas = cardCanvasRef.current
      if (!canvas) return
      const { charW, drawX } = await renderCard(canvas, {
        color: cardColor,
        cardNum: drawingsRef.current.length + 1,
        ascii: [],
        name: "Mystery Visitor",
      })
      charWRef.current = charW
      drawXRef.current = drawX

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
          await renderCard(canvas, {
            color: cardColor,
            cardNum: drawingsRef.current.length + 1,
            ascii: asciiRef.current,
            name: "Mystery Visitor",
          })
        }
      }

      const base = document.createElement("canvas")
      base.width  = canvas.width
      base.height = canvas.height
      base.getContext("2d")!.drawImage(canvas, 0, 0)
      baseCanvasRef.current = base
    })()
  }, [modalOpen, editingId])

  // Color change — re-render card with existing drawing preserved
  useEffect(() => {
    if (!modalOpen || !baseCanvasRef.current) return

    ;(async () => {
      const canvas = cardCanvasRef.current
      if (!canvas) return
      const { charW, drawX } = await renderCard(canvas, {
        color: cardColor,
        cardNum: drawingsRef.current.length + 1,
        ascii: asciiRef.current,
        name: "Mystery Visitor",
      })
      charWRef.current = charW
      drawXRef.current = drawX

      const base = document.createElement("canvas")
      base.width  = canvas.width
      base.height = canvas.height
      base.getContext("2d")!.drawImage(canvas, 0, 0)
      baseCanvasRef.current = base
    })()
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
      y: Math.min(Math.max(0, p.y - DRAW_Y), off ? off.height - 1 : 0),
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
          body: JSON.stringify({ name: randomName(), image_url: imageUrl, card_color: cardColor.hex, position_x: 0, position_y: 0, rotation: 0 }),
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

  useEffect(() => {
    if (zoomedIdx === null || !zoomCanvasRef.current) return
    const drawing = visible[zoomedIdx]
    if (!drawing) return
    const color = CARD_COLORS[zoomedIdx % CARD_COLORS.length]
    let cancelled = false
    cancelAnimationFrame(zoomRafRef.current)
    zoomAsciiRef.current = []
    imageUrlToAscii(drawing.image_url).then(async ascii => {
      if (cancelled || !zoomCanvasRef.current) return
      zoomAsciiRef.current = ascii
      const { drawX: zdx } = await renderCard(zoomCanvasRef.current, { color, cardNum: zoomedIdx + 1, ascii, name: resolveVisitorName(drawing.name, drawing.id), date: drawing.created_at })
      zoomDrawXRef.current = zdx
    })
    return () => { cancelled = true }
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
    <div className="line-grid" style={{ minHeight: "100%", fontFamily: "Space Grotesk, sans-serif", position: "relative" }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="draw-header">
        <div className="draw-header-top">
          <div className="draw-header-left">
            <p className="draw-eyebrow">Visitor Gallery</p>
            <h1 className="draw-headline">Drawing Board</h1>
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
          <div className="draw-divider-line" />
          {drawings.length > 0 && (
            <span className="draw-count">
              {drawings.length} {drawings.length === 1 ? "visitor" : "visitors"}
            </span>
          )}
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
              {visible.map((d, i) => <GalleryCard key={d.id} drawing={d} idx={i} onZoom={(i) => setZoomedIdx(i)} />)}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 48 }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    background: "transparent", border: "1.5px solid rgba(30,75,154,0.2)",
                    color: "#1E4B9A", borderRadius: 100, padding: "10px 28px",
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

          {/* Prev arrow */}
          <button
            onClick={e => { e.stopPropagation(); setZoomedIdx(i => i !== null ? Math.max(0, i - 1) : null) }}
            disabled={zoomedIdx === 0}
            style={{
              position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "50%", width: 44, height: 44,
              color: "#fff", fontSize: 18, cursor: "none",
              opacity: zoomedIdx === 0 ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >‹</button>

          {/* Next arrow */}
          <button
            onClick={e => { e.stopPropagation(); setZoomedIdx(i => i !== null ? Math.min(visible.length - 1, i + 1) : null) }}
            disabled={zoomedIdx === visible.length - 1}
            style={{
              position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
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
                THAT'S YOURS ✦
              </div>
            )}

            {/* Card container */}
            <div
              style={{ width: "100%", maxWidth: 495, borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", position: "relative" }}
              onMouseEnter={(e) => {
                const cardColor = CARD_COLORS[zoomedIdx! % CARD_COLORS.length]
                if (cardColor.ink !== "#ffffff") document.body.classList.add("cursor-on-light-card")
                const overlay = zoomOverlayRef.current
                if (!overlay) return
                overlay.width = CW * CDPR; overlay.height = CH * CDPR
                const ctx = overlay.getContext("2d")!
                ctx.setTransform(CDPR, 0, 0, CDPR, 0, 0)
                const color = CARD_COLORS[zoomedIdx! % CARD_COLORS.length]
                const cells: { x: number; y: number; w: number; h: number }[] = []
                const lineH = ASCII_FS * 1.35
                const charW = ASCII_FS * 0.62
                const ASCII_PX = zoomDrawXRef.current
                zoomAsciiRef.current.forEach((line, row) => {
                  for (let col = 0; col < line.length; col++) {
                    if (line[col] !== " ") cells.push({ x: ASCII_PX + col * charW, y: DRAW_Y + row * lineH - ASCII_FS, w: charW + 0.5, h: ASCII_FS + 1 })
                  }
                })
                if (cells.length === 0) return
                let last = 0
                const tick = (now: number) => {
                  if (now - last < 100) { zoomRafRef.current = requestAnimationFrame(tick); return }
                  last = now
                  ctx.clearRect(0, 0, CW, CH)
                  ctx.fillStyle = color.hex
                  const count = Math.floor(cells.length * 0.10)
                  for (let i = 0; i < count; i++) {
                    const c = cells[Math.floor(Math.random() * cells.length)]
                    ctx.globalAlpha = 0.82 + Math.random() * 0.15
                    ctx.fillRect(c.x, c.y, c.w, c.h)
                  }
                  ctx.globalAlpha = 1
                  zoomRafRef.current = requestAnimationFrame(tick)
                }
                zoomRafRef.current = requestAnimationFrame(tick)
              }}
              onMouseLeave={() => {
                cancelAnimationFrame(zoomRafRef.current)
                zoomOverlayRef.current?.getContext("2d")?.clearRect(0, 0, CW * CDPR, CH * CDPR)
                document.body.classList.remove("cursor-on-light-card")
              }}
            >
              <canvas ref={zoomCanvasRef} width={CW * CDPR} height={CH * CDPR} style={{ display: "block", width: "100%", height: "auto" }} />
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
                    setCardColor(CARD_COLORS[zoomedIdx % CARD_COLORS.length])
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
                <h2 style={{ fontFamily: "Domine, Georgia, serif", fontSize: 24, fontWeight: 700, color: isDark ? "#ffffff" : "#1E4B9A", margin: "0 0 4px" }}>
                  {editingId ? "Edit your card" : "Leave your mark"}
                </h2>
                <p className="draw-modal-subtitle" style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.45)" : "#9aa5b4", margin: 0, letterSpacing: "0.03em" }}>
                  {editingId ? "Redraw on the card to update your entry." : "Draw directly on the card — your sketch becomes ASCII art."}
                </p>
              </div>
              <button onClick={closeModal} style={{
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(30,75,154,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(30,75,154,0.12)"}`,
                borderRadius: "50%", width: 32, height: 32, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "none", color: isDark ? "#ffffff" : "#1E4B9A", fontSize: 13, marginLeft: 12,
              }}>✕</button>
            </div>

            {/* Card — draw directly on it */}
            <div className="draw-modal-canvas-wrap" style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <canvas
                ref={cardCanvasRef}
                width={CW * CDPR}
                height={CH * CDPR}
                style={{ display: "block", width: `${CW}px`, maxWidth: "100%", height: "auto", cursor: "crosshair", touchAction: "none", borderRadius: 10, boxShadow: "0 4px 24px rgba(20,40,100,0.16)" }}
                onMouseDown={onDrawStart}
                onMouseMove={onDrawMove}
                onMouseUp={onDrawEnd}
                onMouseLeave={onDrawEnd}
                onTouchStart={e => { e.stopPropagation(); onDrawStart(e) }}
                onTouchMove={e => { e.stopPropagation(); e.preventDefault(); onDrawMove(e) }}
                onTouchEnd={e => { e.stopPropagation(); onDrawEnd() }}
              />
            </div>

            {/* Controls */}
            <div className="draw-modal-controls">
              {/* Card colors */}
              {CARD_COLORS.map(c => (
                <button key={c.hex} onClick={() => setCardColor(c)} title={c.name} className="draw-color-btn" style={{
                  background: c.hex,
                  border: cardColor.hex === c.hex ? `2.5px solid ${isDark ? "#ffffff" : "#1E4B9A"}` : `2px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(30,75,154,0.14)"}`,
                  outline: cardColor.hex === c.hex ? `2px solid ${isDark ? "#0F1923" : "#fff"}` : "none", outlineOffset: -3,
                  cursor: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
                }} />
              ))}


              {/* Brush sizes */}
              <div style={{ flex: 1 }} />

              <button onClick={clearDrawing} style={{
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(30,75,154,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(30,75,154,0.12)"}`,
                borderRadius: 0, padding: "6px 14px", fontSize: 12,
                fontFamily: "Space Grotesk, sans-serif", cursor: "none",
                color: isDark ? "#ffffff" : "#1E4B9A", fontWeight: 500, letterSpacing: "0.03em",
              }}>Clear</button>
            </div>

            <button
              onClick={post}
              disabled={posting}
              style={{
                width: "100%", padding: 13, borderRadius: 0, border: "none",
                background: posting ? "rgba(30,75,154,0.5)" : "#1E4B9A",
                color: "#fff", fontFamily: "Space Grotesk, sans-serif",
                fontSize: 14, fontWeight: 600, cursor: "none",
                letterSpacing: "0.04em", textTransform: "uppercase", transition: "background 0.15s",
              }}
            >
              {posting ? "Posting…" : editingId ? "Update card →" : "Add to gallery →"}
            </button>
          </div>
        </div>
      , document.body)}
      <Footer />
    </div>
  )
}
