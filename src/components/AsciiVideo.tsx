import { useEffect, useRef } from "react"

const IS_MOBILE = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
// Same tile size everywhere (hero and splash alike) — the touch-repel loop
// below now only ever visits tiles near the finger via grid math, so a finer
// tile grid no longer costs anything extra during interaction.
const TILE      = 3
const PREFERS_REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const SAMPLE_INTERVAL = 80
const FRAME_INTERVAL  = 1000 / 60
const SPRING          = 0.19
const DAMPING         = 0.72
const REPEL_RADIUS    = 30
const REPEL_STRENGTH  = 18
const DISPLACE_THRESH = 0.4
const SCATTER_MAG        = 140
const SCATTER_DELAY_MAX  = 300
const SCATTER_DUR_BASE   = 1400
const SCATTER_DUR_RANGE  = 500

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
  scatterX: number
  scatterY: number
  introDelay: number
  introDuration: number
  introDone: boolean
}

function makeTile(homeX: number, homeY: number, scatterIntro: boolean): Tile {
  const scattered = scatterIntro && !PREFERS_REDUCED_MOTION
  return {
    homeX, homeY,
    x: scattered ? homeX + (Math.random() - 0.5) * 2 * SCATTER_MAG : homeX,
    y: scattered ? homeY + (Math.random() - 0.5) * 2 * SCATTER_MAG : homeY,
    vx: 0, vy: 0,
    visible: false, baseAlpha: 0,
    twinklePhase: Math.random() * Math.PI * 2,
    scatterX: scattered ? homeX + (Math.random() - 0.5) * 2 * SCATTER_MAG : homeX,
    scatterY: scattered ? homeY + (Math.random() - 0.5) * 2 * SCATTER_MAG : homeY,
    introDelay: scattered ? Math.random() * SCATTER_DELAY_MAX : 0,
    introDuration: scattered ? SCATTER_DUR_BASE + Math.random() * SCATTER_DUR_RANGE : 0,
    introDone: !scattered,
  }
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

/** Advances tiles still in their scatter-assemble intro. Returns true if any tile is still introducing. */
function stepIntro(tiles: Tile[], now: number, introStart: number): boolean {
  let stillIntroducing = false
  for (const t of tiles) {
    if (t.introDone) continue
    const elapsed = now - introStart
    if (elapsed < t.introDelay) { stillIntroducing = true; continue }
    const progress = Math.min(1, (elapsed - t.introDelay) / t.introDuration)
    const eased = easeOutCubic(progress)
    t.x = t.scatterX + (t.homeX - t.scatterX) * eased
    t.y = t.scatterY + (t.homeY - t.scatterY) * eased
    if (progress >= 1) { t.x = t.homeX; t.y = t.homeY; t.introDone = true }
    else stillIntroducing = true
  }
  return stillIntroducing
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
  staticBloom?: boolean
  scatterIntro?: boolean
}

export default function AsciiVideo({ src, width = 420, height = 460, twinkle = false, tileColor, seekTo, loop = true, startDelay = 0, playbackRate = 1, staticBloom = false, scatterIntro = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const frameRef  = useRef<HTMLCanvasElement>(null)
  const tilesRef  = useRef<Tile[]>([])
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  // Mobile / staticBloom: always use static bloom image — skip video entirely
  useEffect(() => {
    if (!IS_MOBILE && !staticBloom) return
    const canvas = canvasRef.current
    const frame  = frameRef.current
    if (!canvas || !frame) return
    const ctx  = canvas.getContext("2d", { alpha: true })
    if (!ctx) return
    canvas.width = width; canvas.height = height
    frame.width  = width; frame.height  = height
    const fCtx = frame.getContext("2d", { willReadFrequently: true })!
    const cols = Math.floor(width / TILE)
    const rows = Math.floor(height / TILE)
    const LUM_FLOOR = 0.15
    const tiles: Tile[] = []
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        tiles.push(makeTile(c*TILE, r*TILE, scatterIntro))
    tilesRef.current = tiles
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark"
    // Guards against img.onload firing after this effect has already been
    // cleaned up (component unmounted while the image was still loading) —
    // without it, onload would start a fresh rAF loop on an already-detached canvas.
    let cancelled = false
    const img = new Image()
    img.src = "/cosmos-bloom.jpg"
    img.onload = () => {
      if (cancelled) return
      fCtx.drawImage(img, 0, 0, width, height)
      const imgData = fCtx.getImageData(0, 0, width, height)
      const d = imgData.data
      const dark = isDark()
      const [tr, tg, tb] = tileColor ?? (dark ? [255,255,255] : [30,75,154])
      for (let i = 0; i < tiles.length; i++) {
        const col = i % cols, row = Math.floor(i / cols)
        const sx = col*TILE, sy = row*TILE
        let lumSum = 0
        for (let py = sy; py < sy+2 && py < height; py++)
          for (let px = sx; px < sx+2 && px < width; px++) {
            const pi = (py*width+px)*4
            lumSum += (0.299*d[pi] + 0.587*d[pi+1] + 0.114*d[pi+2]) / 255
          }
        const lum = lumSum / 4
        tiles[i].visible = lum > LUM_FLOOR
        for (let py = sy; py < sy+TILE && py < height; py++)
          for (let px = sx; px < sx+TILE && px < width; px++) {
            const p = (py*width+px)*4
            if (!tiles[i].visible) { d[p+3] = 0; continue }
            const l = (0.299*d[p] + 0.587*d[p+1] + 0.114*d[p+2]) / 255
            const a = l < LUM_FLOOR ? 0 : Math.pow((l-LUM_FLOOR)/(1-LUM_FLOOR), 0.35)
            d[p]=tr; d[p+1]=tg; d[p+2]=tb; d[p+3]=Math.round(a*255)
          }
      }
      fCtx.putImageData(imgData, 0, 0)
      const tileW = cols*TILE, tileH = rows*TILE
      let lastFrame = 0
      let introStart: number | null = null
      let hasDrawnOnce = false
      // Only tiles currently mid-repel or mid-spring-return live here. Touch
      // interaction used to loop over EVERY tile each frame just to check if
      // it was near the finger — for a few thousand tiles that's the actual
      // cause of "laggy, not real-time" dragging, not just draw-call count.
      // Now a touch only ever visits a small neighborhood via row/col math
      // (grid position is deterministic: col*TILE, row*TILE), and only tiles
      // in this set get physics/redraw work at all.
      const activeSet = new Set<number>()
      // Locally-scoped raf id so this effect's cleanup can never race with
      // another invocation's loop (e.g. React StrictMode's dev-only double-effect).
      let localRaf = 0
      const render = (now: number) => {
        localRaf = requestAnimationFrame(render)
        if (now - lastFrame < 1000/30) return
        lastFrame = now
        if (introStart === null) introStart = now
        stepIntro(tiles, now, introStart)
        const mx = mouseRef.current.x, my = mouseRef.current.y
        const active = mx > -100 && my > -100

        if (active) {
          const rr2 = REPEL_RADIUS * REPEL_RADIUS
          const minCol = Math.max(0, Math.floor((mx - REPEL_RADIUS) / TILE))
          const maxCol = Math.min(cols - 1, Math.ceil((mx + REPEL_RADIUS) / TILE))
          const minRow = Math.max(0, Math.floor((my - REPEL_RADIUS) / TILE))
          const maxRow = Math.min(rows - 1, Math.ceil((my + REPEL_RADIUS) / TILE))
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              const i = r * cols + c
              const t = tiles[i]
              if (!t.visible || !t.introDone) continue
              const cx = t.x+TILE/2, cy = t.y+TILE/2
              const dx = cx-mx, dy = cy-my, d2 = dx*dx+dy*dy
              if (d2 < rr2 && d2 > 0) {
                const dist = Math.sqrt(d2)
                t.vx += (dx/dist)*(1-dist/REPEL_RADIUS)*REPEL_STRENGTH
                t.vy += (dy/dist)*(1-dist/REPEL_RADIUS)*REPEL_STRENGTH
                activeSet.add(i)
              }
            }
          }
        }

        if (activeSet.size === 0 && hasDrawnOnce) return

        for (const i of activeSet) {
          const t = tiles[i]
          t.vx += (t.homeX-t.x)*SPRING; t.vy += (t.homeY-t.y)*SPRING
          t.vx *= DAMPING; t.vy *= DAMPING
          t.x += t.vx; t.y += t.vy
          if (Math.abs(t.vx) < 0.01 && Math.abs(t.vy) < 0.01 && Math.abs(t.x-t.homeX) < DISPLACE_THRESH && Math.abs(t.y-t.homeY) < DISPLACE_THRESH) {
            t.vx = 0; t.vy = 0; t.x = t.homeX; t.y = t.homeY
            activeSet.delete(i)
          }
        }

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
        const displaced: Tile[] = []
        for (const i of activeSet) {
          const t = tiles[i]
          if (Math.abs(t.x-t.homeX) > DISPLACE_THRESH || Math.abs(t.y-t.homeY) > DISPLACE_THRESH) displaced.push(t)
        }
        for (const t of displaced) ctx.clearRect(t.homeX, t.homeY, TILE, TILE)
        for (const t of displaced) ctx.drawImage(frame, t.homeX, t.homeY, TILE, TILE, Math.round(t.x), Math.round(t.y), TILE, TILE)
        hasDrawnOnce = true
      }
      localRaf = requestAnimationFrame(render)
      cleanupRaf = () => cancelAnimationFrame(localRaf)
    }
    let cleanupRaf = () => {}
    return () => { cancelled = true; cleanupRaf() }
  }, [width, height])

  useEffect(() => {
    if (IS_MOBILE || staticBloom) return
    const canvas = canvasRef.current
    const video  = videoRef.current
    const frame  = frameRef.current
    if (!canvas || !video || !frame) return

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
        tiles.push(makeTile(c * TILE, r * TILE, scatterIntro))
      }
    }
    tilesRef.current = tiles

    let lastSample = 0
    let lastFrame  = 0
    let introStart: number | null = null

    const isDark = () =>
      document.documentElement.getAttribute("data-theme") === "dark"

    const sampleFrame = (now: number) => {
      // Once a non-looping video ends, its frame stops changing — resampling it
      // (getImageData/putImageData over the whole canvas) is pure wasted work.
      if (video.ended || video.readyState < 2 || now - lastSample < SAMPLE_INTERVAL) return
      lastSample = now

      fCtx.drawImage(video, 0, 0, width, height)
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
        tiles[i].visible  = lum > LUM_FLOOR
        tiles[i].baseAlpha = lum

        for (let py = sy; py < sy + TILE && py < height; py++) {
          for (let px = sx; px < sx + TILE && px < width; px++) {
            const p = (py * width + px) * 4
            if (!tiles[i].visible) {
              d[p + 3] = 0
              continue
            }
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

    // Once the video has ended (loop=false), tiles are settled, and there's no
    // pointer interaction, there's nothing left to animate — skip the per-tile
    // work and redraw entirely instead of doing it forever at ~60fps.
    let settled = false
    // Locally-scoped raf id — cleanup below cancels exactly this invocation's
    // loop, so it can't race with another invocation (e.g. React StrictMode's
    // dev-only double-effect simulation combined with the async video-load
    // callback below).
    let localRaf = 0

    // Only tiles currently mid-repel or mid-spring-return live here — same
    // grid-bounded approach as the mobile static path. Without this, moving
    // the mouse over a full-size flower (420x500 = ~23k tiles) scanned every
    // single tile each frame just to check distance, which is the real cause
    // of "laggy" cursor tracking, not draw-call count.
    const activeSet = new Set<number>()

    const render = (now: number) => {
      localRaf = requestAnimationFrame(render)
      if (now - lastFrame < FRAME_INTERVAL) return
      lastFrame = now
      sampleFrame(now)
      if (introStart === null) introStart = now
      const introActive = stepIntro(tiles, now, introStart)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -100 && my > -100

      if (settled && video.ended && !introActive && !mouseActive && activeSet.size === 0) return

      const rr2 = REPEL_RADIUS * REPEL_RADIUS

      if (mouseActive) {
        const minCol = Math.max(0, Math.floor((mx - REPEL_RADIUS) / TILE))
        const maxCol = Math.min(cols - 1, Math.ceil((mx + REPEL_RADIUS) / TILE))
        const minRow = Math.max(0, Math.floor((my - REPEL_RADIUS) / TILE))
        const maxRow = Math.min(rows - 1, Math.ceil((my + REPEL_RADIUS) / TILE))
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            const i = r * cols + c
            const t = tiles[i]
            if (!t.visible || !t.introDone) continue
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
              activeSet.add(i)
            }
          }
        }
      }

      for (const i of activeSet) {
        const t = tiles[i]
        t.vx += (t.homeX - t.x) * SPRING
        t.vy += (t.homeY - t.y) * SPRING
        t.vx *= DAMPING
        t.vy *= DAMPING
        t.x  += t.vx
        t.y  += t.vy
        if (Math.abs(t.vx) < 0.01 && Math.abs(t.vy) < 0.01 && Math.abs(t.x - t.homeX) < DISPLACE_THRESH && Math.abs(t.y - t.homeY) < DISPLACE_THRESH) {
          t.vx = 0; t.vy = 0; t.x = t.homeX; t.y = t.homeY
          activeSet.delete(i)
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
        settled = false // twinkle modulates forever by design — never sleep
      } else {
        const displaced: Tile[] = []
        for (const i of activeSet) {
          const t = tiles[i]
          if (!t.visible) continue
          if (Math.abs(t.x - t.homeX) > DISPLACE_THRESH || Math.abs(t.y - t.homeY) > DISPLACE_THRESH) {
            displaced.push(t)
          }
        }

        if (displaced.length === 0) {
          ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
        } else {
          ctx.drawImage(frame, 0, 0, tileW, tileH, 0, 0, tileW, tileH)
          for (const t of displaced) {
            ctx.clearRect(t.homeX, t.homeY, TILE, TILE)
          }
          for (const t of displaced) {
            ctx.drawImage(frame, t.homeX, t.homeY, TILE, TILE, Math.round(t.x), Math.round(t.y), TILE, TILE)
          }
        }

        settled = video.ended && !introActive && !mouseActive && displaced.length === 0
      }
    }

    // "loadeddata" and "canplay" commonly both fire for the same load — guard
    // against start() running twice (which would spin up two parallel rAF loops).
    // `cancelled` additionally guards against start()'s deferred setTimeout
    // firing after this effect has already been cleaned up (e.g. the component
    // unmounted while the video was still loading) — without it, that callback
    // would spin up a fresh rAF loop on an already-detached canvas that nothing
    // would ever stop.
    let started = false
    let cancelled = false
    let startTimeout: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      if (started) return
      started = true
      startTimeout = setTimeout(() => {
        if (cancelled) return
        video.playbackRate = playbackRate
        video.play().catch(() => {})
        localRaf = requestAnimationFrame(render)
      }, startDelay)
    }

    if (video.readyState >= 2) start()
    else {
      video.addEventListener("loadeddata", start, { once: true })
      video.addEventListener("canplay", start, { once: true })
      video.load()
    }

    return () => {
      cancelled = true
      clearTimeout(startTimeout)
      video.removeEventListener("loadeddata", start)
      video.removeEventListener("canplay", start)
      cancelAnimationFrame(localRaf)
    }
  }, [src, width, height, seekTo, startDelay])

  // The canvas has a fixed internal resolution (width/height props) but is
  // CSS-scaled to its container, which is often a different size — so a raw
  // clientX/Y - rect.left/top offset drifts from the true pointer position
  // (worse near the edges) unless scaled back into canvas pixel space.
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: (e.clientX - rect.left) * (width / rect.width),
      y: (e.clientY - rect.top) * (height / rect.height),
    }
  }

  const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const t = e.touches[0]
    mouseRef.current = {
      x: (t.clientX - rect.left) * (width / rect.width),
      y: (t.clientY - rect.top) * (height / rect.height),
    }
  }
  const handleTouchEnd = () => { mouseRef.current = { x: -9999, y: -9999 } }

  return (
    <div
      className="ascii-video-wrap"
      style={{ width: "100%", aspectRatio: `${width} / ${height}`, flexShrink: 0, position: "relative" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
      <canvas ref={frameRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  )
}
