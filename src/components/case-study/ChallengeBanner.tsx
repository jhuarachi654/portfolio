interface ChallengeBannerProps {
  label?: string
  question: React.ReactNode
}

export default function ChallengeBanner({ label = 'Challenge', question }: ChallengeBannerProps) {
  return (
    <div className="challenge-banner-wrap" style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, background: 'transparent', padding: '32px 48px', textAlign: 'center', marginTop: 86, marginBottom: 8 }}>
      {/* Icon */}
      <div className="challenge-banner-icon" style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(var(--color-navy-rgb),0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
        color: 'var(--color-cs-heading)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
      </div>

      {/* Label */}
      <p className="font-sans font-semibold tracking-[0.12em] uppercase challenge-banner-label" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>
        {label}
      </p>

      {/* Question */}
      <p className="font-normal challenge-banner-question" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 26, lineHeight: 1.4, margin: 0, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', color: 'var(--color-cs-heading)' }}>
        {question}
      </p>
    </div>
  )
}
