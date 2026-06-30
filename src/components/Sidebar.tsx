import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
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

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()

  const handleWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === "/") {
      document.getElementById("featured-work")?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => {
        document.getElementById("featured-work")?.scrollIntoView({ behavior: "smooth" })
      }, 120)
    }
  }

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          to="/"
          className="flex items-center gap-2 text-navy no-underline"
                    style={{ textDecoration: "none" }}
          onClick={e => {
            e.preventDefault()
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
              navigate("/")
              setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120)
            }
          }}
        >
          <img
            src="/Johanna Profile Picture.png"
            alt="Johanna Huarachi"
            style={{ width: 32, height: 32, objectFit: "cover", objectPosition: "top", flexShrink: 0 }}
          />
          <span className="font-sans text-[14px] font-semibold leading-tight whitespace-nowrap">
            Johanna Huarachi
          </span>
        </Link>
        <button
          onClick={toggle}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="icon-btn"
          style={{ flexShrink: 0 }}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5">
        <a href="/#featured-work" onClick={handleWorks} className="nav-link">
          <span>Works</span>
        </a>
        <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>About</span>
        </NavLink>
        <NavLink to="/play" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>Play</span>
        </NavLink>
        <NavLink to="/draw" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>Drawing Board</span>
        </NavLink>
      </nav>

      <div className="flex flex-col gap-3">
        <p className="font-sans text-[14px] leading-relaxed text-navy">
          First-gen. Humanities-trained. I design for the people these systems usually miss.
        </p>
        <p className="font-sans text-[14px] text-navy">
          Design Prev. @ PROS & DNC
        </p>

        <div className="flex items-center gap-2">
          <a href="mailto:jhuarachi654@gmail.com" aria-label="Email" className="icon-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 4 10 9 10-9" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/johanna-huarachi"
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
          href="https://drive.google.com/file/d/1i5BMnL9dF8lv1CjTIwBDqzOtvkcd779x/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-resume w-full"
        >
          <span>Resume</span>
        </a>
      </div>
    </aside>
  )
}
