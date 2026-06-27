import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, Ticket } from '@phosphor-icons/react'
import Footer from '../../components/Footer'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ea-intro',       label: 'Introduction' },
  { id: 'ea-solution',    label: 'Solution Preview' },
  { id: 'ea-research',    label: 'Research' },
  { id: 'ea-development', label: 'Developments' },
  { id: 'ea-features',    label: 'Solution' },
  { id: 'ea-impact',      label: 'Impact' },
  { id: 'ea-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/expert-ai/${file}`

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`max-w-[1080px] px-8 md:px-14 cs-section ${className}`}
      style={{ marginTop: 48 }}
    >
      {children}
    </motion.section>
  )
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 }}>
      {children}
    </p>
  )
}

function SubHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div>
      {tag && (
        <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>{tag}</p>
      )}
      <h3 className="text-[22px] font-bold text-navy-dark leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 24, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function TicketCard({ label, description, count, total }: { label: string; description: string; count: number; total: number }) {
  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 20 }}>
      <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 12 }}>{label}</p>
      <p className="font-sans font-semibold text-navy" style={{ fontSize: 13, marginBottom: 12 }}>
        <CountUp stat={String(count)} style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-navy)' }} /> of {total} support tickets
      </p>
      <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

function QuoteRow({ quote, role }: { quote: string; role: string }) {
  return (
    <div style={{ borderLeft: '2px solid rgba(30,75,154,0.2)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
      <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 8px' }}>"{quote}"</p>
      <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>— {role}</p>
    </div>
  )
}

type Bullet = { text: string; type?: 'check' | 'x' | 'neutral' }
function ConstraintCard({ title, bullets }: { title: string; bullets: (string | Bullet)[] }) {
  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
      <p className="font-sans font-bold text-navy" style={{ fontSize: 15, margin: '0 0 16px' }}>{title}</p>
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
                color: filled ? '#fff' : '#1E4B9A',
                background: filled ? '#1E4B9A' : 'transparent',
                border: '1.5px solid #1E4B9A',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>{icon}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{text}</span>
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
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
        <div>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>WIREFRAME EXPLORATION</p>
          <h3 className="text-[22px] font-bold text-navy-dark leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 16, marginTop: 8 }}>Exploring Accessibility</h3>
          <div className="cs-option-btns" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accessibilityOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
                background: selected === i ? 'rgba(30,75,154,0.08)' : 'transparent',
              }}>
                <span className="font-sans" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(30,75,154,0.15)', paddingTop: 16 }}>
            <p className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', margin: 0 }}>
              <span className="font-bold text-navy">Pros:</span> {opt.pros}
            </p>
            <p className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', margin: 0 }}>
              <span className="font-bold text-navy">Cons:</span> {opt.cons}
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
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ color: 'var(--color-secondary)' }}>{icon}</span>
        <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>{label}</p>
      </div>
      <CountUp stat={stat} style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1, margin: '0 0 12px', fontWeight: 700, color: 'var(--color-navy)', display: 'block' }} />
      <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

