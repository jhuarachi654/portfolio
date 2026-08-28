import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToc } from '../contexts/CaseStudyTocContext'

export default function CaseStudySidebar() {
  const { sections } = useToc()
  const [activeId, setActiveId] = useState<string>('')
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // Single marker that slides between items — measured against the active
  // link's own offset rather than swapped in/out per item, so it reads as
  // one asterisk flowing down the list instead of popping between rows.
  useEffect(() => {
    const list = listRef.current
    const activeLink = linkRefs.current[activeId]
    if (!list || !activeLink) { setMarker(null); return }
    setMarker({ top: activeLink.offsetTop, height: activeLink.offsetHeight })
  }, [activeId, sections])

  return (
    <aside className="case-study-sidebar">

      {/* ── Top: back to home ── */}
      <div>
        <Link
          to="/"
          className="case-study-sidebar-home"
        >
          <span>← Home</span>
        </Link>
      </div>

      {/* ── Middle: table of contents ── */}
      <nav className="flex-1 flex flex-col gap-4">
        <div style={{ position: 'relative' }}>
          {marker !== null && (
            <span
              className="case-study-toc-active-marker"
              aria-hidden="true"
              style={{ top: marker.top, height: marker.height }}
            />
          )}
          <ul ref={listRef} className="case-study-toc-list flex flex-col gap-1 list-none m-0 p-0">
            {sections.map(({ id, label }) => {
              const isActive = activeId === id
              return (
                <li key={id}>
                  <a
                    ref={el => { linkRefs.current[id] = el }}
                    href={`#${id}`}
                    className={`case-study-toc-link${isActive ? ' active' : ''}`}
                    onClick={e => {
                      e.preventDefault()
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span>{label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

    </aside>
  )
}
