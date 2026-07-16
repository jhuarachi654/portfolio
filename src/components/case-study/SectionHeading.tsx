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
            <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>
              {index}.
            </span>
          )}
          <h2
            className="font-normal"
            style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, lineHeight: 1.2, margin: 0, color: 'var(--color-cs-heading)' }}
          >
            {chapter}
          </h2>
        </div>
      )}

      {/* Container indicator — open-bottom box, rounded top corners */}
      <div style={{
        borderTop: '1px solid rgba(var(--color-navy-rgb),0.3)',
        borderLeft: '1px solid rgba(var(--color-navy-rgb),0.3)',
        borderRight: '1px solid rgba(var(--color-navy-rgb),0.3)',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        height: 32,
        width: '100%',
        marginBottom: 32,
      }} />

      {tag && (
        <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 6, color: 'var(--color-cs-heading)', opacity: 0.5 }}>{tag}</p>
      )}
      <h3
        className="font-normal"
        style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 22, lineHeight: 1.3, margin: 0, color: 'var(--color-cs-heading)' }}
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
