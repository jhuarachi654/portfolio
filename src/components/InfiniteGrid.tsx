import { useRef, useState, useEffect, useMemo, useCallback, ReactNode } from "react"
import { createPortal } from "react-dom"

// ── helpers ───────────────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t
const mod   = (n: number, m: number) => ((n % m) + m) % m
const roundToDpr = (v: number) => {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  return Math.round(v * dpr) / dpr
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function buildTile(srcs: string[], tileW: number, tileH: number, seed: number): Int32Array {
  const n = srcs.length
  const tile = new Int32Array(tileW * tileH)
  if (!n) return tile
  const rnd = mulberry32(seed)
  const bag = Array.from({ length: n }, (_, i) => i)
  const shuffle = () => { for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]] } }
  shuffle()
  let ptr = 0
  const next = () => { const v = bag[ptr++ % bag.length]; if (ptr % bag.length === 0) shuffle(); return v }
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      let di = next(); let tries = 0
      const left = x > 0 ? tile[y * tileW + (x - 1)] : -1
      const up   = y > 0 ? tile[(y - 1) * tileW + x] : -1
      const ul   = x > 0 && y > 0 ? tile[(y - 1) * tileW + (x - 1)] : -1
      const ur   = x < tileW - 1 && y > 0 ? tile[(y - 1) * tileW + (x + 1)] : -1
      while (tries < 80 && n > 1 && (di === left || di === up || di === ul || di === ur)) { di = next(); tries++ }
      tile[y * tileW + x] = di
    }
  }
  return tile
}

const decodedSrcs = new Set<string>()
function preDecodeImage(src: string) {
  if (!src || decodedSrcs.has(src)) return
  decodedSrcs.add(src)
  const img = new Image(); img.src = src
  img.decode().catch(() => decodedSrcs.delete(src))
}
function swapSrcWhenReady(imgEl: HTMLImageElement, src: string) {
  if (decodedSrcs.has(src)) { imgEl.src = src; return }
  decodedSrcs.add(src)
  const tmp = new Image(); tmp.src = src
  tmp.decode().then(() => { imgEl.src = src }).catch(() => { decodedSrcs.delete(src); imgEl.src = src })
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    document.body.style.overflow = "hidden"
    document.body.classList.add("overlay-open")
    return () => {
      window.removeEventListener("keydown", h)
      document.body.style.overflow = ""
      document.body.classList.remove("overlay-open")
    }
  }, [onClose])

  return createPortal(
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:99999, background:"rgba(0,0,0,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:"clamp(16px,5vw,64px)", backdropFilter:"blur(8px)", cursor:"zoom-out" }}>
      <style>{`@keyframes lb-in { from{opacity:0;transform:scale(0.88) rotate(-1.5deg)} to{opacity:1;transform:scale(1) rotate(-1.5deg)} }`}</style>
      <div
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => document.body.classList.add("cursor-on-light-card")}
        onMouseLeave={() => document.body.classList.remove("cursor-on-light-card")}
        style={{ background:"#fff", padding:"clamp(10px,2vw,18px)", paddingBottom:"clamp(36px,6vw,60px)", boxShadow:"0 24px 80px rgba(0,0,0,0.55)", animation:"lb-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards", transform:"rotate(-1.5deg)", maxWidth:"min(85vw,640px)", cursor:"default", position:"relative" }}>
        <img src={src} alt="" style={{ display:"block", width:"100%", maxHeight:"65vh", objectFit:"cover" }} />
        <button onClick={onClose} style={{ position:"absolute", top:-14, right:-14, width:30, height:30, borderRadius:"50%", border:"none", background:"rgba(0,0,0,0.55)", color:"#fff", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>
    </div>
  , document.body)
}

// ── Types ─────────────────────────────────────────────────────────────────────
type CellRec = { a: HTMLAnchorElement; img: HTMLImageElement; r: number; c: number; px: number; py: number; gx: number; gy: number; src: string }

