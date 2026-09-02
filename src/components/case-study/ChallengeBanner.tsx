import { type ReactNode } from 'react'

interface ChallengeBannerProps {
  label?: string
  question: React.ReactNode
  icon?: ReactNode
  iconColor?: string
}

export default function ChallengeBanner({ label = 'Challenge', question, icon, iconColor = 'var(--color-cs-heading)' }: ChallengeBannerProps) {
  return (
    <div className="challenge-banner-wrap" style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, background: 'transparent', padding: 'clamp(24px, 4vw, 32px) clamp(20px, 5vw, 48px)', textAlign: 'center', marginTop: 108, marginBottom: 8 }}>
      {/* Icon */}
      <div className="challenge-banner-icon" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
        color: iconColor,
        fontSize: 'clamp(20px, 3vw, 28px)',
      }}>
        {icon ?? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>}
      </div>

      {/* Label */}
      <p className="cs-metric-label challenge-banner-label" style={{ marginBottom: 16, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>
        {label}
      </p>

      {/* Question */}
      <p className="font-normal challenge-banner-question" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 'clamp(18px, 3vw, 26px)', lineHeight: 'normal', margin: 0, maxWidth: '90%', marginLeft: 'auto', marginRight: 'auto', color: 'var(--color-cs-heading)' }}>
        {question}
      </p>
    </div>
  )
}
