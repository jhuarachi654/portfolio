import { useCallback, useRef, useState } from "react"
import AsciiVideo from "./AsciiVideo"

interface Spark {
  id: number
  x: number
  y: number
}

export default function Footer() {
  const [sparks, setSparks] = useState<Spark[]>([])
  const nextId = useRef(0)

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextId.current++
    setSparks(s => [...s, { id, x, y }])
    setTimeout(() => setSparks(s => s.filter(sp => sp.id !== id)), 1200)
  }, [])

  return (
    <footer className="footer-new footer-dark" onClick={handleClick}>

      {sparks.map(sp => (
        <div key={sp.id} className="footer-spark-burst" style={{ left: sp.x, top: sp.y }}>
          <div className="footer-spark-star" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="footer-spark-particle" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      ))}

      <div className="footer-dark-body">

        <div className="footer-dark-left">
          <p className="footer-dark-tagline">Let's make something<br />worth noticing.</p>
          <p className="footer-dark-sub">Want to talk design, grab an iced hojicha, or just chat? <a href="mailto:jhuarachi654@gmail.com" className="footer-dark-link"><span>Reach out.</span></a></p>
        </div>

        <div className="footer-flower-wrap">
          <AsciiVideo
            src="/cosmos-1.mp4"
            width={200}
            height={200}
            tileColor={[168, 190, 232]}
          />
        </div>

        <div className="footer-dark-links">
          <a href="mailto:jhuarachi654@gmail.com" className="footer-dark-link"><span>Email</span></a>
          <a href="https://www.linkedin.com/in/johanna-huarachi" target="_blank" rel="noopener noreferrer" className="footer-dark-link"><span>LinkedIn</span></a>
          <a href="https://drive.google.com/file/d/1i5BMnL9dF8lv1CjTIwBDqzOtvkcd779x/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="footer-dark-link"><span>Resume</span></a>
        </div>

      </div>

      <div className="footer-dark-bar">
        <span className="footer-dark-made">Made with Iced Hojichas, genuine thought, and delight.</span>
        <span className="footer-dark-copy">© 2026 Johanna Huarachi. Design &amp; code.</span>
      </div>

    </footer>
  )
}
