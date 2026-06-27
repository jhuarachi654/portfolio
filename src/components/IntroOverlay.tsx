import { useEffect, useRef, useState } from "react"
import AsciiFlowTrail from "./AsciiFlowTrail"

const GLYPHS = "▣▤▥▦▧▨▩"
const LINE1 = "Hi I'm"
const LINE2 = "Johanna Huarachi."
const TEXT1 = LINE1 + LINE2

// progress: 0 → 3 (float, bidirectional)
// 0–1  : Phase 1 — chars reveal left→right
// 1–2  : Phase 2 — Phase 1 fades, two lines slide in from opposite sides
// 2–3  : Phase 3 — overlay dissolves into portfolio

export default function IntroOverlay() {
  const [progress, setProgress] = useState(0)
  const [glyph, setGlyph] = useState("▣")
  const [gone, setGone] = useState(false)
  const progressRef = useRef(0)

  // Scramble glyph cycles continuously
  useEffect(() => {
    const id = setInterval(
      () => setGlyph(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
      55
    )
    return () => clearInterval(id)
  }, [])

  // Wheel + touch → bidirectional progress
  useEffect(() => {
    document.body.style.overflow = "hidden"

    const nudge = (raw: number) => {
      // Cap each event so fast wheels don't jump
      const delta = Math.sign(raw) * Math.min(Math.abs(raw), 60) * 0.0018
      progressRef.current = Math.max(0, Math.min(3, progressRef.current + delta))
      setProgress(progressRef.current)
      if (progressRef.current >= 3) {
        document.body.style.overflow = ""
        setTimeout(() => setGone(true), 350)
      }
    }

    const onWheel = (e: WheelEvent) => nudge(e.deltaY)

    let ty = 0
    const onTouchStart = (e: TouchEvent) => { ty = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      nudge((ty - e.touches[0].clientY) * 1.2)
      ty = e.touches[0].clientY
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      document.body.style.overflow = ""
    }
  }, [])

  if (gone) return null

  // ── Derived values ────────────────────────────────────────────────

  // Phase 1: chars revealed proportionally to progress (0→1)
  const charsToShow = Math.min(TEXT1.length, Math.floor(progress * TEXT1.length))
  const phase1Done  = charsToShow >= TEXT1.length

  // Phase 1 visible 0→0.75, fades out 0.75→1
  const p1Opacity = progress <= 0.75
    ? 1
    : Math.max(0, 1 - (progress - 0.75) / 0.25)

  // Phase 2 slides in as progress goes 1→1.7
  const p2Ease    = Math.max(0, Math.min(1, (progress - 1) / 0.65))
  const p2Opacity = Math.min(1, Math.max(0, (progress - 1) / 0.2))
  const slideAmt  = (1 - p2Ease) * 72 // px offset

  // Phase 3 dissolve progress 2→3
  const overlayOpacity = progress <= 2 ? 1 : Math.max(0, 1 - (progress - 2))

  // ── Char renderer ─────────────────────────────────────────────────
  const renderChars = (text: string, lineStart: number) =>
    text.split("").map((char, i) => {
      const fi = lineStart + i
      if (fi < charsToShow)
        return <span key={i}>{char === " " ? " " : char}</span>
      if (fi === charsToShow)
        return <span key={i} style={{ color: "#29C4B0" }}>{glyph}</span>
      return (
        <span key={i} style={{ opacity: 0 }}>
          {char === " " ? " " : char}
        </span>
      )
    })

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "#162B55",
        opacity: overlayOpacity,
        pointerEvents: overlayOpacity < 0.05 ? "none" : "all",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ASCII trail background */}
      <AsciiFlowTrail
        tint="#FFFFFF" trackMouse={12} strength={80}
        tailLength={92} momentum={60} mix={70} radius={25}
      />

      {/* Phase 1 — "Hi I'm / Johanna Huarachi." */}
      <div
        style={{
          position: "relative", zIndex: 1, textAlign: "center",
          opacity: p1Opacity, padding: "0 32px", pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(13px, 1.4vw, 18px)",
          color: "#fff", fontWeight: 400,
          lineHeight: 2.2, letterSpacing: "0.06em",
        }}>
          {renderChars(LINE1, 0)}
        </div>
        <div style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(38px, 5.5vw, 76px)",
          color: "#fff", fontWeight: 700,
          lineHeight: 0.92,
        }}>
          {renderChars(LINE2, LINE1.length)}
        </div>
      </div>

      {/* Phase 2 — slides in from opposite sides */}
      {progress > 0.9 && (
        <div
          style={{
            position: "absolute", zIndex: 2,
            textAlign: "center", padding: "0 32px",
            opacity: p2Opacity,
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 6,
          }}
        >
          <div style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(22px, 3vw, 48px)",
            color: "#fff", fontWeight: 700, lineHeight: 1.1,
            transform: `translateX(${-slideAmt}px)`,
          }}>
            I am a product designer
          </div>
          <div style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(22px, 3vw, 48px)",
            color: "#fff", fontWeight: 700, lineHeight: 1.1,
            transform: `translateX(${slideAmt}px)`,
          }}>
            with a humanities lens.
          </div>
        </div>
      )}

      {/* Scroll hint — appears once Phase 1 is fully revealed */}
      <div
        style={{
          position: "absolute", bottom: 32, zIndex: 1,
          fontFamily: "var(--font-sans)", fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.12em", textTransform: "uppercase",
          opacity: phase1Done && progress < 1.05 ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      >
        scroll to explore ↓
      </div>
    </div>
  )
}
