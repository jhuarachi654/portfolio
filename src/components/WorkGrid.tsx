import { useEffect, useMemo, useState } from "react"
import { ArrowBendRightDown } from "@phosphor-icons/react"
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
    description: "Modernized an airline pricing and seat inventory platform for airline analysts.",
    bgColor: "#12213a",
    lottieStartTime: 1.5,
    mediaScale: 1.1,
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
    title: "Corpus Platform",
    company: "Expert.ai",
    tags: ["Enterprise", "Accessibility", "Internship"],
    image: "/videos/expert.ai-Video-poster.png",
    video: "/videos/expert.ai-Video.webm",
    href: "/work/expert-ai",
    role: "Product Design Intern",
    description: "Redesigned the filtering system for an AI text analysis platform to improve usability and accessibility.",
    bgColor: "#c4ecff",
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
    title: "Campaign Design",
    company: "Democratic National Committee",
    tags: ["Consumer", "Internship"],
    image: "/images/featured-work/featured-work-11-hmQDs6.png",
    video: "",
    lottie: "/videos/DNC-Video.json",
    href: "/work/democratic-national-committee",
    role: "Digital Design Intern",
    description: "Created digital assets across social, ads, email, and events to support the Biden-Harris and Democrat campaign.",
    bgColor: "linear-gradient(135deg, #2b3a8f, #1a2358)",
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
    title: "Fare Finder",
    company: "PROS",
    tags: ["Enterprise", "Internship"],
    image: "/videos/Fare-Finder-Video-poster.png",
    video: "/videos/Fare-Finder-Video.webm",
    href: "/work/fare-finder",
    role: "Product Design Intern",
    description: "Designed a map-based flight exploration tool to support everyday travelers.",
    bgColor: "#003854",
    objectFit: "contain",
    mediaPadding: 16,
    mediaScale: 1.3,
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
    title: "SnapSplit",
    company: "SnapSplit",
    tags: ["Consumer", "Freelance"],
    image: "/videos/SnapSplit-Video-poster.png",
    video: "/videos/SnapSplit-Video.webm",
    href: "/work/snapsplit",
    role: "Freelance Designer",
    description: "Redesigned the brand and bill-splitting flows to help users split expenses with less friction.",
    bgColor: "#8fd9c4",
    objectFit: "cover",
    aspectRatio: "4/3",
    dotField: true,
    dotLayout: 3,
    icon: "🫰",
    iconIsEmoji: true,
    cursorLabel: "Open case study",
    projectType: "Freelance",
    status: "Shipped",
    metrics: [{ stat: "30s", label: "core task time (from 4 min)" }, { stat: "40%", label: "reduction in abandonment" }, { stat: "11", label: "users tested" }],
    team: "Sole Designer + Dev Team",
    timeframe: "Dec 2023 – Sep 2024",
    problem: "Bill-splitting app for friend groups",
    outcome: "Rebrand and redesign that cut the core task from 4 min to 30s",
  },
  {
    title: "Popple",
    tags: ["AI", "Solo"],
    // Popple-Video.webm has real alpha transparency (composited live over the
    // purple bgColor + bgLottie pattern), but alpha-channel WebM only renders
    // correctly in Chromium — Safari/Firefox ignore the alpha track entirely
    // and show a flat opaque frame instead, which reads as a missing/white
    // background. Popple-Video-composited.mp4 is a screen recording of that
    // same Chromium-correct composite (phone + purple + pattern, pre-baked
    // into plain pixels), so it looks identical everywhere with no alpha
    // dependency at all.
    image: "/videos/Popple-Video-composited-poster.png",
    video: "/videos/Popple-Video-composited.mp4",
    href: "https://popple.pages.dev/",
    role: "Design Engineer",
    description: "An app that makes completed tasks tangible and collectible. Designed, built, and shipped solo, end to end.",
    objectFit: "cover",
    aspectRatio: "4/3",
    dotField: false,
    dotLayout: 2,
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
    company: "Love Lives in SF",
    tags: ["Consumer", "Internship"],
    image: "/videos/llsf-Video-poster.png",
    video: "/videos/llsf-Video.webm",
    href: "https://lovelivesinsf.org/",
    role: "Visual Design Intern",
    description: "Website for SF's public art programming. Designed as the sole designer; traffic grew 35% in the first 30 days.",
    bgColor: "#3a3a3a",
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
]

// ── Hooks ────────────────────────────────────────────────────────────
function useNumCols() {
  const get = () => window.innerWidth < 541 ? 1 : window.innerWidth < 1200 ? 2 : 3
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
          <h2 ref={headingRef} className="work-grid-heading work-grid-heading--selected reveal">
            Selected Projects <ArrowBendRightDown className="work-grid-heading-arrow" weight="thin" color="#1E4B9A" size={32} aria-hidden="true" />
          </h2>
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
