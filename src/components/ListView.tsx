import { Link } from "react-router-dom"
import { useState } from "react"
import type { CaseStudy } from "./WorkGrid"

export default function ListView({ studies }: { studies: CaseStudy[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="list-view">

      {/* Hover preview — floats right on desktop */}
      <div className={`list-preview${hovered !== null ? " is-visible" : ""}`}>
        {studies.map((s, i) => (
          <div
            key={s.title}
            className={`list-preview-img${hovered === i ? " is-active" : ""}`}
          >
            <img src={s.image} alt={s.title} />
          </div>
        ))}
      </div>

      {/* Row list */}
      <ol className="list-items">
        {studies.map((s, i) => {
          const row = (
            <div
              className={`list-row${hovered === i ? " is-hovered" : ""}${s.comingSoon ? " is-muted" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="list-row-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="list-row-title">{s.title}</span>
              <span className="list-row-role">{s.role}</span>
              {s.comingSoon && <span className="list-row-soon">Soon</span>}
            </div>
          )

          return (
            <li key={s.title}>
              {s.comingSoon
                ? row
                : <Link to={s.href} className="list-row-link">{row}</Link>
              }
            </li>
          )
        })}
      </ol>
    </div>
  )
}
