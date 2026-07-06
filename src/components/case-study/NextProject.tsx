import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'

interface NextProjectProps {
  title: string
  to: string
  description?: string
  image?: string
  video?: string
  poster?: string
  lottie?: string
  restTime?: number
  mediaPadding?: number
}

// Paused by default, plays on hover — same behavior as the case study heroes.
function PreviewVideo({ src, poster, restTime = 0 }: { src: string; poster?: string; restTime?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDesktop] = useState(() => window.matchMedia('(hover: hover)').matches)

  const handleLoadedMetadata = () => {
    const vid = videoRef.current
    if (vid) vid.currentTime = restTime
  }
  const handleMouseEnter = () => { if (isDesktop) videoRef.current?.play().catch(() => {}) }
  const handleMouseLeave = () => {
    if (!isDesktop) return
    const vid = videoRef.current
    if (vid) { vid.pause(); vid.currentTime = restTime }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      onLoadedMetadata={handleLoadedMetadata}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: '100%', display: 'block' }}
    />
  )
}

function PreviewLottie({ src, restTime = 0 }: { src: string; restTime?: number }) {
  const [data, setData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [isDesktop] = useState(() => window.matchMedia('(hover: hover)').matches)

  useEffect(() => {
    fetch(src).then(r => r.json()).then(setData).catch(() => {})
  }, [src])

  useEffect(() => {
    if (!data) return
    const id = requestAnimationFrame(() => { lottieRef.current?.goToAndStop(restTime * 1000, false) })
    return () => cancelAnimationFrame(id)
  }, [data, restTime])

  const handleMouseEnter = () => { if (isDesktop) lottieRef.current?.play() }
  const handleMouseLeave = () => { if (isDesktop) lottieRef.current?.goToAndStop(restTime * 1000, false) }

  return (
    <div className="w-full overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {data && (
        <Lottie lottieRef={lottieRef} animationData={data} loop autoplay={false} style={{ width: '100%', display: 'block' }} />
      )}
    </div>
  )
}

export default function NextProject({ title, to, description, image, video, poster, lottie, restTime, mediaPadding }: NextProjectProps) {
  return (
    <div style={{ paddingLeft: 32, paddingRight: 32, marginTop: 84 }}>
      <section
        className="max-w-[1080px] px-8 md:px-14"
        style={{
          borderTop: '1px solid rgba(30,75,154,0.2)',
          paddingTop: 48,
          paddingBottom: 84,
        }}
      >
        <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 16 }}>
          Next Project
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: (image || video || lottie) ? '1fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
            <Link to={to} data-cursor-label="Open case study" className="group inline-block">
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1.1, margin: '0 0 12px' }}>
                {title} <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              </h2>
              {description && (
                <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', maxWidth: 480, margin: 0 }}>
                  {description}
                </p>
              )}
            </Link>
          </motion.div>

          {(video || lottie || image) && (
            <Link to={to} tabIndex={-1} style={{ display: 'block' }}>
              <div style={{
                background: 'rgba(30,75,154,0.05)',
                border: '1px solid rgba(30,75,154,0.15)',
                padding: mediaPadding,
                overflow: 'hidden',
              }}>
                {video ? (
                  <PreviewVideo src={video} poster={poster} restTime={restTime} />
                ) : lottie ? (
                  <PreviewLottie src={lottie} restTime={restTime} />
                ) : (
                  <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                )}
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
