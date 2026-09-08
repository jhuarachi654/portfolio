import { useEffect, useState } from "react"

interface CrossfadeImageProps {
  images: { src: string; alt: string }[]
  className?: string
  style?: React.CSSProperties
  intervalMs?: number
  aspectRatio?: string
}

// Loops through a list of images, crossfading between them — used where a
// single figure needs to show a sequence (e.g. a board's before/after
// state) without adding carousel controls. The wrapper owns a fixed
// aspect-ratio and every frame is absolutely positioned to fill it, so no
// single image's intrinsic size drives layout — avoids a background flash
// between frames if their dimensions differ even slightly.
export default function CrossfadeImage({ images, className, style, intervalMs = 2600, aspectRatio = "16/9" }: CrossfadeImageProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return
    const id = setInterval(() => {
      setActive(i => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio, borderRadius: 8, overflow: "hidden", ...style }}>
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={className}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === active ? 1 : 0,
            transition: "opacity 1s ease",
            position: "absolute",
            inset: 0,
          }}
        />
      ))}
    </div>
  )
}
