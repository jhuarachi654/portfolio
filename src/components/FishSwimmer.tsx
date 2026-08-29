import { useEffect, useRef } from "react"

// A single-stroke line-art fish that wanders the hero, flees the cursor
// when it gets close, and darts away on click — same interaction pattern
// as GodRays' ripple trail.

type FishSwimmerProps = {
  color?: string
  onDropStar?: (x: number, y: number) => void
  filled?: boolean
}

function drawFilledFish(ctx: CanvasRenderingContext2D, wag: number, color: string) {
  ctx.save()
  ctx.fillStyle = color

  ctx.beginPath()
  ctx.moveTo(7, 0)
  ctx.bezierCurveTo(16, -7, 26, -6, 30, 0)
  ctx.bezierCurveTo(26, 6, 16, 7, 7, 0)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(8, 0)
  ctx.lineTo(-6, -8 + wag * 3)
  ctx.lineTo(-2, 0)
  ctx.lineTo(-6, 8 - wag * 3)
  ctx.closePath()
  ctx.fill()

  // Eye is punched out of the fill (destination-out) so the background
  // shows through, instead of drawing a same-color dot on top.
  ctx.globalCompositeOperation = "destination-out"
  ctx.beginPath()
  ctx.arc(25, -1, 1.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = "source-over"

  ctx.restore()
}

function drawLineFish(ctx: CanvasRenderingContext2D, wag: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineJoin = "round"
  ctx.lineCap = "round"

  ctx.beginPath()
  ctx.moveTo(7, 0)
  ctx.bezierCurveTo(16, -7, 26, -6, 30, 0)
  ctx.bezierCurveTo(26, 6, 16, 7, 7, 0)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(8, 0)
  ctx.lineTo(-6, -8 + wag * 3)
  ctx.lineTo(-2, 0)
  ctx.lineTo(-6, 8 - wag * 3)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(25, -1, 1.4, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

export default function FishSwimmer({ color = "#ffffff", onDropStar, filled = false }: FishSwimmerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return
    const ctx: CanvasRenderingContext2D = ctx2d

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0, height = 0
    let spriteScale = 1.6
    let textRect: { left: number; right: number; top: number; bottom: number } | null = null
    const TEXT_AVOID_PAD = 28

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

      spriteScale = width < 640 ? 1.0 : 1.6

      const textEl = parent?.querySelector(".hero-landing-inner")
      if (textEl) {
        const canvasRect = canvas!.getBoundingClientRect()
        const tr = textEl.getBoundingClientRect()
        textRect = {
          left: tr.left - canvasRect.left,
          right: tr.right - canvasRect.left,
          top: tr.top - canvasRect.top,
          bottom: tr.bottom - canvasRect.top,
        }
      }
    }
    resize()
    window.addEventListener("resize", resize)

    function isInsideTextZone(px: number, py: number) {
      if (!textRect) return false
      return px > textRect.left - TEXT_AVOID_PAD && px < textRect.right + TEXT_AVOID_PAD &&
        py > textRect.top - TEXT_AVOID_PAD && py < textRect.bottom + TEXT_AVOID_PAD
    }

    const MARGIN = 40
    let x = width * (0.4 + Math.random() * 0.5)
    let y = height * (0.3 + Math.random() * 0.4)
    let angle = Math.random() < 0.5 ? 0 : Math.PI
    let speed = 34
    let startledUntil = 0

    const pointer = { x: 0, y: 0, active: false }
    const FLEE_RADIUS = 130
    const FLEE_SPEED = 170
    const DART_RADIUS = 110
    const DART_SPEED = 260
    const DART_DURATION = 500

    function isOverHero(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isOverHero(e.clientX, e.clientY)) { pointer.active = false; return }
      const rect = canvas!.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!isOverHero(e.clientX, e.clientY)) return
      const rect = canvas!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const dist = Math.hypot(x - cx, y - cy)
      if (dist < DART_RADIUS) {
        angle = Math.atan2(y - cy, x - cx)
        startledUntil = performance.now() + DART_DURATION
      }
    }

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerdown", onPointerDown)
    }

    let rafId = 0
    let lastTime = performance.now()
    let nextStarDropAt = performance.now() + 1500 + Math.random() * 2500

    function step(now: number) {
      // Only drop stars when fish is on the right side (past 55% of width) to avoid text overlap
      if (onDropStar && now >= nextStarDropAt && x > width * 0.55) {
        onDropStar(x, y)
        nextStarDropAt = now + 10000 + Math.random() * 14000
      } else if (now >= nextStarDropAt) {
        // Reschedule drop check without dropping
        nextStarDropAt = now + 500
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const startled = now < startledUntil
      let targetSpeed = 34

      if (startled) {
        targetSpeed = DART_SPEED
      } else if (pointer.active) {
        const dist = Math.hypot(x - pointer.x, y - pointer.y)
        if (dist < FLEE_RADIUS) {
          angle = Math.atan2(y - pointer.y, x - pointer.x)
          targetSpeed = FLEE_SPEED
        }
      }

      if (!startled && (!pointer.active || Math.hypot(x - pointer.x, y - pointer.y) >= FLEE_RADIUS)) {
        angle += (Math.random() - 0.5) * 0.35 * dt * 10
      }

      if (!startled && isInsideTextZone(x, y) && textRect) {
        const cx = (textRect.left + textRect.right) / 2
        const cy = (textRect.top + textRect.bottom) / 2
        angle = Math.atan2(y - cy, x - cx)
        targetSpeed = Math.max(targetSpeed, 90)
      }

      speed += (targetSpeed - speed) * Math.min(dt * 4, 1)

      if (x < MARGIN) angle = Math.cos(angle) < 0 ? Math.PI - angle : angle
      if (x > width - MARGIN) angle = Math.cos(angle) > 0 ? Math.PI - angle : angle
      if (y < MARGIN) angle = Math.sin(angle) < 0 ? -angle : angle
      if (y > height - MARGIN) angle = Math.sin(angle) > 0 ? -angle : angle

      x += Math.cos(angle) * speed * dt
      y += Math.sin(angle) * speed * dt
      x = Math.max(MARGIN * 0.4, Math.min(width - MARGIN * 0.4, x))
      y = Math.max(MARGIN * 0.4, Math.min(height - MARGIN * 0.4, y))

      const agitated = startled || (pointer.active && Math.hypot(x - pointer.x, y - pointer.y) < FLEE_RADIUS)
      const flapInterval = agitated ? 90 : 220
      const wag = Math.sin(now / flapInterval)

      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(x, y)
      const facingLeft = Math.cos(angle) < 0
      ctx.scale(facingLeft ? -1 : 1, 1)
      ctx.scale(spriteScale, spriteScale)
      if (filled) drawFilledFish(ctx, wag, color)
      else drawLineFish(ctx, wag, color)
      ctx.restore()

      rafId = requestAnimationFrame(step)
    }

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(spriteScale, spriteScale)
      if (filled) drawFilledFish(ctx, 0, color)
      else drawLineFish(ctx, 0, color)
      ctx.restore()
    } else {
      rafId = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", mixBlendMode: "overlay" }}
    />
  )
}
