import { useState } from "react"

interface SkeletonImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  wrapperStyle?: React.CSSProperties
}

// Drop-in <img> replacement that shows the same shimmer skeleton used on
// the landing-page case-study cards (see .case-study-card-skeleton) behind
// the image until it finishes loading, then fades the image in over it.
// The wrapper needs its own size (via minHeight, or an explicit height in
// wrapperStyle) since the skeleton is position:absolute and would otherwise
// collapse to 0x0 before the image loads, flashing the page background.
export default function SkeletonImage({ src, alt, className, style, wrapperStyle }: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ position: "relative", minHeight: loaded ? undefined : 200, ...wrapperStyle }}>
      {!loaded && <div className="case-study-card-skeleton" style={{ borderRadius: style?.borderRadius, position: 'absolute', inset: 0 }} />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={className}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease", ...style }}
      />
    </div>
  )
}
