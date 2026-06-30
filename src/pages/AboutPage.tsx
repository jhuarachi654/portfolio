import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import VinylPlayer from "../components/VinylPlayer"
import Footer from "../components/Footer"

const BASE = "/images/about"

// Portrait is index 0 → always starts on top of the pile
const PILE_PHOTOS = [
  { src: `${BASE}/about-16-fXGtIR.png`, alt: "Johanna Huarachi" },
  { src: `${BASE}/about-10-EeeX71.png`, alt: "Fall hike in the DMV" },
  { src: `${BASE}/about-12-nWwB5x.jpg`, alt: "Palace of Fine Arts, SF" },
  { src: `${BASE}/about-17-QN6Eya.png`, alt: "SF at golden hour" },
]

const MOMENTS = [
  { src: `${BASE}/about-13-TPGcKT.jpg`, alt: "At CCA with pennant",       rotate: -1   },
  { src: `${BASE}/about-14-8iDJK2.png`, alt: "Countryside with sparkles", rotate:  1.5 },
  { src: `${BASE}/about-15-ds1yVi.png`, alt: "Red heart sculpture",       rotate: -2   },
  { src: `${BASE}/about-09-B9RMPR.jpg`, alt: "Pink magnolias",            rotate:  1   },
  { src: `${BASE}/about-07-tJpiN1.jpg`, alt: "Waves",                     rotate: -3   },
]

// size = rendered img size in px, offsetY = vertical nudge (positive = down), floatDelay = animation offset
// x/y are percent of scatter container (disc centered at 50%, 45%)
const TREASURES = [
  { src: `${BASE}/about-24-hIUzPz.png`, alt: "Catpple tin",   label: "Some stickers I gifted",          rotate: -8,  size: 94, x: "10%", y: "18%", floatDelay: "0s"   },
  { src: `${BASE}/about-23-cHxzUK.png`, alt: "Latte art",     label: "A cap I made",                    rotate:  5,  size: 56, x: "16%", y: "72%", floatDelay: "0.8s" },
  { src: `${BASE}/about-25-1kVOwL.png`, alt: "Tuxedo cat",    label: "One of my pencil pouches",        rotate: -4,  size: 85, x: "36%", y: "80%", floatDelay: "1.4s" },
  { src: `${BASE}/about-27-ebo5bp.png`, alt: "Doge",          label: "Hi this is my child, Toto.",      rotate:  6,  size: 85, x: "64%", y: "75%", floatDelay: "0.4s" },
  { src: `${BASE}/about-26-6JOonA.png`, alt: "A NYC exhibit that caught my eye", label: "A NYC exhibit that caught my eye", rotate: -5, size: 75, x: "82%", y: "22%", floatDelay: "1.9s" },
  { src: `${BASE}/about-22-RJyGV4.png`, alt: "Salmon nigiri", label: "Some sushi from omakase I had",   rotate:  4,  size: 73, x: "87%", y: "65%", floatDelay: "1.1s" },
]

// Rotations for [bottom, middle, top] cards in the pile
const PILE_ROTATIONS = [-8, 5, -1.5]

