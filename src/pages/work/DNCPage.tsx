import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { MapPin, Briefcase, Megaphone, Users, PaintBrush, Star } from '@phosphor-icons/react'
import Footer from '../../components/Footer'
import SectionHeading from '../../components/case-study/SectionHeading'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'dnc-intro',      label: 'Introduction' },
  { id: 'dnc-context',    label: 'Context' },
  { id: 'dnc-audience',   label: 'Audience' },
  { id: 'dnc-process',    label: 'Design Process' },
  { id: 'dnc-solution',   label: 'Final Design' },
  { id: 'dnc-collection', label: 'Collection of Work' },
  { id: 'dnc-impact',     label: 'Impact' },
  { id: 'dnc-reflection', label: 'Reflection' },
]

const img = (f: string) => `/images/democratic-national-committee/${f}`

// ─── Hero Lottie ──────────────────────────────────────────────────────────────

function HeroLottie() {
  const [data, setData] = useState<object | null>(null)
  useEffect(() => {
    fetch('/videos/DNC-Video.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])
  return (
    <div className="w-full aspect-video overflow-hidden">
      {data && (
        <Lottie animationData={data} loop autoplay style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`max-w-[1080px] px-8 md:px-14 cs-section ${className}`}
      style={{ marginTop: 96 }}
    >
      {children}
    </motion.section>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
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
            border: active === f ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
            background: active === f ? 'rgba(30,75,154,0.08)' : 'transparent',
          }}>
            <span className="font-sans" style={{ fontSize: 13, fontWeight: active === f ? 600 : 400, color: active === f ? '#1E4B9A' : 'rgba(30,75,154,0.4)' }}>{f}</span>
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
            <img src={img(item.file)} alt={item.alt} loading="lazy" className="collection-img" style={{ width: '100%', display: 'block' }} />
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
      <div className="dnc-iter-container" style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <SubHeading tag="GRAPHIC EXPLORATION">VP Anniversary Iterations</SubHeading>
            <BodyText>I tested a few different directions before landing on the final version. The photo selection told people whether this was a celebration or an announcement. The layout told them whether to feel inspired or just informed.</BodyText>
            <div className="dnc-iter-quote" style={{ borderLeft: '2px solid rgba(30,75,154,0.2)', paddingLeft: 16, marginBottom: 24 }}>
              <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>Throughout the process, I got input from my team, which helped me narrow down the options.</p>
            </div>
            <div className="dnc-iter-tabs">
              {iterationOptions.map((o, i) => (
                <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                  border: o.isFinal ? '1px solid #1E4B9A' : selected === i ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
                  background: o.isFinal ? (selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.12)') : selected === i ? 'rgba(30,75,154,0.08)' : 'transparent',
                }}>
                  <span className="font-sans" style={{ fontSize: 13, fontWeight: o.isFinal || selected === i ? 600 : 400, color: o.isFinal ? (selected === i ? '#ffffff' : '#1E4B9A') : selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.4)', whiteSpace: 'nowrap' }}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <img src={img(opt.image)} alt={opt.label} className="dnc-iter-img" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <div style={{ border: `1px solid ${passes ? 'rgba(30,75,154,0.2)' : 'rgba(200,50,50,0.3)'}`, padding: 10 }}>
                <p className="font-sans font-semibold" style={{ fontSize: 11, color: passes ? '#1E4B9A' : '#c03030', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Accessibility — {opt.accessibility.result}</p>
                <p className="font-sans" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{opt.accessibility.note}</p>
              </div>
              <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 10 }}>
                <p className="font-sans font-semibold" style={{ fontSize: 11, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Photo Choice</p>
                <p className="font-sans" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{opt.photoChoice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DNCPage() {
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
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)' }}>
            <HeroLottie />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <h1 className="text-[44px] sm:text-[58px] font-bold text-navy-dark leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
              Democratic National Committee
            </h1>
            <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 24 }}>
              Created campaign assets across social, ads, and email for the Biden-Harris administration as a Visual Design intern on the DNC Mobilization team.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: 'Role',     value: 'Visual Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2023' },
                { label: 'Team',     value: 'Design Director, Graphic Designers' },
                { label: 'Tools',    value: 'Figma, Monday, Slack' },
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

        {/* ── Introduction ── */}
        <Section id="dnc-intro">
          <SectionHeading index={1} chapter="Introduction" heading="" />
          <SubHeading tag="OVERVIEW">Mobilization team at the Democratic National Committee (DNC)</SubHeading>
          <BodyText>I joined the Mobilization team at the DNC as the Visual Design intern. The DNC acts as the in-house design agency for the DNC initiatives supporting both the Biden-Harris administration and the Democratic platform as well. I managed requests for both simultaneously and even had same-day deadlines.</BodyText>
          <div style={{ borderLeft: '2px solid rgba(30,75,154,0.2)', paddingLeft: 16, marginBottom: 32 }}>
            <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>
              <span className="font-semibold text-navy">Context: </span>The Biden-Harris branding system was in midst of a transition when I joined.
            </p>
          </div>
          <figure style={{ marginTop: 48 }}>
            <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
              <img src={img('democratic-national-committee-05-EPOpQr.png')} alt="Biden-Harris 2024 branding" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
            </div>
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>This is the new branding for the Biden-Harris 2024 campaign. It was characterized by handwritten elements, gradients, and brighter blues and reds.</figcaption>
          </figure>
        </Section>

        {/* ── Context ── */}
        <Section id="dnc-context">
          <SectionHeading index={2} chapter="Context" heading="" />
          <SubHeading tag="WORKFLOW">The journey of a design ticket request</SubHeading>

          <BodyText>The workload at the DNC changed all the time. Some days a protest would break out and I had to drop everything to design something that same day. Other times I got assignments with a week or two of notice. My schedule never looked the same week to week, but I learned to adapt fast.</BodyText>
          <BodyText>No matter the timeline, every request followed the same path. Here is how a typical ticket moved from brief to handoff.</BodyText>

          <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
            <img src={img('democratic-national-committee-06-S5fGOr.png')} alt="Design ticket workflow" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Every graphic went through the same six steps: brief, draft, feedback, revisions, verification, and handoff. *Even in same-day design requests</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
            <div>
              <SubHeading>The Challenge</SubHeading>
              <BodyText>Design requests came in on a daily basis. The brand was mid-transition, so I had to balance that while still delivering high quality work.</BodyText>
              <BodyText>Every digital asset reached thousands or even millions of people, which meant real potential for impact. With my background in psychology, I wanted my designs to be inclusive, so I made sure everything met WCAG accessibility. Additionally, the review process with tight deadlines sometimes left me less than a day to finish a request.</BodyText>
              <BodyText>The process was exciting yet I had to keep tabs on myself and be considerate of the constraints.</BodyText>
            </div>
            <figure style={{ margin: 0 }}>
              <img src={img('democratic-national-committee-07-VCrcQ3.gif')} alt="Balance — mentality throughout design requests" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>This was my mentality throughout the design requests</figcaption>
            </figure>
          </div>

          <div style={{ marginTop: 48 }}>
            <ChallengeBanner
              label="Challenge"
              question="How might I balance brand consistency, accessibility, and quality to create effective, inclusive designs?"
            />
          </div>
        </Section>

        {/* ── Audience ── */}
        <Section id="dnc-audience">
          <SectionHeading index={3} chapter="Audience" heading="" />
          <SubHeading tag="AUDIENCE">Who I Designed For</SubHeading>

          <BodyText>As I did my design requests, I kept two distinct perspectives in mind while designing.</BodyText>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
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
              <div key={name} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(30,75,154,0.15)', flexShrink: 0 }}>
                    <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                  <div>
                    <span className="font-sans font-semibold" style={{ fontSize: 11, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{type}</span>
                    <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '2px 0 4px' }}>{name}</h4>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} weight="bold" /> {location}
                      </span>
                      <span className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={12} weight="bold" /> {role}
                      </span>
                    </div>
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.12)', marginBottom: 16 }} />
                <p className="font-sans font-bold text-navy" style={{ fontSize: 13, marginBottom: 10 }}>Needs:</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {needs.map(n => (
                    <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span className="text-navy font-bold shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
                      <span className="font-sans" style={{ fontSize: 14, color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Design Process ── */}
        <Section id="dnc-process">
          <SectionHeading index={4} chapter="Design Process" heading="" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginTop: 8 }}>
            <div>
              <SubHeading tag="FEATURED WORK">Kamala Anniversary Graphic</SubHeading>
              <BodyText>Kamala Harris is someone who inspires me. When the Vice President was about to hit a milestone anniversary in office, the request came in last minute for an Instagram post.</BodyText>
              <BodyText>I had worked on many graphics by this point, but this one stood out because of how many things I had to balance at once. The timeline was tight, but the stakes felt high. This was a memorable event, and a lot of people were going to see it.</BodyText>
              <BodyText>Here is how the Kamala anniversary graphic came together.</BodyText>
            </div>
            <figure style={{ margin: 0 }}>
              <img src={img('democratic-national-committee-10-5DfmYK.png')} alt="VP Kamala Harris reference photo" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </figure>
          </div>

          <div style={{ marginTop: 48 }}>
            <IterationExplorer />
          </div>

          <div className="cs-after-interactive" style={{ marginTop: 48 }}>
            <SubHeading tag="FEEDBACK">What the team said</SubHeading>
            <BodyText>One of my favorite parts about design is the iterative process and the discussions centered on layout, feeling, and more. Not everyone agreed on the same thing, but that is alright. Some wanted a different photo. Some wanted a cleaner layout. At the end of the day, they helped me consider aspects of the designs I hadn't thought about.</BodyText>
            <div style={{ borderLeft: '2px solid rgba(30,75,154,0.2)', paddingLeft: 16, marginBottom: 32 }}>
              <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>
                <strong>Takeaway:</strong> I had to narrow in on the solution, so I focused on what made the most sense for the graphic and took that in with the iterations.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { quote: 'I still liked the other photo better. It felt more genuine.', role: 'Ad Strategist', icon: <Megaphone size={20} weight="thin" color="var(--color-navy)" /> },
                { quote: 'The colors feel much more celebratory now.', role: 'Graphic Designer', icon: <PaintBrush size={20} weight="thin" color="var(--color-navy)" /> },
                { quote: 'Nice speed. Just send it over sooner so we have more breathing room.', role: 'Design Director', icon: <Briefcase size={20} weight="thin" color="var(--color-navy)" /> },
              ].map(({ quote, role, icon }) => (
                <div key={quote} style={{ border: '1px solid rgba(30,75,154,0.1)', background: 'rgba(30,75,154,0.04)', padding: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(30,75,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    {icon}
                  </div>
                  <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 11, color: 'var(--color-navy)', margin: '0 0 8px' }}>{role}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'rgba(30,75,154,0.15)', lineHeight: 1, flexShrink: 0 }}>"</span>
                    <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0, fontStyle: 'italic' }}>{quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </Section>

        {/* ── Final Design ── */}
        <Section id="dnc-solution">
          <SectionHeading index={5} chapter="Final Design" heading="" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p className="font-sans" style={{ fontSize: 15, color: 'var(--color-secondary)', lineHeight: 1.7, margin: '0 0 4px' }}>The final graphic went live on Instagram for the Vice President's anniversary milestone.</p>
              {[
                { tag: 'ACCESSIBILITY', heading: 'Color Contrast Check', body: 'Contrast ratio 14.59 — passes WCAG AAA.' },
                { tag: 'RATIONALE', heading: 'Why this design won', body: 'The layout is clear, the tone is celebratory and professional, and it meets accessibility standards.' },
                { tag: 'PHOTO CHOICE', heading: 'Why this photo', body: 'Warm, professional, and celebratory — this image matched the energy of the milestone.' },
              ].map(({ tag, heading, body }) => (
                <div key={tag} style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 16 }}>
                  <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 10, color: 'var(--color-navy)', margin: '0 0 6px' }}>{tag}</p>
                  <p className="font-sans font-bold text-navy" style={{ fontSize: 14, margin: '0 0 4px' }}>{heading}</p>
                  <p className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{body}</p>
                </div>
              ))}
            </div>

            <img src={img('dnc-iter-final.png')} alt="Final VP Anniversary graphic" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
          </div>

        </Section>

        {/* ── Collection of Work ── */}
        <Section id="dnc-collection">
          <SectionHeading index={6} chapter="Collection of Work" heading="" />
          <SubHeading tag="COLLECTION">Here are some of the digital assets I made!</SubHeading>
          <CollectionGallery />
        </Section>

        {/* ── Reflection ── */}
        {/* ── Impact ── */}
        <Section id="dnc-impact">
          <SectionHeading index={7} chapter="Impact" heading="" />
          <SubHeading tag="IMPACT">Results</SubHeading>
          <BodyText>Being part of the Mobilization team at the DNC pushed my visual design skills. I got to learn quickly on my feet, consider multiple perspectives, and think about the real-world reach of my work. I also got to practice my interest in accessibility — I advocated for it regularly, shared WCAG checking tools with my team, caught a few issues along the way, and the team started paying more attention to it because of it.</BodyText>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
            {[
              { label: 'IN 4 MONTHS', stat: '40 graphics', body: 'Designed across Instagram, Facebook, email, and merch.' },
              { label: 'REQUESTS', stat: '18 same day', body: 'Turned around within hours while still leaving room for feedback, revisions, and handoff.' },
              { label: 'ACROSS INSTAGRAM AND TIKTOK', stat: '5,500 likes\n600 shares', body: 'People saw and responded to the work I made.' },
            ].map(({ label, stat, body }) => (
              <div key={label} style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 20 }}>
                <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 10, color: 'var(--color-secondary)', margin: '0 0 8px' }}>{label}</p>
                <p className="font-bold text-navy" style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 8px', lineHeight: 1.2, whiteSpace: 'pre-line' }}>{stat}</p>
                <p className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="dnc-reflection">
          <SectionHeading index={8} chapter="Reflection" heading="" />

          <SubHeading tag="TAKEAWAYS">What I'd carry forward from a summer in D.C.</SubHeading>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start', marginTop: -8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { heading: 'Design communicates', body: 'Every choice — photo, color, layout — tells people how to feel. I learned to be intentional even under pressure, because nothing is neutral.' },
                { heading: 'Speed and quality coexist', body: 'Same-day turnarounds taught me to work faster without sacrificing accessibility or brand integrity. Constraints sharpen your thinking.' },
                { heading: 'Gratitude', body: 'I am grateful to the Mobilization team for trusting me with real work and for creating the kind of environment where I could grow quickly.' },
              ].map(({ heading, body }) => (
                <div key={heading} style={{ background: 'rgba(30,75,154,0.04)', border: '1px solid rgba(30,75,154,0.1)', padding: 14 }}>
                  <p className="font-sans font-bold text-navy" style={{ fontSize: 15, margin: '0 0 10px' }}>{heading}</p>
                  <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>

            <figure style={{ margin: 0 }}>
              <img src={img('democratic-national-committee-18-clohhk.jpg')} alt="DC Metro" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Snippet of my morning commute! DC Metro is so cool</figcaption>
            </figure>
          </div>
        </Section>

      </div> {/* end padded wrapper */}

      <NextProject
        title="PROS Revenue Management"
        to="/work/revenue-management"
        description="Modernized an AI-powered airline pricing platform for 50+ carrier analysts."
      />

      <Footer />
    </div>
  )
}
