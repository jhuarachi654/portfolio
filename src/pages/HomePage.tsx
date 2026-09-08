import { useEffect, useState } from "react"
import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"
import FishSwimmer from "../components/FishSwimmer"

const WORD_STEP_MS = 55
const WORD_START_DELAY = 150

// Each entry renders as one animated word (or word-with-trailing-space);
// `em` wraps it in <em> for the psychology/interaction design emphasis.
const GREETING_WORDS: { text: string; em?: boolean }[] = [
  { text: "I'm" }, { text: "Johanna, " },
  { text: "a" }, { text: "designer" }, { text: "built" }, { text: "on" },
  { text: "psychology", em: true }, { text: "and" }, { text: "interaction design", em: true },
]

const CREDENTIALS_WORDS = "MDes Interaction Design, CCA | Psych & Neuro, Williams College | Prev. Design @ DNC, PROS".split(" ")

const TOTAL_WORDS = GREETING_WORDS.length + CREDENTIALS_WORDS.length

export default function HomePage() {
  const [wordsRevealed, setWordsRevealed] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setWordsRevealed(TOTAL_WORDS)
      return
    }

    let interval: ReturnType<typeof setInterval> | null = null
    const startTimeout = setTimeout(() => {
      let w = 0
      interval = setInterval(() => {
        w += 1
        setWordsRevealed(w)
        if (w >= TOTAL_WORDS && interval) clearInterval(interval)
      }, WORD_STEP_MS)
    }, WORD_START_DELAY)

    return () => {
      clearTimeout(startTimeout)
      if (interval) clearInterval(interval)
    }
  }, [])

  const wordStyle = (i: number): React.CSSProperties => ({
    display: "inline-block",
    opacity: wordsRevealed > i ? 1 : 0,
    transform: wordsRevealed > i ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  })

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
        <div className="hero-landing-blend-group">
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting">
              <span className="hero-landing-greeting-hi">
                {GREETING_WORDS.slice(0, 2).map((w, i) => (
                  <span key={i} style={wordStyle(i)}>{w.text}{i < 1 ? " " : ""}</span>
                ))}
              </span>
              {" "}
              <span className="hero-landing-greeting-firstname">
                {GREETING_WORDS.slice(2).map((w, i) => {
                  const idx = i + 2
                  const content = w.em ? <em>{w.text}</em> : w.text
                  return (
                    <span key={idx} style={wordStyle(idx)}>{content}{idx < GREETING_WORDS.length - 1 ? " " : ""}</span>
                  )
                })}
              </span>
            </p>

            <p className="hero-landing-credentials">
              {CREDENTIALS_WORDS.map((word, i) => {
                const idx = GREETING_WORDS.length + i
                return (
                  <span key={idx} style={wordStyle(idx)}>{word}{i < CREDENTIALS_WORDS.length - 1 ? " " : ""}</span>
                )
              })}
            </p>
          </div>

          <FishSwimmer color="#ffffff" filled mobileZone="top" scale={0.7} startSide="right" />
          <FishSwimmer color="#ffffff" filled mobileZone="bottom" scale={0.7} startSide="right" />
        </div>

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
