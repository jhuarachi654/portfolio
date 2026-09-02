import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Envelope, LinkedinLogo, Note } from "@phosphor-icons/react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"
  const isCaseStudy = location.pathname.startsWith("/work/")
  // "Works" is active on the home page once the featured-work grid has
  // scrolled into view, tracked via IntersectionObserver below — otherwise
  // clicking Play never visibly leaves Home highlighted, and scrolling the
  // homepage's own case-study masonry into view never highlights Works.
  const [worksInView, setWorksInView] = useState(false)
  const isWorksActive = isCaseStudy || (isHome && worksInView)
  const isAboutActive = location.pathname === "/about"
  const isPlayActive = location.pathname === "/play"

  const navRef = useRef<HTMLElement>(null)
  const homeRef = useRef<HTMLAnchorElement>(null)
  const worksRef = useRef<HTMLAnchorElement>(null)
  const aboutRef = useRef<HTMLAnchorElement>(null)
  const playRef = useRef<HTMLAnchorElement>(null)
  const [pillStyle, setPillStyle] = useState<{ x: number; width: number } | null>(null)

  useEffect(() => {
    if (!isHome) { setWorksInView(false); return }
    const el = document.getElementById("featured-work")
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setWorksInView(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isHome, location.pathname])

  useEffect(() => {
    const activeRef = isWorksActive ? worksRef
      : isAboutActive ? aboutRef
      : isPlayActive ? playRef
      : (isHome && !worksInView) ? homeRef
      : null
    const navEl = navRef.current
    const targetEl = activeRef?.current
    if (!navEl || !targetEl) { setPillStyle(null); return }
    const navRect = navEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()
    const PILL_PAD = 12
    setPillStyle({ x: targetRect.left - navRect.left - PILL_PAD, width: targetRect.width + PILL_PAD * 2 })
  }, [isHome, isWorksActive, isAboutActive, isPlayActive, worksInView])

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120)
    }
  }

  const handleWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) {
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
      <nav className="sidebar-pill-nav" ref={navRef} style={{ position: "relative" }}>
        {pillStyle && (
          <motion.span
            className="nav-active-pill nav-active-pill--shared"
            animate={{ x: pillStyle.x, width: pillStyle.width }}
            transition={{ type: "spring", stiffness: 500, damping: 38 }}
          />
        )}
        <a ref={homeRef} href="/" onClick={handleHome} className={`nav-link${isHome && !worksInView ? " active" : ""}`}>
          <span>Home</span>
        </a>
        <a ref={worksRef} href="/#featured-work" onClick={handleWorks} className={`nav-link${isWorksActive ? " active" : ""}`}>
          <span>Works</span>
        </a>
        <NavLink ref={aboutRef} to="/about" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>About</span>
        </NavLink>
        <NavLink ref={playRef} to="/play" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>Play</span>
        </NavLink>
      </nav>

      <div className="sidebar-pill-divider" />

      <div className="flex items-center gap-2">
        <a href="https://www.linkedin.com/in/johanna-huarachi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
          <LinkedinLogo size={24} weight="regular" />
        </a>
        <a href="mailto:johanna.s.huarachi@gmail.com" aria-label="Email" className="icon-btn">
          <Envelope size={24} weight="regular" />
        </a>
        <a
          href="https://rxresu.me/jhuarachi654/huarachi-designer-resume"
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
