import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import HeroCursorTrail from "../components/HeroCursorTrail"
import HeroFaviconBurst from "../components/HeroFaviconBurst"
import { WordReveal, LineReveal } from "../components/HeroTextReveal"

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <HeroCursorTrail />
        <HeroFaviconBurst />
        <div className="hero-landing-blend-group">
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting">
              <WordReveal delayMs={120}>
                hey! I'm <span className="hero-landing-name-fill" style={{ color: "#588DFB" }}>Johanna</span>,<span className="hero-landing-greeting-break-mobile" aria-hidden="true" /> a designer built on <em>psychology</em> and <em>interaction design</em>
              </WordReveal>
            </p>

            <p className="hero-landing-credentials">
              <LineReveal
                delayMs={620}
                lines={[
                  <><em>Studied</em> Interaction Design at CCA & Psych/Neuro at Williams College, and <em>designed</em> at DNC, PROS.</>,
                  "Recently w/ IDEO designed BackStory, a TikTok-native feature for fighting misinformation.",
                ]}
              />
            </p>
          </div>
        </div>
      </div>

      <div id="featured-work" className="featured-work-curve"><WorkGrid /></div>
      <Footer />
    </>
  )
}
