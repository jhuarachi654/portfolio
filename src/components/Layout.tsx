import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import CaseStudySidebar from './CaseStudySidebar'
import MobileNav from './MobileNav'
import { TocProvider } from '../contexts/CaseStudyTocContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const isCaseStudy = pathname.startsWith('/work/')

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
