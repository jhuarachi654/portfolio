import { useRef, useState } from "react"

// Mobile/tablet counterpart to HeroCursorTrail (which is mouse-only and
// hidden below 1200px). The favicon in the hero's top-right can be
// dragged ("peeled") off and dropped anywhere in the hero as a movable
// sticker — up to MAX_STICKERS at once. Dropping a sticker fires a
// favicon-particle burst at the drop point. Placed stickers stay
// draggable afterward but nothing persists across reloads.
const MAX_STICKERS = 3
const BURST_COUNT = 16

type Burst = { id: number; x: number; y: number; dx: number; dy: number; rotate: number; size: number }
type Sticker = { id: number; x: number; y: number }

function makeBurst(nextId: { current: number }, x: number, y: number): Burst[] {
  return Array.from({ length: BURST_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2
    const distance = 90 + Math.random() * 90
    return {
      id: nextId.current++,
      x,
      y,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 480,
      size: 16 + Math.random() * 14,
    }
  })
}

export default function HeroFaviconBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [popping, setPopping] = useState(false)
  const [dragId, setDragId] = useState<number | "source" | null>(null)
  // While peeling a brand-new sticker off the source icon (dragId === "source"),
  // this tracks the live cursor position so a ghost copy can follow the
  // finger/cursor from the very first pixel of movement — otherwise nothing
  // visibly moves until the pointer is released. peelOrigin is the anchor
  // point the ghost is being pulled away from, used to bend/skew the ghost
  // toward the drag direction like a sticker peeling off a sheet.
  const [peelPoint, setPeelPoint] = useState<{ x: number; y: number } | null>(null)
  const [peelOrigin, setPeelOrigin] = useState<{ x: number; y: number } | null>(null)
  const nextBurstId = useRef(0)
  const nextStickerId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  // onDragMove/onDragEnd are registered as raw window listeners (not React
  // handlers), so they close over stale state — read the live drag id
  // through a ref instead of the dragId state value.
  const dragIdRef = useRef<number | "source" | null>(null)
  dragIdRef.current = dragId
  const stickersRef = useRef<Sticker[]>(stickers)
  stickersRef.current = stickers

  const spawnBurst = (x: number, y: number) => {
    const fresh = makeBurst(nextBurstId, x, y)
    setBursts((prev) => [...prev, ...fresh])
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !fresh.some((f) => f.id === b.id)))
    }, 1100)
  }

  const containerPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const beginDrag = (id: number | "source", e: React.PointerEvent) => {
    e.preventDefault()
    setDragId(id)
    const p = containerPoint(e.clientX, e.clientY)
    if (id === "source") {
      dragOffset.current = { x: 0, y: 0 }
      setPeelOrigin(p)
      setPeelPoint(p)
    } else {
      const s = stickers.find((s) => s.id === id)
      dragOffset.current = { x: (s?.x ?? p.x) - p.x, y: (s?.y ?? p.y) - p.y }
    }
    window.addEventListener("pointermove", onDragMove)
    window.addEventListener("pointerup", onDragEnd)
  }

  const onDragMove = (e: PointerEvent) => {
    const p = containerPoint(e.clientX, e.clientY)
    const dragging = dragIdRef.current
    if (dragging === "source") {
      setPeelPoint(p)
    } else if (dragging !== null) {
      setStickers((prev) =>
        prev.map((s) =>
          s.id === dragging
            ? { ...s, x: p.x + dragOffset.current.x, y: p.y + dragOffset.current.y }
            : s
        )
      )
    }
  }

  const onDragEnd = (e: PointerEvent) => {
    window.removeEventListener("pointermove", onDragMove)
    window.removeEventListener("pointerup", onDragEnd)
    const p = containerPoint(e.clientX, e.clientY)
    const dragging = dragIdRef.current

    if (dragging === "source") {
      if (stickersRef.current.length < MAX_STICKERS) {
        const id = nextStickerId.current++
        setStickers((prev) => [...prev, { id, x: p.x, y: p.y }])
        spawnBurst(p.x, p.y)
      }
      setPopping(true)
      window.setTimeout(() => setPopping(false), 320)
      setPeelPoint(null)
      setPeelOrigin(null)
    } else if (dragging !== null) {
      spawnBurst(p.x, p.y)
    }
    setDragId(null)
  }

  return (
    <div ref={containerRef} className="hero-favicon-burst">
      <button
        type="button"
        className={`hero-favicon-burst-trigger${popping ? " is-popping" : ""}${dragId === "source" ? " is-dragging" : ""}${stickers.length >= MAX_STICKERS ? " is-maxed" : ""}`}
        onPointerDown={(e) => beginDrag("source", e)}
        aria-label="Drag to peel off a favicon sticker"
      >
        <span className="hero-favicon-burst-icon">
          <img src="/favicon.svg" alt="" width="29" height="29" draggable={false} />
        </span>
        <span className="hero-favicon-burst-label">peel sticker</span>
      </button>

      {peelOrigin && (
        <div className="hero-favicon-peel-slot" style={{ left: peelOrigin.x, top: peelOrigin.y }} aria-hidden="true" />
      )}

      {peelPoint && peelOrigin && (() => {
        const dx = peelPoint.x - peelOrigin.x
        const dy = peelPoint.y - peelOrigin.y
        const pulled = Math.min(Math.hypot(dx, dy) / 80, 1)
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        return (
          <div
            className="hero-favicon-sticker-ghost"
            aria-hidden="true"
            style={{
              left: peelPoint.x,
              top: peelPoint.y,
              "--peel-tilt": `${angle + 90}deg`,
              "--peel-amount": pulled,
            } as React.CSSProperties}
          >
            <img src="/favicon.svg" alt="" width="26" height="26" />
          </div>
        )
      })()}

      {stickers.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`hero-favicon-sticker${dragId === s.id ? " is-dragging" : ""}`}
          style={{ left: s.x, top: s.y }}
          onPointerDown={(e) => beginDrag(s.id, e)}
          aria-label="Drag to move sticker"
        >
          <img src="/favicon.svg" alt="" width="26" height="26" draggable={false} />
        </button>
      ))}

      {bursts.map((b) => (
        <div
          key={b.id}
          className="hero-favicon-burst-particle"
          aria-hidden="true"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            "--burst-dx": `${b.dx}px`,
            "--burst-dy": `${b.dy}px`,
            "--burst-rotate": `${b.rotate}deg`,
          } as React.CSSProperties}
        >
          <img src="/favicon.svg" alt="" width={b.size} height={b.size} />
        </div>
      ))}
    </div>
  )
}
