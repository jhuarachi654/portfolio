import { useEffect, useRef } from "react"
import { ShootingStar } from "@phosphor-icons/react"

// Fades + slides the headline in once it scrolls into view. The curtain
// corner itself is a static, fixed-radius cutout (see .featured-work-curve
// in index.css) — no JS or scroll-timeline involved in revealing the
// footer, that's just normal scroll motion passing the section's trailing
// edge through the corner.
//
// Uses a ref rather than a document-wide querySelector: during the
// page-crossfade transition, the outgoing and incoming page's <Footer>
// are both briefly mounted, so querySelector(".footer-dark-tagline") could
// grab the exiting instance instead of this one, mark it visible, then have
// it unmount — leaving this page's own tagline permanently at opacity 0.
function useHeadlineReveal() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const headline = ref.current
    if (!headline) return

    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) headline.classList.add("is-visible") }),
      { threshold: 0.15 }
    )
    io.observe(headline)

    return () => io.disconnect()
  }, [])

  return ref
}

export default function Footer() {
  const taglineRef = useHeadlineReveal()

  return (
    <footer className="footer-new footer-dark">
      <div className="footer-dark-body">
        <div className="footer-dark-left">
          <p className="footer-dark-tagline" ref={taglineRef}>
            Thank you for making it all the way here!{" "}
            <ShootingStar size={64} weight="light" className="footer-dark-tagline-icon" />
          </p>
          <p className="footer-dark-sub">Open to talk projects, collaborations, or anything design.</p>
          <span className="footer-dark-copy">© 2026 Johanna. Made with grit, thought, and lattes.</span>
          <p className="footer-dark-note">This portfolio was designed and built entirely in code, React, TypeScript, and Vite.</p>
        </div>
      </div>

    </footer>
  )
}
