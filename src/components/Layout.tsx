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
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-visible")
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
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