function PhotoLightbox({ photos, startIdx, onClose }: {
  photos: { src: string; alt: string }[]
  startIdx: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIdx)
  const close = useCallback(onClose, [onClose])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % photos.length)
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + photos.length) % photos.length)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", h)
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = "" }
  }, [close, photos.length])

  return createPortal(
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px,5vw,64px)",
        cursor: "zoom-out",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", maxWidth: 560, width: "100%", cursor: "default" }}
      >
        {/* Polaroid frame */}
        <div style={{
          background: "#fff",
          padding: "16px 16px 52px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          transform: "rotate(-1deg)",
        }}>
          <img
            src={photos[idx].src}
            alt={photos[idx].alt}
            style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: "4/3" }}
          />
          <p style={{
            marginTop: 10, textAlign: "center",
            fontFamily: "var(--font-sans)", fontSize: 13, color: "#555",
            fontStyle: "italic",
          }}>{photos[idx].alt}</p>
        </div>

        {/* Navigation */}
        {photos.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
            <button
              onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.15)", color: "#fff",
                fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >‹</button>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: 6, height: 6, borderRadius: "50%", border: "none",
                  background: i === idx ? "#fff" : "rgba(255,255,255,0.3)",
                  cursor: "pointer", padding: 0, alignSelf: "center",
                }}
              />
            ))}
            <button
              onClick={() => setIdx(i => (i + 1) % photos.length)}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.15)", color: "#fff",
                fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >›</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default function AboutPage() {
  // topIdx = which photo is currently on top (index into PILE_PHOTOS)
  const [topIdx, setTopIdx] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [shuffling, setShuffling] = useState(false)
  // z-index starts high (card is in front), drops mid-animation so card passes behind the pile
  const [shuffleZ, setShuffleZ] = useState(10)
  const pageRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 })
  const autoScrollRef = useRef<number>(0)
  const userActiveRef = useRef(false)
  const openLightboxRef = useRef<(i: number) => void>(() => {})
  openLightboxRef.current = (i: number) => setLightboxIdx(i)

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll<HTMLElement>("[data-reveal]")
    if (!els?.length) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-visible"); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const SPEED = 0.6 // px per frame
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const tick = () => {
      if (!userActiveRef.current && !prefersReduced) {
        const half = row.scrollWidth / 2
        row.scrollLeft += SPEED
        // loop seamlessly when we've scrolled one full copy
        if (row.scrollLeft >= half) row.scrollLeft -= half
      }
      autoScrollRef.current = requestAnimationFrame(tick)
    }
    autoScrollRef.current = requestAnimationFrame(tick)

    const onDown = (e: PointerEvent) => {
      userActiveRef.current = true
      dragRef.current = { active: true, startX: e.clientX, startScroll: row.scrollLeft }
      row.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return
      e.preventDefault()
      row.scrollLeft = dragRef.current.startScroll - (e.clientX - dragRef.current.startX)
    }

    const onUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - dragRef.current.startX)
      dragRef.current.active = false
      setTimeout(() => { userActiveRef.current = false }, 1500)
      // Tap (not drag) — find which moment was hit and open lightbox
      if (dx < 6) {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        const moment = el?.closest("[data-moment-idx]") as HTMLElement | null
        if (moment) {
          const idx = parseInt(moment.dataset.momentIdx ?? "-1", 10)
          if (idx >= 0) openLightboxRef.current(idx)
        }
      }
    }

    row.addEventListener("pointerdown", onDown)
    row.addEventListener("pointermove", onMove, { passive: false })
    row.addEventListener("pointerup",   onUp)
    row.addEventListener("pointercancel", onUp)

    return () => {
      cancelAnimationFrame(autoScrollRef.current)
      row.removeEventListener("pointerdown", onDown)
      row.removeEventListener("pointermove", onMove)
      row.removeEventListener("pointerup",   onUp)
      row.removeEventListener("pointercancel", onUp)
    }
  }, [])

  const shuffle = () => {
    if (busyRef.current) return
    busyRef.current = true
    setShuffleZ(10)
    setShuffling(true)
    // After card peaks right (~32% into 500ms), drop z-index so it tucks behind the pile on the return
    setTimeout(() => setShuffleZ(0), 165)
    setTimeout(() => {
      setTopIdx(i => (i + 1) % PILE_PHOTOS.length)
      setShuffling(false)
      busyRef.current = false
    }, 500)
  }

  // pile[0]=bottom, pile[1]=middle, pile[2]=top
  const pile = [
    (topIdx + 2) % PILE_PHOTOS.length,
    (topIdx + 1) % PILE_PHOTOS.length,
    topIdx,
  ]

  return (
    <div ref={pageRef}>
      {/* ── Hero ── */}
      <div className="line-grid hero-page">
        <div className="hero-left">
          <p className="about-eyebrow" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>Hi, again</p>
          <h1 className="hero-name hero-display-headline" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <div>I'm Johanna, a first-generation</div>
            <div>designer building for everyone.</div>
          </h1>

          <p className="about-pronunciation" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>(jo-HAN-uh wah-RAH-chee)</p>

          <div className="about-cta" data-reveal style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
            <a href="mailto:jhuarachi654@gmail.com" className="btn-resume">
              <span>Get in touch</span>
            </a>
          </div>
        </div>

        {/* ── Right: corkboard ── */}
        <div className="hero-right about-hero-right">
          <div className="about-corkboard">

            {/* Main pile — center of corkboard */}
            <div className="about-pile-hero-wrap">
              <span className="about-clip" aria-hidden="true" />
              <button
                className="about-pile-thumb"
                onClick={shuffle}
                aria-label="Shuffle photos"
                data-cursor-label="Hi, this is me! Click to see more →"
              >
                {pile.map((photoIdx, renderIdx) => (
                  <div
                    key={renderIdx}
                    className={`about-pile-thumb-card${renderIdx === 2 && shuffling ? " is-shuffling" : ""}`}
                    style={{
                      transform: (renderIdx === 2 && shuffling) ? undefined : `rotate(${PILE_ROTATIONS[renderIdx]}deg)`,
                      zIndex: renderIdx === 2 && shuffling ? shuffleZ : renderIdx + 1,
                    }}
                  >
                    <img
                      src={PILE_PHOTOS[photoIdx].src}
                      alt={photoIdx === 0 ? "Johanna Huarachi" : ""}
                    />
                  </div>
                ))}
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* ── Bio ── */}
      <section className="work-grid-section about-bio-section">
        <div className="about-bio-grid">
          <div className="about-bio-left">
            <h2 className="about-section-heading" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>A snippet of who I am</h2>
          </div>
          <div className="about-bio-right">
            <p className="about-bio-para" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
              I grew up in the DMV, and I'm a first-generation student and product
              designer with a background in the humanities.
            </p>
            <p className="about-bio-para" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              I'm finishing my Masters in Interaction Design at California College
              of the Arts, graduating June 2026. Before that, I studied psychology,
              neuroscience, and Latino studies at Williams College. That combination
              taught me how people think, why systems fail them, and who gets left out.
            </p>
            <p className="about-bio-para" data-reveal style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
              As a first-generation student, I've seen that firsthand. That's what
              drives my work. I want to use design to build systems that are both
              equitable and delightful. The digital world is only growing, and it
              needs to be built for everyone.
            </p>
            <p className="about-bio-para" data-reveal style={{ "--reveal-delay": "320ms" } as React.CSSProperties}>
              This portfolio was designed and built entirely in code — React, TypeScript, and Vite.
            </p>
          </div>
        </div>

        <div ref={rowRef} className="about-moments-row" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
          <div className="about-moments-track" aria-label="Photo moments">
            {MOMENTS.map((m, i) => (
              <div key={m.src} className="about-moment" data-moment-idx={i} data-cursor-label="Click to view ↗" style={{ transform: `rotate(${m.rotate}deg)`, cursor: "pointer" }}>
                <img src={m.src} alt={m.alt} />
              </div>
            ))}
            {MOMENTS.map((m, i) => (
              <div key={`${m.src}-dup`} className="about-moment" aria-hidden="true" data-moment-idx={i} data-cursor-label="Click to view ↗" style={{ transform: `rotate(${m.rotate}deg)`, cursor: "pointer" }}>
                <img src={m.src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Treasured things ── */}
      <section className="line-grid about-treasures-section">
        <div className="about-treasures-header">
          <h2 className="about-section-heading" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>Made it all the way down here?</h2>
          <p className="about-treasures-sub" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>Here is my favorite song and some of my other treasured things</p>
        </div>

        <div className="about-treasures-scatter">
          {/* Vinyl player — absolutely centered */}
          <div className="about-treasures-vinyl-center" data-cursor-label="Los Retros — Doves">
            <VinylPlayer
              src="/audio/favorite-song.mp3"
              albumArt="/images/album-cover.webp"
              size={170}
            />
          </div>

          {/* Scattered items — absolutely positioned */}
          {TREASURES.map((t) => (
            <div
              key={t.src}
              className="about-treasure-item"
              data-label={t.label}
              style={{
                "--rotate": `${t.rotate}deg`,
                "--float-delay": t.floatDelay,
                left: t.x,
                top: t.y,
              } as React.CSSProperties}
            >
              <img src={t.src} alt={t.alt} style={{ width: t.size, height: t.size }} />
            </div>
          ))}
        </div>
      </section>
      <Footer />
      {lightboxIdx !== null && (
        <PhotoLightbox
          photos={MOMENTS}
          startIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  )
}
