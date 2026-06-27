// Renders 2–3 asymmetric halftone blob clusters as a card background.
// Transparent by default, revealed on card hover via CSS.
// Dot size tapers from large at blob center to small at edge.

const GRID = 6          // spacing between dot sample points (px)
const SQ = 2.2          // square size (px) — uniform tiny squares
const BLUE = "#1E4B9A"  // same as hero flower asset (rgb 30,75,154)

const W = 400
const H = 300

interface Blob {
  cx: number
  cy: number
  rx: number
  ry: number
}

// Each layout is a unique asymmetric arrangement of 2–3 blobs
const LAYOUTS: Blob[][] = [
  // 0 — top-right heavy + bottom-left medium + far-right tiny
  [
    { cx: 295, cy: 82,  rx: 108, ry: 88 },
    { cx: 78,  cy: 225, rx: 68,  ry: 60 },
    { cx: 355, cy: 230, rx: 38,  ry: 32 },
  ],
  // 1 — top-left dominant + bottom-right medium
  [
    { cx: 98,  cy: 92,  rx: 112, ry: 86 },
    { cx: 305, cy: 215, rx: 88,  ry: 78 },
  ],
  // 2 — center-right + top-left small + bottom-center medium
  [
    { cx: 272, cy: 145, rx: 98,  ry: 108 },
    { cx: 62,  cy: 62,  rx: 50,  ry: 44 },
    { cx: 178, cy: 268, rx: 78,  ry: 55 },
  ],
  // 3 — bottom-left large + top-right small pair
  [
    { cx: 105, cy: 210, rx: 100, ry: 82 },
    { cx: 318, cy: 70,  rx: 60,  ry: 52 },
    { cx: 360, cy: 178, rx: 34,  ry: 38 },
  ],
]

function buildDots(blobs: Blob[]): { x: number; y: number; opacity: number }[] {
  const map = new Map<string, { x: number; y: number; opacity: number }>()

  for (const blob of blobs) {
    const cols = Math.ceil((blob.rx * 2 + GRID) / GRID)
    const rows = Math.ceil((blob.ry * 2 + GRID) / GRID)
    const startX = blob.cx - blob.rx - GRID / 2
    const startY = blob.cy - blob.ry - GRID / 2

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = Math.round((startX + col * GRID) / GRID) * GRID
        const y = Math.round((startY + row * GRID) / GRID) * GRID
        const key = `${x},${y}`

        const dx = (x - blob.cx) / blob.rx
        const dy = (y - blob.cy) / blob.ry
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 1) continue

        // Opacity: full at center, fades to ~15% at edge
        const opacity = 0.15 + 0.85 * (1 - dist) * (1 - dist)

        // Keep highest opacity if dot overlaps multiple blobs
        const existing = map.get(key)
        if (!existing || opacity > existing.opacity) {
          map.set(key, { x, y, opacity })
        }
      }
    }
  }

  return Array.from(map.values())
}

interface Props {
  layout?: number
  className?: string
}

export default function DotField({ layout = 0, className = "" }: Props) {
  const blobs = LAYOUTS[layout % LAYOUTS.length]
  const dots = buildDots(blobs)
  const half = SQ / 2

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`dot-field-bg ${className}`}
      aria-hidden="true"
    >
      <g fill="currentColor">
        {dots.map((d, i) => (
          <rect
            key={i}
            x={(d.x - half).toFixed(1)}
            y={(d.y - half).toFixed(1)}
            width={SQ}
            height={SQ}
            opacity={d.opacity.toFixed(3)}
          />
        ))}
      </g>
    </svg>
  )
}