interface Props {
  srcs: string[]
  itemSize?: number
  gap?: number
  maxSpeed?: number
  damping?: number
  magnify?: number
  radius?: number
}

const OVERSCAN      = 3
const PRIORITY_COLS = 4
const PRIORITY_ROWS = 3

// ── Main component ────────────────────────────────────────────────────────────
export default function InfiniteGrid({ srcs, itemSize = 120, gap = 6, maxSpeed = 220, damping = 0.7, magnify = 0.35, radius = 180 }: Props) {
  const rootRef  = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const inside    = useRef(false)
  const target    = useRef({ x: 0, y: 0 })
  const smooth    = useRef({ x: 0, y: 0 })
  const pointerPx = useRef({ x: 0, y: 0, has: false })
  const offset    = useRef({ x: 0, y: 0 })
  const vel       = useRef({ x: 0, y: 0 })
  const baseCell  = useRef({ bx: 0, by: 0 })
  const cellsRef  = useRef<CellRec[]>([])

  const step = Math.max(1, itemSize + gap)

  const tileSize = useMemo(() => {
    const n = srcs.length
    const s = Math.ceil(Math.sqrt(clamp(Math.max(81, n * 3), 81, 256)))
    return clamp(s, 9, 18)
  }, [srcs.length])

  const tile = useMemo(() => {
    const seedBase = (srcs.length * 1315423911 + tileSize * 374761393) >>> 0
    let srcHash = 0
    for (const s of srcs) srcHash ^= hashString(s)
    return buildTile(srcs, tileSize, tileSize, (seedBase ^ srcHash) >>> 0)
  }, [srcs, tileSize])

  useEffect(() => {
    const el = rootRef.current; if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0]?.contentRect
      if (r && r.width > 10 && r.height > 10) setContainerSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = rootRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left; const y = e.clientY - rect.top
      const isIn = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      inside.current = isIn
      if (!isIn) { target.current = { x:0, y:0 }; pointerPx.current = { x:0, y:0, has:false }; return }
      pointerPx.current = { x, y, has: true }
      target.current = { x: clamp(x / rect.width - 0.5, -0.5, 0.5), y: clamp(y / rect.height - 0.5, -0.5, 0.5) }
    }
    const onBlur = () => { inside.current = false; target.current = { x:0, y:0 }; pointerPx.current = { x:0, y:0, has:false } }
    window.addEventListener("pointermove", onMove, true)
    window.addEventListener("blur", onBlur)
    return () => { window.removeEventListener("pointermove", onMove as any, true as any); window.removeEventListener("blur", onBlur) }
  }, [])

  const cols = Math.max(1, Math.ceil(containerSize.w / step) + 2 * OVERSCAN)
  const rows = Math.max(1, Math.ceil(containerSize.h / step) + 2 * OVERSCAN)

  const applyAssignment = useCallback(() => {
    if (!srcs.length) return
    const { bx, by } = baseCell.current
    for (const cell of cellsRef.current) {
      const gx = bx + (cell.c - OVERSCAN); const gy = by + (cell.r - OVERSCAN)
      if (gx === cell.gx && gy === cell.gy) continue
      cell.gx = gx; cell.gy = gy
      const tx = mod(gx, tileSize); const ty = mod(gy, tileSize)
      const di = tile[ty * tileSize + tx] % srcs.length
      const src = srcs[di]
      if (cell.src !== src) { cell.src = src; swapSrcWhenReady(cell.img, src) }
    }
    for (let gy = by - 2; gy <= by + rows + 2; gy++)
      for (let gx = bx - 2; gx <= bx + cols + 2; gx++)
        preDecodeImage(srcs[tile[mod(gy, tileSize) * tileSize + mod(gx, tileSize)] % srcs.length])
  }, [srcs, tile, tileSize, cols, rows])

  useEffect(() => {
    offset.current = { x:0, y:0 }; vel.current = { x:0, y:0 }; baseCell.current = { bx:0, by:0 }
    requestAnimationFrame(() => applyAssignment())
  }, [cols, rows, srcs.length, tileSize, itemSize, gap, applyAssignment])

  useEffect(() => {
    if (!rootRef.current || !worldRef.current || !srcs.length) return
    let raf = 0; let last = performance.now()
    const sigma2 = 2 * Math.pow(Math.max(1, radius) * 0.55, 2)
    const mag = Math.max(0, magnify)

    const tick = () => {
      const now = performance.now(); const dt = Math.min(0.033, (now - last) / 1000); last = now
      const k = clamp(1 - damping, 0.03, 0.35)
      smooth.current.x = lerp(smooth.current.x, target.current.x, k)
      smooth.current.y = lerp(smooth.current.y, target.current.y, k)
      vel.current.x = lerp(vel.current.x, (inside.current ? smooth.current.x / 0.5 : 0) * maxSpeed, k)
      vel.current.y = lerp(vel.current.y, (inside.current ? smooth.current.y / 0.5 : 0) * maxSpeed, k)
      offset.current.x += vel.current.x * dt
      offset.current.y += vel.current.y * dt

      const bx = Math.floor(offset.current.x / step); const by = Math.floor(offset.current.y / step)
      const lx = offset.current.x - bx * step;         const ly = offset.current.y - by * step
      if (bx !== baseCell.current.bx || by !== baseCell.current.by) { baseCell.current = { bx, by }; applyAssignment() }

      worldRef.current!.style.transform = `translate3d(${roundToDpr(-lx)}px,${roundToDpr(-ly)}px,0)`

      if (!inside.current || !pointerPx.current.has || mag === 0) {
        for (const c of cellsRef.current) c.a.style.setProperty("--s", "1")
      } else {
        const px = pointerPx.current.x; const py = pointerPx.current.y
        for (const c of cellsRef.current) {
          const dx = (c.px - lx + itemSize / 2) - px; const dy = (c.py - ly + itemSize / 2) - py
          const s = Math.round((1 + mag * Math.exp(-(dx*dx + dy*dy) / sigma2)) * 800) / 800
          c.a.style.setProperty("--s", String(s))
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [srcs.length, step, itemSize, maxSpeed, damping, magnify, radius, applyAssignment])

  // ── Build cells ──
  cellsRef.current = []
  const nodes: ReactNode[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * step; const py = r * step
      const priority = r < PRIORITY_ROWS && c < PRIORITY_COLS
      nodes.push(
        <a key={`${r}-${c}`}
          ref={el => {
            if (!el) return
            const img = el.querySelector("img") as HTMLImageElement | null
            if (!img) return
            el.style.setProperty("--s", "1")
            cellsRef.current.push({ a: el, img, r, c, px, py, gx: NaN, gy: NaN, src: "" })
          }}
          onClick={e => {
            e.preventDefault()
            const img = e.currentTarget.querySelector("img") as HTMLImageElement | null
            if (img?.src) setLightboxSrc(img.src)
          }}
          style={{ position:"absolute", left:px, top:py, width:itemSize, height:itemSize, display:"block", overflow:"hidden", background:"#e8e8e8", transform:"scale(var(--s,1))", transformOrigin:"center", willChange:"transform", textDecoration:"none", cursor:"zoom-in" }}
        >
          <img
            src={srcs[0]}
            alt=""
            draggable={false}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            style={{ width:"100%", height:"100%", display:"block", objectFit:"cover", pointerEvents:"none" }}
          />
        </a>
      )
    }
  }

  return (
    <>
      <div ref={rootRef} style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", userSelect:"none" }}>
        <div ref={worldRef} style={{ position:"absolute", left:0, top:0, width:cols*step, height:rows*step, transform:"translate3d(0,0,0)", willChange:"transform" }}>
          {nodes}
        </div>
      </div>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </>
  )
}
