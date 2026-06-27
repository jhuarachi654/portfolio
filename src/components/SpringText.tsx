import { useEffect, useRef, useCallback } from "react"

const SPRING         = 0.18
const DAMPING        = 0.70
const REPEL_RADIUS   = 30
const REPEL_STRENGTH = 10
const FRAME_INTERVAL = 1000 / 60

interface CharState {
  el: HTMLSpanElement
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
}

export interface SpringLine {
  text: string
  style?: React.CSSProperties
}

interface Props {
  lines: SpringLine[]
  containerStyle?: React.CSSProperties
  gap?: number
}

export default function SpringText({ lines, containerStyle, gap = 12 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const charsRef     = useRef<CharState[]>([])
  const mouseRef     = useRef({ x: -9999, y: -9999 })
  const rafRef       = useRef(0)
  const seededRef    = useRef(false)

  const seedHomes = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const states = charsRef.current
    for (const s of states) {
      const r  = s.el.getBoundingClientRect()
      s.homeX  = r.left - cRect.left + r.width  / 2
      s.homeY  = r.top  - cRect.top  + r.height / 2
      s.x      = s.homeX
      s.y      = s.homeY
    }
    seededRef.current = true
  }, [])

  useEffect(() => {
    // collect all char spans after render
    const container = containerRef.current
    if (!container) return
    const spans = Array.from(container.querySelectorAll<HTMLSpanElement>("[data-char]"))
    charsRef.current = spans.map(el => ({
      el, homeX: 0, homeY: 0, x: 0, y: 0, vx: 0, vy: 0,
    }))

    // seed homes after fonts have likely loaded
    const t = setTimeout(seedHomes, 100)

    let lastFrame = 0

    const render = (now: number) => {
      if (!seededRef.current) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      if (now - lastFrame < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      lastFrame = now

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -100
      const rr2 = REPEL_RADIUS * REPEL_RADIUS

      for (const s of charsRef.current) {
        if (mouseActive) {
          const dx = s.x - mx
          const dy = s.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < rr2 && d2 > 0) {
            const dist  = Math.sqrt(d2)
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
            s.vx += (dx / dist) * force
            s.vy += (dy / dist) * force
          }
        }

        s.vx += (s.homeX - s.x) * SPRING
        s.vy += (s.homeY - s.y) * SPRING
        s.vx *= DAMPING
        s.vy *= DAMPING
        s.x  += s.vx
        s.y  += s.vy

        if (!mouseActive && Math.abs(s.vx) < 0.01 && Math.abs(s.vy) < 0.01) {
          s.vx = 0; s.vy = 0; s.x = s.homeX; s.y = s.homeY
        }

        const tx = s.x - s.homeX
        const ty = s.y - s.homeY
        s.el.style.transform = Math.abs(tx) > 0.1 || Math.abs(ty) > 0.1
          ? `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`
          : ""
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(t) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedHomes])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, ...containerStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 } }}
    >
      {lines.map((line, li) => (
        <p key={li} style={{ margin: 0, lineHeight: 1, ...line.style }}>
          {line.text.split("").map((ch, ci) => (
            <span
              key={ci}
              data-char
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {ch}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
