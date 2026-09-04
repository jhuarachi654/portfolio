import { useRef, useState, useEffect } from 'react'
import PlayPauseButton from '../PlayPauseButton'

interface HeroMediaProps {
  video: string
  poster: string
  bgColor: string
  borderColor?: string
  objectFit?: 'contain' | 'cover'
  scale?: number
  padding?: number
}

// Shared by every case study hero and driven by the same objectFit/scale/
// padding values as that project's WorkGrid landing card, so the two never
// drift out of sync the way each page's hand-rolled hero used to.
export default function HeroMedia({
  video,
  poster,
  bgColor,
  borderColor = '#d1d1d1',
  objectFit = 'contain',
  scale,
  padding = 16,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const handleToggle = () => {
    const vid = videoRef.current
    if (!vid) return
    if (playing) vid.pause()
    else vid.play().catch(() => {})
  }

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const playPromise = vid.play()
    if (playPromise !== undefined) playPromise.catch(() => {})
  }, [])

  return (
    <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
      <div style={{ background: bgColor, borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', padding, border: `1px solid ${borderColor}` }}>
        <video
          ref={videoRef}
          src={video}
          poster={poster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{ width: '100%', height: '100%', display: 'block', objectFit, ...(scale ? { transform: `scale(${scale})` } : {}) }}
        />
        <PlayPauseButton playing={playing} onToggle={handleToggle} />
      </div>
    </div>
  )
}
