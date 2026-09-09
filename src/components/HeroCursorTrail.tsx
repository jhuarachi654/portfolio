import { useEffect, useRef } from "react"
import GodRays from "./GodRays"

// A trail of small organic "blobs," each filled with the same animated
// GodRays canvas used for the "Johanna" name-fill and the site favicon
// (same color array, same soft irregular flower-like outline instead of a
// plain circle), that follow the cursor and fade out — scoped to the hero.
const TRAIL_LENGTH = 10
const BLOB_SIZE = 22

// A handful of distinct blob outlines (as CSS border-radius shorthand,
// which accepts 8 values for elliptical corners) so consecutive trail dots
// don't all read as the same identical shape — echoes the favicon's soft,
// asymmetric petal silhouette rather than a uniform circle.
const BLOB_SHAPES = [
  "62% 38% 55% 45% / 45% 55% 45% 55%",
  "45% 55% 40% 60% / 55% 40% 62% 38%",
  "58% 42% 62% 38% / 38% 58% 42% 62%",
]

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
      pts[0].x += (target.current.x - pts[0].x) * 0.35
      pts[0].y += (target.current.y - pts[0].y) * 0.35
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.35
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.35
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
            opacity: 1 - i / TRAIL_LENGTH,
            transform: `scale(${1 - i / (TRAIL_LENGTH * 1.4)})`,
            borderRadius: BLOB_SHAPES[i % BLOB_SHAPES.length],
          }}
        >
          <GodRays
            colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
            noiseScale={0.2}
            noiseStrength={0.7}
            blurAmount={4}
          />
        </div>
      ))}
    </div>
  )
}
