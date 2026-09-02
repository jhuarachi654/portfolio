import { useState, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { LinkedinLogo, EnvelopeSimple, FileText } from "@phosphor-icons/react"

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
    setTimeout(() => { setOpen(false); setClosing(false) }, 420)
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

  const menuOpen = open && !closing

  return (
    <>
      <button
        className={`mobile-nav-toggle mobile-nav-toggle--dark${menuOpen ? " is-open" : ""}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span className="mobile-nav-toggle-bar" />
        <span className="mobile-nav-toggle-bar" />
        <span className="mobile-nav-toggle-bar" />
      </button>

      {open && (
        <>
          <div
            className={`nav-overlay${closing ? " is-closing" : ""}`}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 48 }}
          />
          <nav className={`mobile-nav-panel${closing ? " is-closing" : ""}`}>
            <a href="/" onClick={handleHome} aria-label="Home">
              <img src="/favicon.svg" alt="" aria-hidden="true" className="mobile-nav-favicon" />
            </a>

            <div className="mobile-nav-links">
              <a href="/#featured-work" onClick={handleWorks} className={`mobile-nav-link${location.pathname === "/" ? " active" : ""}`}>
                {location.pathname === "/" && <span className="mobile-nav-active-marker" aria-hidden="true">*</span>}
                Works
              </a>
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={close}
                  className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="mobile-nav-active-marker" aria-hidden="true">*</span>}
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="mobile-nav-links mobile-nav-links--small">
              <a
                href="https://www.linkedin.com/in/johanna-huarachi"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-link--small"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={29} weight="regular" />
              </a>
              <a href="mailto:johanna.s.huarachi@gmail.com" className="mobile-nav-link--small" aria-label="Email">
                <EnvelopeSimple size={29} weight="regular" />
              </a>
              <a
                href="https://rxresu.me/jhuarachi654/huarachi-designer-resume"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mobile-nav-link--small"
                aria-label="Resume"
              >
                <FileText size={29} weight="regular" />
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
