export type ViewMode = "grid" | "deck"

const ICONS: Record<ViewMode, JSX.Element> = {
  grid: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" rx="0.5" fill="currentColor"/>
      <rect x="8" y="1" width="5" height="5" rx="0.5" fill="currentColor"/>
      <rect x="1" y="8" width="5" height="5" rx="0.5" fill="currentColor"/>
      <rect x="8" y="8" width="5" height="5" rx="0.5" fill="currentColor"/>
    </svg>
  ),
  deck: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="10" height="7" rx="0.5" fill="currentColor" opacity="0.3"/>
      <rect x="1" y="2.5" width="10" height="7" rx="0.5" fill="currentColor" opacity="0.6" transform="translate(0.5 0)"/>
      <rect x="2" y="1" width="10" height="7" rx="0.5" fill="currentColor"/>
    </svg>
  ),
}

const LABELS: Record<ViewMode, string> = {
  grid: "Grid view",
  deck: "Deck view",
}

interface Props {
  current: ViewMode
  onChange: (v: ViewMode) => void
}

export default function ViewSwitcher({ current, onChange }: Props) {
  return (
    <div className="view-switcher" role="group" aria-label="View mode">
      {(["grid", "deck"] as ViewMode[]).map(v => (
        <button
          key={v}
          className={`view-switcher-btn${current === v ? " is-active" : ""}`}
          onClick={() => onChange(v)}
          aria-pressed={current === v}
          aria-label={LABELS[v]}
          title={LABELS[v]}
        >
          {ICONS[v]}
        </button>
      ))}
    </div>
  )
}
