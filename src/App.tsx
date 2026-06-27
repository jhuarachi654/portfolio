import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import PlayPage from "./pages/PlayPage";
import DrawPage from "./pages/DrawPage";
import ContactPage from "./pages/ContactPage";
import FareFinderPage from "./pages/work/FareFinderPage";
import RevenueManagementPage from "./pages/work/RevenueManagementPage";
import DNCPage from "./pages/work/DNCPage";
import ExpertAIPage from "./pages/work/ExpertAIPage";


function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/draw" element={<DrawPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/work/fare-finder" element={<FareFinderPage />} />
        <Route path="/work/revenue-management" element={<RevenueManagementPage />} />
        <Route path="/work/democratic-national-committee" element={<DNCPage />} />
        <Route path="/work/expert-ai" element={<ExpertAIPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("loading", !loaded)
  }, [loaded])

  return (
    <ThemeProvider>
      <Analytics />
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <BrowserRouter>
        <ScrollToTop />
        <CustomCursor />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
