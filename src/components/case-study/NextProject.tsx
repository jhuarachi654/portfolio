import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { Sparkle } from '@phosphor-icons/react'

interface NextProjectProps {
  title: string
  to: string
  company?: string
  description?: string
  tags?: string[]
  image?: string
  video?: string
  poster?: string
  lottie?: string
  restTime?: number
  mediaPadding?: number
  mediaZoom?: number
  objectFit?: 'cover' | 'contain'
  category?: 'enterprise' | 'ai' | 'consumer' | 'accessibility'
  bgColor?: string
}

// Paused by default, plays automatically once scrolled into view — same
// convention as the case-study cards on Home/Play (see CaseStudyCard.tsx).
function PreviewVideo({ src, poster, restTime = 0, zoom = 1, objectFit = 'cover' }: { src: string; poster?: string; restTime?: number; zoom?: number; objectFit?: 'cover' | 'contain' }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const handleLoadedMetadata = () => {
    const vid = videoRef.current
    if (vid) vid.currentTime = restTime
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current
        if (!vid) return
        if (entry.isIntersecting) {
          vid.play().catch(() => {})
        } else {
          vid.pause()
          vid.currentTime = restTime
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [restTime])

  return (
    <div ref={wrapRef} className="w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        style={{ width: '100%', height: '100%', display: 'block', objectFit, transform: zoom !== 1 ? `scale(${zoom})` : undefined }}
      />
    </div>
  )
}

function PreviewLottie({ src, restTime = 0, zoom = 1, objectFit = 'cover' }: { src: string; restTime?: number; zoom?: number; objectFit?: 'cover' | 'contain' }) {
  const [data, setData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(src).then(r => r.json()).then(setData).catch(() => {})
  }, [src])

  useEffect(() => {
    if (!data) return
    const id = requestAnimationFrame(() => { lottieRef.current?.goToAndStop(restTime * 1000, false) })
    return () => cancelAnimationFrame(id)
  }, [data, restTime])

  useEffect(() => {
    if (!data) return
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lottieRef.current?.play()
        } else {
          lottieRef.current?.goToAndStop(restTime * 1000, false)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [data, restTime])

  return (
    <div ref={wrapRef} className="w-full h-full overflow-hidden">
      {data && (
        <Lottie
          lottieRef={lottieRef}
          animationData={data}
          loop
          autoplay={false}
          rendererSettings={{ preserveAspectRatio: objectFit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice' }}
          style={{ width: '100%', height: '100%', display: 'block', transform: zoom !== 1 ? `scale(${zoom})` : undefined }}
        />
      )}
    </div>
  )
}

export default function NextProject({ title, to, company, description, tags, image, video, poster, lottie, restTime, mediaPadding, mediaZoom = 1, objectFit = 'cover', category, bgColor }: NextProjectProps) {
  return (
    <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, marginTop: 84 }}>
      <section className="max-w-[1080px] px-8 md:px-14" style={{ paddingBottom: 84 }}>
        <h2
          className="next-project-heading font-normal"
          style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-cs-heading)', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          Explore more work <Sparkle size="0.7em" weight="regular" />
        </h2>

        {/* Reuses the exact CaseStudyCard classes/markup (media on top,
            compact body below) so a project's "next up" preview here looks
            and feels identical to how it appears in the landing grid,
            instead of its own bespoke side-by-side layout. */}
        <Link to={to} data-cursor-label="Open case study" className="case-study-card-wrapper next-project-card-wrapper" style={{ maxWidth: 400 }}>
          <div className="case-study-card next-project-card">
            {(video || lottie || image) && (
              <div
                className={`case-study-card-media aspect-4-3${!bgColor && category ? ` case-study-card-media--${category}` : ''}`}
                style={{
                  background: bgColor ?? (category ? undefined : 'transparent'),
                  padding: mediaPadding ? `${(mediaPadding / 400) * 100}%` : undefined,
                  overflow: 'hidden',
                  boxShadow: 'none',
                }}
              >
                {video ? (
                  <PreviewVideo src={video} poster={poster} restTime={restTime} zoom={mediaZoom} objectFit={objectFit} />
                ) : lottie ? (
                  <PreviewLottie src={lottie} restTime={restTime} zoom={mediaZoom} objectFit={objectFit} />
                ) : (
                  <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                  />
                )}
              </div>
            )}

            <div className="case-study-card-body">
              <h3 className="case-study-card-title">{title}</h3>
              {company && <span className="case-study-card-company">at {company}</span>}
              {description && <p className="case-study-card-description">{description}</p>}
              {tags && tags.length > 0 && (
                <div className="case-study-card-tags">
                  {tags.map(tag => (
                    <span key={tag} className="case-study-card-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}
