import WorkGrid from "../components/WorkGrid"
import Footer from "../components/Footer"
import GodRaysTextFill from "../components/GodRaysTextFill"
import HeroCursorTrail from "../components/HeroCursorTrail"
import { WordReveal, LineReveal } from "../components/HeroTextReveal"

function LogoMark({ src, alt, float }: { src: string; alt: string; float: "up" | "down" }) {
  return (
    <img
      src={src}
      alt={alt}
      className="hero-landing-logo-mark"
      style={{ transform: float === "up" ? "translateY(-3px) rotate(-4deg)" : "translateY(3px) rotate(4deg)" }}
    />
  )
}

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
                  <>Studied at <LogoMark src="/images/company-logos/cca.png" alt="CCA" float="up" /> &amp; <LogoMark src="/images/company-logos/williams.png" alt="Williams" float="down" />, and designed at <LogoMark src="/images/company-logos/dnc.png" alt="DNC" float="up" />, <LogoMark src="/images/company-logos/pros.png" alt="PROS" float="down" />.</>,
                  <>Recently designed <LogoMark src="/images/company-logos/ideo.png" alt="IDEO" float="up" /> BackStory, a TikTok-native feature for fighting misinformation.</>,
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
