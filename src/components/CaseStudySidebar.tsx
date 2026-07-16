import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToc } from '../contexts/CaseStudyTocContext'

export default function CaseStudySidebar() {
  const { sections, title } = useToc()
  const [activeId, setActiveId] = useState<string>('')

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

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
        {title && (
          <p
            className="case-study-sidebar-title"
            style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 18, fontWeight: 600, color: 'var(--color-cs-heading)', margin: '0 0 4px', padding: '0 12px' }}
          >
            {title}
          </p>
        )}
        <ul className="case-study-toc-list flex flex-col gap-1 list-none m-0 p-0">
          {sections.map(({ id, label }, i) => {
            const isActive = activeId === id
            return (
              <li key={id}>
                <a
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
      </nav>

      {/* ── Bottom: back to top ── */}
      <div>
        <button
          onClick={scrollToTop}
          className="case-study-sidebar-home bg-transparent border-0 cursor-pointer p-0"
          style={{ width: 'fit-content' }}
        >
          <span>↑ Back to top</span>
        </button>
      </div>

    </aside>
  )
}
