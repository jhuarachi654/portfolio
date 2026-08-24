import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
        />
        <div className="hero-landing-inner">
          <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
            <span className="hero-landing-greeting-hi">Hi! I'm</span> <span className="hero-landing-greeting-firstname">Johanna&nbsp;Huarachi.</span>
          </p>

          <p className="hero-landing-tagline" data-reveal-hero style={{ "--hero-delay": "260ms" } as React.CSSProperties}>
            I'm a product designer with a background in interaction design and psychology, and I use that lens to create experiences grounded in how people think, decide, and build trust.
          </p>

          <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
            MDes Interaction Design, CCA | Psych &amp; Neuro, Williams College | Prev. Design @ DNC, PROS
          </p>
        </div>

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
