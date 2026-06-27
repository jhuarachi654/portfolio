import { useState } from "react"

export interface WorkFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export default function WorkFilter({ allTags, selectedTags, onTagToggle, onClearAll }: WorkFilterProps) {
  const [open, setOpen] = useState(false)
  const activeLabel = selectedTags.length > 0 ? selectedTags[0] : "All"

  const handleSelect = (tag: string | null) => {
    if (tag === null) onClearAll()
    else onTagToggle(tag)
    setOpen(false)
  }

  return (
    <>
      {/* ── Desktop: pill row ─────────────────────────────────────── */}
      <div className="work-filter-desktop" role="group" aria-label="Filter by skill">
        <button
          className="work-filter-pill work-filter-pill--all"
          onClick={onClearAll}
        >
          <span>All</span>
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`work-filter-pill${selectedTags.includes(tag) ? " is-active" : ""}`}
            onClick={() => onTagToggle(tag)}
            aria-pressed={selectedTags.includes(tag)}
          >
            <span>{tag}</span>
          </button>
        ))}
      </div>

      {/* ── Mobile: dropdown ──────────────────────────────────────── */}
      <div className="work-filter-mobile">
        <button
          className="work-filter-dropdown-trigger"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          <span>{activeLabel}</span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="work-filter-dropdown">
            <button
              className="work-filter-dropdown-item"
              onClick={() => handleSelect(null)}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`work-filter-dropdown-item${selectedTags.includes(tag) ? " is-active" : ""}`}
                onClick={() => handleSelect(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
