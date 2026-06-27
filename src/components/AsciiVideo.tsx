import { useEffect, useRef } from "react"

const TILE            = 3
const IS_MOBILE       = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
const SAMPLE_INTERVAL = 80
const FRAME_INTERVAL  = 1000 / 60
const SPRING          = 0.19
const DAMPING         = 0.72
const REPEL_RADIUS    = 40
const REPEL_STRENGTH  = 20
const DISPLACE_THRESH = 0.4

const MOBILE_STATIC_SRC = "/cosmos-bloom.png"

interface Tile {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  visible: boolean
  baseAlpha: number
  twinklePhase: number
}

interface Props {
  src: string
  width?: number
  height?: number
  twinkle?: boolean
  tileColor?: [number, number, number]
  seekTo?: number
  loop?: boolean
  startDelay?: number
  playbackRate?: number
}

export default function AsciiVideo({ src, width = 420, height = 460, twinkle = false, tileColor, seekTo, loop = true, startDelay = 0, playbackRate = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const frameRef  = useRef<HTMLCanvasElement>(null)
  const tilesRef  = useRef<Tile[]>([])
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const frame  = frameRef.current
    if (!canvas || !frame) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    canvas.width  = width
    canvas.height = height
    frame.width   = width
    frame.height  = height
    const fCtx = frame.getContext("2d", { willReadFrequently: true })!

    const cols = Math.floor(width  / TILE)
    const rows = Math.floor(height / TILE)
    const LUM_FLOOR = 0.15

    const tiles: Tile[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tiles.push({ homeX: c * TILE, homeY: r * TILE, x: c * TILE, y: r * TILE, vx: 0, vy: 0, visible: false, baseAlpha: 0, twinklePhase: Math.random() * Math.PI * 2 })
      }
    }
    tilesRef.current = tiles

    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark"

    const processPixels = () => {
      const img = fCtx.getImageData(0, 0, width, height)
      const d   = img.data
      const dark = isDark()
      const [tr, tg, tb] = tileColor ?? (dark ? [255, 255, 255] : [30, 75, 154])

      for (let i = 0; i < tiles.length; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        const sx  = col * TILE
        const sy  = row * TILE

        let lumSum = 0
        for (let py = sy; py < sy + 2 && py < height; py++) {
          for (let px = sx; px < sx + 2 && px < width; px++) {
            const pi = (py * width + px) * 4
            lumSum += (0.299 * d[pi] + 0.587 * d[pi + 1] + 0.114 * d[pi + 2]) / 255
          }
        }
        const lum = lumSum / 4
        tiles[i].visible   = lum > LUM_FLOOR
        tiles[i].baseAlpha = lum

        for (let py = sy; py < sy + TILE && py < height; py++) {
          for (let px = sx; px < sx + TILE && px < width; px++) {
            const p = (py * width + px) * 4
            if (!tiles[i].visible) { d[p + 3] = 0; continue }
            const l  = (0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]) / 255
            const a  = l < LUM_FLOOR ? 0 : Math.pow((l - LUM_FLOOR) / (1 - LUM_FLOOR), 0.35)
            d[p]     = tr
            d[p + 1] = tg
            d[p + 2] = tb
            d[p + 3] = Math.round(a * 255)
          }
        }
      }
      fCtx.putImageData(img, 0, 0)
    }

    // ── Mobile: static image path ──────────────────────────────────
    if (IS_MOBILE) {
      const img = new Image()
      img.src = MOBILE_STATIC_SRC
      img.onload = () => {
        fCtx.drawImage(img, 0, 0, width, height)
        processPixels()

        let lastFrame = 0
        const render = (now: number) => {
          if (now - lastFrame < 1000 / 30) { rafRef.current = requestAnimationFrame(render); return }
          lastFrame = now

          const mx = mouseRef.current.x
          const my = mouseRef.current.y
          const active = mx > -100 && my > -100
          const rr2 = REPEL_RADIUS * REPEL_RADIUS

          let anyMoving = false
          for (let i = 0; i < tiles.length; i++) {
            const t = tiles[i]
            if (!t.visible) continue
            if (active) {
              const cx = t.x + TILE / 2
              const cy = t.y + TILE / 2
              const dx = cx - mx
              const dy = cy - my
              const d2 = dx * dx + dy * dy
              if (d2 < rr2 && d2 > 0) {
                const dist  = Math.sqrt(d2)
                const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
                t.vx += (dx / dist) * force
                t.vy += (dy / dist) * force
              }
            }
            t.vx += (t.homeX - t.x) * SPRING
            t.vy += (t.homeY - t.y) * SPRING
            t.vx *= DAMPING
            t.vy *= DAMPING
            t.x  += t.vx
            t.y  += t.vy
            if (Math.abs(t.vx) < 0.01 && Math.abs(t.vy) < 0.01 && Math.abs(t.x - t.homeX) < 0.1 && Math.abs(t.y - t.homeY) < 0.1) {
              t.vx = 0; t.vy = 0; t.x = t.homeX; t.y = t.homeY
            } else { anyMoving = true }
          }

          ctx.clearRect(0, 0, width, height)
          const tileW = cols * TILE
          const tileH = rows * TILE
          const displaced: Tile[] = []
          for (let i = 0; i < tiles.length; i++) {
            const t = tiles[i]
            if (!t.visible) continue
            if (Math.abs(t.x - t.homeX) > DISPLACE_THRESH || Math.abs(t.y - t.homeY) > DISPLACE_THRESH) displaced.push(t)
          }
          if (displaced.length === 0) {
            ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
          } else {
            ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
            for (const t of displaced) ctx.clearRect(t.homeX, t.homeY, TILE, TILE)
            for (const t of displaced) ctx.drawImage(frame, t.homeX, t.homeY, TILE, TILE, Math.round(t.x), Math.round(t.y), TILE, TILE)
          }

          if (active || anyMoving) rafRef.current = requestAnimationFrame(render)
          else rafRef.current = 0
        }

        rafRef.current = requestAnimationFrame(render)
      }
      return () => cancelAnimationFrame(rafRef.current)
    }

    // ── Desktop/tablet: video path ─────────────────────────────────
    const video = videoRef.current
    if (!video) return

    let lastSample = 0
    let lastFrame  = 0

    const sampleFrame = (now: number) => {
      if (video.readyState < 2 || now - lastSample < SAMPLE_INTERVAL) return
      lastSample = now
      fCtx.drawImage(video, 0, 0, width, height)
      processPixels()
    }

    const render = (now: number) => {
      if (now - lastFrame < FRAME_INTERVAL) { rafRef.current = requestAnimationFrame(render); return }
      lastFrame = now
      sampleFrame(now)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -100 && my > -100
      const rr2 = REPEL_RADIUS * REPEL_RADIUS

      if (mouseActive) {
        for (let i = 0; i < tiles.length; i++) {
          const t  = tiles[i]
          if (!t.visible) continue
          const cx = t.x + TILE / 2
          const cy = t.y + TILE / 2
          const dx = cx - mx
          const dy = cy - my
          const d2 = dx * dx + dy * dy
          if (d2 < rr2 && d2 > 0) {
            const dist  = Math.sqrt(d2)
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
            t.vx += (dx / dist) * force
            t.vy += (dy / dist) * force
          }
          t.vx += (t.homeX - t.x) * SPRING
          t.vy += (t.homeY - t.y) * SPRING
          t.vx *= DAMPING
          t.vy *= DAMPING
          t.x  += t.vx
          t.y  += t.vy
        }
      } else {
        for (let i = 0; i < tiles.length; i++) {
          const t = tiles[i]
          if (!t.visible || (t.vx === 0 && t.vy === 0 && t.x === t.homeX && t.y === t.homeY)) continue
          t.vx += (t.homeX - t.x) * SPRING
          t.vy += (t.homeY - t.y) * SPRING
          t.vx *= DAMPING
          t.vy *= DAMPING
          t.x  += t.vx
          t.y  += t.vy
          if (Math.abs(t.vx) < 0.01 && Math.abs(t.vy) < 0.01) { t.vx = 0; t.vy = 0; t.x = t.homeX; t.y = t.homeY }
        }
      }

      ctx.clearRect(0, 0, width, height)
      const tileW = cols * TILE
      const tileH = rows * TILE

      if (twinkle) {
        const flicker = 0.6 + 0.4 * Math.sin(now * 0.004)
        ctx.globalAlpha = flicker
        ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
        ctx.globalAlpha = 1
      } else {
        const displaced: Tile[] = []
        for (let i = 0; i < tiles.length; i++) {
          const t = tiles[i]
          if (!t.visible) continue
          if (Math.abs(t.x - t.homeX) > DISPLACE_THRESH || Math.abs(t.y - t.homeY) > DISPLACE_THRESH) displaced.push(t)
        }
        if (displaced.length === 0) {
          ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
        } else {
          ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
          for (const t of displaced) ctx.clearRect(t.homeX, t.homeY, TILE, TILE)
          for (const t of displaced) ctx.drawImage(frame, t.homeX, t.homeY, TILE, TILE, Math.round(t.x), Math.round(t.y), TILE, TILE)
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    const start = () => {
      setTimeout(() => {
        video.playbackRate = playbackRate
        video.play().catch(() => {})
        rafRef.current = requestAnimationFrame(render)
      }, startDelay)
    }

    if (video.readyState >= 2) start()
    else {
      video.addEventListener("loadeddata", start, { once: true })
      video.addEventListener("canplay", start, { once: true })
      video.load()
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [src, width, height, seekTo, startDelay])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => {})
  }

  const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const t = e.touches[0]
    mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(function loop(now) {
      rafRef.current = requestAnimationFrame(loop)
    })
  }

  const handleTouchEnd = () => { mouseRef.current = { x: -9999, y: -9999 } }

  return (
    <div
      className="ascii-video-wrap"
      style={{ width, height, flexShrink: 0, position: "relative" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!IS_MOBILE && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop={loop}
          muted
          playsInline
          preload="auto"
          style={{ display: "none" }}
        />
      )}
      <canvas ref={frameRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{ display: "block", width, height, background: "transparent" }}
      />
    </div>
  )
}
