import { useMemo } from "react"

// Hand-crafted cosmos flower — companion to the AsciiVideo flower
const ART = `
        ·   *   ·
     *   · \\·/ ·   *
   ·   \\   \\|/   /   ·
   *  ──\\───●───/──  *
   ·   /   /|\\   \\   ·
     *   · /·\\ ·   *
        ·   *   ·
            |
     ·  ·   |   ·  ·
      ·  ·  |  ·  ·
            |
`.trimStart()

export default function AsciiCosmos() {
  const chars = useMemo(() => {
    return ART.split("").map((ch, i) => ({
      ch,
      delay: `${((i * 37 + (i % 7) * 13) % 280) / 100}s`,
      dur:   `${2.4 + ((i * 19) % 18) / 10}s`,
    }))
  }, [])

  return (
    <pre className="ascii-cosmos" aria-hidden="true">
      {chars.map((c, i) =>
        c.ch === "\n" ? "\n" :
        c.ch === " " ? " " :
        c.ch === "|" || c.ch === "\\" || c.ch === "/" ? (
          <span key={i} className="ascii-cosmos-char ascii-cosmos-structure"
            style={{ "--delay": c.delay, "--dur": c.dur } as React.CSSProperties}>
            {c.ch}
          </span>
        ) : (
          <span key={i} className="ascii-cosmos-char"
            style={{ "--delay": c.delay, "--dur": c.dur } as React.CSSProperties}>
            {c.ch}
          </span>
        )
      )}
    </pre>
  )
}
