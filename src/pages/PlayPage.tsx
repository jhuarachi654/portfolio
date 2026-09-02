import { useRef, useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { X, MagicWand } from "@phosphor-icons/react"
import CaseStudyCard from "../components/CaseStudyCard"
import { useNumCols } from "../components/WorkGrid"
import InfiniteGrid from "../components/InfiniteGrid"
import Footer from "../components/Footer"
import DotField from "../components/DotField"
import Annotate from "../components/Annotate"
import { DrawBoard } from "./DrawPage"

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
  const [modal, setModal] = useState<"photography" | "koi" | "draw" | null>(null)
  const numCols = useNumCols()

  const items: { key: string; fullWidth: boolean; render: (index: number) => React.ReactNode }[] = [
    {
      key: "photography",
      fullWidth: true,
      render: (index) => (
        <div
          className="case-study-card-wrapper"
          onClick={() => setModal("photography")}
          data-cursor-label="Click to explore"
          data-reveal
          style={{ "--reveal-delay": `${Math.min(index % 4, 3) * 80}ms`, cursor: "pointer" } as React.CSSProperties}
        >
          <div className="case-study-card">
            <div className="case-study-card-media aspect-16-9" style={{ overflow: "hidden", position: "relative", pointerEvents: "none" }}>
              <DotField layout={1} />
              <InfiniteGrid srcs={PHOTO_SRCS} itemSize={80} gap={6} maxSpeed={120} magnify={0.2} radius={160} />
            </div>
            <div className="case-study-card-body">
              <h3 className="case-study-card-title">Photography</h3>
              <div className="case-study-card-title-row">
                <p className="case-study-card-landing-title">Photography</p>
                <div className="case-study-card-tags">
                  {["Claude Code", "Photography"].map(t => (
                    <span key={t} className="case-study-card-tag">{t}</span>
                  ))}
                </div>
              </div>
              <p className="case-study-card-description">An interactive medium for exploring film photography through motion and space. Click to explore.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "llsf",
      fullWidth: true,
      render: (index) => (
        // Love Lives in SF — moved here from the Work grid
        <CaseStudyCard
          index={index}
          title="Love Lives in SF"
          landingTitle="Love Lives in SF"
          tags={["Framer", "Web Design"]}
          image="/videos/llsf-Video-poster.png"
          video="/videos/llsf-Video.webm"
          href="https://lovelivesinsf.org/"
          description="Website for SF's public art programming. Designed as the sole designer; traffic grew 35% in the first 30 days."
          bgColor="#3a3a3a"
          objectFit="contain"
          mediaPadding={16}
          dotLayout={1}
          cursorLabel="Open live site"
        />
      ),
    },
    {
      key: "draw",
      fullWidth: true,
      render: (index) => (
        <div
          className="case-study-card-wrapper"
          onClick={() => setModal("draw")}
          data-cursor-label="Click to draw"
          data-reveal
          style={{ "--reveal-delay": `${Math.min(index % 4, 3) * 80}ms`, cursor: "pointer" } as React.CSSProperties}
        >
          <div className="case-study-card">
            <div className="case-study-card-media aspect-16-9" style={{ overflow: "hidden", position: "relative", pointerEvents: "none", background: "#1E4B9A" }}>
              <img src="/images/play/drawing-board-thumb.png" alt="Drawing Board gallery preview" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            </div>
            <div className="case-study-card-body">
              <h3 className="case-study-card-title">Drawing Board</h3>
              <div className="case-study-card-title-row">
                <p className="case-study-card-landing-title">Drawing Board</p>
                <div className="case-study-card-tags">
                  {["Claude Code", "Interactive"].map(t => (
                    <span key={t} className="case-study-card-tag">{t}</span>
                  ))}
                </div>
              </div>
              <p className="case-study-card-description">A collaborative ASCII-art drawing gallery — sketch a card and add it to the wall. Click to draw.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "koi",
      fullWidth: true,
      render: (index) => (
        <div
          className="case-study-card-wrapper"
          onClick={() => setModal("koi")}
          data-cursor-label="Click to dive in"
          data-reveal
          style={{ "--reveal-delay": `${Math.min(index % 4, 3) * 80}ms`, cursor: "pointer" } as React.CSSProperties}
        >
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
              <div className="case-study-card-title-row">
                <p className="case-study-card-landing-title">Koi Pond</p>
                <div className="case-study-card-tags">
                  {["Claude Code", "Interactive"].map(t => (
                    <span key={t} className="case-study-card-tag">{t}</span>
                  ))}
                </div>
              </div>
              <p className="case-study-card-description">An interactive koi pond with draggable lily pads, ripple physics, and dragonflies — every element hand-drawn in Figma Draw. Click to dive in.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "popple",
      fullWidth: false,
      render: (index) => (
        // Popple — same CaseStudyCard config as the Home page entry.
        // Uses the pre-composited MP4 (phone + purple bg baked in) rather
        // than the original alpha-channel WebM, since alpha-channel WebM
        // only renders correctly in Chromium — see WorkGrid.tsx for the
        // full explanation.
        <CaseStudyCard
          index={index}
          title="Popple"
          landingTitle="Popple"
          tags={["Claude Code", "Interactive"]}
          image="/videos/Popple-Video-composited-poster.png"
          video="/videos/Popple-Video-composited.mp4"
          href="https://popple.pages.dev/"
          description="Designed an app that makes completed tasks tangible and collectible."
          aspectRatio="16/9"
          objectFit="cover"
          dotLayout={2}
          cursorLabel="Open live site"
        />
      ),
    },
    {
      key: "canopy",
      fullWidth: false,
      render: (index) => (
        <CaseStudyCard
          index={index}
          title="Canopy Animation"
          landingTitle="Canopy Animation"
          tags={["Jitter", "Motion Design"]}
          image="/images/play/canopy-animation-poster.png"
          video="/videos/Canopy-Animation.webm"
          href="#"
          description="A notification animation for a Focus Session, designed for Canopy."
          aspectRatio="16/9"
          bgColor="#f5f7fc"
          mediaScale={1}
          cursorLabel="Video made in Jitter"
        />
      ),
    },
  ]

  // Split the ordered item list into blocks: a run of consecutive non-full-width
  // items becomes one work-masonry (flex, N-column round-robin) row; each
  // full-width item becomes its own standalone row — mirrors how WorkGrid lays
  // out its own masonry columns, but allows full-bleed items to interrupt it.
  type Block = { type: "masonry"; entries: { key: string; node: React.ReactNode }[] } | { type: "full"; key: string; node: React.ReactNode }
  const blocks: Block[] = []
  items.forEach((item, i) => {
    if (item.fullWidth) {
      blocks.push({ type: "full", key: item.key, node: item.render(i) })
    } else {
      const last = blocks[blocks.length - 1]
      if (last?.type === "masonry") {
        last.entries.push({ key: item.key, node: item.render(i) })
      } else {
        blocks.push({ type: "masonry", entries: [{ key: item.key, node: item.render(i) }] })
      }
    }
  })

  return (
    <>
      <div className="play-page footer-curtain">
        <div className="play-header">
          <h1 className="play-headline" data-reveal style={{ "--reveal-delay": "80ms", display: "flex", alignItems: "center", gap: 4 } as React.CSSProperties}><span>Experiments and Artifacts</span><MagicWand size={32} weight="thin" /></h1>
          <p className="play-body" data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>Curiosity, designing, and coding is what drives me lately. I bounce between Figma and Claude Code until something feels right, chasing one question: how do we make mundane experiences <Annotate type="underline" order={0}>feel alive and worth coming back to</Annotate>?</p>
        </div>

        <div className="play-card-grid">
          {blocks.map((block, bi) => {
            if (block.type === "full") {
              return (
                <motion.div key={block.key} layout style={{ gridColumn: "1 / -1" }}>
                  {block.node}
                </motion.div>
              )
            }
            const cols: { key: string; node: React.ReactNode }[][] = Array.from({ length: numCols }, () => [])
            block.entries.forEach((entry, i) => cols[i % numCols].push(entry))
            return (
              <div key={`masonry-${bi}`} className="work-masonry" style={{ gridColumn: "1 / -1" }}>
                {cols.map((col, ci) => (
                  <div key={ci} className="work-masonry-col">
                    {col.map(entry => (
                      <motion.div key={entry.key} layout>
                        {entry.node}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })}
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

      {/* Drawing Board modal */}
      <InteractiveModal open={modal === "draw"} onClose={() => setModal(null)}>
        <div style={{ width: "100%", height: "100%", overflow: "auto", background: "var(--color-cs-bg, #fff)" }}>
          <DrawBoard />
        </div>
      </InteractiveModal>
      <Footer />
    </>
  )
}
