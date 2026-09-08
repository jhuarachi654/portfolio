import { useEffect, useState } from "react"

interface CrossfadeImageProps {
  images: { src: string; alt: string }[]
  className?: string
  style?: React.CSSProperties
  intervalMs?: number
}

// Loops through a list of images, crossfading between them — used where a
// single figure needs to show a sequence (e.g. a board's before/after
// state) without adding carousel controls.
export default function CrossfadeImage({ images, className, style, intervalMs = 2600 }: CrossfadeImageProps) {
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
    <div style={{ position: "relative", width: "100%", ...style }}>
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={className}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: 8,
            opacity: i === active ? 1 : 0,
            transition: "opacity 1s ease",
            position: i === 0 ? "relative" : "absolute",
            top: 0,
            left: 0,
          }}
        />
      ))}
    </div>
  )
}
