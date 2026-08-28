import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

// Stars the hero fish occasionally drop as they swim — they stay put where
// dropped, gently spinning, and persist until clicked. Clicking one reveals
// a fact (content owned by the parent via onCatch). Capped at MAX_STARS so
// the hero never gets cluttered.

export type StarFieldHandle = {
  drop: (x: number, y: number) => void
}

type StarFieldProps = {
  onCatch: (x: number, y: number) => void
  onCountChange?: (count: number) => void
}

type Star = { id: number; x: number; y: number; rotation: number; bornAt: number; poppingAt?: number }

export const MAX_STARS = 3
const CLICK_RADIUS = 22
const ASTERISK_SPOKES = 6 // 6 lines through the center = 12 points
const STAR_SIZE = 4 // half-length of each spoke — 8x8px overall
const POP_DURATION = 220

function drawStar(ctx: CanvasRenderingContext2D, size: number, rotation: number, opacity: number) {
  ctx.save()
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 1.1
  ctx.lineCap = "round"
  for (let i = 0; i < ASTERISK_SPOKES; i++) {
    const angle = (Math.PI * i) / ASTERISK_SPOKES
    const dx = Math.cos(angle) * size
    const dy = Math.sin(angle) * size
    ctx.beginPath()
    ctx.moveTo(-dx, -dy)
    ctx.lineTo(dx, dy)
    ctx.stroke()
  }
  ctx.restore()
}

const StarField = forwardRef<StarFieldHandle, StarFieldProps>(({ onCatch, onCountChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const nextId = useRef(0)
  const lastReportedCount = useRef(0)

  const reportCount = () => {
    const count = starsRef.current.length
    if (count !== lastReportedCount.current) {
      lastReportedCount.current = count
      onCountChange?.(count)
    }
  }

  useImperativeHandle(ref, () => ({
    drop: (x: number, y: number) => {
      if (starsRef.current.length >= MAX_STARS) return
      starsRef.current = [...starsRef.current, { id: nextId.current++, x, y, rotation: Math.random() * Math.PI, bornAt: performance.now() }]
      reportCount()
    },
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return
    const ctx: CanvasRenderingContext2D = ctx2d

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0, height = 0
    function resize() {
      const parent = canvas!.parentElement
      width = parent ? parent.clientWidth : window.innerWidth
      height = parent ? parent.clientHeight : window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    function isOverHero(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!isOverHero(e.clientX, e.clientY)) return
      const rect = canvas!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const hit = starsRef.current.find(s => !s.poppingAt && Math.hypot(s.x - cx, s.y - cy) < CLICK_RADIUS)
      if (hit) {
        starsRef.current = starsRef.current.map(s => s.id === hit.id ? { ...s, poppingAt: performance.now() } : s)
        onCatch(hit.x, hit.y)
      }
    }
    window.addEventListener("pointerdown", onPointerDown)

    let rafId = 0
    let lastTime = performance.now()

    function step(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      starsRef.current = starsRef.current
        .map(s => ({ ...s, rotation: s.rotation + dt * 1.2 }))
        .filter(s => !s.poppingAt || now - s.poppingAt < POP_DURATION)
      reportCount()

      ctx.clearRect(0, 0, width, height)
      for (const s of starsRef.current) {
        const fadeIn = Math.min((now - s.bornAt) / 200, 1)
        let scale = 1
        let opacity = fadeIn
        if (s.poppingAt) {
          const t = Math.min((now - s.poppingAt) / POP_DURATION, 1)
          scale = 1 + t * 1.6
          opacity = fadeIn * (1 - t)
        }
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.scale(scale, scale)
        drawStar(ctx, STAR_SIZE, s.rotation, opacity)
        ctx.restore()
      }

      rafId = requestAnimationFrame(step)
    }

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [onCatch])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
    />
  )
})

export default StarField
