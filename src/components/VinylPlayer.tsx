import { useState, useRef } from "react"

interface Props {
  src: string
  albumArt?: string
  size?: number
}

export default function VinylPlayer({ src, albumArt, size = 160 }: Props) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(p => !p)
  }

  return (
    <div
      className={`vinyl-player${playing ? " is-playing" : ""}`}
      style={{ width: size, height: size }}
      onClick={toggle}
      role="button"
      aria-label={playing ? "Pause music" : "Play music"}
      tabIndex={0}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggle()}
    >
      <audio ref={audioRef} src={src} loop />

      {/* Disc */}
      <div className="vinyl-disc">
        {albumArt && (
          <div className="vinyl-label">
            <img src={albumArt} alt="" />
          </div>
        )}
        <div className="vinyl-center-hole" />
      </div>

      {/* Tonearm */}
      <div className="vinyl-arm-wrap">
        <div className="vinyl-arm-pivot" />
        <div className="vinyl-arm-rod" />
      </div>
    </div>
  )
}
