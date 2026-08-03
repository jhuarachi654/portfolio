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
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>
              {index}.
            </span>
          )}
          <h2
            className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal"
            style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}
          >
            {chapter}
          </h2>
        </div>
      )}

      {/* Container indicator — open-bottom box, rounded top corners */}
      <div style={{
        borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
        borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
        borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
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
        className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal"
        style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}
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
