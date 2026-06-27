import { useCountUp } from '../../hooks/useCountUp'

// Parses a stat string like "40%", "35%", "3 months", "30s"
// Returns { prefix, number, suffix } so we animate just the number
function parseStat(stat: string): { prefix: string; number: number; suffix: string } | null {
  const match = stat.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return { prefix: match[1], number: parseFloat(match[2]), suffix: match[3] }
}

export default function CountUp({ stat, style }: { stat: string; style?: React.CSSProperties }) {
  const parsed = parseStat(stat)
  const { value, ref } = useCountUp(parsed?.number ?? 0, 1400)

  if (!parsed) return <span style={style}>{stat}</span>

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} style={style}>
      {parsed.prefix}{value}{parsed.suffix}
    </span>
  )
}
