import { useRef, useState } from "react"
import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"

const STICKER_ROTATION = 10

// Draggable sticker — follows the pointer 1:1 while held, then eases back
// to its resting spot (and rotation) on release via a CSS transition that's
// only enabled once dragging stops, so the follow itself stays instant.
function HeroSticker() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const innerRef = useRef<HTMLDivElement>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  const onPointerUp = () => {
    setDragging(false)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="hero-sticker" data-reveal-hero style={{ "--hero-delay": "460ms" } as React.CSSProperties}>
      <div
        ref={innerRef}
        className={`hero-sticker-inner${dragging ? " is-dragging" : ""}`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) rotate(${STICKER_ROTATION}deg)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="hero-sticker-flower" />

        <div className="hero-sticker-text">
          <span>Currently seeking</span>
          <span className="hero-sticker-text-emph">design roles</span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
        />
        <div className="hero-landing-inner">
          <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
            Hi! I'm <span className="hero-landing-greeting-name">Johanna Huarachi.</span>
          </p>

          <p className="hero-landing-tagline" data-reveal-hero style={{ "--hero-delay": "260ms" } as React.CSSProperties}>
            I'm a designer with a background in psychology and behavioral science, and I use it to build products people need, understand, and trust.
          </p>

          <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
            MDes Interaction Design, CCA | Psych &amp; Neuro, Williams College | Prev. Design @ DNC, PROS
          </p>
        </div>

        <HeroSticker />

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
