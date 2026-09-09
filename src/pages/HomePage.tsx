import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRaysTextFill from "../components/GodRaysTextFill"

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <div className="hero-landing-blend-group">
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting" data-reveal-hero style={{ "--hero-delay": "120ms" } as React.CSSProperties}>
              hey! i'm <GodRaysTextFill text="Johanna" className="hero-landing-name-fill" />, a designer built on <em>psychology</em> and <em>interaction design</em>
            </p>

            <p className="hero-landing-credentials" data-reveal-hero style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
              Studied at CCA &amp; Williams, and designed at DNC, PROS.
            </p>
          </div>
        </div>
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
