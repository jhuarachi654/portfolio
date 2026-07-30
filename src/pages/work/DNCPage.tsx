import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { MapPin, Briefcase } from '@phosphor-icons/react'
import SectionHeading from '../../components/case-study/SectionHeading'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'dnc-intro',      label: 'Introduction' },
  { id: 'dnc-process',    label: 'Process' },
  { id: 'dnc-collection', label: 'Collection of Work' },
  { id: 'dnc-reflection', label: 'Reflection' },
]

const img = (f: string) => `/images/democratic-national-committee/${f}`

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

function Prose({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
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

// ─── Collection Gallery ───────────────────────────────────────────────────────

const collectionItems = [
  { file: 'Frame 27672.png', category: 'Anniversary', alt: 'VP Kamala Harris anniversary graphic',      label: 'VP Anniversary' },
  { file: 'Frame 27683.png', category: 'Anniversary', alt: 'VP Kamala Harris Fearless Fighter graphic', label: 'Fearless Fighter' },
  { file: 'Frame 27673.png', category: 'Merch',       alt: 'Biden 2024 sweatshirt',                    label: 'Biden Sweatshirt' },
  { file: 'Frame 27674.png', category: 'Merch',       alt: 'Biden 2024 merch collection',               label: 'Merch Collection' },
  { file: 'Frame 27675.png', category: 'Issue',       alt: 'Protect Reproductive Rights graphic',       label: 'Reproductive Rights' },
  { file: 'Frame 27677.png', category: 'Issue',       alt: 'Protect Affordable Health Care graphic',    label: 'Affordable Health Care' },
  { file: 'Group 4670.png',  category: 'Issue',       alt: 'Ban Assault Weapons graphic',               label: 'Ban Assault Weapons' },
  { file: 'Frame 27678.png', category: 'Campaign',    alt: 'Bidenomics 101 graphic',                    label: 'Bidenomics 101' },
  { file: 'Frame 27679.png', category: 'Campaign',    alt: 'Biden achievements infographic',             label: 'Biden Achievements' },
  { file: 'Frame 27682.png', category: 'Campaign',    alt: 'Biden achievements infographic v2',          label: 'Biden Achievements' },
]

const FILTERS = ['All', 'Anniversary', 'Issue', 'Campaign', 'Merch'] as const

function CollectionLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const close = useCallback(onClose, [onClose])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('overlay-open')
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
      document.body.classList.remove('overlay-open')
    }
  }, [close])

  return createPortal(
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,5vw,64px)', backdropFilter: 'blur(8px)', cursor: 'zoom-out' }}>
      <style>{`@keyframes lb-in { from{opacity:0;transform:scale(0.88) rotate(-1.5deg)} to{opacity:1;transform:scale(1) rotate(-1.5deg)} }`}</style>
      <div
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => document.body.classList.add('cursor-on-light-card')}
        onMouseLeave={() => document.body.classList.remove('cursor-on-light-card')}
        style={{ background: '#fff', padding: 'clamp(10px,2vw,18px)', paddingBottom: 'clamp(36px,6vw,60px)', boxShadow: '0 24px 80px rgba(0,0,0,0.55)', animation: 'lb-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards', transform: 'rotate(-1.5deg)', maxWidth: 'min(85vw,640px)', cursor: 'default', position: 'relative' }}>
        <img src={src} alt="" style={{ display: 'block', width: '100%', maxHeight: '65vh', objectFit: 'contain' }} />
        <button onClick={close} style={{ position: 'absolute', top: -14, right: -14, width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>
    </div>
  , document.body)
}

