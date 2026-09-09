import { useRef, useState } from "react"

// Mobile/tablet counterpart to HeroCursorTrail (which is mouse-only and
// hidden below 1200px). A tappable favicon in the hero's top-right that
// bursts a handful of favicon minis outward on press, each fading out on
// its own CSS animation — no rAF loop, no pointermove tracking, so it
// can't inherit the crash the old click-burst had.
const BURST_COUNT = 8

type Burst = { id: number; dx: number; dy: number }

export default function HeroFaviconBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const nextId = useRef(0)

  const handlePress = () => {
    const newBursts: Burst[] = Array.from({ length: BURST_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const distance = 60 + Math.random() * 50
      return {
        id: nextId.current++,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
      }
    })
    setBursts((prev) => [...prev, ...newBursts])
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !newBursts.some((nb) => nb.id === b.id)))
    }, 900)
  }

  return (
    <div className="hero-favicon-burst">
      <button
        type="button"
        className="hero-favicon-burst-trigger"
        onClick={handlePress}
        aria-label="Press for a surprise"
      >
        <span className="hero-favicon-burst-icon">
          <img src="/favicon.svg" alt="" width="29" height="29" />
        </span>
        <span className="hero-favicon-burst-label">press me</span>
      </button>

      {bursts.map((b) => (
        <div
          key={b.id}
          className="hero-favicon-burst-particle"
          aria-hidden="true"
          style={{
            width: 18,
            height: 18,
            "--burst-dx": `${b.dx}px`,
            "--burst-dy": `${b.dy}px`,
          } as React.CSSProperties}
        >
          <img src="/favicon.svg" alt="" width={18} height={18} />
        </div>
      ))}
    </div>
  )
}
