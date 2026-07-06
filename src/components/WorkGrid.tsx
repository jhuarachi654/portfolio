import { useEffect, useMemo, useState } from "react"
import CaseStudyCard from "./CaseStudyCard"
import WorkFilter from "./WorkFilter"
import { useScrollReveal } from "../hooks/useScrollReveal"

// ── Shared type ─────────────────────────────────────────────────────
export type CaseStudy = {
  title: string
  year?: number
  tags: string[]
  image: string
  video: string
  lottie?: string
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
}

// ── Data (newest → oldest) ───────────────────────────────────────────
const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Revenue Management",
    company: "PROS",
    tags: ["Enterprise", "AI", "Internship"],
    image: "/images/featured-work/featured-work-pros-rm.png",
    video: "",
    lottie: "/videos/Revenue-Management-Video.json",
    href: "/work/revenue-management",
    role: "Product Design Intern",
    description: "An enterprise airline pricing platform for major airlines. Redesigned the core workflow for new-hire and veteran analysts and handed off to engineering.",
    lottieStartTime: 1.5,
    dotField: true,
    dotLayout: 0,
    icon: "/PROS Logo.jpeg",
    cursorLabel: "Open case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "45%", label: "of analysts were newcomers" }, { stat: "2×", label: "mental models balanced in one UI" }],
    team: "UX Strategist · UX Researcher · PM",
    timeframe: "Jun – Aug 2025",
    problem: "Enterprise pricing software used by major airlines",
    outcome: "Redesigned the core workflow for new-hire and veteran airline pricing analysts; handed off to engineering",
  },
  {
    title: "Fare Finder",
    company: "PROS",
    tags: ["Enterprise", "Internship"],
    image: "/videos/Fare-Finder-Video-poster.png",
    video: "/videos/Fare-Finder-Video.webm",
    href: "/work/fare-finder",
    role: "Product Design Intern",
    description: "A flight exploration tool for everyday travelers. Designed the map-based feature for PROS's 130+ airline partners; bookings up 35%.",
    objectFit: "contain",
    mediaScale: 1.6,
    dotField: true,
    dotLayout: 0,
    icon: "/PROS Logo.jpeg",
    cursorLabel: "Open case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "45%", label: "drop in map abandonment" }, { stat: "35%", label: "increase in direct bookings" }, { stat: "30%", label: "improvement in fare findability" }],
    team: "PROS Product Team · 130+ airlines",
    timeframe: "Jun – Aug 2025",
    problem: "Flight exploration tool for everyday travelers",
    outcome: "Designed a map-based feature for PROS's 130+ airline partners; direct bookings up 35%",
  },
  {
    title: "Campaign Design",
    company: "Democratic National Committee",
    tags: ["Consumer", "Internship"],
    image: "/images/featured-work/featured-work-11-hmQDs6.png",
    video: "",
    lottie: "/videos/DNC-Video.json",
    href: "/work/democratic-national-committee",
    role: "Digital Design Intern",
    description: "Digital design for Biden-Harris and Democratic party initiatives. Turned around 18 same-day assets during an active presidential campaign; posts hit 5,500+ likes.",
    objectFit: "contain",
    mediaScale: 1.5,
    dotField: true,
    dotLayout: 1,
    icon: "/DNC Logo.svg.png",
    cursorLabel: "Open case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "18", label: "same-day turnarounds" }, { stat: "5,500", label: "likes across Instagram & TikTok" }],
    team: "Digital Design Team",
    timeframe: "Jun – Sep 2023",
    problem: "Digital design for Biden-Harris and Democratic party initiatives",
    outcome: "18 assets turned around same-day during an active presidential campaign; posts hit 5,500+ likes",
  },
  {
    title: "Corpus Platform",
    company: "Expert.ai",
    tags: ["Enterprise", "Accessibility", "Internship"],
    image: "/videos/expert.ai-Video-poster.png",
    video: "/videos/expert.ai-Video.webm",
    href: "/work/expert-ai",
    role: "Product Design Intern",
    description: "An AI text analysis platform for enterprise teams. Redesigned filtering for accessibility; task time dropped from 2 min to 30s.",
    objectFit: "contain",
    mediaPadding: 16,
    dotField: true,
    dotLayout: 2,
    icon: "/expert.ai Logo.png",
    cursorLabel: "Open case study",
    projectType: "Internship",
    status: "Handed Off",
    metrics: [{ stat: "30s", label: "task time (down from 2 min)" }, { stat: "42%", label: "fewer support tickets after ship" }],
    team: "UX Team",
    timeframe: "2022",
    problem: "AI text analysis platform for enterprise teams",
    outcome: "Redesigned filtering for accessibility; task time dropped from 2 min to 30s",
  },
  {
    title: "Popple",
    tags: ["AI", "Solo"],
    image: "/videos/Popple-Video-poster.png",
    video: "/videos/Popple-Video.webm",
    href: "https://popple.pages.dev/",
    role: "Design Engineer",
    description: "An app that makes completed tasks tangible and collectible. Designed, built, and shipped solo, end to end.",
    objectFit: "contain",
    mediaScale: 1.5,
    aspectRatio: "4/3",
    dotField: true,
    dotLayout: 2,
    lottieStartTime: 8.79,
    icon: "/Popple Logo.png",
    cursorLabel: "Open live site",
    projectType: "Side Project",
    status: "Shipped",
    metrics: [{ stat: "Solo", label: "Designed, built & shipped" }, { stat: "Live", label: "Deployed with Cloudflare R2" }],
    team: "Solo",
    timeframe: "2025 – Present",
    problem: "App that makes completed tasks tangible and collectible",
    outcome: "Solo: designed, built, and shipped end to end",
  },
  {
    title: "Love Lives in SF",
    tags: ["Consumer", "Internship"],
    image: "/videos/llsf-Video-poster.png",
    video: "/videos/llsf-Video.webm",
    href: "https://lovelivesinsf.org/",
    role: "Visual Design Intern",
    description: "Website for SF's public art programming. Designed as the sole designer; traffic grew 35% in the first 30 days.",
    objectFit: "contain",
    mediaPadding: 16,
    dotField: true,
    dotLayout: 1,
    icon: "/LLSF Logo.avif",
    cursorLabel: "Open live site",
    projectType: "Internship",
    status: "Shipped",
    metrics: [{ stat: "35%", label: "traffic increase in 30 days" }, { stat: "3 min", label: "avg session duration" }, { stat: "8", label: "user interviews" }],
    team: "Sole Designer",
    timeframe: "Jan – May 2026",
    problem: "Website for SF public art programming",
    outcome: "Sole designer; site saw 35% more traffic in the first 30 days",
  },
  {
    title: "SnapSplit",
    tags: ["Consumer", "Freelance"],
    image: "/videos/SnapSplit-Video-poster.png",
    video: "/videos/SnapSplit-Video.webm",
    href: "/work",
    role: "Freelance Designer",
    description: "A bill-splitting app for friend groups. Rebranded and redesigned; cut the core task from 4 min to 30s.",
    objectFit: "contain",
    mediaScale: 1.5,
    aspectRatio: "4/3",
    dotField: true,
    dotLayout: 3,
    icon: "🫰",
    iconIsEmoji: true,
    comingSoon: true,
    cursorLabel: "Case study coming soon",
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
function useNumCols() {
  const get = () => window.innerWidth < 541 ? 1 : 2
  const [n, setN] = useState(get)
  useEffect(() => {
    const update = () => setN(get())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return n
}

function useIsMobile() {
  const get = () => window.innerWidth < 768
  const [v, setV] = useState(get)
  useEffect(() => {
    const update = () => setV(get())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return v
}

export default function WorkGrid() {
  const isMobile = useIsMobile()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const numCols = useNumCols()
  const headingRef = useScrollReveal<HTMLHeadingElement>()

  const FILTER_EXCLUDE = new Set(["Internship", "Solo", "Freelance"])
  const allTags = useMemo(() => {
    const count = new Map<string, number>()
    CASE_STUDIES.forEach(s => s.tags.forEach(t => { if (!FILTER_EXCLUDE.has(t)) count.set(t, (count.get(t) ?? 0) + 1) }))
    return [...count.entries()].map(([t]) => t).sort()
  }, [])

  const filtered = useMemo(() =>
    selectedTags.length === 0
      ? CASE_STUDIES
      : CASE_STUDIES.filter(s => selectedTags.some(t => s.tags.includes(t))),
    [selectedTags]
  )

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev[0] === tag ? [] : [tag])

  const clearTags = () => setSelectedTags([])

  return (
    <>
      <section className="work-grid-section">
        <div className="work-grid-header">
          <h2 ref={headingRef} className="work-grid-heading reveal">Featured Work</h2>
        </div>

        <div className="work-controls">
          <WorkFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            onClearAll={clearTags}
          />
        </div>

        <div className="work-masonry">
          {filtered.length > 0 ? (() => {
            const cols: { study: CaseStudy; globalIdx: number }[][] = Array.from({ length: numCols }, () => [])
            filtered.forEach((s, i) => cols[i % numCols].push({ study: s, globalIdx: i }))
            return cols.map((col, ci) => (
              <div key={ci} className="work-masonry-col">
                {col.map(({ study: s, globalIdx }) => (
                  <CaseStudyCard
                    key={s.title}
                    index={globalIdx}
                    title={s.title}
                    year={s.year}
                    tags={s.tags}
                    image={s.image}
                    video={s.video}
                    lottie={s.lottie}
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
                    cursorIcon={s.iconIsEmoji ? undefined : s.icon}
                    cursorIconIsEmoji={s.iconIsEmoji}
                    projectType={s.projectType}
                    status={s.status}
                    metrics={s.metrics}
                    team={s.team}
                    timeframe={s.timeframe}
                    problem={s.problem}
                    outcome={s.outcome}
                    company={s.company}
                  />
                ))}
              </div>
            ))
          })() : (
            <div className="work-empty">
              <p>No projects match these filters.</p>
              <button onClick={clearTags} className="work-empty-reset">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
