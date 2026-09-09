import { useEffect, useState } from "react"

interface ZoomPanImageProps {
  src: string
  alt: string
  aspectRatio?: string
  zoomScale?: number
  focusX?: number
  focusY?: number
  holdMs?: number
  zoomMs?: number
}

// Shows the full image, then slowly zooms into a focus point and holds
// before zooming back out — a Ken Burns-style pan/zoom, contained within a
// fixed-aspect-ratio frame so it never breaks the surrounding layout.
export default function ZoomPanImage({
  src,
  alt,
  aspectRatio = "16/9",
  zoomScale = 2.2,
  focusX = 80,
  focusY = 40,
  holdMs = 2200,
  zoomMs = 2400,
}: ZoomPanImageProps) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    let timeoutId: ReturnType<typeof setTimeout>
    const cycle = (toZoomed: boolean, delay: number) => {
      timeoutId = setTimeout(() => {
        setZoomed(toZoomed)
        cycle(!toZoomed, toZoomed ? holdMs + zoomMs : holdMs + zoomMs)
      }, delay)
    }
    cycle(true, holdMs)

    return () => clearTimeout(timeoutId)
  }, [holdMs, zoomMs])

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio, borderRadius: 8, overflow: "hidden" }}>
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${focusX}% ${focusY}%`,
          transform: zoomed ? `scale(${zoomScale})` : "scale(1)",
          transition: `transform ${zoomMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
    </div>
  )
}
