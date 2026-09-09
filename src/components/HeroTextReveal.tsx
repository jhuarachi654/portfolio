import { Children, isValidElement, type ReactNode, Fragment } from "react"

// Splits inline JSX content (strings + elements like <em> or a custom name
// component) into individual word-level spans for a staggered reveal
// animation, without breaking apart any non-text child (e.g. the gradient
// name-fill) — those pass through as a single "word" unit.
function splitToWords(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = []
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      const parts = child.split(/(\s+)/).filter(p => p !== "")
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          out.push(part)
        } else {
          out.push(<span className="hero-reveal-word" key={out.length}>{part}</span>)
        }
      })
    } else if (isValidElement(child)) {
      out.push(<span className="hero-reveal-word" key={out.length}>{child}</span>)
    } else {
      out.push(child)
    }
  })
  return out
}

export function WordReveal({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const words = splitToWords(children)
  let wordIndex = 0
  return (
    <>
      {words.map((w, i) => {
        if (typeof w === "string") return <Fragment key={i}>{w}</Fragment>
        const idx = wordIndex++
        return (
          <span
            key={i}
            className="hero-reveal-word-wrap"
            style={{ "--word-delay": `${delayMs + idx * 45}ms` } as React.CSSProperties}
          >
            {w}
          </span>
        )
      })}
    </>
  )
}

export function LineReveal({ lines, delayMs = 0, lineGapMs = 140 }: { lines: ReactNode[]; delayMs?: number; lineGapMs?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className="hero-reveal-line"
          style={{ "--line-delay": `${delayMs + i * lineGapMs}ms` } as React.CSSProperties}
        >
          {line}
        </span>
      ))}
    </>
  )
}
