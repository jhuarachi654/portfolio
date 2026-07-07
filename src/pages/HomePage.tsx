import { useState, useEffect, useRef } from "react"
import AsciiVideo from "../components/AsciiVideo"
import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"

function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const str = time.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: "America/Los_Angeles", timeZoneName: "short",
  })
  return <span className="live-clock"><span className="live-clock-dot" />{str}</span>
}


const TITLES = [
  "product designer",
  "user advocate",
  "AI-native designer",
]
const TAGS = ["MS-HCI @ CCA", "Psych & Neuro @ Williams", "Figma Campus Leader"] as const

const TYPE_SPEED   = 80
const DELETE_SPEED = 45
const PAUSE_FULL   = 1800
const PAUSE_EMPTY  = 300

function useTypewriter() {
  const [displayed, setDisplayed] = useState("")
  const [wordIdx, setWordIdx]     = useState(0)
  const [typing, setTyping]       = useState(true)

  useEffect(() => {
    const word = TITLES[wordIdx]
    if (typing) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), TYPE_SPEED)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), PAUSE_FULL)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), DELETE_SPEED)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => {
          setWordIdx(i => (i + 1) % TITLES.length)
          setTyping(true)
        }, PAUSE_EMPTY)
        return () => clearTimeout(t)
      }
    }
  }, [displayed, wordIdx, typing])

  return { displayed, word: TITLES[wordIdx] }
}

// The hero flower shouldn't play until the intro splash is actually dismissed —
// otherwise it's already animating (or finished) behind the curtain by the time
// the user sees it. `intro-complete` is fired by App.tsx the moment the splash commits.
function useIntroDone() {
  const [introDone, setIntroDone] = useState(() => !document.documentElement.classList.contains("loading"))
  useEffect(() => {
    if (introDone) return
    const onDone = () => setIntroDone(true)
    window.addEventListener("intro-complete", onDone)
    return () => window.removeEventListener("intro-complete", onDone)
  }, [introDone])
  return introDone
}

// Only start the flower once its container is actually visible in the
// viewport — on mobile especially, there's no reason to spin up the canvas
// render loop for a hero that isn't on screen yet.
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (inView) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])
  return [ref, inView] as const
}

export default function HomePage() {
  const { displayed, word } = useTypewriter()
  const article = /^[aeiou]/i.test(word) ? "an" : "a"
  const introDone = useIntroDone()
  const [flowerRef, flowerInView] = useInView<HTMLDivElement>()
  const [isMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches)
  const showFlower = introDone && flowerInView
  // On mobile the flower is a static image (no playback to get "ahead of"),
  // so it's safe to mount it immediately — hidden behind the splash — and let
  // it do its decode/sampling work there instead of cold at reveal time. On
  // desktop it's a real video, so it stays gated to avoid starting early.
  const mountFlower = isMobile || showFlower
  return (
    <>
      <div className="line-grid hero-page">

        {/* ── Left: headline + button + hashtags ── */}
        <div className="hero-left">
          <div className="hero-name hero-display-headline" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            <div className="hero-first-line">
              Hi, I'm Johanna, {article}{" "}
              <span className="hero-role-wrap">
                <span className="hero-role">{displayed}</span>
                <span className="hero-role-cursor">|</span>
              </span>
            </div>
            <div>who thinks in behavior, leads with craft, and ships in code.</div>
          </div>

          <div className="hero-tags" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            {TAGS.map(tag => (
              <span key={tag} className="hero-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── Right: ASCII flower — waits for the intro splash to finish AND for
             this container to actually be in the viewport, then fades in.
             (Was a per-tile scatter-assemble animation; switched to a plain CSS fade
             since the physics-driven version could hitch on slower phones.) ── */}
        <div
          ref={flowerRef}
          className="hero-right hero-flower-wrap"
          style={showFlower ? { animation: "fadeIn 0.6s ease", opacity: 1 } : { opacity: 0, pointerEvents: "none" }}
        >
          {mountFlower && (
            <>
              <AsciiVideo src="/cosmos-1.mp4" width={420} height={500} loop={false} playbackRate={2.5} />
              <span className="hero-flower-label">Built from the ground up with React + Canvas API</span>
            </>
          )}
        </div>

        {/* ── Clock: absolute top-right of hero ── */}
        <div className="hero-clock-row">
          <LiveClock />
        </div>
      </div>

      <div id="featured-work"><WorkGrid /></div>
      <Footer />
    </>
  )
}
