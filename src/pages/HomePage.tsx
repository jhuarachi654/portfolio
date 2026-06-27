import { useState, useEffect } from "react"
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


function useFlowerSize() {
  const getSize = () => {
    const w = window.innerWidth
    if (w >= 1200) return { width: 420, height: 500 }
    if (w >= 768) return { width: 220, height: 300 }
    const size = Math.min(w - 40, 320)
    return { width: size, height: Math.round(size * 1.15) }
  }
  const [size, setSize] = useState(getSize)
  useEffect(() => {
    const update = () => setSize(getSize())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return size
}

const TITLES = [
  "product designer",
  "design engineer",
  "interaction designer",
]
const TAGS = ["Based in SF", "MDes @ CCA", "Figma Campus Leader"] as const

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

  return displayed
}

export default function HomePage() {
  const displayed = useTypewriter()
  const flowerSize = useFlowerSize()

  return (
    <>
      <div className="line-grid hero-page">

        {/* ── Left: headline + button + hashtags ── */}
        <div className="hero-left">
          <div className="hero-name hero-display-headline">
            <div className="hero-first-line">
              Hi, I'm Johanna, a{" "}
              <span className="hero-role-wrap">
                <span className="hero-role">{displayed}</span>
                <span className="hero-role-cursor">|</span>
              </span>
            </div>
            <div>who thinks in behavior, leads with craft, and ships in code.</div>
          </div>

          <div className="hero-tags">
            {TAGS.map(tag => (
              <span key={tag} className="hero-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── Right: ASCII flower ── */}
        <div className="hero-right">
          <AsciiVideo src="/cosmos-1.mp4" width={flowerSize.width} height={flowerSize.height} />
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
