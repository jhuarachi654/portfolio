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
          <div className="hero-landing-name" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
            Johanna Huarachi
          </div>

          <p className="hero-landing-tagline" data-reveal-hero style={{ "--hero-delay": "260ms" } as React.CSSProperties}>
            I'm a product designer creating <em>joyful, accessible</em> experiences.
          </p>

          <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
            MDes Interaction Design, CCA '26 | Prev. Product Design @ DNC &amp; PROS | Figma Campus Leader
          </p>
        </div>
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
