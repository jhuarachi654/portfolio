import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react"
import AsciiVideo from "./AsciiVideo"
import SpringText from "./SpringText"

const LoadingClock = memo(function LoadingClock() {
  const [clock, setClock] = useState("")
  useEffect(() => {
    const fmt = () => new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit",
      hour12: true, timeZone: "America/Los_Angeles", timeZoneName: "short",
    })
    setClock(fmt())
    const id = setInterval(() => setClock(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return <>{clock}</>
})

// Deterministic seed particles so no re-render flicker
const SEEDS = Array.from({ length: 18 }, (_, i) => {
  const rng = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1
  return {
    left:     `${(rng(0) * 90 + 5).toFixed(1)}%`,
    size:     rng(1) < 0.5 ? 2 : 1.5,
    opacity:  (rng(2) * 0.12 + 0.06).toFixed(2),
    duration: `${(rng(3) * 14 + 14).toFixed(1)}s`,
    delay:    `${(rng(4) * -20).toFixed(1)}s`,
    drift:    `${((rng(5) - 0.5) * 40).toFixed(1)}px`,
  }
})

const SLIDE_DUR = 700

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase]           = useState<"intro" | "ready" | "dissolving">("intro")
  const [btnHovered, setBtnHovered] = useState(false)
  const [sparks, setSparks]         = useState<{ id: number; x: number; y: number }[]>([])
  const sparkId                     = useRef(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id   = sparkId.current++
    setSparks(s => [...s, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setSparks(s => s.filter(sp => sp.id !== id)), 1200)
  }, [])

  // After intro fade-in, show button
  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 900)
    return () => clearTimeout(t)
  }, [])

  const handleExplore = useCallback(() => {
    if (phase !== "ready") return
    setPhase("dissolving")
    setTimeout(() => onDoneRef.current(), SLIDE_DUR)
  }, [phase])

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#162B55",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "none",
        transform: phase === "dissolving" ? "translateY(-100vh)" : "translateY(0)",
        transition: phase === "dissolving" ? `transform ${SLIDE_DUR}ms cubic-bezier(0.76, 0, 0.24, 1)` : "none",
      }}
    >
      {sparks.map(sp => (
        <div key={sp.id} className="footer-spark-burst" style={{ left: sp.x, top: sp.y, position: "absolute", zIndex: 10, pointerEvents: "none" }}>
          <div className="footer-spark-star" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="footer-spark-particle" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      ))}
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      {/* Drifting seeds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        {SEEDS.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "-4px",
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#ffffff",
            opacity: parseFloat(s.opacity),
            ["--drift" as string]: s.drift,
            animation: `seed-rise ${s.duration} ${s.delay} linear infinite`,
          }} />
        ))}
      </div>

{/* Timestamp + coordinates bottom-right */}
      <div className="loading-geo" style={{
        position: "absolute", bottom: 28, right: 36, zIndex: 5,
        textAlign: "right", pointerEvents: "none",
        opacity: phase === "intro" ? 0 : 1, transition: "opacity 1s ease 0.6s",
      }}>
        <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          <LoadingClock />
        </p>
        <p style={{ margin: "4px 0 0", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          37.7749° N, 122.4194° W
        </p>
      </div>
      {/* Cursor: white by default, navy on button hover */}
      <style>{`
        .cursor-dot { background: ${btnHovered ? '#162B55' : '#ffffff'} !important; z-index: 999999 !important; }
        .cursor-ring { border-color: ${btnHovered ? 'rgba(30,75,154,0.6)' : 'rgba(255,255,255,0.5)'} !important; z-index: 999999 !important; }
        @keyframes seed-rise {
          0%   { transform: translateY(0)   translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(var(--drift)); opacity: 0; }
        }
        .loading-explore-btn {
          position: relative; overflow: visible;
          padding: 10px 28px;
          font-family: var(--font-sans); font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #162B55; background: #ffffff;
          border: 1px solid #ffffff;
          cursor: pointer;
          transition: color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .loading-explore-btn:hover {
          transform: translateY(-6px) scale(1.1);
          box-shadow: 0 20px 48px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.15);
        }
        @media (max-width: 767px) {
          .loading-geo {
            bottom: auto !important;
            top: 20px !important;
            right: 20px !important;
          }
        }
      `}</style>

      {/* ── Center content ── */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        gap: 20, padding: "0 32px",
        position: "relative", zIndex: 5,
      }}>

        {/* Text with spring-repel interaction */}
        {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
        <SpringText
          gap={16}
          containerStyle={{
            opacity: phase === "intro" ? 0 : 1,
            transform: phase === "intro" ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
          lines={[
            {
              text: "Hello, welcome to",
              style: {
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              },
            },
            {
              text: "Johanna's Portfolio.",
              style: {
                fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em",
              },
            },
            {
              text: "She's a product designer grounded in",
              style: {
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", maxWidth: 520, textAlign: "center",
                lineHeight: 1.8,
              },
            },
            {
              text: "psychology who builds what she designs.",
              style: {
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", maxWidth: 520, textAlign: "center",
                lineHeight: 1.8, marginTop: -10,
              },
            },
          ]}
        />

        {/* Explore button */}
        <button
          className="loading-explore-btn"
          onClick={handleExplore}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            marginTop: 8,
            opacity: phase === "ready" || phase === "dissolving" ? 1 : 0,
            transition: "opacity 0.5s ease, color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
            pointerEvents: phase === "ready" ? "auto" : "none",
          }}
        >
          Explore
        </button>
      </div>

      {/* ── Flower bed at bottom ── */}
      <div style={{
        position: "absolute",
        bottom: -40,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 0,
        zIndex: 2,
      }}>
        {[
          { w: 160, h: 200, mt: 20, delay: 800  },
          { w: 220, h: 270, mt: -10, delay: 0   },
          { w: 160, h: 200, mt: 20, delay: 1400 },
        ].map((f, i) => (
          <div key={i} style={{ marginTop: f.mt, flexShrink: 0 }}>
            <AsciiVideo
              src="/cosmos-1.mp4"
              width={f.w}
              height={f.h}
              tileColor={[255, 255, 255]}
              loop={false}
              startDelay={f.delay}
              playbackRate={2.5}
            />
          </div>
        ))}
      </div>


      <style>{`@keyframes lb { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}
