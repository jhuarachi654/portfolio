import { useRef, useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, MagicWand } from "@phosphor-icons/react"
import CaseStudyCard from "../components/CaseStudyCard"
import InfiniteGrid from "../components/InfiniteGrid"
import Footer from "../components/Footer"
import DotField from "../components/DotField"

const PHOTO_SRCS = [
  "/images/play/photography/DSCN0007 copy.JPG",
  "/images/play/photography/DSCN0069 copy.JPG",
  "/images/play/photography/DSCN0122 copy.JPG",
  "/images/play/photography/DSCN0135 copy.JPG",
  "/images/play/photography/DSCN0138 copy.JPG",
  "/images/play/photography/DSCN0198 copy.JPG",
  "/images/play/photography/DSCN0580 copy.JPG",
  "/images/play/photography/DSCN0591 copy.JPG",
  "/images/play/photography/DSCN0812 copy.JPG",
  "/images/play/photography/DSCN1012 copy.JPG",
  "/images/play/photography/DSCN1079 copy.JPG",
  "/images/play/photography/DSCN1229 copy.JPG",
  "/images/play/photography/DSCN1287 copy.JPG",
  "/images/play/photography/DSCN1289 copy.JPG",
  "/images/play/photography/DSCN1313 copy.JPG",
  "/images/play/photography/DSCN1481 copy.JPG",
  "/images/play/photography/DSCN1587 copy.JPG",
]

// ── Modal ─────────────────────────────────────────────────────────────────────
function InteractiveModal({ open, onClose, children }: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const close = useCallback(onClose, [onClose])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", h)
    document.body.style.overflow = "hidden"
    document.body.classList.add("overlay-open")
    return () => {
      window.removeEventListener("keydown", h)
      document.body.style.overflow = ""
      document.body.classList.remove("overlay-open")
    }
  }, [open, close])

  if (!open) return null

  return createPortal(
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px,5vw,64px)",
        cursor: "zoom-out",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "85vw", height: "85vh",
          overflow: "hidden",
          cursor: "default",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 10,
            width: 32, height: 32, borderRadius: "50%",
            border: "none", background: "rgba(0,0,0,0.55)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} weight="bold" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

// ── Koi Pond iframe (loads immediately when modal opens) ──────────────────────
function KoiPondEmbed() {
  const [interacted, setInteracted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleOverlayClick = () => {
    setInteracted(true)
    // Forward a synthetic click into the iframe so the browser grants it
    // the user-gesture needed to unlock audio autoplay
    try {
      iframeRef.current?.contentWindow?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    } catch {
      // cross-origin — ignore; user's next direct click on the pond will start music
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <iframe
        ref={iframeRef}
        src="https://jhuarachi654.github.io/koi-pond/"
        title="Koi Pond"
        style={{ position: "absolute", inset: "-4%", width: "108%", height: "108%", border: "none" }}
        allow="autoplay; web-share"
      />
      {!interacted && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            paddingBottom: 32,
            cursor: "pointer",
          }}
        >
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.35)",
            padding: "6px 14px",
            borderRadius: 4,
            backdropFilter: "blur(4px)",
          }}>
            Tap to interact
          </span>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PlayPage() {
  const [modal, setModal] = useState<"photography" | "koi" | null>(null)

  return (
    <>
      <div className="play-page footer-curtain">
        <div className="play-header">
          <h1 className="play-headline" data-reveal style={{ "--reveal-delay": "80ms", display: "flex", alignItems: "center", gap: 4 } as React.CSSProperties}><span>Side Works</span><MagicWand size={32} weight="thin" /></h1>
          <p className="play-body" data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>A collection of my experiments and work in code, motion, branding, and more…</p>
        </div>

        <div className="play-card-grid">

          {/* Photography — full width, opens modal */}
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="case-study-card-wrapper" style={{ cursor: "pointer" }} onClick={() => setModal("photography")}>
              <div className="case-study-card">
                <div className="case-study-card-media aspect-16-9" style={{ overflow: "hidden", position: "relative", pointerEvents: "none" }}>
                  <DotField layout={1} />
                  <InfiniteGrid srcs={PHOTO_SRCS} itemSize={110} gap={6} maxSpeed={120} magnify={0.2} radius={160} />
                </div>
                <div className="case-study-card-body">
                  <h3 className="case-study-card-title">Photography</h3>
                  <p className="case-study-card-description">An interactive medium for exploring film photography through motion and space. Click to explore.</p>
                  <div className="case-study-card-tags">
                    {["Photography", "Interactive"].map(t => (
                      <span key={t} className="case-study-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popple — same CaseStudyCard config as the Home page entry */}
          <CaseStudyCard
            title="Popple"
            tags={["AI", "Design Engineering"]}
            image="/videos/Popple-Video-poster.png"
            video="/videos/Popple-Video.webm"
            bgLottie="/videos/Popple-Background.json"
            href="https://popple.pages.dev/"
            description="Designed an app that makes completed tasks tangible and collectible."
            aspectRatio="4/3"
            bgColor="linear-gradient(135deg, #d9d3f0, #c7c9d6)"
            objectFit="cover"
            dotField
            dotLayout={2}
            lottieStartTime={8.79}
            cursorLabel="Open live site"
          />

          {/* Canopy Animation */}
          <CaseStudyCard
            title="Canopy Animation"
            tags={["Motion Design"]}
            image="/images/play/canopy-animation-poster.png"
            video="/videos/Canopy-Animation.webm"
            href="#"
            description="A notification animation for a Focus Session, designed for Canopy."
            aspectRatio="4/3"
            bgColor="#f5f7fc"
            mediaScale={1}
            cursorLabel="Video made in Jitter"
          />

          {/* Koi Pond — full width, opens modal */}
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="case-study-card-wrapper" style={{ cursor: "pointer" }} onClick={() => setModal("koi")}>
              <div className="case-study-card">
                <div className="case-study-card-media aspect-16-9" style={{ overflow: "hidden", position: "relative", pointerEvents: "none" }}>
                  <iframe
                    src="https://jhuarachi654.github.io/koi-pond/"
                    title="Koi Pond preview"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    allow="autoplay"
                    sandbox="allow-scripts allow-same-origin"
                    tabIndex={-1}
                  />
                </div>
                <div className="case-study-card-body">
                  <h3 className="case-study-card-title">Koi Pond</h3>
                  <p className="case-study-card-description">An interactive koi pond with draggable lily pads, ripple physics, and dragonflies — every element hand-drawn in Figma Draw. Click to dive in.</p>
                  <div className="case-study-card-tags">
                    {["Figma Draw", "Vanilla JS"].map(t => (
                      <span key={t} className="case-study-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Photography modal */}
      <InteractiveModal open={modal === "photography"} onClose={() => setModal(null)}>
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <DotField layout={1} />
          <InfiniteGrid srcs={PHOTO_SRCS} itemSize={140} gap={8} maxSpeed={200} magnify={0.3} radius={200} />
        </div>
      </InteractiveModal>

      {/* Koi Pond modal */}
      <InteractiveModal open={modal === "koi"} onClose={() => setModal(null)}>
        <KoiPondEmbed />
      </InteractiveModal>
      <Footer />
    </>
  )
}
