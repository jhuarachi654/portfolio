import { useLayoutEffect, useRef, useState } from "react"
import GodRays from "./GodRays"

// Renders the name as plain (invisible) text for layout/accessibility, and
// stacks a live GodRays canvas behind it, masked to the exact glyph shapes
// of that text via an SVG <mask>. The mask's <text> mirrors the real
// span's font/size/content, kept in sync on resize, so the fill reads as
// the identical animated background, viewed only through the letterforms.
export default function GodRaysTextFill({ text, className }: { text: string; className?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })
  const [font, setFont] = useState({ family: "", size: "16px", weight: "400" })

  useLayoutEffect(() => {
    const el = spanRef.current
    if (!el) return

    function measure() {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const style = window.getComputedStyle(el)
      setBox({ width: rect.width, height: rect.height })
      setFont({ family: style.fontFamily, size: style.fontSize, weight: style.fontWeight })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)

    // The initial measure can run before the webfont (Sentient) has
    // finished loading, so it captures the fallback font's (narrower or
    // wider) glyph metrics — the mask then goes stale relative to the real
    // rendered text once the webfont swaps in, clipping the last glyph(s).
    let cancelled = false
    document.fonts?.ready?.then(() => {
      if (!cancelled) measure()
    })

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [text])

  // Safari doesn't support mask-image: url("#fragment") referencing an
  // in-page <mask>, only a standalone SVG document — so the mask is built
  // as a self-contained data: URI (with its own width/height/text) rather
  // than an id reference, which also works fine in Chrome/Firefox.
  //
  // The SVG's own text-layout metrics can render a couple px wider than the
  // CSS box measured via getBoundingClientRect (kerning/hinting differences,
  // worse on bold serif faces) — that mismatch clipped the last glyph(s) of
  // the mask. A small horizontal pad on both the SVG canvas and the masked
  // layer's box gives the glyphs room to render at their true width without
  // affecting layout (the visible text still comes from the real span).
  const MASK_PAD = 16
  const maskDataUrl =
    box.width > 0
      ? `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='${box.width + MASK_PAD * 2}' height='${box.height}'>` +
            `<text x='${MASK_PAD}' y='${box.height * 0.5}' dominant-baseline='middle' ` +
            `font-family='${font.family}' font-size='${font.size}' font-weight='${font.weight}' fill='#fff'>` +
            `${text}</text></svg>`
        )}")`
      : undefined

  return (
    <span ref={spanRef} className={className} style={{ position: "relative", display: "inline-block", color: "transparent" }}>
      {text}
      {maskDataUrl && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -MASK_PAD,
            top: 0,
            width: box.width + MASK_PAD * 2,
            height: box.height,
            WebkitMaskImage: maskDataUrl,
            maskImage: maskDataUrl,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            overflow: "hidden",
          }}
        >
          <GodRays
            colors={["#2C70FB", "#4A84FC", "#5479F0", "#5E92FC", "#6C8DE8", "#7CA6FD", "#8CA3FA", "#9ABBFD", "#B8CFFE", "#A9AAF7"]}
            noiseScale={0.2}
            noiseStrength={0.7}
          />
        </span>
      )}
    </span>
  )
}
