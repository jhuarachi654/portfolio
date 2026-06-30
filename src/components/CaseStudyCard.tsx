import { Link } from "react-router-dom"
import { useRef, useEffect, useState } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import DotField from "./DotField"

export interface CaseStudyCardProps {
  index?: number
  title: string
  year?: number
  tags: string[]
  image: string
  video?: string
  lottie?: string
  href: string
  comingSoon?: boolean
  role?: string
  description?: string
  aspectRatio?: "16/9" | "4/3" | "3/4" | "1/1"
  objectFit?: "cover" | "contain"
  objectPosition?: string
  bgColor?: string
  mediaPadding?: number
  mediaScale?: number
  lottieStartTime?: number
  dotField?: boolean
  dotColor?: string
  dotLayout?: number
  forcePlay?: boolean
  cursorLabel?: string
  cursorIcon?: string
  cursorIconIsEmoji?: boolean
  projectType?: string
  status?: string
  metrics?: { stat: string; label: string }[]
  team?: string
  timeframe?: string
}

export default function CaseStudyCard({
  index,
  title,
  year,
  tags,
  image,
  video,
  lottie,
  href,
  comingSoon = false,
  role,
  description,
  aspectRatio = "16/9",
  objectFit = "cover",
  objectPosition = "center",
  bgColor,
  mediaPadding,
  mediaScale,
  lottieStartTime,
  dotField = false,
  dotColor,
  dotLayout = 0,
  forcePlay = false,
  cursorLabel,
  cursorIcon,
  cursorIconIsEmoji,
  projectType,
  status,
  metrics,
  team,
  timeframe,
}: CaseStudyCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const mediaRef = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(false)

  const [lottieData, setLottieData] = useState<object | null>(null)
  const [isDesktop] = useState(() => window.matchMedia("(hover: hover)").matches)
  const [prefersReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [isInView, setIsInView] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [slowLoad, setSlowLoad] = useState(false)
  const mobileInViewRef = useRef(false)

  useEffect(() => {
    if (forcePlay) { setIsInView(true); return }
    const el = mediaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } },
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [forcePlay])

  useEffect(() => {
    if (isReady) { setSlowLoad(false); return }
    const t = setTimeout(() => setSlowLoad(true), 400)
    return () => clearTimeout(t)
  }, [isReady])

  useEffect(() => {
    if (!lottieData || !isDesktop || lottieStartTime == null) return
    const id = requestAnimationFrame(() => { lottieRef.current?.goToAndStop(lottieStartTime * 1000, false) })
    return () => cancelAnimationFrame(id)
  }, [lottieData, isDesktop, lottieStartTime])

  useEffect(() => {
    if (!lottie || !isInView || lottieData) return
    fetch(lottie).then(r => r.json()).then(data => { setLottieData(data); setIsReady(true) }).catch(() => {})
  }, [lottie, isInView, lottieData])

  useEffect(() => {
    if (prefersReducedMotion) return
    if (forcePlay) {
      videoRef.current?.play().catch(() => {})
      lottieRef.current?.play()
    } else {
      const vid = videoRef.current
      if (vid) { vid.pause(); vid.currentTime = lottieStartTime ?? 0 }
      if (lottieStartTime != null) lottieRef.current?.goToAndStop(lottieStartTime * 1000, false)
      else lottieRef.current?.stop()
    }
  }, [forcePlay, prefersReducedMotion, lottieStartTime, lottieData])

  const handleImageLoad = () => setIsReady(true)

  const handleCanPlay = () => {
    setIsReady(true)
    if (prefersReducedMotion) return
    const vid = videoRef.current
    if (!vid) return
    if (forcePlay || (isDesktop && isHoveredRef.current) || (!isDesktop && mobileInViewRef.current)) {
      vid.play().catch(() => {})
    } else {
      vid.currentTime = lottieStartTime ?? 0
    }
  }

  const handleMouseEnter = () => {
    if (!isDesktop || prefersReducedMotion) return
    isHoveredRef.current = true
    videoRef.current?.play().catch(() => {})
    lottieRef.current?.play()
  }

  const handleMouseLeave = () => {
    if (!isDesktop) return
    isHoveredRef.current = false
    const vid = videoRef.current
    if (vid) { vid.pause(); vid.currentTime = 0 }
    if (lottieStartTime != null) lottieRef.current?.goToAndStop(lottieStartTime * 1000, false)
    else lottieRef.current?.stop()
  }

  useEffect(() => {
    if (isDesktop || prefersReducedMotion || !isInView) return
    if (!video && !lottieData) return
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mobileInViewRef.current = true
          videoRef.current?.play().catch(() => {})
          lottieRef.current?.play()
        } else {
          mobileInViewRef.current = false
          const vid = videoRef.current
          if (vid) { vid.pause(); vid.currentTime = 0 }
          lottieRef.current?.stop()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop, video, lottieData, isInView, prefersReducedMotion])

  useEffect(() => {
    if (isDesktop) return
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wrapper = el.closest(".case-study-card-wrapper")
        wrapper?.classList.toggle("metrics-in-view", entry.isIntersecting)
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop])

  const aspectRatioClass = `aspect-${aspectRatio.replace("/", "-")}`
  const showSkeleton = slowLoad && !isReady

  const hasMetrics = metrics && metrics.length > 0

  const cardContent = (
    <div
      ref={cardRef}
      className="case-study-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={mediaRef}
        className={`case-study-card-media ${aspectRatioClass} ${isReady ? "is-loaded" : ""}`}
        style={{ ...(bgColor ? { background: bgColor } : {}), ...(mediaPadding ? { padding: mediaPadding } : {}) }}
      >
        {dotField && <DotField layout={dotLayout} />}
        {video ? (
          <video
            ref={videoRef}
            className="case-study-card-video"
            src={isInView ? video : undefined}
            poster={image}
            muted loop playsInline preload="metadata"
            onCanPlay={handleCanPlay}
            style={{ objectFit, objectPosition, ...(mediaScale ? { transform: `scale(${mediaScale})` } : {}) }}
          />
        ) : lottie && lottieData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={lottieData}
            autoplay={!isDesktop}
            loop
            style={{ width: "100%", height: "100%", objectFit, objectPosition, position: "relative", zIndex: 1, ...(mediaScale ? { transform: `scale(${mediaScale})` } : {}) }}
          />
        ) : (
          <img
            src={image}
            alt={title}
            style={{ objectFit, objectPosition }}
            className="case-study-card-image"
            onLoad={handleImageLoad}
          />
        )}
        {showSkeleton && <div className="case-study-card-skeleton" aria-busy="true" />}
        {comingSoon && <span className="case-study-card-badge">Soon</span>}
        {year && <span className="case-study-card-year-pill">{year}</span>}
      </div>

      <div className="case-study-card-body">
        <div className="case-study-card-header">
          <h3 className="case-study-card-title">{title}</h3>
          {tags.length > 0 && (
            <div className="case-study-card-tags">
              {tags.map(tag => <span key={tag} className="case-study-card-tag">{tag}</span>)}
            </div>
          )}
        </div>
        {description && <p className="case-study-card-description">{description}</p>}
      </div>

      {hasMetrics && (
        <div className="cs-metrics-panel">
          <div className="cs-metrics-inner">
            <div className="cs-metrics-boxes">
              {metrics!.map((m, i) => (
                <div key={i} className="cs-metric-box">
                  <span className="cs-metric-stat">{m.stat}</span>
                  <span className="cs-metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const cursorAttrs = cursorLabel ? {
    "data-cursor-label": cursorLabel,
    ...(cursorIcon ? { "data-cursor-icon": cursorIcon } : {}),
    ...(cursorIconIsEmoji ? { "data-cursor-emoji": "true" } : {}),
  } : {}

  const revealDelay = `${Math.min((index ?? 0) % 4, 3) * 80}ms`
  const revealAttrs = { "data-reveal": true, style: { "--reveal-delay": revealDelay } as React.CSSProperties }

  if (comingSoon) {
    return (
      <div className="case-study-card-wrapper case-study-card-wrapper--disabled" {...cursorAttrs} {...revealAttrs}>
        {cardContent}
      </div>
    )
  }

  const isExternal = href.startsWith("http")

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="case-study-card-wrapper" tabIndex={0} {...cursorAttrs} {...revealAttrs}>
        {cardContent}
      </a>
    )
  }

  return (
    <Link to={href} className="case-study-card-wrapper" tabIndex={0} {...cursorAttrs} {...revealAttrs}>
      {cardContent}
    </Link>
  )
}
