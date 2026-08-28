import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"

// TEMPORARY comparison page — identical to HomePage, just forces system-ui
// everywhere via the .force-system-ui wrapper class (see index.css) so it
// can be compared side by side against the real font choices. Delete this
// file, its route in App.tsx, and the .force-system-ui rule once done.
export default function HomePageSystemUI() {
  return (
    <div className="force-system-ui">
      <div className="hero-page hero-page--landing">
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
        />
        <div className="hero-landing-inner">
          <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
            <span className="hero-landing-greeting-hi">I'm Johanna,</span> <span className="hero-landing-greeting-firstname">a designer built on <em>psychology</em> and <em>interaction design</em></span>
          </p>

          <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
            MDes Interaction Design, CCA | Psych &amp; Neuro, Williams College | Prev. Design @ DNC, PROS
          </p>
        </div>

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </div>
  )
}
