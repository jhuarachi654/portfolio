import { useEffect, useRef } from "react"

const TILE            = 3
const FRAME_INTERVAL  = 1000 / 60
const SPRING          = 0.19
const DAMPING         = 0.72
const REPEL_RADIUS    = 40
const REPEL_STRENGTH  = 22
const DISPLACE_THRESH = 0.4
const LUM_FLOOR       = 0.1

interface TextLine {
  text: string
  font: string          // CSS font string — use actual family names, not CSS vars
  alpha: number         // 0–1 fill opacity for this line
  y: number             // baseline y within the canvas
  align?: CanvasTextAlign
}

interface Tile {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  visible: boolean
  alpha: number
}

interface Props {
  lines: TextLine[]
  width: number
  height: number
  color?: [number, number, number]  // tile RGB, default white
}

export default function AsciiText({ lines, width, height, color = [255, 255, 255] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })!
    canvas.width  = width
    canvas.height = height

    const cols = Math.floor(width  / TILE)
    const rows = Math.floor(height / TILE)
    const [tr, tg, tb] = color

    // Render text to offscreen canvas
    const off = document.createElement("canvas")
    off.width  = width
    off.height = height
    const offCtx = off.getContext("2d", { willReadFrequently: true })!
    offCtx.clearRect(0, 0, width, height)

    for (const line of lines) {
      offCtx.save()
      offCtx.font         = line.font
      offCtx.fillStyle    = `rgba(255,255,255,${line.alpha})`
      offCtx.textAlign    = line.align ?? "center"
      offCtx.textBaseline = "alphabetic"
      offCtx.fillText(line.text, width / 2, line.y)
      offCtx.restore()
    }

    // Sample pixel data into tiles
    const img = offCtx.getImageData(0, 0, width, height)
    const d   = img.data

    const tiles: Tile[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sx = c * TILE
        const sy = r * TILE

        let lumSum = 0
        let count  = 0
        for (let py = sy; py < sy + TILE && py < height; py++) {
          for (let px = sx; px < sx + TILE && px < width; px++) {
            const pi  = (py * width + px) * 4
            lumSum   += (0.299 * d[pi] + 0.587 * d[pi + 1] + 0.114 * d[pi + 2]) / 255
            count++
          }
        }
        const lum = lumSum / count

        tiles.push({
          homeX: sx, homeY: sy,
          x: sx, y: sy,
          vx: 0, vy: 0,
          visible: lum > LUM_FLOOR,
          alpha: lum,
        })
      }
    }

    // Build a tinted source image for fast blitting
    const src = document.createElement("canvas")
    src.width  = width
    src.height = height
    const srcCtx = src.getContext("2d", { willReadFrequently: true })!
    srcCtx.putImageData(img, 0, 0)
    const tinted = srcCtx.getImageData(0, 0, width, height)
    const td = tinted.data
    for (let i = 0; i < td.length; i += 4) {
      const lum = (0.299 * td[i] + 0.587 * td[i + 1] + 0.114 * td[i + 2]) / 255
      const a   = lum < LUM_FLOOR ? 0 : Math.pow((lum - LUM_FLOOR) / (1 - LUM_FLOOR), 0.35)
      td[i]     = tr
      td[i + 1] = tg
      td[i + 2] = tb
      td[i + 3] = Math.round(a * 255)
    }
    srcCtx.putImageData(tinted, 0, 0)

    let lastFrame = 0

    const render = (now: number) => {
      if (now - lastFrame < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      lastFrame = now

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -100 && my > -100
      const rr2 = REPEL_RADIUS * REPEL_RADIUS

      if (mouseActive) {
        for (const t of tiles) {
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
        for (const t of tiles) {
          if (!t.visible || (t.vx === 0 && t.vy === 0 && t.x === t.homeX && t.y === t.homeY)) continue
          t.vx += (t.homeX - t.x) * SPRING
          t.vy += (t.homeY - t.y) * SPRING
          t.vx *= DAMPING
          t.vy *= DAMPING
          t.x  += t.vx
          t.y  += t.vy
          if (Math.abs(t.vx) < 0.01 && Math.abs(t.vy) < 0.01) {
            t.vx = 0; t.vy = 0; t.x = t.homeX; t.y = t.homeY
          }
        }
      }

      ctx.clearRect(0, 0, width, height)

      const displaced: Tile[] = []
      for (const t of tiles) {
        if (!t.visible) continue
        if (Math.abs(t.x - t.homeX) > DISPLACE_THRESH || Math.abs(t.y - t.homeY) > DISPLACE_THRESH) {
          displaced.push(t)
        }
      }

      ctx.drawImage(src, 0, 0)

      if (displaced.length > 0) {
        for (const t of displaced) ctx.clearRect(t.homeX, t.homeY, TILE, TILE)
        for (const t of displaced) ctx.drawImage(src, t.homeX, t.homeY, TILE, TILE, Math.round(t.x), Math.round(t.y), TILE, TILE)
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafRef.current)
  }, [width, height, JSON.stringify(lines), JSON.stringify(color)])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 } }}
    />
  )
}
