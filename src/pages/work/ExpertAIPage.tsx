import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, AirplaneTakeoff, Brain, Ghost, BookOpen, Quotes, ShareNetwork, UserGear, Hand, CheckCircle, MinusCircle, CaretRight, CaretLeft, Asterisk, TrendDown } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ea-intro',            label: 'Context' },
  { id: 'ea-solution-preview', label: 'Solution Preview' },
  { id: 'ea-research',         label: 'Research' },
  { id: 'ea-development',      label: 'Development' },
  { id: 'ea-features',         label: 'Solution' },
  { id: 'ea-impact',           label: 'Impact' },
  { id: 'ea-reflection',       label: 'Reflection' },
]

const img = (file: string) => `/images/expert-ai/${file}`

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`max-w-[1080px] px-8 md:px-14 cs-section ${className}`}
      style={{ marginTop: 164 }}
    >
      {children}
    </section>
  )
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 }}>
      {children}
    </p>
  )
}

function SubHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div>
      {tag && (
        <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]/50" style={{ fontSize: 13, marginBottom: 6 }}>{tag}</p>
      )}
      <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function TicketCard({ label, description, count, total, icon }: { label: string; description: string; count: number; total: number; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>
          {icon}
        </div>
        <p style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 20, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{label}</p>
      </div>
      <div className="font-landing-body" style={{ fontSize: 14, color: '#416BCC', marginBottom: 12, fontWeight: 500 }}>
        {count} of {total} support tickets
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '0 0 12px' }} />
      <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

type Bullet = { text: string; type?: 'check' | 'x' | 'neutral' }
function ConstraintCard({ title, icon, bullets }: { title: string; icon?: React.ReactNode; bullets: (string | Bullet)[] }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: 0 }}>{title}</p>
        {icon && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>
            {icon}
          </span>
        )}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bullets.map((b, i) => {
          const text = typeof b === 'string' ? b : b.text
          return (
            <li key={i}>
              <span className="font-landing-body" style={{ fontSize: 13, opacity: 1, color: '#222225', lineHeight: 'normal' }}>{text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function FeedbackCard({ role, avatar, bullets }: { role: string; avatar: string; bullets: string[] }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '4px 16px 4px 4px', marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.15)', flexShrink: 0 }}>
          <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <span className="font-landing-body" style={{ fontSize: 15, color: '#222225' }}>{role}</span>
      </div>
      <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: '0 0 12px' }}>Feedback:</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bullets.map((text, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
            <span className="font-landing-body" style={{ fontSize: 15, color: '#222225', lineHeight: 'normal' }}>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


const accessibilityOptions = [
  {
    label: 'Labels inside buttons',
    image: 'expert-ai-12-e6QDix.png',
    pros: 'Immediately visible, no hover required. Clear grouping at a glance.',
    cons: 'Only fixed labeling. Did not solve color inaccessibility, the popup blocking results, or drag-and-drop issues.',
  },
  {
    label: 'Tooltip labels',
    image: 'expert-ai-11-Fj1Yo1.png',
    pros: "Cleaner UI. Doesn't add visual clutter to the button.",
    cons: 'Requires hover to discover. Not accessible for keyboard or touch users. Same core problems remain.',
  },
]

function AccessibilityExplorer() {
  const [selected, setSelected] = useState(0)
  const [direction, setDirection] = useState(1)
  const opt = accessibilityOptions[selected]
  const goNext = () => { setDirection(1); setSelected(i => (i + 1) % accessibilityOptions.length) }
  const goPrev = () => { setDirection(-1); setSelected(i => (i - 1 + accessibilityOptions.length) % accessibilityOptions.length) }
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div className="ea-accessibility-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'start' }}>
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6 }}>Wireframe Tests</p>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', marginBottom: 8, marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: '1em' }}><Hand size="1em" weight="regular" /></span>
            Accessibility
          </h3>
          <BodyText>
            With the defined constraints, my first attempt was conservative. I added labels inside the category buttons and tooltip labels on hover.
          </BodyText>
          <BodyText>
            During a design critique, the Lead Designer pointed out that these changes helped with labeling but did not solve the core problems. The popup still blocked results. Drag and drop still slowed users w/ motor deficits. Results were still blocked.
          </BodyText>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              I took this feedback and asked if I could explore a <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>more rigorous solution.</strong> They said yes, as long as I stayed within the design system.
            </p>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Show previous wireframe test"
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(22, 43, 85, 0.35)', color: '#ffffff', cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              <CaretLeft size={12} weight="bold" />
            </button>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <motion.div
                key={selected}
                initial={{ x: direction === 1 ? 24 : -24 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}
              >
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, marginTop: 8 }}>{opt.label}</p>
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={img(opt.image)} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 1 }}><CheckCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Pros:</span> {opt.pros}</span>
                  </p>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-cs-heading)', flexShrink: 0, display: 'flex', marginTop: 1 }}><MinusCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Cons:</span> {opt.cons}</span>
                  </p>
                </div>
              </motion.div>
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Show next wireframe test"
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(22, 43, 85, 0.35)', color: '#ffffff', cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              <CaretRight size={12} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ stat, label, description, icon }: { stat: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 8px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, lineHeight: 'normal', margin: 0, fontWeight: 400, color: '#416BCC' }} />
        <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>{icon}</span>
      </div>
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

