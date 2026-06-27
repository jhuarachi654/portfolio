import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)

function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const str = time.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: "America/Los_Angeles", timeZoneName: "short",
  })
  return (
    <span className="live-clock">
      <span className="live-clock-dot" />
      {str}
    </span>
  )
}

const NAV_LINKS = [
  { label: "Works", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Playground", to: "/play" },
  { label: "Drawing Board", to: "/draw" },
]

export default function MobileNav() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1200)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1200)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const close = () => setOpen(false)

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

  // Desktop: sidebar handles nav + toggle
  if (isDesktop) return null

  return (
    <>
      {/* Top bar — mobile/tablet only */}
      <header
        className="mobile-nav"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: 56, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
          background: theme === "dark" ? "#0A1118" : "#fff",
          borderBottom: theme === "dark" ? "1px solid rgba(168,190,232,0.08)" : "1px solid rgba(30,75,154,0.1)",
        }}
      >
        <Link to="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img
            src="/Johanna Profile Picture.png"
            alt="Johanna Huarachi"
            style={{ width: 32, height: 32, objectFit: "cover", objectPosition: "top" }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "inherit", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>
            Johanna Huarachi
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={toggle}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="icon-btn"
            style={{ width: 32, height: 32 }}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "none", color: "inherit", padding: 4 }}
          >
            {open
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            }
          </button>
        </div>
      </header>

      {open && (
        <>
          <div
            className="nav-overlay"
            onClick={close}
            style={{ position: "fixed", inset: 0, top: 56, zIndex: 48 }}
          />
          <nav
            className="nav-dropdown"
            style={{
              position: "fixed", top: 56, left: 0, right: 0, zIndex: 49,
              background: theme === "dark" ? "#0A1118" : "#fff",
              borderBottom: theme === "dark" ? "1px solid rgba(168,190,232,0.08)" : "1px solid rgba(30,75,154,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              padding: "24px 16px",
              display: "flex", flexDirection: "column", gap: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <a href="/#featured-work" onClick={handleWorks} className="nav-link">
                <span>Works</span>
              </a>
              {NAV_LINKS.slice(1).map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={close}
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(30,75,154,0.08)", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a href="mailto:johanna.huarachi@cca.edu" aria-label="Email" className="icon-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 4 10 9 10-9" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/johannahuarachi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="icon-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <a
                href="/Johanna_Huarachi_Resumee.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-resume"
              >
                <span>Resume</span>
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
