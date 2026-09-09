import { useEffect, useRef } from "react"

// A trail of small favicon copies that follow the cursor and fade out.
// Scoped to the hero section only, desktop/tablet (>=1200px) — mobile gets
// the tap-to-peel-and-place favicon sticker instead (HeroFaviconBurst).
const TRAIL_LENGTH = 9
const BLOB_SIZE = 22
// Lower = looser, gentler trail (more visible gap between trailing dots,
// softer/slower chase instead of snapping to the cursor).
const FOLLOW_EASE = 0.16

export default function HeroCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -999, y: -999 }))
  )
  const target = useRef({ x: -999, y: -999 })
  const active = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const heroEl = container.closest(".hero-page--landing") as HTMLElement | null
    if (!heroEl) return

    const onMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect()
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      active.current = true
      container.style.opacity = "1"
    }
    const onLeave = () => {
      active.current = false
      container.style.opacity = "0"
    }
    heroEl.addEventListener("mousemove", onMove)
    heroEl.addEventListener("mouseleave", onLeave)

    let rafId = 0
    function tick() {
      const pts = positions.current
      pts[0].x += (target.current.x - pts[0].x) * FOLLOW_EASE
      pts[0].y += (target.current.y - pts[0].y) * FOLLOW_EASE
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * FOLLOW_EASE
        pts[i].y += (pts[i - 1].y - pts[i].y) * FOLLOW_EASE
      }
      dotsRef.current.forEach((el, i) => {
        if (!el) return
        const p = pts[i]
        el.style.transform = `translate(${p.x - BLOB_SIZE / 2}px, ${p.y - BLOB_SIZE / 2}px)`
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      heroEl.removeEventListener("mousemove", onMove)
      heroEl.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-cursor-trail" aria-hidden="true">
      {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) dotsRef.current[i] = el }}
          className="hero-cursor-trail-dot"
          style={{
            width: BLOB_SIZE,
            height: BLOB_SIZE,
            opacity: (1 - i / TRAIL_LENGTH) * 0.85,
            transform: `scale(${1 - i / (TRAIL_LENGTH * 1.4)})`,
          }}
        >
          <img src="/favicon.svg" alt="" width={BLOB_SIZE} height={BLOB_SIZE} />
        </div>
      ))}
    </div>
  )
}
