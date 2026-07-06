import { useEffect, useRef, useState, useCallback, memo } from "react"
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

const DISMISS_DISTANCE = 520

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  // progress is a continuous scrub value [0, DISMISS_DISTANCE] — scrolling up/down
  // moves it in both directions, so the reveal always tracks scroll intent exactly
  // and is fully reversible until it commits at the very end.
  const [progress, setProgress]     = useState(0)
  const [ready, setReady]           = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [sparks, setSparks]         = useState<{ id: number; x: number; y: number }[]>([])
  const sparkId                     = useRef(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const progressRef = useRef(0)
  progressRef.current = progress
  const committedRef = useRef(false)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id   = sparkId.current++
    setSparks(s => [...s, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setSparks(s => s.filter(sp => sp.id !== id)), 1200)
  }, [])

  // After intro fade-in, show button — matches the button's own sequential
  // fade-in delay below, so it isn't clickable before it's visible.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1150)
    return () => clearTimeout(t)
  }, [])

  const commitIfDone = useCallback((next: number) => {
    if (next >= DISMISS_DISTANCE && !committedRef.current) {
      committedRef.current = true
      onDoneRef.current()
    }
  }, [])

  // Explore button: smoothly swipes the whole curtain up and away, rather than
  // a jump-cut — a longer duration + gentle ease-in-out reads as more elegant
  // than a fast snap.
  const dismiss = useCallback(() => {
    const start = progressRef.current
    const startTime = performance.now()
    const duration = 750
    const tick = (now: number) => {
      const t = clamp((now - startTime) / duration, 0, 1)
      // ease-in-out cubic: gentle acceleration, gentle settle — smoother than a
      // pure ease-out snap for a deliberate "swipe up and away" feel.
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const next = start + (DISMISS_DISTANCE - start) * eased
      setProgress(next)
      if (t < 1) requestAnimationFrame(tick)
      else commitIfDone(DISMISS_DISTANCE)
    }
    requestAnimationFrame(tick)
  }, [commitIfDone])

  // Wheel / touch / keyboard scrub the splash away — and back — continuously.
  // Real page scroll stays locked (see html.loading) so the homepage sits
  // pristine at scrollTop 0 until this fully commits.
  useEffect(() => {
    if (committedRef.current) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const next = clamp(progressRef.current + e.deltaY, 0, DISMISS_DISTANCE)
      setProgress(next)
      commitIfDone(next)
    }
    let touchY: number | null = null
    // Track recent touch samples to estimate fling velocity on release — a real
    // swipe/scroll keeps going after your finger lifts (momentum); this was
    // purely 1:1 with finger movement and stopped dead on touchend, which is
    // why a hard flick did nothing extra and dragging felt "heavy"/stuck.
    let lastTouchTime = 0
    let velocity = 0 // px/ms, +down
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null
      lastTouchTime = performance.now()
      velocity = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      e.preventDefault()
      const now = performance.now()
      const y = e.touches[0]?.clientY ?? touchY
      const delta = touchY - y
      const dt = Math.max(1, now - lastTouchTime)
      // A gentle response curve: amplify the raw finger delta a bit so the
      // gesture doesn't require dragging the full DISMISS_DISTANCE in real
      // screen pixels (which felt heavier than a native scroll on tall phones).
      const next = clamp(progressRef.current + delta * 1.6, 0, DISMISS_DISTANCE)
      setProgress(next)
      commitIfDone(next)
      velocity = delta / dt
      touchY = y
      lastTouchTime = now
    }
    const FLING_VELOCITY = 0.5 // px/ms — a quick flick easily clears this
    const onTouchEnd = () => {
      touchY = null
      if (velocity > FLING_VELOCITY) dismiss()
      velocity = 0
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const step = 80
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        const next = clamp(progressRef.current + step, 0, DISMISS_DISTANCE)
        setProgress(next)
        commitIfDone(next)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        setProgress(clamp(progressRef.current - step, 0, DISMISS_DISTANCE))
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("touchcancel", onTouchEnd, { passive: true })
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [commitIfDone, dismiss])

  const reveal = progress / DISMISS_DISTANCE

  // Flowers land as the final beat of the cascade, right after the button
  // (which finishes at 1.25s + 0.4s = 1.65s) — tightly clustered together
  // (100ms apart) so the whole splash settles by ~1.8s instead of ~3s.
  // Mobile's splash flower is bigger and crisper than before (was 220x270,
  // same blocky tile density as a much smaller canvas) but not full 420x500 —
  // that overflowed the screen and made touch interaction noticeably heavier
  // (more tiles to scan). 280x340 keeps the improved detail without either problem.
  const flowers = window.innerWidth < 768
    ? [{ w: 280, h: 340, mt: 0, delay: 1300 }]
    : [
        { w: 160, h: 200, mt: 20, delay: 1360 },
        { w: 220, h: 270, mt: -10, delay: 1240 },
        { w: 160, h: 200, mt: 20, delay: 1420 },
      ]

  // Real vibration pulse on Android, timed to each flower's visual "snap" —
  // feature-detected, so iOS (no web vibration API) just gets the visual.
  useEffect(() => {
    if (typeof navigator.vibrate !== "function") return
    const timers = flowers.map(f => setTimeout(() => navigator.vibrate(15), f.delay))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#162B55",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "none",
        transform: `translateY(${-reveal * 100}%)`,
        pointerEvents: reveal >= 1 ? "none" : "auto",
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
        opacity: 0, animation: "stagger-in 0.6s ease-out 0.05s forwards",
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
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 12px 30px rgba(0,0,0,0.3), 0 0 24px rgba(255,255,255,0.12);
        }
        /* Plain fade + a small drift, nothing else — no blur, no glow, no
           scale bump. Every added effect (blur-to-sharp, glow flash,
           overshoot) kept reading as more "effort", not less, no matter how
           faint. Gentleness here comes from the motion itself: a longer,
           soft ease-out drift with real room between beats. */
        @keyframes stagger-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes snap-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes button-bloom-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
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
          lines={[
            {
              text: "Welcome to",
              style: {
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                opacity: 0,
                // Each element starts a little before the previous one fully
                // settles — a gentle overlap reads as one continuous flow
                // instead of a rigid, evenly-spaced pop-pop-pop sequence.
                animation: "stagger-in 0.6s ease-out 0.05s forwards",
              },
            },
            {
              text: "Johanna's Corner of the Internet.",
              style: {
                fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em",
                maxWidth: "min(1100px, 92vw)", textAlign: "center", lineHeight: 1.3,
                opacity: 0,
                animation: "stagger-in 0.6s ease-out 0.35s forwards",
              },
            },
          ]}
        />

        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            opacity: 0,
            animation: "stagger-in 0.6s ease-out 0.65s forwards",
          }}
        >
          Ideas bloom through iteration. Click to see what's grown so far.
        </p>

        {/* Explore button */}
        <button
          className="loading-explore-btn"
          onClick={dismiss}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            marginTop: 8,
            opacity: 0,
            animation: "button-bloom-in 0.6s ease-out 0.95s forwards",
            transition: "color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
            pointerEvents: ready ? "auto" : "none",
          }}
        >
          Explore
        </button>

      </div>

      {/* ── Flower bed at bottom — each flower controls its own reveal timing
           via snap-in below, so this container itself stays plainly visible
           (no separate fade, which would otherwise compound with theirs). ── */}
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
        {flowers.map((f, i) => (
          <div
            key={i}
            style={{
              marginTop: f.mt,
              flexShrink: 0,
              opacity: 0,
              animation: `snap-in 0.55s ease-out ${f.delay}ms both`,
            }}
          >
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
