import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToc } from '../contexts/CaseStudyTocContext'

export default function CaseStudySidebar() {
  const { sections } = useToc()
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
    <aside className="sidebar">

      {/* ── Top: back to home ── */}
      <div>
        <Link
          to="/"
          className="nav-link"
          data-cursor-label="take me home ↩"
        >
          <span>← Home</span>
        </Link>
      </div>

      {/* ── Middle: table of contents ── */}
      <nav className="flex-1 flex flex-col gap-4">
        <p
          className="font-sans font-semibold tracking-[0.14em] uppercase px-2"
          style={{ fontSize: '10px', color: 'var(--color-secondary)', opacity: 0.6 }}
        >
          On this page
        </p>

        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {sections.map(({ id, label }, i) => {
            const isActive = activeId === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link${isActive ? ' active' : ''}`}
                  onClick={e => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span
                    className="font-mono tabular-nums mr-2 shrink-0 toc-num"
                    style={{
                      fontSize: '10px',
                      opacity: isActive ? 1 : 0.3,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}.
                  </span>
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
          className="nav-link bg-transparent border-0 cursor-pointer p-0"
          style={{ width: 'fit-content' }}
        >
          <span>↑ Back to top</span>
        </button>
      </div>

    </aside>
  )
}
