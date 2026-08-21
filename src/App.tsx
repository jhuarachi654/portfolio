import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
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
import SnapSplitPage from "./pages/work/SnapSplitPage";
import BackStoryPage from "./pages/work/BackStoryPage";
import NotFoundPage from "./pages/NotFoundPage";


function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// True crossfade: the outgoing page stays mounted and fades out while the
// incoming one fades in over it, rather than a hard cut (Routes swapping
// synchronously) or a fade-out-then-fade-in with a gap (AnimatePresence's
// "wait" mode). Absolute-positioning the exiting page during its exit keeps
// it from pushing the incoming page's layout down while both are mounted.
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, position: "absolute", inset: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
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
          <Route path="/work/snapsplit" element={<SnapSplitPage />} />
          <Route path="/work/backstory" element={<BackStoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Analytics />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
