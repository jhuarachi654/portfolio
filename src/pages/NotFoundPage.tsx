import { Link } from "react-router-dom"
import LiquidImage from "../components/LiquidImage"
import Footer from "../components/Footer"

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Main: 50/50 split */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        minHeight: "80vh",
      }}>

        {/* Left: text — with grid background */}
        <div className="line-grid" style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 80px)",
          borderRight: "1px solid rgba(30,75,154,0.1)",
        }}>
          <p className="about-eyebrow nf-anim" style={{ animationDelay: "60ms" }}>
            Error 404
          </p>

          <h1
            className="hero-name hero-display-headline nf-anim"
            style={{ animationDelay: "140ms", marginBottom: 20 }}
          >
            Lost in space.
          </h1>

          <p
            className="nf-anim"
            style={{
              fontFamily: "var(--font-sans)",
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
            <Link to="/" className="btn-resume">
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right: dog — fills full half */}
        <div className="nf-anim" style={{
          flex: "0 0 50%",
          overflow: "hidden",
          animationDelay: "0ms",
        }}>
          <LiquidImage
            src="/Toto dog.png"
            alt="A dog who also couldn't find what you're looking for"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

      </div>

      <Footer />
    </div>
  )
}
