import { useCallback, useEffect, useRef, useState } from "react"
import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"
import FishSwimmer from "../components/FishSwimmer"
import StarField, { MAX_STARS, type StarFieldHandle } from "../components/StarField"

const STAR_FACTS = [
  "Johanna grew up in Koreatown.",
  "Johanna has studied neuroscience and Latino studies, in addition to psychology and design.",
  "Her favorite part of design is learning and collaborating with others.",
  "Johanna likes to look at a design challenge from every angle.",
  "Wondering why the fish? Johanna is a Pisces.",
  "Her dog is named Toto, and he's a shiba!",
  "Currently learning Jitter, Paper, and Figma Motion.",
  "Cares deeply about misinformation on social media — learn more in Backstory.",
  "Johanna has experience with branding, B2B SaaS products, accessibility, and visual design.",
  "At the DNC, Johanna once turned around a campaign graphic same-day, mid-protest, with zero revisions.",
  "Johanna's a sucker for omakase — sushi counters are basically the best UX case study in hospitality.",
  "As founding designer at SnapSplit, Johanna took completion rates from 20% to 83% by watching five people struggle with the same screen.",
  "Johanna believes good interaction design is applied psychology — every friction point is a decision cost.",
  "Johanna hand-gifts stickers she's designed to friends — probably her longest-running 'side project.'",
]

type StarBubblePhase = "entering" | "typing" | "holding" | "dissolving"
type StarBubble = { text: string; x: number; y: number; revealed: number; phase: StarBubblePhase }

const TYPE_INTERVAL_MS = 22
const HOLD_MS = 3000
const DISSOLVE_MS = 600
const PARTICLE_COUNT = 7

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const HINT_TEXT = "* something's floating — click it"
const HINT_TYPE_INTERVAL_MS = 28
// Only nudge once the hero is cluttered with stars and nothing's happened
// for a bit — not on every single drop/catch.
const HINT_IDLE_MS = 4000

// Keeps a bubble's anchor point far enough from the hero's edges that its
// max ~280px-wide, ~34px-plus-tail-tall body never renders off-screen.
const BUBBLE_MARGIN_X = 150
const BUBBLE_MARGIN_TOP = 110

