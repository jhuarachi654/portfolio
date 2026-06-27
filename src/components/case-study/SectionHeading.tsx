interface SectionHeadingProps {
  chapter?: string
  index?: number
  heading: string
  tag?: string
  sub?: string
  className?: string
}

export default function SectionHeading({ chapter, index, heading, tag, sub, className = '' }: SectionHeadingProps) {
  return (
    <div className={`cs-section-heading ${className}`} style={{ marginBottom: 8 }}>
      {chapter && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          {index !== undefined && (
            <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>
              {index}.
            </span>
          )}
          <h2
            className="font-bold"
            style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0, color: 'var(--color-navy-dark)' }}
          >
            {chapter}
          </h2>
        </div>
      )}

      {/* Container indicator — open-bottom box, rounded top corners */}
      <div style={{
        borderTop: '1px solid rgba(30,75,154,0.3)',
        borderLeft: '1px solid rgba(30,75,154,0.3)',
        borderRight: '1px solid rgba(30,75,154,0.3)',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        height: 32,
        width: '100%',
        marginBottom: 32,
      }} />

      {tag && (
        <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>{tag}</p>
      )}
      <h3
        className="font-bold"
        style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0, color: 'var(--color-navy-dark)' }}
      >
        {heading}
      </h3>

      {sub && (
        <p className="font-sans text-[15px] leading-relaxed max-w-[560px]" style={{ color: 'var(--color-secondary)', marginTop: 8, marginBottom: 0 }}>
          {sub}
        </p>
      )}
    </div>
  )
}
