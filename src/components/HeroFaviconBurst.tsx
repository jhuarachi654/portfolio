import { useRef, useState } from "react"

// Mobile/tablet counterpart to HeroCursorTrail (which is mouse-only and
// hidden below 1200px). A tappable favicon in the hero's top-right that
// bursts a handful of favicon minis outward on press, each fading out on
// its own CSS animation — no rAF loop, no pointermove tracking, so it
// can't inherit the crash the old click-burst had.
const BURST_COUNT = 16

type Burst = { id: number; dx: number; dy: number; rotate: number; size: number }

export default function HeroFaviconBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const [popping, setPopping] = useState(false)
  const nextId = useRef(0)

  const handlePress = () => {
    const newBursts: Burst[] = Array.from({ length: BURST_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const distance = 90 + Math.random() * 90
      return {
        id: nextId.current++,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 480,
        size: 16 + Math.random() * 14,
      }
    })
    setBursts((prev) => [...prev, ...newBursts])
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !newBursts.some((nb) => nb.id === b.id)))
    }, 1100)

    setPopping(true)
    window.setTimeout(() => setPopping(false), 320)
  }

  return (
    <div className="hero-favicon-burst">
      <button
        type="button"
        className={`hero-favicon-burst-trigger${popping ? " is-popping" : ""}`}
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
            width: b.size,
            height: b.size,
            "--burst-dx": `${b.dx}px`,
            "--burst-dy": `${b.dy}px`,
            "--burst-rotate": `${b.rotate}deg`,
          } as React.CSSProperties}
        >
          <img src="/favicon.svg" alt="" width={b.size} height={b.size} />
        </div>
      ))}
    </div>
  )
}