export default function HomePage() {
  const [starBubble, setStarBubble] = useState<StarBubble | null>(null)
  const [hintRevealed, setHintRevealed] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const starFactQueue = useRef<string[]>(shuffled(STAR_FACTS))
  const lastFactShown = useRef<string | null>(null)
  const starFieldRef = useRef<StarFieldHandle>(null)
  const starTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const hintTypeInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const hintShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintTyped = useRef(false)

  const startHintTyping = () => {
    if (hintTyped.current) return
    hintTyped.current = true
    setHintVisible(true)
    let i = 0
    hintTypeInterval.current = setInterval(() => {
      i += 1
      setHintRevealed(i)
      if (i >= HINT_TEXT.length && hintTypeInterval.current) {
        clearInterval(hintTypeInterval.current)
        hintTypeInterval.current = null
      }
    }, HINT_TYPE_INTERVAL_MS)
  }

  const cancelHint = () => {
    if (hintShowTimer.current) { clearTimeout(hintShowTimer.current); hintShowTimer.current = null }
    if (hintTypeInterval.current) { clearInterval(hintTypeInterval.current); hintTypeInterval.current = null }
    hintTyped.current = false
    setHintVisible(false)
    setHintRevealed(0)
  }

  const handleStarCountChange = useCallback((count: number) => {
    if (count >= MAX_STARS) {
      // Only queue the nudge if nothing's currently on screen — an
      // interaction (catching a star) cancels this via handleStarCatch.
      if (!hintShowTimer.current && !hintTyped.current) {
        hintShowTimer.current = setTimeout(() => {
          hintShowTimer.current = null
          startHintTyping()
        }, HINT_IDLE_MS)
      }
    } else {
      cancelHint()
    }
  }, [])

  const clampToHero = (x: number, y: number) => {
    const el = heroRef.current
    const width = el?.clientWidth ?? x + BUBBLE_MARGIN_X
    return {
      x: Math.max(BUBBLE_MARGIN_X, Math.min(width - BUBBLE_MARGIN_X, x)),
      y: Math.max(BUBBLE_MARGIN_TOP, y),
    }
  }

  const handleDropStar = (x: number, y: number) => {
    starFieldRef.current?.drop(x, y)
  }

  const handleStarCatch = useCallback((rawX: number, rawY: number) => {
    starTimers.current.forEach(clearTimeout)
    starTimers.current = []
    cancelHint()

    if (starFactQueue.current.length === 0) {
      // Reshuffle for another pass, avoiding an immediate repeat of the
      // last fact shown (which would otherwise land at either end).
      let next = shuffled(STAR_FACTS)
      if (next[0] === lastFactShown.current) next = [...next.slice(1), next[0]]
      starFactQueue.current = next
    }
    const text = starFactQueue.current.shift()!
    lastFactShown.current = text
    const { x, y } = clampToHero(rawX, rawY)
    setStarBubble({ text, x, y, revealed: 0, phase: "entering" })

    // Enter, then start typing on the next frame so the CSS opacity
    // transition actually has a 0 -> 1 change to animate.
    const enterId = setTimeout(() => {
      setStarBubble(prev => prev && prev.text === text ? { ...prev, phase: "typing" } : prev)

      let i = 0
      const typeId = setInterval(() => {
        i += 1
        setStarBubble(prev => {
          if (!prev || prev.text !== text) return prev
          if (i >= text.length) {
            clearInterval(typeId)
            const holdId = setTimeout(() => {
              setStarBubble(p => p && p.text === text ? { ...p, phase: "dissolving" } : p)
              const removeId = setTimeout(() => {
                setStarBubble(p => p && p.text === text ? null : p)
              }, DISSOLVE_MS)
              starTimers.current.push(removeId)
            }, HOLD_MS)
            starTimers.current.push(holdId)
            return { ...prev, revealed: text.length, phase: "holding" }
          }
          return { ...prev, revealed: i }
        })
      }, TYPE_INTERVAL_MS)
      starTimers.current.push(typeId as unknown as ReturnType<typeof setTimeout>)
    }, 20)
    starTimers.current.push(enterId)
  }, [])

  useEffect(() => () => {
    starTimers.current.forEach(clearTimeout)
    if (hintTypeInterval.current) clearInterval(hintTypeInterval.current)
    if (hintShowTimer.current) clearTimeout(hintShowTimer.current)
  }, [])

  return (
    <>
      <div className="hero-page hero-page--landing">
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
        />
        {/* Isolated so the fish only picks up a difference blend against the
            text painted below it in here — the GodRays background stays
            outside this stacking context, so the fish keeps its own color
            everywhere it swims over open water. */}
        <div className="hero-landing-blend-group" ref={heroRef}>
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
              <span className="hero-landing-greeting-hi">I'm Johanna,</span> <span className="hero-landing-greeting-firstname">a designer built on <em>psychology</em> and <em>interaction design</em></span>
            </p>

            <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
              MDes Interaction Design, CCA | Psych &amp; Neuro, Williams College | Prev. Design @ DNC, PROS
            </p>
          </div>

          <FishSwimmer color="#ffffff" onDropStar={handleDropStar} />
          <FishSwimmer color="#ffffff" onDropStar={handleDropStar} />
          <StarField ref={starFieldRef} onCatch={handleStarCatch} onCountChange={handleStarCountChange} />

          {hintVisible && (
            <p className="hero-star-hint" aria-live="polite">
              {HINT_TEXT.slice(0, hintRevealed)}
            </p>
          )}

          {starBubble && (
            <div
              className={`hero-star-bubble${starBubble.phase !== "entering" ? " is-visible" : ""}${starBubble.phase === "dissolving" ? " is-dissolving" : ""}`}
              style={{ left: starBubble.x, top: starBubble.y }}
              aria-live="polite"
            >
              {starBubble.text.slice(0, starBubble.revealed)}
              {starBubble.phase === "typing" && <span className="hero-star-bubble-cursor" aria-hidden="true" />}
              {starBubble.phase === "dissolving" && Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4
                const dist = 26 + Math.random() * 22
                return (
                  <span
                    key={i}
                    className="hero-star-bubble-particle"
                    aria-hidden="true"
                    style={{
                      "--dx": `${Math.cos(angle) * dist}px`,
                      "--dy": `${Math.sin(angle) * dist}px`,
                      animationDelay: `${i * 18}ms`,
                    } as React.CSSProperties}
                  />
                )
              })}
            </div>
          )}
        </div>

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