function ImpactToggle() {
  const [view, setView] = useState<'stats' | 'quotes' | 'future'>('stats')
  const labels = { stats: 'Metrics', quotes: 'User Quotes', future: 'Future' }
  return (
    <div style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['stats', 'quotes', 'future'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className="cs-tab-btn" style={{
            border: view === v ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
            background: view === v ? 'rgba(30,75,154,0.08)' : 'transparent',
            color: view === v ? '#1E4B9A' : 'rgba(30,75,154,0.4)',
          }}>
            {labels[v]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr', alignItems: 'stretch' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'stats' ? 'visible' : 'hidden', opacity: view === 'stats' ? 1 : 0, pointerEvents: view === 'stats' ? 'auto' : 'none' }}>
          <StatBlock stat="30s" label="Task Time" description="Task time dropped from 2 minutes to 30 seconds. Users could see their results while filtering and change states with a click." icon={<Timer size={16} />} />
          <StatBlock stat="42%" label="Fewer Support Tickets" description="After the redesign shipped, support tickets related to filtering fell by 42%." icon={<Ticket size={16} />} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'quotes' ? 'visible' : 'hidden', opacity: view === 'quotes' ? 1 : 0, pointerEvents: view === 'quotes' ? 'auto' : 'none' }}>
          {[
            { quote: "It's pretty neat that I can see the real time results on the side. The only thing I'm unsure of is how to exclude an item?", role: 'Legal Analyst' },
            { quote: "The content is pretty clear and I appreciate the multiple labels for clarity. I also like that there is no tedious dragging for filtering.", role: 'Data Analyst w/ Colorblindness' },
          ].map(({ quote, role }) => (
            <div key={role} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: '20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 10px' }}>"{quote}"</p>
              <p className="font-sans font-semibold tracking-[0.1em] uppercase text-navy" style={{ fontSize: 11, margin: 0 }}>{role}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridRow: 1, gridColumn: 1, alignItems: 'stretch', visibility: view === 'future' ? 'visible' : 'hidden', opacity: view === 'future' ? 1 : 0, pointerEvents: view === 'future' ? 'auto' : 'none' }}>
          {[
            { label: 'Where we landed', body: 'I handed off the designs at the end of my internship. The redesigned filter component shipped and support tickets related to filtering fell by 42% — a direct result of addressing the root causes uncovered during research.' },
            { label: "What I'd do differently", body: 'If I had more time, I would have pushed for more end-user testing earlier in the process. Discovering the accessibility issues mid-project meant some iterations felt rushed. Starting with a broader audit would have set a stronger foundation.' },
          ].map(({ label, body }) => (
            <div key={label} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16, height: '100%', boxSizing: 'border-box' }}>
              <p className="font-sans font-semibold" style={{ fontSize: 13, color: 'var(--color-navy)', margin: '0 0 6px' }}>{label}</p>
              <p className="font-sans text-[13px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExpertAIPage() {
  useCaseToc(TOC)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">

      {/* ── Hero ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, marginBottom: 48 }}>
          <div className="cs-solution-wrap" style={{ background: '#f0f4fb', padding: '56px 100px', border: '1px solid rgba(30,75,154,0.2)' }}>
            <video
              src="/videos/expert.ai-Video.webm"
              poster="/videos/expert.ai-Video-poster.png"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <h1 className="text-[44px] sm:text-[58px] font-bold text-navy-dark leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
              Expert.ai Filter Component
            </h1>
            <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 16 }}>
              Expert.ai is an AI text analysis platform for legal, finance, and government organizations. As a Product Design Intern, I worked with the AI innovation team and directly with enterprise users to redesign the filtering system.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: 'Role',     value: 'Product Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2022' },
                { label: 'Team',     value: 'UX Engineer, Developer, PMs' },
                { label: 'Tools',    value: 'Figma' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '8px', border: '1px solid rgba(30,75,154,0.2)' }}>
                  <p className="font-sans text-[11px] font-bold text-navy mb-3 tracking-wide">{label}</p>
                  <p className="font-sans text-[14px] text-navy/70">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ea-intro">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>1.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Introduction
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="OVERVIEW">The current state of the filtering system</SubHeading>
            <Prose>
              <BodyText>
                Expert.ai helps legal, finance, and government organizations analyze massive amounts of text — contracts, court rulings, financial reports, and regulatory filings. The Corpus platform is where users upload, organize, and filter documents before running AI analysis.
              </BodyText>
              <BodyText>
                In six months, the customer support team received 62 support tickets about filtering alone. When users applied filters, the popup blocked their results completely — they'd add a filter, close the popup to check, reopen it to adjust, and repeat. Each loop took 15–20 seconds.
              </BodyText>
            </Prose>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
            <div>
              <img src={img('expert-ai-05-DNXec4.png')} alt="Expert.ai Corpus filtering interface — current state" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>The original filter popup — blocking results while in use</p>
            </div>
            <div>
              <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: '0 0 16px' }}>What wasn't working</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { type: '-', text: 'Popup covered results entirely while filtering' },
                  { type: '-', text: 'Red/green indicators invisible to colorblind users' },
                  { type: '-', text: 'Drag-and-drop failed frequently, causing repeated attempts' },
                  { type: '-', text: 'No way to see active filters once the popup was closed' },
                ].map(({ type, text }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, flexShrink: 0, lineHeight: 1.5, color: 'rgba(30,75,154,0.35)' }}>{type}</span>
                    <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Challenge banner ── */}
        <Section>
          <ChallengeBanner question="How might we redesign filtering to be visible and reliable so users can filter efficiently?" />
        </Section>

        {/* ── 2. Solution Preview ── */}
        <Section id="ea-solution">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>2.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Solution Preview
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <img src="/videos/expert.ai-Video-poster.png" alt="Expert.ai filter component — solution preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginTop: 32 }}>
            <h3 className="font-bold leading-snug" style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-navy)', margin: 0 }}>
              A faster, clearer, and more accessible way to filter.
            </h3>
            <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
              A seamless dropdown filter panel with clear status indicators, accessible interface, and improved usability that work for everyone.
            </p>
          </div>
        </Section>

        {/* ── 3. Research ── */}
        <Section id="ea-research">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>3.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Research
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="SUPPORT TICKETS">What the support tickets showed</SubHeading>
            <Prose>
              <BodyText>
                I met with the Customer Support Specialist and reviewed all 62 support tickets. I also spoke with the PM and a UX engineer to understand what had been tried before. Here is what I found.
              </BodyText>
            </Prose>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: 48 }}>
              <TicketCard label="Lack of Visibility" description="Users couldn't see which filters were active. The popup showed nothing once closed." count={34} total={62} />
              <TicketCard label="High Friction" description="Drag and drop often failed. Users had to try multiple times to add a simple filter." count={22} total={62} />
              <TicketCard label="Blocked Results" description="The popup covered the entire screen. Users couldn't see their data while filtering." count={47} total={62} />
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="USER RESEARCH">What everyday users experienced</SubHeading>
            <Prose>
              <BodyText>
                I talked to 10 enterprise users across legal, finance, and government. What struck me was not just what they said, but how they adapted — one person added extra steps, another abandoned a feature entirely, a third wasn't even aware the feature existed.
              </BodyText>
            </Prose>

            <BodyText>
              When multiple users find different workarounds for the same interface, the filter component was clearly the issue.
            </BodyText>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { role: 'Legal Analyst', quote: 'I have to close it every time just to check my work. Then open it again. Then close it. It is exhausting.', offset: '0%' },
                { role: 'Government Contract Analyst', quote: 'I gave up on drag and drop. I just type everything now.', offset: '15%' },
                { role: 'Data Analyst w/ Colorblindness', quote: 'I did not even know there were red and green indicators until someone told me.', offset: '8%' },
              ].map(({ role, quote, offset }) => (
                <div key={role} style={{ marginLeft: offset, border: '1px solid rgba(30,75,154,0.2)', padding: '12px 16px', maxWidth: '75%' }}>
                  <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy" style={{ fontSize: 11, marginBottom: 6 }}>{role}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                    <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{quote}</p>
                    <span className="font-bold text-navy/20" style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="ACCESSIBILITY">Accessibility</SubHeading>
            <BodyText>
              Several users also mentioned accessibility issues. The system used red and green to show exclusion and inclusion, which meant colorblind users could not tell them apart. The filtering system also required users to drag elements into inclusion and exclusion areas. For users who could not use a mouse, this was difficult.
            </BodyText>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 32 }}>
              <div>
                <img src={img('expert-ai-09-ileoWS.png')} alt="Red/green accessibility contrast failure" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Red/green indicators — inaccessible for colorblind users</p>
              </div>
              <div>
                <img src={img('expert-ai-10-eGAcY4.png')} alt="Tooltip labels iteration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Tooltip labels — minor fix, core issues remain</p>
              </div>
            </div>

            <div style={{ marginTop: 32, border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.03)', padding: 20 }}>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                <strong style={{ color: 'var(--color-navy)' }}>Takeaway:</strong> This was not part of the original project scope, but I brought it up to my team and backed the case with user research — showing how fixing accessibility would increase overall usability and improve things for everyone.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 4. Developments ── */}
        <Section id="ea-development">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>4.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Developments
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="CONSTRAINTS">Technical Constraints</SubHeading>
            <Prose>
              <BodyText>
                Although I had the go-ahead on accessibility, I had to ensure design iterations were feasible. I checked in with both developers and the Lead Designer to understand the boundaries.
              </BodyText>
            </Prose>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 48 }}>
              <ConstraintCard
                title="Design System"
                bullets={[
                  { text: 'The Lead Designer advised that the filter component had to be built from existing design system elements.', type: 'check' },
                  { text: 'Consider whether the solution could scale to other products.', type: 'check' },
                ]}
              />
              <ConstraintCard
                title="Technical Feasibility"
                bullets={[
                  { text: 'Developers preferred annotated mockups for async feedback before I went too far down any path.', type: 'check' },
                  { text: "Check in early and often — don't wait until a solution is fully baked.", type: 'check' },
                ]}
              />
            </div>

            <div style={{ marginTop: 32, border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.03)', padding: 20 }}>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                <strong style={{ color: 'var(--color-navy)' }}>Takeaway:</strong> The solution had to come from the existing design system. I also had to balance accessibility improvements with what the team could realistically build in one sprint.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="IDEATION">Exploring Accessibility</SubHeading>
            <Prose>
              <BodyText>
                My first attempt was conservative — I added labels inside category buttons and tooltip labels on hover. During a design critique, the Lead Designer pointed out these helped with labeling but didn't solve the core problems. The popup still blocked results. Drag-and-drop still slowed users.
              </BodyText>
              <BodyText>
                I asked if I could explore a more rigorous solution. They said yes, as long as I stayed within the design system.
              </BodyText>
            </Prose>

            <AccessibilityExplorer />
          </div>
        </Section>

        {/* ── Revised challenge ── */}
        <Section>
          <ChallengeBanner question="How might we make filtering visible, reliable, and accessible so users can filter efficiently and independently?" />
        </Section>

        {/* ── Finalized solution (pre-feedback) ── */}
        <Section>
          <SubHeading tag="SOLUTION">Dropdown Panel</SubHeading>
          <BodyText>
            After the critique, I went with a more rigorous approach addressing all three pain points.
          </BodyText>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            {[
              { n: '01', bold: 'Fixed the layout.', body: 'I made the filter panel compact so it no longer blocked results. Users could finally see their data while filtering.' },
              { n: '02', bold: 'Changed how filtering works.', body: 'I embedded labels directly into the panel. Instead of dragging and dropping, users just click a label to change its state — one click to include, another to exclude, another to reset.' },
              { n: '03', bold: 'Fixed the colors.', body: 'I swapped red and green for blue and gray. Every state also has a text label so no one has to rely on color alone.' },
            ].map(({ n, bold, body }) => (
              <div key={n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', borderTop: '1px solid rgba(30,75,154,0.12)', paddingTop: 14 }}>
                <span className="font-sans font-bold text-navy/20" style={{ fontSize: 13, flexShrink: 0, minWidth: 24 }}>{n}</span>
                <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                  <span className="font-semibold text-navy">{bold}</span> {body}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(30,75,154,0.12)', marginTop: 32, paddingTop: 32, display: 'grid', gridTemplateColumns: '2fr auto 3fr', gap: 24, alignItems: 'center' }}>
            <div>
              <img src={img('expert-ai-15-bW3HXl.png')} alt="Standalone filter component" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Standalone component</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(30,75,154,0.2)', fontSize: 24, fontWeight: 300 }}>→</div>
            <div>
              <img src={img('expert-ai-16-BSVPlU.png')} alt="Filter integrated into full page" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Integrated into full page</p>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="FEEDBACK">Checking in with Design and Technical Teams</SubHeading>
            <Prose>
              <BodyText>
                Before moving to usability testing, I brought the dropdown panel back to the developers and Lead Designer for feasibility and layout feedback.
              </BodyText>
            </Prose>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 48 }}>
              <ConstraintCard
                title="Lead Designer"
                bullets={[
                  { text: 'Liked the consistency with the previous version.', type: 'check' },
                  { text: 'Suggested a more compact layout.', type: 'x' },
                  { text: 'Proposed making it horizontal and embedded into the screen.', type: 'x' },
                ]}
              />
              <ConstraintCard
                title="Developer"
                bullets={[
                  { text: 'Confirmed the dropdown behaviors were feasible.', type: 'check' },
                  { text: 'Noted that clicking to change state was simpler than drag and drop.', type: 'check' },
                  { text: 'Said the timeline was manageable with the current approach.', type: 'check' },
                ]}
              />
            </div>

            <div style={{ marginTop: 24, border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.03)', padding: 20 }}>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                <strong style={{ color: 'var(--color-navy)' }}>Takeaway:</strong> Consistency with the design system helped with both feasibility and timeline. I kept that foundation and improved the layout based on feedback.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 5. Solution ── */}
        <Section id="ea-features">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>5.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Solution
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
            <div>
              <SubHeading tag="FINAL DESIGN">New Filter Component</SubHeading>
              <BodyText>
                After incorporating feedback from both the design critique and technical team, I landed on a dropdown filter panel that sits alongside the results — users can see their data update in real time as they make selections.
              </BodyText>

              <div style={{ marginTop: 24, border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.03)', padding: 20 }}>
                <p className="font-sans font-bold text-navy" style={{ fontSize: 13, marginBottom: 12 }}>NEW GUIDELINES</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Click once to include a filter',
                    'Click twice to exclude',
                    'Click three times to reset',
                    'Blue and gray indicate status, with text labels for every state',
                  ].map(g => (
                    <li key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span className="text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
                      <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <video
                src="/videos/expert.ai-Video.webm"
                poster="/videos/expert.ai-Video-poster.png"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Final filter component — dropdown panel embedded alongside results</p>
            </div>
          </div>
        </Section>

        {/* ── 6. Impact ── */}
        <Section id="ea-impact">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>6.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Impact
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="TESTING">Testing and Impact</SubHeading>
            <BodyText>
              I ran usability testing with 8 enterprise users across legal, finance, and government. The Lead Designer observed sessions with me. I asked each user to complete filtering tasks while sharing their screen, watching for friction, what they clicked, and how long each task took.
            </BodyText>

            <ImpactToggle />

            <div className="cs-after-interactive" style={{ marginTop: 32, border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.03)', padding: 20 }}>
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy" style={{ fontSize: 11, marginBottom: 10 }}>Takeaway</p>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                The Lead Designer and I noted that two users still hesitated when trying to reset a filter. The three-click pattern (include → exclude → reset) was not obvious to everyone. If I had more time, I would add a small indicator showing what each click would do, and create an onboarding experience for first-time users.
              </p>
            </div>

          </div>
        </Section>

        {/* ── 7. Reflection ── */}
        <Section id="ea-reflection">
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="font-sans text-navy/40" style={{ fontSize: 13, fontWeight: 500 }}>7.</span>
              <h2 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
                Reflection
              </h2>
            </div>
            <div style={{
              borderTop: '1px solid rgba(30,75,154,0.2)',
              borderLeft: '1px solid rgba(30,75,154,0.2)',
              borderRight: '1px solid rgba(30,75,154,0.2)',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              height: 32,
              width: '100%',
            }} />
          </div>

          <div style={{ marginTop: 48 }}>
            <SubHeading tag="TAKEAWAYS">What this project taught me</SubHeading>
            <BodyText>This was my first UX Design internship — and the one that taught me to look beyond the brief.</BodyText>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
              {[
                { heading: 'Reframe before you solve', body: 'The initial brief was about usability. But looking deeper revealed an accessibility problem. Taking time to question the problem statement led to a better outcome.' },
                { heading: 'Advocacy through research', body: "User interviews and support ticket analysis gave me the evidence I needed to push for accessibility improvements — even when it wasn't in the original scope." },
                { heading: 'Gratitude', body: "I'm so grateful to the Expert.ai AI Innovation team for supporting my initiative and for the mentorship and guidance throughout the process." },
              ].map(({ heading, body }) => (
                <div key={heading} style={{ background: 'rgba(30,75,154,0.04)', border: '1px solid rgba(30,75,154,0.1)', padding: 20 }}>
                  <p className="font-sans font-bold text-navy" style={{ fontSize: 15, margin: '0 0 10px', lineHeight: 1.4 }}>{heading}</p>
                  <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <img src={img('expert-ai-19-ljiJuP.jpg')} alt="Snippet of final presentation" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Snippet of final presentation</p>
            </div>
          </div>
        </Section>

      </div>

      <NextProject
        title="PROS Fare Finder Map"
        to="/work/fare-finder"
        description="Designed and shipped a flight map tool for travelers to explore and book their next trip."
      />

      <Footer />
    </div>
  )
}
