import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import CaseStudySidebar from './CaseStudySidebar'
import MobileNav from './MobileNav'
import { TocProvider } from '../contexts/CaseStudyTocContext'

interface LayoutProps {
  children: React.ReactNode
}

function useGlobalReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
      if (!els.length) return
      const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-visible"); obs.unobserve(e.target) }
        }),
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      )
      els.forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }
    // Small delay so new page's DOM is painted
    const t = setTimeout(observe, 60)
    return () => clearTimeout(t)
  }, [pathname])
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const isCaseStudy = pathname.startsWith('/work/')
  useGlobalReveal()

  return (
    <TocProvider>
      <div className="min-h-screen">
        {isCaseStudy ? <CaseStudySidebar /> : <Sidebar />}
        <MobileNav />
        <div className="main-content flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </TocProvider>
  )
}
