import { useState, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Play", to: "/play" },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1200)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1200)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const close = () => {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 220)
  }

  // Closing on scroll is deliberate: if someone opens the menu, changes
  // their mind, and scrolls the page instead, the menu should get out of
  // the way rather than stay pinned over content they're now scrolling past.
  useEffect(() => {
    if (!open) return
    const handleScroll = () => close()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [open])

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault()
    close()
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120)
    }
  }

  const handleWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    close()
    if (location.pathname === "/") {
      document.getElementById("featured-work")?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => {
        document.getElementById("featured-work")?.scrollIntoView({ behavior: "smooth" })
      }, 120)
    }
  }

  // Desktop: sidebar handles nav
  if (isDesktop) return null

  return (
    <>
      {!open && (
        <button
          className="mobile-nav-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
      )}

      {open && (
        <>
          <div
            className={`nav-overlay${closing ? " is-closing" : ""}`}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 48 }}
          />
          <nav className={`mobile-nav-panel${closing ? " is-closing" : ""}`}>
            <button className="mobile-nav-close" onClick={close} aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            <div className="mobile-nav-links">
              <a href="/" onClick={handleHome} className="mobile-nav-link">Home</a>
              <a href="/#featured-work" onClick={handleWorks} className="mobile-nav-link">Works</a>
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={close}
                  className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="mobile-nav-divider" />

            <div className="mobile-nav-links mobile-nav-links--small">
              <a
                href="https://www.linkedin.com/in/johanna-huarachi"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-link mobile-nav-link--small"
              >
                Linkedin
              </a>
              <a href="mailto:johanna.s.huarachi@gmail.com" className="mobile-nav-link mobile-nav-link--small">Email</a>
              <a
                href="https://docs.google.com/document/d/1ak7ln9627ek1KxQODL-yZ3cQLpjccrpHin7fv6HP_qg/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mobile-nav-link mobile-nav-link--small"
              >
                Resume
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
