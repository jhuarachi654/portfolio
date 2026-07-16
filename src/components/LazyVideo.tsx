import { useEffect, useRef, useState } from "react"

interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  style?: React.CSSProperties
}

// Defers setting `src` until the video scrolls near the viewport, so
// below-the-fold case-study videos don't compete with the hero for
// bandwidth/decoding on page load. Mirrors the pattern already used by
// CaseStudyCard for the landing-page grid.
export default function LazyVideo({ src, poster, className, style }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } },
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={isInView ? src : undefined}
      poster={poster}
      preload="metadata"
      autoPlay={isInView}
      loop
      muted
      playsInline
      className={className}
      style={style}
    />
  )
}
