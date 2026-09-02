import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import CaseStudyCard from "./CaseStudyCard"

// ── Shared type ─────────────────────────────────────────────────────
export type CaseStudy = {
  title: string
  landingTitle?: string
  year?: number
  tags: string[]
  image: string
  video: string
  lottie?: string
  bgLottie?: string
  href: string
  comingSoon?: boolean
  role?: string
  description?: string
  objectFit?: "cover" | "contain"
  objectPosition?: string
  bgColor?: string
  aspectRatio?: "16/9" | "4/3" | "3/4" | "1/1"
  mediaPadding?: number
  mediaScale?: number
  lottieStartTime?: number
  dotField?: boolean
  dotColor?: string
  dotLayout?: number
  icon?: string
  iconIsEmoji?: boolean
  cursorLabel?: string
  projectType?: string
  status?: string
  metrics?: { stat: string; label: string }[]
  team?: string
  timeframe?: string
  problem?: string
  outcome?: string
  company?: string
  archived?: boolean
}

// ── Data (newest → oldest) ───────────────────────────────────────────
const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Revenue Management",
    landingTitle: "PROS — Revenue Management",
    company: "PROS",
    tags: ["Enterprise", "AI", "Pricing Systems"],
    image: "/images/featured-work/featured-work-pros-rm.png",
    video: "",
    lottie: "/videos/Revenue-Management-Video.json",
    href: "/work/revenue-management",
    role: "Product Design Intern",
    description: "Modernized UI and integrated AI features into an enterprise pricing and seat inventory platform for airline analysts.",
    bgColor: "#12213a",
    lottieStartTime: 1.5,
    mediaScale: 1.1,
    dotField: true,
    dotLayout: 0,
    icon: "/PROS Logo.jpeg",
    cursorLabel: "View case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "45%", label: "of analysts were newcomers" }, { stat: "2×", label: "mental models balanced in one UI" }],
    team: "UX Strategist · UX Researcher · PM",
    timeframe: "Jun – Aug 2025",
    problem: "Enterprise pricing software used by major airlines",
    outcome: "Redesigned the core workflow for new-hire and veteran airline pricing analysts; handed off to engineering",
  },
  {
    title: "BackStory",
    landingTitle: "IDEO — BackStory",
    company: "BackStory",
    tags: ["Consumer", "Misinformation", "Social Media"],
    image: "/videos/BackStory-Video-poster.png",
    video: "/videos/BackStory-Video.webm",
    lottieStartTime: 1,
    href: "/work/backstory",
    role: "Interaction Designer",
    description: "Backstory, a TikTok-native feature to counter misinformation that gives users the full context behind a piece of content.",
    bgColor: "rgba(30,75,154,0.06)",
    dotField: true,
    dotLayout: 0,
    cursorLabel: "View case study",
    projectType: "MDes Capstone",
    status: "In Progress",
    team: "[ Team ]",
    timeframe: "[ Timeframe ]",
    problem: "[ Problem placeholder ]",
    outcome: "[ Outcome placeholder ]",
  },
  {
    title: "Fare Finder",
    landingTitle: "PROS — Fare Finder",
    company: "PROS",
    tags: ["Enterprise", "Travel", "Booking Flows"],
    image: "/videos/Fare-Finder-Video-poster.png",
    video: "/videos/Fare-Finder-Video.webm",
    href: "/work/fare-finder",
    role: "Product Design Intern",
    description: "Revised the interactions for a flight map tool so everyday travelers can easily explore and book trips.",
    bgColor: "#003854",
    objectFit: "contain",
    mediaPadding: 16,
    mediaScale: 1.3,
    dotField: true,
    dotLayout: 0,
    icon: "/PROS Logo.jpeg",
    cursorLabel: "View case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "45%", label: "drop in map abandonment" }, { stat: "35%", label: "increase in direct bookings" }, { stat: "30%", label: "improvement in fare findability" }],
    team: "PROS Product Team · 130+ airlines",
    timeframe: "Jun – Aug 2025",
    problem: "Flight exploration tool for everyday travelers",
    outcome: "Designed a map-based feature for PROS's 130+ airline partners; direct bookings up 35%",
  },
  {
    title: "Corpus Platform",
    landingTitle: "Expert.ai — Filter",
    company: "Expert.ai",
    tags: ["Enterprise", "Accessibility", "AI Filtering"],
    image: "/videos/expert.ai-Video-poster.png",
    video: "/videos/expert.ai-Video.webm",
    href: "/work/expert-ai",
    role: "Product Design Intern",
    description: "Redesigned the filtering system for an enterprise AI text analysis platform to improve usability and accessibility.",
    bgColor: "#c4ecff",
    objectFit: "contain",
    mediaPadding: 16,
    dotField: true,
    dotLayout: 2,
    icon: "/expert.ai Logo.png",
    cursorLabel: "View case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "30s", label: "task time (down from 2 min)" }, { stat: "42%", label: "fewer support tickets after ship" }],
    team: "UX Team",
    timeframe: "2022",
    problem: "AI text analysis platform for enterprise teams",
    outcome: "Redesigned filtering for accessibility; task time dropped from 2 min to 30s",
  },
  {
    title: "Campaign Design",
    landingTitle: "Democrats — Campaign Design",
    company: "Democratic National Committee",
    tags: ["Consumer", "Civic Tech", "Campaign Design"],
    image: "/images/featured-work/featured-work-11-hmQDs6.png",
    video: "",
    lottie: "/videos/DNC-Video.json",
    lottieStartTime: 4,
    href: "/work/democratic-national-committee",
    role: "Digital Design Intern",
    description: "Created digital assets across social, ads, email, and events to support the Biden-Harris and Democrat campaign.",
    bgColor: "linear-gradient(135deg, #2b3a8f, #1a2358)",
    objectFit: "contain",
    mediaScale: 1.2,
    dotField: true,
    dotLayout: 1,
    icon: "/DNC Logo.svg.png",
    cursorLabel: "View case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "18", label: "same-day turnarounds" }, { stat: "5,500", label: "likes across Instagram & TikTok" }],
    team: "Digital Design Team",
    timeframe: "Jun – Sep 2023",
    problem: "Digital design for Biden-Harris and Democratic party initiatives",
    outcome: "18 assets turned around same-day during an active presidential campaign; posts hit 5,500+ likes",
  },
  {
    archived: true,
    title: "SnapSplit",
    landingTitle: "SnapSplit — Flow Redesign",
    company: "SnapSplit",
    tags: ["Consumer", "Fintech", "Billing UX"],
    image: "/videos/SnapSplit-Video-poster.png",
    video: "/videos/SnapSplit-Video.webm",
    href: "/work/snapsplit",
    role: "Freelance Designer",
    description: "Redesigned the branding and optimized bill-splitting flows to help users split with less friction at fintech start-up.",
    bgColor: "#8fd9c4",
    objectFit: "cover",
    aspectRatio: "4/3",
    dotField: true,
    dotLayout: 3,
    icon: "🫰",
    iconIsEmoji: true,
    cursorLabel: "View case study",
    projectType: "Freelance",
    status: "Shipped",
    metrics: [{ stat: "30s", label: "core task time (from 4 min)" }, { stat: "40%", label: "reduction in abandonment" }, { stat: "11", label: "users tested" }],
    team: "Sole Designer + Dev Team",
    timeframe: "Dec 2023 – Sep 2024",
    problem: "Bill-splitting app for friend groups",
    outcome: "Rebrand and redesign that cut the core task from 4 min to 30s",
  },
]

