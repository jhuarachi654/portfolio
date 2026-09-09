import { useEffect, useRef, useState } from "react"
import GodRays from "./GodRays"

// A trail of small "blobs," each filled with the same animated GodRays
// canvas used for the "Johanna" name-fill, clipped to the *actual* favicon
// silhouette (its real SVG path, not an approximation) — same shape the
// browser tab icon uses, at trail-dot scale — that follow the cursor and
// fade out. Scoped to the hero section only.
const TRAIL_LENGTH = 9
const BLOB_SIZE = 22

// The favicon's own path data (public/favicon.svg, viewBox 0 0 80 80) —
// clip-path: path() operates in the clipped element's own pixel box, so
// the wrapper below is sized at the favicon's native 80px and clipped
// 1:1, then a separate CSS transform: scale() (on a wrapper OUTSIDE the
// translate-positioned element) shrinks it to BLOB_SIZE — keeping scale
// and translate on different elements avoids the scale factor also
// warping the translate offset, which would otherwise make each trail
// dot drift away from its intended trail position.
const FAVICON_PATH =
  "M24.8666 10.3753C25.0301 8.9707 28.0128 5.84775 29.1087 4.93722C33.0195 1.68779 37.9942 0.723802 42.8491 1.39156C49.5319 2.31076 54.0028 6.84755 56.256 12.9541C56.3916 13.3215 57.3238 14.2321 57.4416 14.5904C60.7748 18.0748 62.828 17.5686 67.1993 18.4253C67.7773 18.5386 68.8699 18.7722 69.3737 19.0765C74.7266 20.8967 79.0906 26.5319 79.7883 32.1047L80 32.3704V37.5684L79.9727 37.6266C79.7867 38.0369 79.4773 39.3897 79.3453 39.8998C78.9352 41.4905 78.3477 42.5724 77.4566 43.9452C76.7841 44.9816 75.9979 45.9395 75.1123 46.8009C73.0912 48.7427 72.16 49.0933 71.1442 51.9642C69.9198 55.4248 70.9698 57.5959 71.2533 60.9882C72.3027 73.5493 58.7291 82.4648 47.4012 77.386C46.8673 77.1466 46.05 76.7116 45.6196 76.3351C45.0555 76.0835 44.5487 75.7323 43.898 75.4655C41.3948 74.437 38.5846 74.4504 36.0912 75.5024C35.8823 75.6733 35.348 75.7928 35.1086 75.961C29.5174 79.8875 21.439 79.6609 15.9103 75.6711C10.977 72.1863 8.05094 66.2738 8.82336 60.2106C9.24281 56.9176 10.1828 54.7253 8.67445 51.3609C7.62459 49.0191 6.85556 48.5098 4.98079 46.8191C2.83416 44.8833 0.944328 41.6516 0.425708 38.7773C0.354147 38.3175 0.248357 37.6621 0 37.2728V32.6694C0.165412 32.4588 0.948766 29.0189 1.17692 28.4283C2.99466 23.7231 6.47358 20.3682 11.2715 18.8027C12.4609 18.4147 13.9941 18.1937 15.2547 18.0103C15.7156 17.8952 16.725 17.8794 17.3026 17.7328C20.44 16.9365 22.202 15.3794 23.7944 12.5759C24.1749 11.9059 24.4223 11.0494 24.8301 10.4299L24.8666 10.3753Z"
const FAVICON_NATIVE_SIZE = 80
const BLOB_SCALE = BLOB_SIZE / FAVICON_NATIVE_SIZE

const BURST_COUNT = 10
const BURST_SIZE = 36
const BURST_RADIUS = 110
const BURST_DURATION_MS = 700

type Burst = { id: number; x: number; y: number }

function BurstBlob({ angle }: { angle: number }) {
  const dx = Math.cos(angle) * BURST_RADIUS
  const dy = Math.sin(angle) * BURST_RADIUS
  return (
    <div
      className="hero-cursor-burst-dot"
      style={{
        width: BURST_SIZE,
        height: BURST_SIZE,
        "--burst-dx": `${dx}px`,
        "--burst-dy": `${dy}px`,
        animationDuration: `${BURST_DURATION_MS}ms`,
      } as React.CSSProperties}
    >
      <div
        className="hero-cursor-trail-blob"
        style={{
          width: FAVICON_NATIVE_SIZE,
          height: FAVICON_NATIVE_SIZE,
          clipPath: `path("${FAVICON_PATH}")`,
          WebkitClipPath: `path("${FAVICON_PATH}")`,
          transform: `scale(${BURST_SIZE / FAVICON_NATIVE_SIZE})`,
        }}
      >
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
          blurAmount={4}
        />
      </div>
    </div>
  )
}

export default function HeroCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -999, y: -999 }))
  )
  const target = useRef({ x: -999, y: -999 })
  const active = useRef(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const burstIdRef = useRef(0)

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
    const onClick = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect()
      const id = burstIdRef.current++
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setBursts((prev) => [...prev, { id, x, y }])
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id))
      }, BURST_DURATION_MS)
    }

    heroEl.addEventListener("mousemove", onMove)
    heroEl.addEventListener("mouseleave", onLeave)
    heroEl.addEventListener("click", onClick)

    let rafId = 0
    function tick() {
      const pts = positions.current
      pts[0].x += (target.current.x - pts[0].x) * 0.28
      pts[0].y += (target.current.y - pts[0].y) * 0.28
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.28
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.28
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
          }}
        >
          <div
            className="hero-cursor-trail-blob"
            style={{
              width: FAVICON_NATIVE_SIZE,
              height: FAVICON_NATIVE_SIZE,
              clipPath: `path("${FAVICON_PATH}")`,
              WebkitClipPath: `path("${FAVICON_PATH}")`,
              transform: `scale(${BLOB_SCALE * (1 - i / (TRAIL_LENGTH * 1.4))})`,
            }}
          >
            <GodRays
              colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
              noiseScale={0.2}
              noiseStrength={0.7}
              blurAmount={4}
            />
          </div>
        </div>
      ))}

      {bursts.map((b) => (
        <div key={b.id} className="hero-cursor-burst" style={{ transform: `translate(${b.x}px, ${b.y}px)` }}>
          {Array.from({ length: BURST_COUNT }, (_, i) => (
            <BurstBlob key={i} angle={(i / BURST_COUNT) * Math.PI * 2} />
          ))}
        </div>
      ))}
    </div>
  )
}
