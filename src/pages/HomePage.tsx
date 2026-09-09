import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRays from "../components/GodRays"
import FishSwimmer from "../components/FishSwimmer"
import GodRaysTextFill from "../components/GodRaysTextFill"

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <GodRays
          colors={["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"]}
          noiseScale={0.2}
          noiseStrength={0.7}
        />
        {/* Isolated so the fish only picks up a difference blend against the
            text painted below it in here — the GodRays background stays
            outside this stacking context, so the fish keeps its own color
            everywhere it swims over open water. */}
        <div className="hero-landing-blend-group">
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
              hey! i'm <GodRaysTextFill text="Johanna" className="hero-landing-name-fill" />, a designer built on <em>psychology</em> and <em>interaction design</em>
            </p>

            <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
              studied at <span className="hero-landing-credential-tag">CCA</span> &amp; <span className="hero-landing-credential-tag">Williams</span> &amp; designed at <span className="hero-landing-credential-tag">DNC</span>, <span className="hero-landing-credential-tag">PROS</span>
            </p>
          </div>

          <FishSwimmer color="#ffffff" filled mobileZone="top" />
          <FishSwimmer color="#ffffff" filled mobileZone="bottom" />
        </div>

        <div className="hero-landing-bottom-mask" aria-hidden="true" />
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
