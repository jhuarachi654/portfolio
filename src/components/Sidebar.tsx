import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Envelope, LinkedinLogo, Note, PaintBrush } from "@phosphor-icons/react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120)
    }
  }

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
      <nav className="sidebar-pill-nav">
        <a href="/" onClick={handleHome} className="nav-link">
          <span>Home</span>
        </a>
        <a href="/#featured-work" onClick={handleWorks} className="nav-link">
          <span>Works</span>
        </a>
        <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>About</span>
        </NavLink>
        <NavLink to="/play" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>Play</span>
        </NavLink>
      </nav>

      <div className="sidebar-pill-divider" />

      <div className="flex items-center gap-2">
        <NavLink to="/draw" aria-label="Draw" className="icon-btn">
          <PaintBrush size={24} weight="regular" />
        </NavLink>
        <a href="https://www.linkedin.com/in/johanna-huarachi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
          <LinkedinLogo size={24} weight="regular" />
        </a>
        <a href="mailto:johanna.s.huarachi@gmail.com" aria-label="Email" className="icon-btn">
          <Envelope size={24} weight="regular" />
        </a>
        <a
          href="https://drive.google.com/file/d/1wNYUGBOmFI5eHhyiExuZbi1K_-uZcJlt/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Resume"
          className="icon-btn"
        >
          <Note size={24} weight="regular" />
        </a>
      </div>
    </aside>
  )
}
