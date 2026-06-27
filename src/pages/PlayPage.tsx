import { useRef, useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { X } from "@phosphor-icons/react"
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

// ── Popple video (seeks to 8.79s on hover) ───────────────────────────────────
function PoppleVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const onEnter = () => {
    const vid = ref.current; if (!vid) return
    vid.currentTime = 8.79
    vid.play().catch(() => {})
  }
  const onLeave = () => {
    const vid = ref.current; if (!vid) return
    vid.pause(); vid.currentTime = 8.79
  }
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <video
        ref={ref}
        src="/videos/Popple-Video.webm"
        poster="/videos/Popple-Video-poster.png"
        muted loop playsInline preload="auto"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
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
      <div className="play-page">
        <div className="play-header">
          <p className="play-eyebrow">Playground</p>
          <h1 className="play-headline">Fun side projects, explorations, and more.</h1>
        </div>

        <div className="play-card-grid line-grid">

          {/* Photography — full width, opens modal */}
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="case-study-card-wrapper" style={{ cursor: "pointer" }} onClick={() => setModal("photography")}>
              <div className="case-study-card">
                <div className="case-study-card-media aspect-16-9" style={{ overflow: "hidden", position: "relative", pointerEvents: "none" }}>
                  <DotField layout={1} />
                  <InfiniteGrid srcs={PHOTO_SRCS} itemSize={110} gap={6} maxSpeed={120} magnify={0.2} radius={160} />
                </div>
                <div className="case-study-card-body">
                  <div className="case-study-card-header">
                    <h3 className="case-study-card-title">Photography</h3>
                    <div className="case-study-card-tags">
                      {["Personal Project", "Photography", "Interactive"].map(t => (
                        <span key={t} className="case-study-card-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="case-study-card-description">An interactive medium for exploring film photography through motion and space. Click to explore.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popple */}
          <a href="https://popple.app" target="_blank" rel="noopener noreferrer" className="case-study-card-wrapper" style={{ display: "block", textDecoration: "none" }}>
            <div className="case-study-card">
              <div className="case-study-card-media aspect-4-3" style={{ position: "relative", overflow: "hidden" }}>
                <PoppleVideo />
              </div>
              <div className="case-study-card-body">
                <div className="case-study-card-header">
                  <h3 className="case-study-card-title">Popple</h3>
                  <div className="case-study-card-tags">
                    {["Personal Project", "AI", "Design Engineering"].map(t => (
                      <span key={t} className="case-study-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <p className="case-study-card-description">Designed an app that makes completed tasks tangible and collectible.</p>
              </div>
            </div>
          </a>

          {/* Focus Notification */}
          <CaseStudyCard
            title="Focus Notification"
            tags={["Personal Project", "Motion Design"]}
            image="/images/play/play-07-4oxDlE.png"
            lottie="/animations/focus-notification.json"
            href="#"
            description="A notification animation for a Focus Session, designed for Canopy."
            aspectRatio="4/3"
            bgColor="#f5f7fc"
            cursorLabel="Lottie animation made in Jitter"
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
                  <div className="case-study-card-header">
                    <h3 className="case-study-card-title">Koi Pond</h3>
                    <div className="case-study-card-tags">
                      {["Personal Project", "Figma Draw", "Vanilla JS"].map(t => (
                        <span key={t} className="case-study-card-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="case-study-card-description">An interactive koi pond with draggable lily pads, ripple physics, and dragonflies — every element hand-drawn in Figma Draw. Click to dive in.</p>
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
