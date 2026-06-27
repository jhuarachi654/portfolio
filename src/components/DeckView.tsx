import { useState, useRef, useEffect, useCallback } from "react"
import type { CaseStudy } from "./WorkGrid"
import CaseStudyCard from "./CaseStudyCard"

const PEEK      = 72
const PREV_PEEK = 56
const GAP       = 12
const SNAP_MS   = 460

interface Props {
  studies: CaseStudy[]
}

// Rendered order: [clone of last, ...studies, clone of first]
// visualIndex 0   → clone of last  → teleport to n after snap
// visualIndex 1–n → real cards
// visualIndex n+1 → clone of first → teleport to 1 after snap

export default function DeckView({ studies }: Props) {
  const n      = studies.length
  const cloned = [studies[n - 1], ...studies, studies[0]]

  const [visualIndex, setVisualIndex] = useState(1)
  const [cardHeight, setCardHeight]   = useState(0)

  const visualRef  = useRef(1)
  const stepRef    = useRef(0)
  const snapping   = useRef(false)
  const snapTimer  = useRef<ReturnType<typeof setTimeout>>()
  const touchStartY = useRef<number | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const viewRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current?.firstElementChild as HTMLElement | null
    if (!el) return
    const ro = new ResizeObserver(() => setCardHeight(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => { visualRef.current = visualIndex }, [visualIndex])
  useEffect(() => { stepRef.current = cardHeight + GAP }, [cardHeight])

  const applyTransform = useCallback((vi: number, animated: boolean) => {
    const el = trackRef.current
    if (!el || !stepRef.current) return
    const base = -(vi * stepRef.current) + PREV_PEEK
    el.style.transition = animated ? `transform ${SNAP_MS}ms cubic-bezier(0.22,1,0.36,1)` : "none"
    el.style.transform  = `translateY(${base}px)`
  }, [])

  const snapTo = useCallback((vi: number) => {
    if (snapping.current) return
    snapping.current  = true
    visualRef.current = vi
    setVisualIndex(vi)
    applyTransform(vi, true)

    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      // Silently teleport clone positions to their real equivalents
      const cur = visualRef.current
      if (cur === 0) {
        visualRef.current = n
        setVisualIndex(n)
        applyTransform(n, false)
      } else if (cur === n + 1) {
        visualRef.current = 1
        setVisualIndex(1)
        applyTransform(1, false)
      }
      snapping.current = false
    }, SNAP_MS)
  }, [n, applyTransform])

  useEffect(() => {
    if (cardHeight) applyTransform(visualRef.current, false)
  }, [cardHeight, applyTransform])

  // Wheel — one directional intent → immediate snap
  useEffect(() => {
    const el = viewRef.current
    if (!el || !cardHeight) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (snapping.current) return
      if (Math.abs(e.deltaY) < 25) return
      snapTo(visualRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [cardHeight, snapTo])

  // Touch — swipe to snap
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const dy = touchStartY.current - e.changedTouches[0].clientY
    touchStartY.current = null
    if (Math.abs(dy) < 40) return
    snapTo(visualRef.current + (dy > 0 ? 1 : -1))
  }

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") snapTo(visualRef.current + 1)
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  snapTo(visualRef.current - 1)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [snapTo])

  const realIndex  = Math.min(Math.max(visualIndex - 1, 0), n - 1)
  const viewHeight = cardHeight ? PREV_PEEK + cardHeight + PEEK : "auto"

  return (
    <div className="deck-view">
      <div
        ref={viewRef}
        className="deck-viewport"
        style={{ height: viewHeight }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="deck-peek-fade" />
        <div ref={trackRef} className="deck-track" style={{ gap: GAP }}>
          {cloned.map((s, i) => (
            <div key={`${s.title}-${i}`} className="deck-track-item">
              <CardSlot study={s} active={i === visualIndex} />
            </div>
          ))}
        </div>
      </div>

      <div className="deck-nav">
        <button
          className="deck-nav-arrow"
          onClick={() => snapTo(visualRef.current - 1)}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="deck-toc">
          <span className="deck-toc-counter">{realIndex + 1} / {n}</span>
          <div className="deck-toc-pills">
            {studies.map((s, i) => (
              <button
                key={s.title}
                className={`deck-toc-pill${i === realIndex ? " is-active" : ""}`}
                onClick={() => snapTo(i + 1)}
                aria-label={s.title}
              >
                {s.iconIsEmoji ? (
                  <span className="deck-toc-pill-emoji" aria-hidden="true">{s.icon}</span>
                ) : (
                  <img src={s.icon ?? s.image} alt="" aria-hidden="true" />
                )}
                <span className="deck-toc-pill-label">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="deck-nav-arrow"
          onClick={() => snapTo(visualRef.current + 1)}
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 4v8M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const CardSlot = ({ study: s, active }: { study: CaseStudy; active: boolean }) => (
  <CaseStudyCard
    title={s.title}
    year={s.year}
    tags={s.tags}
    image={s.image}
    video={s.video}
    lottie={s.lottie}
    href={s.href}
    comingSoon={s.comingSoon}
    role={s.role}
    description={s.description}
    aspectRatio="16/9"
    objectFit={s.objectFit}
    objectPosition={s.objectPosition}
    bgColor={s.bgColor}
    mediaPadding={s.mediaPadding}
    mediaScale={s.mediaScale}
    lottieStartTime={s.lottieStartTime}
    dotField={s.dotField}
    dotColor={s.dotColor}
    dotLayout={s.dotLayout}
    forcePlay={active}
    cursorLabel={s.cursorLabel}
    cursorIcon={s.iconIsEmoji ? undefined : s.icon}
    cursorIconIsEmoji={s.iconIsEmoji}
  />
)
