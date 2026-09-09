import { useRef, useState } from "react"

// Mobile/tablet counterpart to HeroCursorTrail (which is mouse-only and
// hidden below 1200px). The favicon in the hero's top-right can be
// dragged ("peeled") off and dropped anywhere in the hero as a movable
// sticker — up to MAX_STICKERS at once. Dropping a sticker fires a
// favicon-particle burst at the drop point. Placed stickers stay
// draggable afterward but nothing persists across reloads.
const MAX_STICKERS = 3
const BURST_COUNT = 16
// Renders the dragged/placed icon this many px above the actual touch
// point so a thumb/finger doesn't cover it while dragging on mobile.
const TOUCH_LIFT = 56
// Shared size (px) for the source trigger icon, the drag ghost, and
// placed stickers, so the favicon reads as the same object throughout
// the peel-and-place interaction.
const ICON_SIZE = 42
// A press-and-release with less movement than this (px) reads as an
// accidental tap rather than an intentional drag — no sticker is placed,
// so a tap can't silently burn through the MAX_STICKERS budget.
const MIN_DRAG_DISTANCE = 24

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
  // Briefly true right after a press-and-release that didn't move far
  // enough to count as a real drag, so the trigger can play a "nope, try
  // dragging" cue instead of silently doing nothing.
  const [tapCancelled, setTapCancelled] = useState(false)
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
  const peelOriginRef = useRef<{ x: number; y: number } | null>(null)
  peelOriginRef.current = peelOrigin

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
      // Stored sticker x/y is the floating (lifted) position already, so the
      // offset is computed against that directly — keeps the icon anchored
      // under the same point of the shape the finger originally grabbed,
      // consistent with where it visually sits above the touch point.
      const s = stickers.find((s) => s.id === id)
      const liftedP = { x: p.x, y: p.y - TOUCH_LIFT }
      dragOffset.current = { x: (s?.x ?? liftedP.x) - liftedP.x, y: (s?.y ?? liftedP.y) - liftedP.y }
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
      const liftedP = { x: p.x, y: p.y - TOUCH_LIFT }
      setStickers((prev) =>
        prev.map((s) =>
          s.id === dragging
            ? { ...s, x: liftedP.x + dragOffset.current.x, y: liftedP.y + dragOffset.current.y }
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
      const origin = peelOriginRef.current
      const dragDistance = origin ? Math.hypot(p.x - origin.x, p.y - origin.y) : 0
      const isRealDrag = dragDistance >= MIN_DRAG_DISTANCE

      if (isRealDrag && stickersRef.current.length < MAX_STICKERS) {
        const id = nextStickerId.current++
        const liftedP = { x: p.x, y: p.y - TOUCH_LIFT }
        setStickers((prev) => [...prev, { id, x: liftedP.x, y: liftedP.y }])
        spawnBurst(liftedP.x, liftedP.y)
        setPopping(true)
        window.setTimeout(() => setPopping(false), 320)
      } else if (!isRealDrag) {
        setTapCancelled(true)
        window.setTimeout(() => setTapCancelled(false), 260)
      }
      setPeelPoint(null)
      setPeelOrigin(null)
    } else if (dragging !== null) {
      const s = stickersRef.current.find((s) => s.id === dragging)
      if (s) spawnBurst(s.x, s.y)
    }
    setDragId(null)
  }

  return (
    <div ref={containerRef} className="hero-favicon-burst">
      <button
        type="button"
        className={`hero-favicon-burst-trigger${popping ? " is-popping" : ""}${dragId === "source" ? " is-dragging" : ""}${stickers.length >= MAX_STICKERS ? " is-maxed" : ""}${tapCancelled ? " is-tap-cancelled" : ""}`}
        onPointerDown={(e) => beginDrag("source", e)}
        aria-label="Hold and drag to peel off a favicon sticker"
      >
        <span className="hero-favicon-burst-icon">
          <img src="/favicon.svg" alt="" width={ICON_SIZE} height={ICON_SIZE} draggable={false} />
        </span>
        <span className="hero-favicon-burst-label">
          {dragId === "source" ? "hold & drag" : "peel sticker"}
        </span>
      </button>

      {peelOrigin && peelPoint && (() => {
        const dx = peelPoint.x - peelOrigin.x
        const dy = peelPoint.y - peelOrigin.y
        const pulled = Math.min(Math.hypot(dx, dy) / 70, 1)
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        // Fold axis is perpendicular to the pull direction, so the sticker
        // curls up along the edge closest to peelOrigin (like lifting a
        // real sticker corner) rather than spinning flat on the page.
        const foldAxisX = -Math.sin((angle * Math.PI) / 180)
        const foldAxisY = Math.cos((angle * Math.PI) / 180)
        return (
          <div
            className="hero-favicon-sticker-ghost"
            aria-hidden="true"
            style={{
              left: peelPoint.x,
              top: peelPoint.y - TOUCH_LIFT,
              "--fold-axis-x": foldAxisX,
              "--fold-axis-y": foldAxisY,
              "--peel-amount": pulled,
            } as React.CSSProperties}
          >
            <img src="/favicon.svg" alt="" width={ICON_SIZE} height={ICON_SIZE} />
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
          <img src="/favicon.svg" alt="" width={ICON_SIZE} height={ICON_SIZE} draggable={false} className="hero-favicon-sticker-outline" />
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
