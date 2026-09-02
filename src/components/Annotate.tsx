// Hand-drawn annotation marks (underline / circle / squiggle) that draw
// themselves in, like pencil marks over the phrase — triggered by the same
// [data-reveal] .is-visible class the surrounding paragraph already gets
// from the page's scroll IntersectionObserver, so no separate observer is
// needed here. `order` staggers each mark's draw-in so, when several land
// in the same viewport pass, they animate one after another instead of all
// at once.
const ANNOTATE_PATHS: Record<"underline" | "squiggle" | "circle", string> = {
  underline: "M2 8 C 25 12, 75 4, 98 8",
  squiggle: "M2 8 Q 10 2, 18 8 T 34 8 T 50 8 T 66 8 T 82 8 T 98 8",
  circle: "M 112 6 C 60 2, 8 18, 6 46 C 4 76, 60 88, 112 86 C 168 84, 216 70, 214 42 C 212 16, 160 4, 112 8",
}

export default function Annotate({ children, type, order = 0 }: { children: React.ReactNode; type: "underline" | "circle" | "squiggle"; order?: number }) {
  const delay = `${0.4 + order * 0.5}s`
  const viewBox = type === "circle" ? "0 0 220 90" : "0 0 100 14"
  const d = ANNOTATE_PATHS[type]
  return (
    <span className="about-annotate" data-annotate={type} style={{ "--annotate-delay": delay } as React.CSSProperties}>
      {children}
      <svg className={`about-annotate-svg about-annotate-${type}`} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
        <path className="about-annotate-stroke" d={d} pathLength={100} fill="none" stroke="#416BCC" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  )
}
