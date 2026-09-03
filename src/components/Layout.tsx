import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import CaseStudySidebar from './CaseStudySidebar'
import MobileNav from './MobileNav'
import { TocProvider } from '../contexts/CaseStudyTocContext'

// Matches AnimatedRoutes' own crossfade duration in App.tsx — the sidebar
// swap (a completely different component, not just page content) is held
// back until the outgoing page has actually finished fading out, so the
// case-study sidebar/nav never appears stacked on top of the still-visible
// landing page mid-transition, which read as a jarring flash/pop.
const PAGE_TRANSITION_MS = 250

interface LayoutProps {
  children: React.ReactNode
}

function useGlobalReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-visible")
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
    )

    const observeNew = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach(el => io.observe(el))
    }

    // Initial observe after paint
    const t = setTimeout(observeNew, 60)

    // Re-observe whenever new [data-reveal] nodes are added (e.g. column reflow on resize)
    const mo = new MutationObserver(() => observeNew())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const isCaseStudy = pathname.startsWith('/work/')
  const [sidebarIsCaseStudy, setSidebarIsCaseStudy] = useState(isCaseStudy)
  useGlobalReveal()

  useEffect(() => {
    if (isCaseStudy === sidebarIsCaseStudy) return
    const t = setTimeout(() => setSidebarIsCaseStudy(isCaseStudy), PAGE_TRANSITION_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCaseStudy])

  return (
    <TocProvider>
      <div className="min-h-screen">
        {sidebarIsCaseStudy ? <CaseStudySidebar /> : <Sidebar />}
        <MobileNav />
        <div className={`main-content flex flex-col min-h-screen${isCaseStudy ? ' has-case-study-sidebar' : ''}`}>
          <main className="flex-1" style={{ position: "relative" }}>
            {children}
          </main>
        </div>
      </div>
    </TocProvider>
  )
}