function CollectionGallery() {
  const [active, setActive] = useState<string>('All')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = active === 'All' ? collectionItems : collectionItems.filter(i => i.category === active)

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)} className="cs-tab-btn" style={{
            border: active === f ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
            background: 'transparent',
          }}>
            <span className="font-landing-body" style={{ fontSize: 13, fontWeight: active === f ? 600 : 400, color: active === f ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)' }}>{f}</span>
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div style={{ columns: 3, columnGap: 12 }}>
        {filtered.map(item => (
          <div
            key={item.file}
            data-cursor-label={item.label}
            style={{ position: 'relative', marginBottom: 12, breakInside: 'avoid' }}
            onClick={() => setSelected(item.file)}
          >
            <img src={img(item.file)} alt={item.alt} loading="lazy" className="collection-img" style={{ width: '100%', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </div>
        ))}
      </div>

      {selected && <CollectionLightbox src={img(selected)} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ─── VP Anniversary Explorer ──────────────────────────────────────────────────

const iterationOptions = [
  {
    label: 'Flag Photo',
    image: 'dnc-iter-1.png',
    isFinal: false,
    accessibility: { result: 'Fails (6.22)', note: 'Text legibility is poor against the high-contrast flag elements.' },
    photoChoice: 'While the photo is positive, the busy background creates legibility and hierarchy issues.',
  },
  {
    label: 'Outdoor Shot',
    image: 'dnc-iter-2.png',
    isFinal: false,
    accessibility: { result: 'Passes WCAG AAA (11.12)', note: 'Strong contrast on dark background.' },
    photoChoice: 'This in-action shot was a strong contender, but the team ultimately preferred a warmer photo.',
  },
  {
    label: 'Light Blue',
    image: 'dnc-iter-3.png',
    isFinal: false,
    accessibility: { result: 'Fails (3.08)', note: 'White text on a light blue background is not accessible.' },
    photoChoice: 'The image is positive, but the overall is bland and lacked the celebratory energy we wanted.',
  },
  {
    label: 'Navy Background',
    image: 'dnc-iter-4.png',
    isFinal: false,
    accessibility: { result: 'Passes WCAG AAA (14.68)', note: 'Strong contrast with navy background.' },
    photoChoice: "The photo's tone is muted and didn't feel celebratory enough for the event.",
  },
  {
    label: 'Final',
    image: 'dnc-iter-final.png',
    isFinal: true,
    accessibility: { result: 'Passes WCAG AAA (14.59)', note: 'Selected design. Layout is clear, tone is celebratory and professional.' },
    photoChoice: 'This photo was selected for its warm, professional, and celebratory tone.',
  },
]

function IterationExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = iterationOptions[selected]
  const passes = opt.accessibility.result.startsWith('Passes')
  return (
    <div>
      <div className="cs-card-box" style={{ padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <SubHeading>VP Anniversary Iterations</SubHeading>
            <BodyText>I tested a few different directions before landing on the final version. The photo selection told people whether this was a celebration or an announcement. The layout told them whether to feel inspired or just informed.</BodyText>
            <div className="dnc-iter-quote" style={{ borderLeft: '2px solid rgba(var(--color-navy-rgb),0.2)', paddingLeft: 16, marginBottom: 24 }}>
              <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>Throughout the process, I got input from my team, which helped me narrow down the options.</p>
            </div>
            <div className="dnc-iter-tabs">
              {iterationOptions.map((o, i) => (
                <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                  border: o.isFinal ? '1px solid var(--color-cs-heading)' : selected === i ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
                  background: o.isFinal && selected === i ? 'var(--color-cs-heading)' : 'transparent',
                }}>
                  <span className="font-landing-body" style={{ fontSize: 13, fontWeight: o.isFinal || selected === i ? 600 : 400, color: o.isFinal ? (selected === i ? '#ffffff' : 'var(--color-cs-heading)') : selected === i ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)', whiteSpace: 'nowrap' }}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <img src={img(opt.image)} alt={opt.label} className="dnc-iter-img" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <div style={{ border: `1px solid ${passes ? 'rgba(var(--color-navy-rgb),0.2)' : 'rgba(200,50,50,0.3)'}`, borderRadius: 12, padding: 10 }}>
                <p className={`font-landing-body font-semibold${passes ? '' : ' cs-a11y-fail'}`} style={{ fontSize: 11, color: passes ? 'var(--color-cs-heading)' : undefined, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Accessibility: {opt.accessibility.result}</p>
                <p className="font-landing-body" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{opt.accessibility.note}</p>
              </div>
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 10 }}>
                <p className="font-landing-body font-semibold" style={{ fontSize: 11, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Photo Choice</p>
                <p className="font-landing-body" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{opt.photoChoice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hero Lottie — autoplays by default; the button is the sole manual control ──

function HeroLottie() {
  const [data, setData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    // Defers the 5.8MB Lottie fetch/parse off the initial render's critical
    // path — the hero image is fixed-size regardless, so the rest of the
    // page can paint before this heavy JSON.parse runs.
    const load = () => fetch('/videos/DNC-Video.json').then(r => r.json()).then(setData).catch(() => {})
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load)
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(load, 0)
    return () => clearTimeout(id)
  }, [])

  const handleToggle = () => {
    if (playing) { lottieRef.current?.pause(); setPlaying(false) }
    else { lottieRef.current?.play(); setPlaying(true) }
  }

  return (
    <div className="w-full h-full overflow-hidden" style={{ position: 'relative' }}>
      {data && (
        <Lottie
          lottieRef={lottieRef}
          animationData={data}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.5)' }}
        />
      )}
      {data && <PlayPauseButton playing={playing} onToggle={handleToggle} />}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DNCPage() {
  useCaseToc(TOC, 'Campaign Design')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: 'linear-gradient(135deg, #2b3a8f, #1a2358)', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <HeroLottie />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-cs-heading)', marginBottom: 8, borderLeft: '2px solid var(--color-navy)', paddingLeft: 10 }}>Democratic National Committee</p>
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              Campaign Design
            </h1>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
              The Democratic National Committee's in-house design team powers the party's visual brand. I interned on the Mobilization team during the 2024 presidential campaign, turning around digital assets for a national audience under same-day deadlines. In four months, our work earned 5,500 likes and 600 shares across platforms.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Visual Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2023' },
                { label: 'Team',     value: 'Design Director, Graphic Designers' },
                { label: 'Tools',    value: 'Figma, Monday, Slack' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>

            
            <a href="#dnc-collection" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to collection</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Introduction ── */}
        <Section id="dnc-intro">
          <SectionHeading index={1} chapter="Introduction" heading="" />
          <SubHeading>Forty graphics in four months, eighteen same-day, for a national audience</SubHeading>
          <BodyText>The Democratic National Committee runs design for the Democratic party. I joined the Mobilization team as a Visual Design Intern, working under a Design Director alongside a team of Graphic Designers.</BodyText>
          <BodyText>Every asset went out to a national audience across Instagram, Facebook, email, and merch, supporting the Biden-Harris campaign and Democratic platform initiatives. Some requests came with a week of lead time. Others arrived in the morning and needed to ship the same afternoon. The brand was mid-transition when I joined, which meant every graphic had to feel consistent with a system that was still being defined.</BodyText>
          <BodyText>That combination of tight timelines, high visibility, and an evolving brand system shaped every design decision I made that summer.</BodyText>

          <div style={{ marginTop: 32 }}>
            <ChallengeBanner
              label="Challenge"
              question="How might I balance brand consistency, accessibility, and quality to create effective, inclusive designs on tight timelines?"
            />
          </div>
        </Section>

        {/* ── Process ── */}
        <Section id="dnc-process">
          <SectionHeading index={2} chapter="Process" heading="" />
          <SubHeading>Every graphic went through the same six steps, brief to handoff, even on the tightest deadlines</SubHeading>
          <BodyText>The workload at the DNC changed constantly. Some requests came with a week of notice. Others arrived in the morning with a same-day deadline. My schedule varied week to week, but the process stayed the same no matter how much time I had.</BodyText>
          <BodyText>Every graphic went through six steps:</BodyText>

          <ul style={{ listStyle: 'none', margin: '8px 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: 'Brief', body: 'Art Director or Ad Strategist wrote the creative brief.' },
              { step: 'Draft', body: 'I explored directions and landed on a concept.' },
              { step: 'Review', body: 'The full design team reviewed the work live and gave feedback.' },
              { step: 'Revision', body: 'I revised based on feedback and sent the asset for verification.' },
              { step: 'Verification', body: 'Brand Strategist checked against brand standards.' },
              { step: 'Handoff', body: 'Approved asset sent to digital channels for publication.' },
            ].map(({ step, body }) => (
              <li key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
                <span className="font-landing-body text-[14px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                  <strong className="text-[var(--color-cs-heading)]">{step}</strong> — {body}
                </span>
              </li>
            ))}
          </ul>

          <BodyText>That consistency mattered most on the hardest days. Same-day requests still got six rounds of eyes before they went live.</BodyText>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Designing for two audiences in every file</SubHeading>
            <BodyText>Every graphic had to work for two very different people at once. The first was the scrolling voter, someone encountering the post on their phone with no context and no patience. The message had to land immediately: clear text, accessible contrast, meaning evident at a glance.</BodyText>
            <BodyText>The second was the Brand Strategist reviewing the asset before it went out. They needed to trust the design met brand standards so their feedback could be specific and fast. They had no time to catch basic mistakes.</BodyText>
            <BodyText>Every layout decision I made was an answer to both at once.</BodyText>

            <div className="dnc-persona-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              {[
                {
                  type: 'The Scrolling Voter',
                  name: 'Sam',
                  location: 'United States',
                  role: 'Everyday citizen',
                  avatar: img('dnc-avatar-sam.jpg'),
                  needs: ['Understand the message fast', 'Read the text easily', 'Feel connected without overthinking'],
                },
                {
                  type: 'Brand Strategist',
                  name: 'Jordan',
                  location: 'Washington, D.C.',
                  role: 'DNC brand team',
                  avatar: img('dnc-avatar-jordan.jpg'),
                  needs: ['Trust the brand work is done', 'Have time to give real feedback', 'Get a design that is almost ready to go'],
                },
              ].map(({ type, name, location, role, avatar, needs }) => (
                <div key={name} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.15)', flexShrink: 0 }}>
                      <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    </div>
                    <div>
                      <span className="font-landing-body font-semibold" style={{ fontSize: 11, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{type}</span>
                      <h4 className="font-semibold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 20, margin: '2px 0 4px' }}>{name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} weight="bold" /> {location}
                        </span>
                        <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Briefcase size={12} weight="bold" /> {role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 10 }}>Needs:</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {needs.map(n => (
                      <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span className="text-[var(--color-cs-heading)] font-bold shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
                        <span className="font-landing-body" style={{ fontSize: 14, color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>A same-day milestone graphic for the Vice President</SubHeading>
            <BodyText>The Kamala Harris anniversary post is the clearest example of that process under pressure. The brief arrived the morning it needed to go live. The Vice President was hitting a milestone in office and the post needed to be on Instagram that afternoon.</BodyText>
            <BodyText>I explored several directions before landing on the photo. The image choice was the first decision because it set the tone for everything else: a celebratory photo read as a milestone, a formal one read as an announcement. Each option carried a different message before anyone read a word.</BodyText>
            <BodyText>I ran contrast checks on every version. The flag photo scored 6.22 on the WCAG scale, below the minimum for accessible text legibility. It was a strong image but it did not meet the accessibility bar, so I eliminated it. The final version used a warmer photo against a solid background, scoring 14.59 and passing WCAG AAA. The layout was clear, the tone matched the occasion, and it cleared every quality check before it went out.</BodyText>
            <BodyText>The team had mixed reactions throughout. One designer preferred the flag photo for authenticity. Another felt the final version read as more celebratory. The Design Director asked for earlier turnarounds on future requests to allow more breathing room. I took all of it in and made the call that best served the brief.</BodyText>
          </div>

          <div style={{ marginTop: 86 }}>
            <IterationExplorer />
          </div>
        </Section>

        {/* ── Collection of Work ── */}
        <Section id="dnc-collection">
          <SectionHeading index={3} chapter="Collection of Work" heading="" />
          <BodyText>Forty graphics across four months: anniversary posts, issue campaigns, donation drives, and merch. Every asset met WCAG accessibility standards before handoff.</BodyText>
          <div style={{ marginTop: 24 }}>
            <CollectionGallery />
          </div>
        </Section>

        {/* ── Reflection ── */}
        <Section id="dnc-reflection">
          <SectionHeading index={4} chapter="Reflection" heading="" />

          <BodyText>In four months: 40 graphics, 18 same-day, 5,500 likes and 600 shares across Instagram and TikTok.</BodyText>
          <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 32 }}>All figures measured by the DNC.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { heading: 'Every design choice communicates something', body: 'Photo selection, type weight, color temperature: none of those are neutral decisions, especially in a political context where every visual carries weight. Working at this pace and this scale taught me to be deliberate about every element, not because I had time to second-guess everything, but because I learned to trust the reasoning behind my first call.' },
              { heading: 'Speed and quality have to coexist', body: 'Same-day does not mean subpar. Every asset still went through six steps regardless of the timeline. The constraint was time, not standard. Working inside that structure taught me that tight deadlines sharpen decisions rather than compromise them.' },
              { heading: 'Gratitude', body: "I am grateful to the DNC's Mobilization team for trusting me with work that reached millions of people, for building an environment where a junior designer could contribute meaningfully from day one, and for a memorable summer in D.C." },
            ].map(({ heading, body }) => (
              <div key={heading} className="cs-info-box" style={{ padding: 14 }}>
                <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 10px' }}>{heading}</p>
                <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </Section>

      </div> {/* end padded wrapper */}

      <NextProject
        title="Expert.ai"
        to="/work/expert-ai"
        tags={["Enterprise", "Accessibility", "Product Design Intern"]}
        description="Redesigned filtering for an AI text analysis platform, improving accessibility."
        video="/videos/expert.ai-Video.webm"
        poster="/videos/expert.ai-Video-poster.png"
        restTime={4}
        mediaPadding={16}
        objectFit="contain"
        category="accessibility"
        bgColor="#c4ecff"
      />

    </div>
  )
}
