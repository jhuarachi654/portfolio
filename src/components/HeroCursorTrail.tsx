import { useEffect, useRef, useState } from "react"

// A trail of small favicon copies that follow the cursor and fade out.
// Scoped to the hero section only, desktop/tablet (>=1200px) — mobile gets
// the tap-to-peel-and-place favicon sticker instead (HeroFaviconBurst).
const TRAIL_LENGTH = 9
const BLOB_SIZE = 22
// Lower = looser, gentler trail (more visible gap between trailing dots,
// softer/slower chase instead of snapping to the cursor).
const FOLLOW_EASE = 0.18
// Small click burst, same mechanic as the mobile sticker-drop burst
// (HeroFaviconBurst): a capped, self-cleaning array of particles — no
// unbounded growth, nothing kept around after its own timeout fires.
const CLICK_BURST_COUNT = 8

type Burst = { id: number; x: number; y: number; dx: number; dy: number; rotate: number; size: number }

export default function HeroCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -999, y: -999 }))
  )
  const target = useRef({ x: -999, y: -999 })
  const active = useRef(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const nextBurstId = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const heroEl = container.closest(".hero-page--landing") as HTMLElement | null
    if (!heroEl) return

    // Reading getBoundingClientRect() on every mousemove forces a synchronous
    // layout — Safari is noticeably more sensitive to this than Chrome, and
    // it was making the whole trail feel sluggish independent of the easing
    // factor. Cache the rect and only refresh it on resize/scroll instead.
    let heroRect = heroEl.getBoundingClientRect()
    const updateRect = () => { heroRect = heroEl.getBoundingClientRect() }
    window.addEventListener("resize", updateRect)
    window.addEventListener("scroll", updateRect, { passive: true })

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX - heroRect.left, y: e.clientY - heroRect.top }
      active.current = true
      container.style.opacity = "1"
    }
    const onLeave = () => {
      active.current = false
      container.style.opacity = "0"
    }
    const onClick = (e: MouseEvent) => {
      const x = e.clientX - heroRect.left
      const y = e.clientY - heroRect.top
      const fresh: Burst[] = Array.from({ length: CLICK_BURST_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2
        const distance = 40 + Math.random() * 40
        return {
          id: nextBurstId.current++,
          x,
          y,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          rotate: (Math.random() - 0.5) * 360,
          size: 10 + Math.random() * 8,
        }
      })
      setBursts((prev) => [...prev, ...fresh])
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => !fresh.some((f) => f.id === b.id)))
      }, 700)
    }
    heroEl.addEventListener("mousemove", onMove)
    heroEl.addEventListener("mouseleave", onLeave)
    heroEl.addEventListener("click", onClick)

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
      heroEl.removeEventListener("click", onClick)
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
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

      {bursts.length > 0 && (
        <div className="hero-cursor-click-burst" aria-hidden="true">
          {bursts.map((b) => (
            <div
              key={b.id}
              className="hero-cursor-click-burst-particle"
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
      )}
    </>
  )
}
