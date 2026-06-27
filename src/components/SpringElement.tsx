import { useEffect, useRef } from "react"

const SPRING         = 0.15
const DAMPING        = 0.65
const REPEL_RADIUS   = 80
const REPEL_STRENGTH = 22
const FRAME_INTERVAL = 1000 / 60

interface Props {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export default function SpringElement({ children, style, className }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef   = useRef(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    let lastFrame = 0

    const render = (now: number) => {
      if (now - lastFrame < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      lastFrame = now

      const s  = stateRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      if (mx > -100) {
        const rect = el.getBoundingClientRect()
        const cx   = rect.left + rect.width  / 2
        const cy   = rect.top  + rect.height / 2
        const dx   = cx - mx
        const dy   = cy - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          s.vx -= (dx / dist) * force
          s.vy -= (dy / dist) * force
        }
      }

      s.vx += -s.x * SPRING
      s.vy += -s.y * SPRING
      s.vx *= DAMPING
      s.vy *= DAMPING
      s.x  += s.vx
      s.y  += s.vy

      if (Math.abs(s.vx) < 0.01 && Math.abs(s.vy) < 0.01 && Math.abs(s.x) < 0.01 && Math.abs(s.y) < 0.01) {
        s.vx = 0; s.vy = 0; s.x = 0; s.y = 0
        el.style.transform = ""
      } else {
        el.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px)`
      }

      rafRef.current = requestAnimationFrame(render)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ display: "inline-block", ...style }} className={className}>
      {children}
    </div>
  )
}