// ── Hooks ────────────────────────────────────────────────────────────
export function useNumCols() {
  const get = () => window.innerWidth < 541 ? 1 : 2
  const [n, setN] = useState(get)
  useEffect(() => {
    const update = () => setN(get())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return n
}

const VISIBLE_COUNT = 4

export default function WorkGrid() {
  const numCols = useNumCols()
  const [showAll, setShowAll] = useState(false)

  const visibleStudies = CASE_STUDIES.filter(s => !s.archived)
  const studiesToShow = showAll ? visibleStudies : visibleStudies.slice(0, VISIBLE_COUNT)
  const hasMore = visibleStudies.length > VISIBLE_COUNT

  return (
    <>
      <section className="work-grid-section">
        <div className="work-masonry">
          {studiesToShow.length > 0 ? (() => {
            const cols: { study: CaseStudy; globalIdx: number }[][] = Array.from({ length: numCols }, () => [])
            studiesToShow.forEach((s, i) => cols[i % numCols].push({ study: s, globalIdx: i }))
            return cols.map((col, ci) => (
              <div key={ci} className="work-masonry-col">
                <AnimatePresence initial={false}>
                {col.map(({ study: s, globalIdx }) => (
                  <motion.div
                    key={s.title}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 28 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                  <CaseStudyCard
                    index={globalIdx}
                    title={s.title}
                    landingTitle={s.landingTitle}
                    year={s.year}
                    tags={s.tags}
                    image={s.image}
                    video={s.video}
                    lottie={s.lottie}
                    bgLottie={s.bgLottie}
                    href={s.href}
                    comingSoon={s.comingSoon}
                    role={s.role}
                    description={s.description}
                    aspectRatio={s.aspectRatio ?? "16/9"}
                    objectFit={s.objectFit}
                    objectPosition={s.objectPosition}
                    bgColor={s.bgColor}
                    mediaPadding={s.mediaPadding}
                    mediaScale={s.mediaScale}
                    lottieStartTime={s.lottieStartTime}
                    dotField={s.dotField}
                    dotColor={s.dotColor}
                    dotLayout={s.dotLayout}
                    cursorLabel={s.cursorLabel}
                    projectType={s.projectType}
                    status={s.status}
                    metrics={s.metrics}
                    team={s.team}
                    timeframe={s.timeframe}
                    problem={s.problem}
                    outcome={s.outcome}
                    company={s.company}
                  />
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            ))
          })() : null}
        </div>
        {hasMore && (
          <motion.div layout transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32, overflow: 'hidden' }}>
            <button
              onClick={() => setShowAll(v => !v)}
              className="work-grid-load-more"
              style={{
                position: 'relative',
                border: '1px solid rgba(var(--color-navy-rgb),0.2)',
                borderRadius: 8,
                padding: '10px 24px',
                background: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                fontSize: 15,
                color: 'var(--color-cs-heading)',
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={showAll ? 'less' : 'more'}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  {showAll ? 'Show less' : 'Load more'}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.div>
        )}
      </section>
    </>
  )
}
