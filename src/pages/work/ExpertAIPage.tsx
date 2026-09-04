import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, AirplaneTakeoff, ShareNetwork, UserGear, Hand, CheckCircle, MinusCircle, CaretRight, CaretLeft, Asterisk, TrendDown } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import HeroMedia from '../../components/case-study/HeroMedia'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ea-intro',            label: 'Context' },
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
      data-reveal
      className={`max-w-[1080px] px-8 md:px-[42px] cs-section ${className}`}
      style={{ marginTop: 164 }}
    >
      {children}
    </section>
  )
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-landing-body text-[17px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
      {children}
    </p>
  )
}

function SubHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties}>
      {tag && (
        <p className="cs-metric-label" style={{ margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{tag}</p>
      )}
      <h3 className="text-[32px] text-[var(--color-cs-heading)] cs-lh-normal rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
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
        <span className="font-landing-body" style={{ fontSize: 17, color: '#222225' }}>{role}</span>
      </div>
      <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', margin: '0 0 12px' }}>Feedback:</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bullets.map((text, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
            <span className="font-landing-body" style={{ fontSize: 17, color: '#222225', lineHeight: 'normal' }}>{text}</span>
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
          <h3 className="text-[32px] text-[var(--color-cs-heading)] cs-lh-normal rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
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
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={img(opt.image)} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{opt.label}</p>
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
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', margin: 0, fontWeight: 500, color: '#416BCC' }} />
        <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>{icon}</span>
      </div>
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

export default function ExpertAIPage() {
  useCaseToc(TOC, 'Expert.ai Filter Function')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <HeroMedia
          video="/videos/expert.ai-Video.webm"
          poster="/videos/expert.ai-Video-poster.png"
          bgColor="#c4ecff"
          objectFit="contain"
          padding={16}
        />

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-[42px] pt-14 pb-16">
            <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              Expert.ai Filter Function
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[17px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Designing and shipping a more accessible and usable filter function for an enterprise AI text analysis platform used by legal, finance, and government organizations.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
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

            
            <a href="#ea-features" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ea-intro">
          <div style={{ marginTop: 32 }}>
            <SubHeading>What is Expert.ai?</SubHeading>
            <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', marginBottom: 12 }}>
              Expert.ai serves legal, finance, and government organizations that need to analyze and organize massive amounts of text. In the Corpus platform, users upload documents that expert.ai's NLU engine analyzes, annotates, and trains models on, helping teams extract key terms, flag compliance risks, and classify documents at scale.
            </p>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>My Role</SubHeading>
            <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', marginBottom: 12 }}>
              As a product design intern at Expert.ai, I worked alongside an AI Innovation Manager and developers to <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>improve the design of the Filter function</strong>, centering the redesign on usability then accessibility. I designed and prototyped in Figma, provided developer annotations, and conducted usability testing to help enterprise users identify key content from their documents faster.
            </p>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('filter-documents-3d-mockup.png')} alt="Filter documents panel within the Expert.ai Corpus platform" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 64 }} data-reveal>
            <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Impact</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '30s', description: 'Task time dropped from 2 minutes to 30 seconds' },
                { stat: '42%', description: 'fewer support tickets related to filtering after launch' },
              ].map(({ stat, description }, i) => (
                <div key={description} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', margin: '0 0 8px', fontWeight: 500, color: '#416BCC', display: 'block' }} />
                  <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>More documents didn't mean better decisions. It meant <span style={{ color: '#416BCC' }}>paralysis.</span></SubHeading>
            <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', marginBottom: 12 }}>
              Psychologist Barry Schwartz found that more options lead to overwhelm, not better outcomes. Digitalization gave organizations access to everything — every contract, ruling, and filing. But access without structure isn't power. Filtering is what turns information overload into a decision.
            </p>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: 8 }}>
                <img src={img('document-archive.jpg')} alt="A crowded physical records archive with shelves of overflowing document folders" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </figure>
          </div>

          <div className="rm-challenge-subheader-style" style={{ marginTop: 108 }}>
            <ChallengeBanner
              label="Mission"
              question={<>How might we make filtering <span style={{ color: '#416BCC' }}>reliable</span>, and <span style={{ color: '#416BCC' }}>accessible</span> to help users identify and extract key information?</>}
            />
          </div>
        </Section>

        {/* ── 3. Research ── */}
        <Section id="ea-research">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>2. Research</p>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>62 support tickets about filtering in <span style={{ color: '#416BCC' }}>six months</span></SubHeading>
            <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', marginBottom: 12 }}>
              To understand the scope of the problem, I reviewed 62 support tickets filed over six months and interviewed the Customer Support Specialist — the person closest to user frustration. Three friction points surfaced consistently.
            </p>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('users-could-not.png')} alt="Users could not see which filters were active, use drag-and-drop filters, or see their results while they worked" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>User interviews surfaced the human cost</SubHeading>
            <BodyText>
              I talked to 10 enterprise users across legal, finance, and government. The ticket analysis showed the patterns. The interviews showed the daily reality: time lost to tedious manual workarounds, and features meant to simplify their work had become obstacles themselves.
            </BodyText>

            {/* Quotes + illustrations, 2-column */}
            <div className="ea-quotes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { role: 'Legal Analyst', quote: 'I have to close it every time just to check my work. Then open it again. Then close it. It is exhausting.' },
                  { role: 'Government Contract Analyst', quote: 'I gave up on drag and drop. I just type everything now.' },
                  { role: 'Data Analyst w/ Colorblindness', quote: 'I did not even know there were red and green indicators until someone told me.' },
                ].map(({ role, quote }) => (
                  <div key={role}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'rgba(var(--color-navy-rgb),0.06)', color: 'var(--color-secondary)', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>"</span>
                    <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: '#222225', margin: '0 0 8px' }}>"{quote}"</p>
                    <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400 }}>{role}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={img('user-research-illustrations.png')} alt="Illustrations of overwhelmed enterprise users struggling with the filter interface" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 108 }}>
            <div style={{ textAlign: 'center' }}>
              <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Key Finding #1: The Popup Blocked Results</p>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <SubHeading><span style={{ color: '#416BCC' }}>76%</span> of tickets traced back to one component: the filter popup.</SubHeading>
              </div>
              <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', maxWidth: 560, margin: '0 auto' }}>
                It covered the results screen entirely, and closing it left no visible record of what had been applied.
              </p>
            </div>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('key-finding-1-popup-blocked.png')} alt="Filter documents popup overlaying the results, blocking the user's data" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <div style={{ textAlign: 'center' }}>
              <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Key Finding #2: High Friction</p>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <SubHeading><span style={{ color: '#416BCC' }}>More than 1/3</span> of support tickets were about drag-and-drop.</SubHeading>
              </div>
              <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', maxWidth: 560, margin: '0 auto' }}>
                The interaction was unreliable and tedious. One analyst gave up entirely and switched to typing manually.
              </p>
            </div>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('key-finding-2-high-friction.png')} alt="Cursor dragging a Geography entity toward the include panel in the filter documents interface" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <div style={{ textAlign: 'center' }}>
              <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Key Finding #3: Accessibility Gap</p>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <SubHeading>The filter's red/green indicators <span style={{ color: '#416BCC' }}>did not meet WCAG standards.</span></SubHeading>
              </div>
              <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', maxWidth: 560, margin: '0 auto' }}>
                This was outside the original project scope. I surfaced the gap through user research and advocated for its inclusion in the redesign.
              </p>
            </div>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: 8 }}>
                <img src={img('key-finding-3-wcag-contrast.png')} alt="Accessibility Colour Contrast Checker showing the filter's red and green indicators both failing WCAG AA and AAA" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </figure>
          </div>

        </Section>

        {/* ── 4. Development ── */}
        <Section id="ea-development">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Development</p>
          </div>

          {/* Technical Constraints — first, per Framer */}
          <div style={{ marginTop: 32 }}>
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
            <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
              <strong className="text-[var(--color-cs-heading)]">Takeaway:</strong> The solution had to come from the existing design system. I also had to balance accessibility improvements with what the team could realistically build in one sprint.
            </p>
          </div>

          {/* Accessibility — wireframe tests */}
          <div style={{ marginTop: 108 }}>
            <AccessibilityExplorer />
          </div>

          <div style={{ marginTop: 108 }}>
            <ChallengeBanner
              icon={<AirplaneTakeoff size="1em" weight="regular" />}
              iconColor="#416BCC"
              label="Challenge (Revised)"
              question={<>How might we make filtering <strong><em>visible,</em></strong> <strong><em>reliable,</em></strong> and <strong><em>accessible</em></strong> so users can filter efficiently and independently?</>}
            />
          </div>

          {/* Revised Solution */}
          <div style={{ marginTop: 108 }}>
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
                  <p className="font-landing-body" style={{ fontSize: 17, color: 'var(--color-secondary)', lineHeight: 'normal', margin: 0 }}>
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
            <div style={{ marginTop: 108 }}>
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
                <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                  <strong className="text-[var(--color-cs-heading)]">Takeaway:</strong> Both appreciated that the design was consistent with the previous version. That helped with feasibility and timeline. I took both pieces of feedback. The consistency was good. The feasibility was solid. But I still had room to improve the layout.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 5. Solution ── */}
        <Section id="ea-features">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>4. Solution</p>
          </div>

          <div style={{ width: '80%', margin: '32px auto 0' }} data-reveal>
            <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden', background: 'transparent' }}>
              <LazyVideo
                src="/videos/expert.ai-Video.webm"
                poster="/videos/expert.ai-Video-poster.png"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>

          <div className="ea-solution-grid" style={{ marginTop: 108, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'center' }}>
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
                      <span className="font-landing-body" style={{ fontSize: 17, color: '#222225', lineHeight: 'normal' }}>{g}</span>
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
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>5. Impact</p>
          </div>

          <div style={{ marginTop: 32 }}>
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
              <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                The Lead Designer and I noted that two users still hesitated when trying to reset a filter. The three click pattern (include, exclude, reset) was not obvious to everyone. <strong className="text-[var(--color-cs-heading)]">If I had more time</strong>, I would add a small indicator showing what each click would do and create an onboarding experience for first time users.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 7. Reflection ── */}
        <Section id="ea-reflection">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>6. Reflection</p>
          </div>

          <div className="ea-takeaways-grid" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
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
