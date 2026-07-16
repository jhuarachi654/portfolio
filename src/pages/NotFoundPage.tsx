import { Link } from "react-router-dom"
import LiquidImage from "../components/LiquidImage"
import Footer from "../components/Footer"

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Main: 50/50 split — column on mobile, row from tablet up (see
          .nf-split / .nf-text / .nf-image in index.css) */}
      <div className="footer-curtain nf-split" style={{
        flex: 1,
        display: "flex",
        minHeight: "80vh",
      }}>

        {/* Left: text */}
        <div className="nf-text" style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <h1
            className="hero-name hero-display-headline nf-anim"
            style={{ animationDelay: "140ms", marginBottom: 20 }}
          >
            Lost in space.
          </h1>

          <p
            className="nf-anim"
            style={{
              fontFamily: "var(--font-landing-body)",
              fontSize: 15,
              color: "var(--color-secondary)",
              lineHeight: 1.7,
              maxWidth: 340,
              marginBottom: 32,
              animationDelay: "220ms",
            }}
          >
            We searched high and low but couldn't find what you're looking for.
            Let's find a better place for you to go.
          </p>

          <div className="about-cta nf-anim" style={{ animationDelay: "300ms" }}>
            <Link to="/" className="cs-jump-btn">
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right: dog — fills full half */}
        <div className="nf-anim nf-image" style={{
          flex: "0 0 50%",
          overflow: "hidden",
          animationDelay: "0ms",
        }}>
          <LiquidImage
            src="/Toto dog.png"
            alt="A dog who also couldn't find what you're looking for"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
          />
        </div>

      </div>

      <Footer />
    </div>
  )
}
