import { Link } from "react-router-dom"
import { useRef, useEffect, useState } from "react"
import type { CaseStudy } from "./WorkGrid"

// Predefined scatter positions (chronological left→right, newest first)
// Each entry: [left%, top px, rotation deg, width px]
const POSITIONS: [string, number, number, number][] = [
  ["0%",    24,   -1.5, 300],
  ["22%",  160,    1.2, 260],
  ["44%",   20,   -0.8, 320],
  ["64%",  140,    1.8, 280],
  ["8%",   360,    0.6, 280],
  ["32%",  400,   -1.4, 300],
  ["58%",  320,    1.0, 260],
]

function ExploreCard({ study, position }: { study: CaseStudy; position: [string, number, number, number] }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [left, top, rotate, width] = position
  const [isDesktop] = useState(() => window.matchMedia("(hover: hover)").matches)

  const play  = () => isDesktop && videoRef.current?.play().catch(() => {})
  const pause = () => {
    if (!videoRef.current) return
    videoRef.current.pause()
    videoRef.current.currentTime = 0
  }

  const inner = (
    <div
      className="explore-card"
      style={{ width, transform: `rotate(${rotate}deg)` }}
      onMouseEnter={play}
      onMouseLeave={pause}
    >
      <div className="explore-card-media">
        <video
          ref={videoRef}
          src={study.video}
          poster={study.image}
          muted loop playsInline preload="none"
          className="explore-card-video"
        />
        {study.comingSoon && <span className="explore-card-badge">Soon</span>}
      </div>
      <div className="explore-card-body">
        <p className="explore-card-title">{study.title}</p>
        <p className="explore-card-role">{study.role}</p>
      </div>
    </div>
  )

  if (study.comingSoon) {
    return (
      <div className="explore-item explore-item--muted" style={{ left, top: `${top}px` }}>
        {inner}
      </div>
    )
  }
  return (
    <Link to={study.href} className="explore-item" style={{ left, top: `${top}px` }}>
      {inner}
    </Link>
  )
}

export default function ExploreView({ studies }: { studies: CaseStudy[] }) {
  // Calculate required container height based on tallest positioned item
  const minHeight = Math.max(...studies.map((_, i) => {
    const pos = POSITIONS[i] ?? POSITIONS[POSITIONS.length - 1]
    return pos[1] + 380 // top + approx card height
  }))

  return (
    <>
      {/* Desktop: absolute scatter */}
      <div className="explore-view" style={{ minHeight }}>
        {studies.map((s, i) => (
          <ExploreCard
            key={s.title}
            study={s}
            position={POSITIONS[i] ?? POSITIONS[POSITIONS.length - 1]}
          />
        ))}
      </div>

      {/* Mobile/tablet: single column fallback */}
      <div className="explore-view-mobile">
        {studies.map(s => (
          <Link
            key={s.title}
            to={s.href}
            className={`explore-mobile-item${s.comingSoon ? " explore-mobile-item--muted" : ""}`}
          >
            <div className="explore-mobile-media">
              <img src={s.image} alt={s.title} />
              {s.comingSoon && <span className="explore-card-badge">Soon</span>}
            </div>
            <p className="explore-card-title">{s.title}</p>
            <p className="explore-card-role">{s.role}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
