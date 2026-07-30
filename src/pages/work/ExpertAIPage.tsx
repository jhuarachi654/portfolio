import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, Ticket } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ea-intro',       label: 'Introduction' },
  { id: 'ea-research',    label: 'Research' },
  { id: 'ea-development', label: 'Development' },
  { id: 'ea-features',    label: 'Solution' },
  { id: 'ea-reflection',  label: 'Reflection' },
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
    <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 }}>
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
      <h3 className="text-[22px] font-bold text-[var(--color-cs-heading)] leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function TicketCard({ label, description, count, total }: { label: string; description: string; count: number; total: number }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 20 }}>
      <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 12 }}>{label}</p>
      <p className="font-landing-body font-semibold text-[var(--color-cs-heading)]" style={{ fontSize: 13, marginBottom: 12 }}>
        <CountUp stat={String(count)} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 24, fontWeight: 700, color: 'var(--color-cs-heading)' }} /> of {total} support tickets
      </p>
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

function QuoteRow({ quote, role }: { quote: string; role: string }) {
  return (
    <div style={{ borderLeft: '2px solid rgba(var(--color-navy-rgb),0.2)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
      <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 8px' }}>"{quote}"</p>
      <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>— {role}</p>
    </div>
  )
}

type Bullet = { text: string; type?: 'check' | 'x' | 'neutral' }
function ConstraintCard({ title, bullets }: { title: string; bullets: (string | Bullet)[] }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
      <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 16px' }}>{title}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bullets.map((b, i) => {
          const text = typeof b === 'string' ? b : b.text
          const type = typeof b === 'string' ? 'neutral' : (b.type ?? 'neutral')
          const icon = type === 'check' ? '✓' : type === 'x' ? '✕' : '·'
          const filled = type === 'check'
          return (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="shrink-0 font-bold" style={{
                fontSize: 11,
                lineHeight: 1,
                color: filled ? '#fff' : 'var(--color-cs-heading)',
                background: filled ? 'var(--color-cs-heading)' : 'transparent',
                border: '1.5px solid var(--color-cs-heading)',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>{icon}</span>
              <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{text}</span>
            </li>
          )
        })}
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
  const opt = accessibilityOptions[selected]
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
        <div>
          <h3 className="text-[22px] font-bold text-[var(--color-cs-heading)] leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 8 }}>Wireframe iterations</h3>
          <div className="cs-option-btns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            {accessibilityOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
                background: 'transparent',
              }}>
                <span className="font-landing-body" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16 }}>
            <p className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', margin: 0, display: 'flex', gap: 8 }}>
              <span className="font-bold text-[var(--color-cs-heading)] text-[16px] leading-none mt-0.5 shrink-0">+</span>
              <span><span className="font-bold text-[var(--color-cs-heading)]">Pros:</span> {opt.pros}</span>
            </p>
            <p className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', margin: 0, display: 'flex', gap: 8 }}>
              <span className="font-bold text-[var(--color-cs-heading)]/30 text-[16px] leading-none mt-0.5 shrink-0">−</span>
              <span><span className="font-bold text-[var(--color-cs-heading)]">Cons:</span> {opt.cons}</span>
            </p>
          </div>
        </div>
        <div>
          <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
            <img src={img(opt.image)} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ stat, label, description, icon }: { stat: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ color: 'var(--color-secondary)' }}>{icon}</span>
        <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>{label}</p>
      </div>
      <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 48, lineHeight: 1, margin: '0 0 12px', fontWeight: 700, color: 'var(--color-cs-heading)', display: 'block' }} />
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

