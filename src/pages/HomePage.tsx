import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRaysTextFill from "../components/GodRaysTextFill"
import HeroCursorTrail from "../components/HeroCursorTrail"
import { WordReveal, LineReveal } from "../components/HeroTextReveal"

export default function HomePage() {
  return (
    <>
      <div className="hero-page hero-page--landing">
        <HeroCursorTrail />
        <div className="hero-landing-blend-group">
          <div className="hero-landing-inner">
            <p className="hero-landing-greeting">
              <WordReveal delayMs={120}>
                hey! i'm <GodRaysTextFill text="Johanna" className="hero-landing-name-fill" />, a designer built on <em>psychology</em> and <em>interaction design</em>
              </WordReveal>
            </p>

            <p className="hero-landing-credentials">
              <LineReveal
                delayMs={620}
                lines={[
                  "Studied IxD at CCA & Psych/Neuro at Williams, and designed at DNC, PROS.",
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
