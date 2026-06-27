interface ChallengeBannerProps {
  label?: string
  question: string
}

export default function ChallengeBanner({ label = 'Challenge', question }: ChallengeBannerProps) {
  return (
    <div className="challenge-banner-wrap" style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: '32px 48px', textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
      {/* Icon */}
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(30,75,154,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        <span style={{ fontSize: 16 }}>✈</span>
      </div>

      {/* Label */}
      <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 10, marginBottom: 16 }}>
        {label}
      </p>

      {/* Question */}
      <p className="font-bold text-navy challenge-banner-question" style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.4, margin: 0, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
        {question}
      </p>
    </div>
  )
}
