import { Play, Pause } from "@phosphor-icons/react"

interface PlayPauseButtonProps {
  playing: boolean
  onToggle: () => void
  label?: string
}

export default function PlayPauseButton({ playing, onToggle, label = "video" }: PlayPauseButtonProps) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onToggle() }}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      className="cs-hero-playpause"
    >
      {playing ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
    </button>
  )
}