function ImpactToggle() {
  const [view, setView] = useState<'stats' | 'quotes' | 'future'>('stats')
  const labels = { stats: 'Metrics', quotes: 'User Quotes', future: 'Future' }
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['stats', 'quotes', 'future'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className="cs-tab-btn" style={{
            border: view === v ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
            background: 'transparent',
            color: view === v ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)',
          }}>
            {labels[v]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr', alignItems: 'stretch' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'stats' ? 'visible' : 'hidden', opacity: view === 'stats' ? 1 : 0, pointerEvents: view === 'stats' ? 'auto' : 'none' }}>
          <StatBlock stat="30s" label="Task Time" description="Task time dropped from 2 minutes to 30 seconds. Users could see their results while filtering and change states with a click." icon={<Timer size={16} />} />
          <StatBlock stat="42%" label="Fewer Support Tickets" description="After the redesign shipped, support tickets related to filtering fell by 42%." icon={<Ticket size={16} />} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'quotes' ? 'visible' : 'hidden', opacity: view === 'quotes' ? 1 : 0, pointerEvents: view === 'quotes' ? 'auto' : 'none' }}>
          {[
            { quote: "It's pretty neat that I can see the real time results on the side. The only thing I'm unsure of is how to exclude an item?", role: 'Legal Analyst' },
            { quote: "The content is pretty clear and I appreciate the multiple labels for clarity. I also like that there is no tedious dragging for filtering.", role: 'Data Analyst w/ Colorblindness' },
          ].map(({ quote, role }) => (
            <div key={role} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: '20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 10px' }}>"{quote}"</p>
              <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]" style={{ fontSize: 11, margin: 0 }}>{role}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'future' ? 'visible' : 'hidden', opacity: view === 'future' ? 1 : 0, pointerEvents: view === 'future' ? 'auto' : 'none' }}>
          {[
            { label: 'Where we landed', body: 'I handed off the designs at the end of my internship. The redesigned filter component shipped and support tickets related to filtering fell by 42%, a direct result of addressing the root causes uncovered during research.' },
            { label: "What I'd do differently", body: 'If I had more time, I would have pushed for more end-user testing earlier in the process. Discovering the accessibility issues mid-project meant some iterations felt rushed. Starting with a broader audit would have set a stronger foundation.' },
          ].map(({ label, body }) => (
            <div key={label} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16, height: '100%', boxSizing: 'border-box' }}>
              <p className="font-semibold cs-serif-label" style={{ fontSize: 16, margin: '0 0 6px' }}>{label}</p>
              <p className="font-landing-body text-[13px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
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
  useCaseToc(TOC, 'Corpus Platform')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: '#c4ecff', padding: '4%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-cs-heading)', marginBottom: 8, borderLeft: '2px solid var(--color-navy)', paddingLeft: 10 }}>Expert.ai</p>
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              Corpus Platform
            </h1>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              Expert.ai builds AI text analysis tools for legal, finance, and government teams. The Corpus Platform is where those teams upload, organize, and filter documents before running analysis. Over time, the filter component generated 62 support tickets in six months as user needs grew beyond what it was originally built to handle. I redesigned it to address those gaps. Task time dropped from 2 minutes to 30 seconds and support tickets fell 42%.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Product Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2022' },
                { label: 'Team',     value: 'UX Engineer, Developer, PMs' },
                { label: 'Tools',    value: 'Figma' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 1.4 }}>{value}</p>
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
              <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>1.</span>
              <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Introduction
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
            <SubHeading>The filter generated more support tickets than any other feature on the platform.</SubHeading>
            <Prose>
              <BodyText>
                Expert.ai helps legal, finance, and government organizations analyze large volumes of text: contracts, court rulings, financial reports, and regulatory filings. The Corpus Platform is where analysts upload and organize those documents before running AI analysis. Filtering is how analysts narrow thousands of documents down to the ones that matter. It is one of the first things every user does.
              </BodyText>
              <BodyText>
                The filter had been designed as a popup that opened over the document results. As the platform grew and the user base expanded across legal, finance, and government teams, the interaction started generating friction. Analysts had to close the popup to check their results, reopen it to adjust a filter, close it again to check, and repeat. Each loop took 15 to 20 seconds. Over six months, that friction accumulated into 62 support tickets.
              </BodyText>
              <BodyText>
                When I reviewed those tickets and spoke with users, what I found was not just a usability problem. The filter also had accessibility limitations that were affecting a portion of users in ways the team had not yet quantified. The original brief did not include accessibility. I made the case that it should.
              </BodyText>
            </Prose>
          </div>

          <div style={{ marginTop: 32 }}>
            <ChallengeBanner question={<>How might we <strong className="font-semibold">redesign filtering</strong> to be visible, reliable, and accessible so users can filter efficiently and independently?</>} />
          </div>
        </Section>

        {/* ── 2. Research ── */}
        <Section id="ea-research">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>2.</span>
              <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
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
            <SubHeading>62 support tickets pointed at three failure modes</SubHeading>
            <Prose>
              <BodyText>
                I met with the Customer Support Specialist and reviewed all 62 support tickets. I also spoke with the PM and a UX Engineer to understand what had been tried before. Three patterns emerged from the tickets.
              </BodyText>
            </Prose>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ marginTop: 86 }}>
              <TicketCard label="Lack of Visibility" description="Users could not see which filters were active once the popup closed. The popup showed nothing once dismissed." count={34} total={62} />
              <TicketCard label="High Friction" description="Drag and drop failed frequently. Users had to attempt the same action multiple times to add a single filter." count={22} total={62} />
              <TicketCard label="Blocked Results" description="The popup covered the entire screen while filtering. Users could not see their data while making selections." count={47} total={62} />
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Users were adapting around the filter, not using it</SubHeading>
            <Prose>
              <BodyText>
                I talked to 10 enterprise users across legal, finance, and government. What stood out was not just what they said but how they had each found a different workaround for the same interaction. One person added extra steps to work around the popup. Another abandoned drag and drop entirely. A third had not noticed the color indicators at all.
              </BodyText>
            </Prose>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { role: 'Legal Analyst', quote: 'I have to close it every time just to check my work. Then open it again. Then close it. It is exhausting.', offset: '0%' },
                { role: 'Government Contract Analyst', quote: 'I gave up on drag and drop. I just type everything now.', offset: '15%' },
                { role: 'Data Analyst w/ Colorblindness', quote: 'I did not even know there were red and green indicators until someone told me.', offset: '8%' },
              ].map(({ role, quote, offset }) => (
                <div key={role} style={{ marginLeft: offset, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: '12px 16px', maxWidth: '75%' }}>
                  <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]" style={{ fontSize: 11, marginBottom: 6 }}>{role}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                    <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{quote}</p>
                    <span className="font-bold text-[var(--color-cs-heading)]/20" style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>"</span>
                  </div>
                </div>
              ))}
            </div>

            <BodyText>
              When multiple users find different workarounds for the same interface, the interface is signaling that it needs to change. Each workaround was a user absorbing friction that the design should have handled differently as the product matured.
            </BodyText>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>The brief was about usability. The research revealed an accessibility gap.</SubHeading>
            <BodyText>
              The filter used red and green to show which documents were excluded or included. For colorblind users, those two colors are indistinguishable. The filter also required drag and drop as the primary interaction, which created a barrier for users who could not use a mouse precisely or at all.
            </BodyText>
            <BodyText>
              These limitations had not been the focus of the original design. As the platform's user base grew to include more diverse users across enterprise contexts, they became a meaningful source of friction. I brought them to my team with the user research as evidence, showing how addressing the accessibility gaps would improve usability for everyone. The team agreed to expand the scope.
            </BodyText>
            <BodyText>
              The accessibility gaps were not a separate problem alongside the usability ones. They were contributing to many of the usability failures we were already seeing in the tickets.
            </BodyText>
          </div>
        </Section>

        {/* ── 3. Development ── */}
        <Section id="ea-development">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>3.</span>
              <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
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

          <div style={{ marginTop: 86 }}>
            <SubHeading>The conservative fix did not address the core friction</SubHeading>
            <Prose>
              <BodyText>
                My first attempt was conservative. I added labels inside category buttons and tooltip labels on hover. During a design critique, the Lead Designer pointed out these helped with labeling but did not solve the core problems. The popup still blocked results. Drag and drop still slowed users. I asked if I could explore a more rigorous solution within the existing design system. The team said yes.
              </BodyText>
            </Prose>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Engineering and design system constraints shaped what was possible</SubHeading>
            <BodyText>
              Before exploring further, I checked in with the developers and the Lead Designer to understand the boundaries.
            </BodyText>
            <BodyText>
              The Lead Designer confirmed the filter component had to be built from existing design system elements and needed to scale to other products in the platform. Developers confirmed they preferred annotated mockups for async feedback before I went too far down any direction, and that clicking to change state was simpler to build than drag and drop. The timeline was manageable with the current approach.
            </BodyText>
            <BodyText>
              Those constraints narrowed the solution space before I started exploring. The new design had to work within the existing system, avoid drag and drop, and ship within one sprint.
            </BodyText>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>The dropdown panel addressed all three friction points</SubHeading>
            <BodyText>
              I replaced the popup with a compact dropdown panel that sat alongside the document results. Users could see their data while filtering. I replaced drag and drop with a three-click state system: one click to include a filter, a second click to exclude it, a third click to reset. I replaced red and green with blue and gray, and added a text label to every state so no user had to rely on color alone.
            </BodyText>
            <BodyText>
              The Lead Designer liked the consistency with the previous version and suggested a more compact layout embedded horizontally into the screen. The Developer confirmed the dropdown behaviors were feasible, noted that clicking to change state was simpler to build than drag and drop, and said the timeline was manageable. I kept the design system foundation and updated the layout based on that feedback.
            </BodyText>

            <div style={{ marginTop: 32, paddingTop: 32, display: 'grid', gridTemplateColumns: '2fr auto 3fr', gap: 24, alignItems: 'center' }}>
              <div>
                <img src={img('expert-ai-15-bW3HXl.png')} alt="Standalone filter component" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Standalone component</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(var(--color-navy-rgb),0.2)', fontSize: 24, fontWeight: 300 }}>→</div>
              <div>
                <img src={img('expert-ai-16-BSVPlU.png')} alt="Filter integrated into full page" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Integrated into full page</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. Solution ── */}
        <Section id="ea-features">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>4.</span>
              <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
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

          <div style={{ marginTop: 86, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
            <div>
              <SubHeading>A dropdown filter panel that stays alongside your results</SubHeading>
              <BodyText>
                The Corpus Platform filter is now a compact dropdown panel that sits beside the document list. Users can see their results update in real time as they make selections. The popup is gone. The screen is no longer blocked while filtering.
              </BodyText>
              <BodyText>
                Filtering works through a three-click state system. One click marks a filter as included, shown in blue with a text label. A second click marks it as excluded, shown in gray with a text label. A third click resets it. Every state has a text label so no user has to rely on color to understand what is active.
              </BodyText>
              <BodyText>
                Red and green are replaced by blue and gray throughout. Colorblind users can read the filter the same way every other user does.
              </BodyText>

              <div style={{ marginTop: 24, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, background: 'transparent', padding: 20 }}>
                <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 12 }}>New Guidelines</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Click once to include a filter',
                    'Click twice to exclude',
                    'Click three times to reset',
                    'Blue and gray indicate status, with text labels for every state',
                  ].map(g => (
                    <li key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
                      <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{g}</span>
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
              <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Final filter component, dropdown panel embedded alongside results</p>
            </div>
          </div>
        </Section>

        {/* ── 5. Reflection ── */}
        <Section id="ea-reflection">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>5.</span>
              <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
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

          <div style={{ marginTop: 86 }}>
            <SubHeading>Task time dropped from 2 minutes to 30 seconds. Support tickets fell 42%.</SubHeading>
            <BodyText>
              I ran usability testing with 8 enterprise users across legal, finance, and government before the redesign shipped. The Lead Designer observed sessions with me. After the redesign shipped, Expert.ai measured support tickets related to filtering over the following period.
            </BodyText>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginTop: 24, marginBottom: 24 }}>
              <StatBlock stat="30s" label="Task Time" description="Task time before: 2 minutes. Task time after: 30 seconds." icon={<Timer size={16} />} />
              <StatBlock stat="42%" label="Fewer Support Tickets" description="Support tickets related to filtering: down 42%." icon={<Ticket size={16} />} />
            </div>

            <BodyText>
              Two users from the testing sessions responded in ways that validated the accessibility work specifically:
            </BodyText>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: 24 }}>
              {[
                { quote: "It's pretty neat that I can see the real time results on the side. The only thing I'm unsure of is how to exclude an item.", role: 'Legal Analyst' },
                { quote: 'The content is pretty clear and I appreciate the multiple labels for clarity. I also like that there is no tedious dragging for filtering.', role: 'Data Analyst with colorblindness' },
              ].map(({ quote, role }) => (
                <div key={role} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 20, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 10px' }}>"{quote}"</p>
                  <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]" style={{ fontSize: 11, margin: 0 }}>{role}</p>
                </div>
              ))}
            </div>

            <BodyText>
              The second response mattered most. It confirmed that replacing drag and drop and replacing color-only indicators addressed the exact barriers that had generated the most friction in the original design.
            </BodyText>
            <BodyText>
              Two users still hesitated when trying to reset a filter. The three-click pattern, include then exclude then reset, was not immediately obvious to everyone. If I had more time, I would add a small indicator showing what the next click would do and create a short onboarding experience for first-time users.
            </BodyText>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
              {[
                { heading: 'Reframe before you solve', body: 'The original brief was about usability. Reviewing the support tickets and talking to users revealed that accessibility gaps were contributing to many of the usability failures. Taking time to question the problem statement before designing led to a better outcome than solving the problem as it was originally framed.' },
                { heading: 'Advocacy through research', body: 'Accessibility was not in the original scope. User interviews and support ticket analysis gave me the evidence I needed to make the case for including it. The team agreed because the evidence was specific: real users, real workarounds, real tickets. That is what turned a suggestion into a decision.' },
              ].map(({ heading, body }) => (
                <div key={heading} className="cs-info-box" style={{ padding: 20 }}>
                  <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 10px', lineHeight: 1.4 }}>{heading}</p>
                  <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
                </div>
              ))}
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
