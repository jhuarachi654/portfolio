/**
 * Enhanced Case Study Data Schema
 * This shows the full structure with all new fields
 */

import type { CaseStudyCardProps } from "./CaseStudyCard"

export interface ExtendedCaseStudy extends CaseStudyCardProps {
  id: string
}

export const ENHANCED_CASE_STUDIES: ExtendedCaseStudy[] = [
  {
    id: "revenue-management",
    title: "PROS Revenue Management",
    tags: ["Internship", "Product Design", "AI"],
    image: "/images/featured-work/featured-work-05-3gewKT.png",
    video: "/images/featured-work/featured-05.webm",
    href: "/revenue-management",
    role: "Lead Designer",
    description: "AI-powered revenue optimization platform for global enterprises. Increased efficiency by 40%.",
    aspectRatio: "16/9",
  },
  {
    id: "fare-finder",
    title: "PROS Fare Finder",
    tags: ["Internship", "Product Design", "Research"],
    image: "/images/featured-work/featured-work-07-IXFLl8.png",
    video: "/images/featured-work/featured-07.webm",
    href: "/fare-finder",
    role: "Design Lead",
    description: "Intelligent fare search tool serving millions of travelers globally.",
    aspectRatio: "16/9",
  },
  {
    id: "dnc",
    title: "Democratic National Committee",
    tags: ["Internship", "Graphic Design", "Motion"],
    image: "/images/featured-work/featured-work-08-tkB9Yu.png",
    video: "/images/featured-work/featured-08.webm",
    href: "/work/democratic-national-committee",
    role: "Designer",
    description: "Campaign visual identity and motion design system.",
    aspectRatio: "16/9",
  },
  {
    id: "expert-ai",
    title: "Expert.ai",
    tags: ["Internship", "Product Design", "Accessibility"],
    image: "/images/featured-work/featured-work-09-A4kZ02.png",
    video: "/images/featured-work/featured-09.webm",
    href: "/work/expert-ai",
    role: "UX Designer",
    description: "Natural language processing interface with WCAG AAA accessibility.",
    aspectRatio: "16/9",
  },
]

/**
 * Usage Example:
 * 
 * import CaseStudyCard from './CaseStudyCard'
 * import { ENHANCED_CASE_STUDIES } from './caseStudyData'
 * 
 * export function CaseStudyGrid() {
 *   return (
 *     <div className="case-study-grid">
 *       {ENHANCED_CASE_STUDIES.map(study => (
 *         <CaseStudyCard key={study.id} {...study} />
 *       ))}
 *     </div>
 *   )
 * }
 * 
 * Features included:
 * - ✅ Lazy loading: Images/videos only load when scrolled into view (50px margin)
 * - ✅ Focus states: Full keyboard navigation with visible focus ring
 * - ✅ Aspect ratios: Prevents layout shift with consistent media proportions
 * - ✅ Overlay text: Description appears on hover with smooth transition
 * - ✅ Role badges: Shows your role on each project
 * - ✅ Loading skeleton: Animated skeleton while media loads
 * - ✅ Reduced motion: Respects prefers-reduced-motion for accessibility
 * - ✅ Dark mode: Full support with adjusted colors and contrast
 */