// ─── Hero video — autoplays by default; the button is the sole manual control ──

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const handleToggle = () => {
    const vid = videoRef.current
    if (!vid) return
    if (playing) vid.pause()
    else vid.play().catch(() => {})
  }

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/expert.ai-Video.webm"
        poster="/videos/expert.ai-Video-poster.png"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
      <PlayPauseButton playing={playing} onToggle={handleToggle} />
    </>
  )
}

export default function ExpertAIPage() {
  useCaseToc(TOC, 'Expert.ai Corpus')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: '#c4ecff', borderRadius: 8, padding: 32, border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              Expert.ai Corpus
            </h1>
            <p className="font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Expert.ai is an AI text analysis platform for legal, finance, and government organizations. As a Product Design Intern, I worked with the AI innovation team and directly with enterprise users to redesign the filtering system. Task time dropped from 2 minutes to 30 seconds. Support tickets about filtering fell by 42%.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Product Design Intern' },
                { label: 'Timeline', value: 'Jun – Sep 2022' },
                { label: 'Team',     value: 'UX Engineer, Developer, PMs' },
                { label: 'Tools/Skills', value: 'Figma' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
                </div>
              ))}
            </div>

            
            <a href="#ea-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ea-intro">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>1.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Context
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>The current state of the filtering system</SubHeading>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', marginBottom: 12 }}>
              Expert.ai helps legal, finance, and government organizations analyze massive amounts of text. Think contracts, court rulings, financial reports, and regulatory filings.
            </p>

            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', marginBottom: 12 }}>
              The Corpus platform is where users upload, organize, and filter their documents before running AI analysis. Filtering is how users narrow down thousands of documents to the ones that actually matter for their work.
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0 }}>
                <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>Problem:</strong> In six months, the customer support team received 62 support tickets about filtering alone. Users were frustrated, and it was clear something needed to change.
              </p>
            </div>

            <figure style={{ margin: '24px 0 0', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
              <img src={img('expert-ai-filter-popup.webp')} alt="Original Expert.ai filter popup blocking results" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
                When users applied filters, the popup blocked their results completely. They would add a filter, close the popup to check, see they needed to adjust, reopen the popup, make a change, close it again, and repeat. Each time taking about 15 to 20 seconds. That added up fast.
              </figcaption>
            </figure>
          </div>

          <div style={{ marginTop: 86 }}>
            <ChallengeBanner
              icon={<AirplaneTakeoff size="1em" weight="regular" />}
              iconColor="#416BCC"
              question={<>How might we redesign filtering to be <strong><em>visible</em></strong> and <strong><em>reliable</em></strong> so users can filter efficiently?</>}
            />
          </div>
        </Section>

        {/* ── 2. Solution Preview ── */}
        <Section id="ea-solution-preview">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>2.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Solution Preview
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          {/* Video container */}
          <div style={{ width: '80%', margin: '0 auto' }}>
            <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden', background: 'transparent' }}>
              <LazyVideo
                src="/videos/expert.ai-Video.webm"
                poster="/videos/expert.ai-Video-poster.png"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>

          {/* TL:DR */}
          <div style={{ marginTop: 86 }}>
            <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>TL:DR</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
                A faster, clearer, and more accessible way to filter.
              </h3>
              <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                A seamless dropdown filter panel with clear status indicators, accessible interface, and improved usability that work for everyone.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 3. Research ── */}
        <Section id="ea-research">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>3.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Research
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>What the support tickets showed</SubHeading>
            <Prose>
              <BodyText>
                I met with the Customer Support Specialist and started reviewing the 62 support tickets. I also talked to the PM and a UX engineer to understand what had been tried before. The filtering component had been overdue for a redesign and although there was data, no one had pulled it together yet. Here is what I found.
              </BodyText>
            </Prose>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
              <TicketCard label="Lack of visibility" description="Users could not see which filters were active. The popup showed nothing once you closed it." count={34} total={62} icon={<Brain size="1em" />} />
              <TicketCard label="High friction" description="Drag and drop often failed. Users had to try multiple times just to add a simple filter." count={22} total={62} icon={<Ghost size="1em" />} />
              <TicketCard label="Blocked results" description="The popup covered the entire screen. Users could not see their data while filtering." count={47} total={62} icon={<BookOpen size="1em" />} />
            </div>
            <p className="font-landing-body cs-caption" style={{ marginTop: 20 }}>
              Main Pain Points from User Research/Internal Interviews
            </p>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>What users told me</SubHeading>
            <BodyText>
              I talked to 10 enterprise users across legal, finance, and government. What struck me was not just what they said, but how they adapted when the filter component did not meet their needs. One person added extra steps. Another abandoned a feature entirely. A third was not aware that the feature existed.
            </BodyText>

            {/* Callout */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 32 }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                When multiple users find different workarounds for the same interface, the filter component was clearly the issue.
              </p>
            </div>

            {/* Quote cards */}
            <div className="ea-quotes-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { role: 'Legal Analyst', avatar: img('legal-analyst.avif'), quote: 'I have to close it every time just to check my work. Then open it again. Then close it. It is exhausting.', align: 'left' },
                { role: 'Government Contract Analyst', avatar: img('government-analyst.avif'), quote: 'I gave up on drag and drop. I just type everything now.', align: 'right' },
                { role: 'Data Analyst w/ Colorblindness', avatar: img('data-analyst.avif'), quote: 'I did not even know there were red and green indicators until someone told me.', align: 'left' },
              ].map(({ role, avatar, quote, align }) => (
                <div key={role} style={{ maxWidth: '80%', marginLeft: align === 'right' ? 'auto' : 0, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', opacity: 0.7 }}>{role}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                    <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 'normal', color: '#222225', margin: 0 }}>{quote}</p>
                    <span style={{ color: '#416BCC', flexShrink: 0, lineHeight: 'normal', display: 'flex', alignItems: 'flex-end' }}>
                      <Quotes size={22} weight="fill" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Unexpected Find: Accessibility</SubHeading>
            <BodyText>
              Several users also mentioned accessibility issues. The system used red and green to show exclusion and inclusion, which meant colorblind users could not tell them apart. The filtering system also required users to drag elements into inclusion and exclusion areas. For users who could not use a mouse, this was difficult.
            </BodyText>

            {/* 2-image visual grid */}
            <div className="ea-unexpected-find-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <img src={img('wcag-analysis.png')} alt="WCAG contrast check: red #EC5750 on #F4E8E7 scores 2.90:1, all WCAG fail" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
              <img src={img('motion-drag.png')} alt="Original filter popup requiring drag and drop to include or exclude entities" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
            </div>
            <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              The original filter popup. It blocks results, uses red/green indicators, and requires drag and drop.
            </p>

            {/* Callout */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                This was not part of the original project scope, but I brought it up to my team and backed the case with user research. I mentioned how it could <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>increase overall usability and improve things for everyone.</strong>
              </p>
            </div>

            <BodyText>
              I got the go ahead to fix it, but I had to check with the technical team on feasibility and make sure it fit within the design system constraints.
            </BodyText>
          </div>
        </Section>

        {/* ── 4. Development ── */}
        <Section id="ea-development">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>4.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Development
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          {/* Technical Constraints — first, per Framer */}
          <div style={{ marginTop: 86 }}>
            <SubHeading>Technical Constraints</SubHeading>
            <BodyText>
              Although I had the go-ahead from my team to work on accessibility, I had to ensure that my design iterations were feasible with check-ins with the developers on my team and designers as well to ensure that it aligned with the design system. I touched base with both and the following are my takeaways that I brought when iterating the solutions.
            </BodyText>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <ConstraintCard
              title="Design System"
              icon={<ShareNetwork size="1em" weight="regular" />}
              bullets={['The Lead Designer advised me that the filter component had to be built from design system elements. Also, to consider whether the solution could scale to other products.']}
            />
            <ConstraintCard
              title="Technical Feasibility"
              icon={<UserGear size="1em" weight="regular" />}
              bullets={['The developers asked me to check in with them early and often. They preferred annotated mockups so they could give async feedback before I went too far down any path.']}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 16 }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
              <strong className="text-[var(--color-cs-heading)]">Takeaway:</strong> The solution had to come from the existing design system. I also had to balance accessibility improvements with what the team could realistically build in one sprint.
            </p>
          </div>

          {/* Accessibility — wireframe tests */}
          <div style={{ marginTop: 86 }}>
            <AccessibilityExplorer />
          </div>

          <div style={{ marginTop: 86 }}>
            <ChallengeBanner
              icon={<AirplaneTakeoff size="1em" weight="regular" />}
              iconColor="#416BCC"
              label="Challenge (Revised)"
              question={<>How might we make filtering <strong><em>visible,</em></strong> <strong><em>reliable,</em></strong> and <strong><em>accessible</em></strong> so users can filter efficiently and independently?</>}
            />
          </div>

          {/* Revised Solution */}
          <div style={{ marginTop: 86 }}>
            <SubHeading>Revised Solution</SubHeading>
            <BodyText>
              After the design critique, I went ahead with a more rigorious approach that touched on the painpoints we've uncovered during research.
            </BodyText>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { bold: 'First, I fixed the layout.', body: ' I made the filter panel compact so it no longer blocked the results. Users could finally see their data while filtering.' },
                { bold: 'Second, I changed how filtering works.', body: ' I embedded labels directly into the panel. Instead of dragging and dropping, users just click a label to change its state. One click to include, another to exclude, another to reset.' },
                { bold: 'Third, I fixed the colors.', body: ' I swapped red and green for blue and gray. The colors help, but every state also has a text label so no one has to rely on color alone.' },
              ].map(({ bold, body }) => (
                <div key={bold} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                  <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', lineHeight: 'normal', margin: 0 }}>
                    <strong className="text-[var(--color-cs-heading)]">{bold}</strong>{body}
                  </p>
                </div>
              ))}
            </div>

            <div className="ea-comparison-grid" style={{ marginTop: 32, paddingTop: 32, display: 'grid', gridTemplateColumns: '2fr auto 3fr', gap: 24, alignItems: 'center' }}>
              <div>
                <img src={img('expert-ai-15-bW3HXl.png')} alt="Standalone filter component" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Filter DropDown</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(var(--color-navy-rgb),0.2)', fontSize: 24, fontWeight: 300 }}>→</div>
              <div>
                <img src={img('expert-ai-16-BSVPlU.png')} alt="Filter integrated into full page" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Filter Drop Down (integrated)</p>
              </div>
            </div>

            {/* Verifying w/ Design and Technical Teams */}
            <div style={{ marginTop: 86 }}>
              <SubHeading>Verifying w/ Design and Technical Teams</SubHeading>
              <BodyText>
                Before moving to usability testing, I brought my dropdown panel back to the developers and the Lead Designer for feedback on feasibility and usability.
              </BodyText>
              <div className="ea-feedback-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <FeedbackCard
                  role="Lead Designer"
                  avatar={img('lead-designer.avif')}
                  bullets={[
                    'Liked the consistency with the previous version',
                    'Suggested a more compact layout',
                    'Proposed making it horizontal and embedded into the screen',
                  ]}
                />
                <FeedbackCard
                  role="Developer"
                  avatar={img('developer.avif')}
                  bullets={[
                    'Confirmed the dropdown behaviors were feasible',
                    'Noted that clicking to change state was simpler than drag and drop',
                    'Said the timeline was manageable with the current approach',
                  ]}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 24 }}>
                <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
                <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                  <strong className="text-[var(--color-cs-heading)]">Takeaway:</strong> Both appreciated that the design was consistent with the previous version. That helped with feasibility and timeline. I took both pieces of feedback. The consistency was good. The feasibility was solid. But I still had room to improve the layout.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 5. Solution ── */}
        <Section id="ea-features">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>5.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Solution
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div className="ea-solution-grid" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'center' }}>
            <div>
              <SubHeading>The new Filter Component</SubHeading>
              <BodyText>
                After incorporating feedback from the design critique and the technical team, I landed on a drop down filter panel. The panel sits alongside the results so users can see their data update in real time as they make selections.
              </BodyText>

              <div style={{ marginTop: 24, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, background: 'transparent', padding: 20 }}>
                <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 12 }}>New Guidelines</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Click once to include a filter',
                    'Click twice to exclude',
                    'Click three times to reset',
                    'Blue and gray indicate status, with text labels for every state',
                  ].map(g => (
                    <li key={g} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                      <span className="font-landing-body" style={{ fontSize: 15, color: '#222225', lineHeight: 'normal' }}>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <LazyVideo
                src="/videos/expert.ai-Video.webm"
                poster="/videos/expert.ai-Video-poster.png"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Final filter component, dropdown panel embedded alongside results</p>
            </div>
          </div>
        </Section>

        {/* ── 6. Impact ── */}
        <Section id="ea-impact">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>6.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Impact
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Usability Testing and Impact</SubHeading>
            <BodyText>
              I ran usability testing with 8 enterprise users across legal, finance, and government. The Lead Designer observed the sessions with me. I asked each user to complete a series of filtering tasks while sharing their screen. I watched for moments of friction, what they clicked, and how long each task took.
            </BodyText>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginTop: 16, marginBottom: 16 }}>
              <StatBlock stat="30 seconds" label="Task time" description="Task time dropped from 2 minutes to 30 seconds. Users could see their results while filtering and change states with a click." icon={<Timer size="1em" />} />
              <StatBlock stat="42% less" label="Support Tickets" description="After the redesign shipped, support tickets related to filtering fell by 42%." icon={<TrendDown size="1em" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
              {[
                { quote: "It's pretty neat that I can see the real time results on the side. The only thing I'm unsure of is how to exclude an item?", role: 'Legal Analyst', avatar: img('legal-analyst.avif') },
                { quote: 'The content is pretty clear and I appreciate the multiple labels for clarity. I also like that there is no tedious dragging for filtering.', role: 'Data Analyst w/ Colorblindness', avatar: img('data-analyst.avif') },
              ].map(({ quote, role, avatar }) => (
                <div key={role} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 20, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 10px' }}>"{quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.15)', flexShrink: 0 }}>
                      <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <p className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0 }}>{role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                The Lead Designer and I noted that two users still hesitated when trying to reset a filter. The three click pattern (include, exclude, reset) was not obvious to everyone. <strong className="text-[var(--color-cs-heading)]">If I had more time</strong>, I would add a small indicator showing what each click would do and create an onboarding experience for first time users.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 7. Reflection ── */}
        <Section id="ea-reflection">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>7.</span>
              <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
                Reflection
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderLeft: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderRight: '1px solid rgba(var(--color-navy-rgb),0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div className="ea-takeaways-grid" style={{ marginTop: 86, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <img src={img('presentation.webp')} alt="Snippet of my final presentation" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Snippet of my Final Presentation</p>
            </div>
            <div>
              <SubHeading>Takeaways</SubHeading>
              <BodyText>
                This was my first UX Design internship, and I am so thankful to the Expert.ai AI Innovation team.
              </BodyText>
              <BodyText>
                This experience taught me how much impact a small component can have on all types of users. The initial request was improving usability, but I learned that sometimes it takes reflection and initiative to reframe the problem. I discovered deeper issues with accessibility and advocated for that with user research while talking to the technical team through the process.
              </BodyText>
              <BodyText>
                I am grateful to my team for supporting my initiative on accessibility and for their guidance!
              </BodyText>
            </div>
          </div>
        </Section>

      </div>

      <NextProject
        title="SnapSplit"
        to="/work/snapsplit"
        tags={["Consumer", "Freelance"]}
        description="A bill-splitting app for friend groups; rebranded and redesigned to cut the core task from 4 min to 30s."
        video="/videos/SnapSplit-Video.webm"
        poster="/videos/SnapSplit-Video-poster.png"
        objectFit="cover"
        bgColor="#8fd9c4"
        category="consumer"
      />

    </div>
  )
}
