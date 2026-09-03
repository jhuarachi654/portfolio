import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { MapPin, Gear, Asterisk, Megaphone, CaretLeft, CaretRight, Quotes } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'dnc-intro',            label: 'Introduction' },
  { id: 'dnc-solution-preview', label: 'Solution Preview' },
  { id: 'dnc-context',          label: 'Context' },
  { id: 'dnc-vp',               label: 'VP Graphic' },
  { id: 'dnc-collection',       label: 'Collection' },
  { id: 'dnc-impact',           label: 'Impact' },
  { id: 'dnc-reflection',       label: 'Reflection' },
]

const img = (f: string) => `/images/democratic-national-committee/${f}`

// ─── Section wrapper ──────────────────────────────────────────────────────────

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
    <p className="font-landing-body text-[15px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
      {children}
    </p>
  )
}

function SubHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties}>
      {tag && (
        <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]/50" style={{ fontSize: 13, marginBottom: 6 }}>{tag}</p>
      )}
      <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function StatBlock({ label, stat, statSecondary, description }: { label: string; stat: string; statSecondary?: string; description: string }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 8px' }}>{label}</p>
      <div style={{ marginBottom: 12 }}>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', fontWeight: 500, color: '#416BCC', display: 'block' }} />
        {statSecondary && <CountUp stat={statSecondary} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', fontWeight: 500, color: '#416BCC', display: 'block' }} />}
      </div>
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

// ─── Persona card ─────────────────────────────────────────────────────────────

// ─── Collection Gallery ───────────────────────────────────────────────────────

const collectionItems = [
  { file: 'dnc-collection-vp-anniversary.webp',      alt: 'VP Kamala Harris anniversary graphic',                   label: 'VP Anniversary' },
  { file: 'dnc-collection-ban-weapons-1.webp',        alt: 'Ban Assault Weapons graphic',                            label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-ban-weapons-2.webp',        alt: 'Ban Assault Weapons repeating pattern graphic',          label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-ban-weapons-3.webp',        alt: 'Ban Assault Weapons repeating pattern graphic',          label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-ban-weapons-4.webp',        alt: 'Ban Assault Weapons graphic',                            label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-sweatshirt.webp',           alt: 'Biden 2024 sweatshirt',                                  label: 'Biden Sweatshirt' },
  { file: 'dnc-collection-merch.webp',                alt: 'Biden 2024 merch collection',                            label: 'Merch Collection' },
  { file: 'dnc-collection-reproductive-rights.webp',  alt: 'Protect Reproductive Rights and Abortion Access graphic', label: 'Reproductive Rights' },
  { file: 'dnc-collection-healthcare.webp',           alt: 'Protect Affordable Health Care graphic',                 label: 'Affordable Health Care' },
  { file: 'dnc-collection-lgbtq-rights.webp',         alt: 'Protect and Advance LGBTQ+ Rights graphic',              label: 'LGBTQ+ Rights' },
  { file: 'dnc-collection-bidenomics-101.webp',       alt: 'Bidenomics 101 graphic',                                 label: 'Bidenomics 101' },
  { file: 'dnc-collection-jobs-thumbsup.webp',        alt: 'Biden jobs and economy achievements infographic',        label: 'Biden Achievements' },
  { file: 'dnc-collection-jobs-waving.webp',          alt: 'Biden jobs and economy achievements infographic',        label: 'Biden Achievements' },
  { file: 'dnc-collection-training-academy.webp',     alt: 'Summer Training Academy Organizing to Victory graphic',  label: 'Summer Training Academy' },
]

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
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <div style={{ columns: 3, columnGap: 12 }}>
        {collectionItems.map(item => (
          <div
            key={item.file}
            data-cursor-label={item.label}
            style={{ position: 'relative', marginBottom: 12, breakInside: 'avoid', overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}
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

// ─── VP Anniversary iteration explorer ───────────────────────────────────────

const iterationOptions = [
  { label: 'Flag Photo', image: 'dnc-iter-1.webp' },
  { label: 'Outdoor Shot', image: 'dnc-iter-2.webp' },
  { label: 'Light Blue', image: 'dnc-iter-3.webp' },
  { label: 'Navy Background', image: 'dnc-iter-4.webp' },
  { label: 'Final', image: 'dnc-iter-final.webp' },
]

const CIRCLE_BTN: React.CSSProperties = { flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 43, 85, 0.35)', color: '#ffffff', cursor: 'pointer', backdropFilter: 'blur(4px)' }

function IterationImageCarousel({ src, alt, index, label, onPrev, onNext }: { src: string; alt: string; index: number; label: string; onPrev: () => void; onNext: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={onPrev} aria-label="Show previous" style={CIRCLE_BTN}><CaretLeft size={12} weight="bold" /></button>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <motion.div
          key={index}
          initial={{ x: 24 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}
        >
          <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
          <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{label}</p>
        </motion.div>
      </div>
      <button onClick={onNext} aria-label="Show next" style={CIRCLE_BTN}><CaretRight size={12} weight="bold" /></button>
    </div>
  )
}

function IterationExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = iterationOptions[selected]
  const total = iterationOptions.length
  const prev = () => setSelected((selected - 1 + total) % total)
  const next = () => setSelected((selected + 1) % total)
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div>
        <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Graphic Exploration</p>
        <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
          VP Anniversary Iterations
        </h3>
        <BodyText>I tested a few different directions for the Kamala Harris graphic before landing on the final version. I realized that every design choice sends a message, even the ones you do not think about. The photo selection told people whether this was a celebration or an announcement. The layout told them whether to feel inspired or just informed. I got the chance to look at the design through multiple perspectives.</BodyText>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
          <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
          <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
            Throughout the process, I got input from my team, which helped me narrow down the options.
          </p>
        </div>
      </div>
      <IterationImageCarousel src={img(opt.image)} alt={opt.label} index={selected} label={opt.label} onPrev={prev} onNext={next} />
    </div>
  )
}

// ─── Hero Lottie ──────────────────────────────────────────────────────────────

function HeroLottie() {
  const [data, setData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
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
          style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.2)' }}
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
          <div style={{ background: 'linear-gradient(135deg, #2b3a8f, #1a2358)', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.1)' }}>
            <HeroLottie />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-[42px] pt-14 pb-16">
            <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              Campaign Design
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              The Democratic National Committee runs the digital communications for the Democratic Party. As a Digital Design Intern, I worked with the communications and design team to produce graphics for the Biden-Harris campaign. Over 4 months, I produced 42 WCAG-compliant assets across social media, digital ads, and email.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',         value: 'Digital Design Intern' },
                { label: 'Timeline',     value: 'Jun – Sep 2023' },
                { label: 'Team',         value: 'Design & Comms Team' },
                { label: 'Tools/Skills', value: 'Figma' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
                </div>
              ))}
            </div>

            <a href="#dnc-collection" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to collection</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="dnc-intro">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>1. Introduction</p>
          </div>

          <div>
            <SubHeading>Campaign graphics at the DNC</SubHeading>
            <BodyText>
              The Democratic National Committee runs the digital communications for the Democratic Party. During the summer of 2023, I joined as a Digital Design Intern on the Biden-Harris campaign, working with the communications and design team to produce graphics for social media, digital ads, and email.
            </BodyText>
            <BodyText>
              The work moved fast. Requests came in daily, sometimes with same-day turnarounds. Every asset had to be WCAG-compliant. And the campaign's visual identity was actively shifting. Colors, fonts, and graphic accents were being updated as the brand evolved.
            </BodyText>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                The challenge wasn't any one graphic. It was doing this <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>consistently, at speed, across dozens of assets,</strong> while the brand itself was still being defined.
              </p>
            </div>

            <figure style={{ margin: '24px 0 0', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
              <img src={img('branding-transition.png')} alt="Biden-Harris 2024 campaign branding, including handwritten ad copy, donor call-to-action graphics, bumper stickers, and buttons" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>This is the new branding for the Biden-Harris 2024 campaign. It was characterized by handwritten elements, gradients, and brighter blues and reds.</figcaption>
            </figure>
          </div>
        </Section>

        {/* ── 2. Solution Preview ── */}
        <Section id="dnc-solution-preview">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>2. Solution Preview</p>
          </div>

          <div className="dnc-solution-preview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { file: 'Frame 27675.png', alt: 'Protect Reproductive Rights graphic' },
              { file: 'Frame 27677.png', alt: 'Protect Affordable Health Care graphic' },
              { file: 'Frame 27678.png', alt: 'Bidenomics 101 graphic' },
              { file: 'dnc-vp-anniversary-graphic.png', alt: 'VP Kamala Harris anniversary graphic' },
            ].map(({ file, alt }) => (
              <img key={file} src={img(file)} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, border: '1px solid rgba(var(--color-navy-rgb),0.2)' }} />
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>TL:DR</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
                42 graphics. 4 months. Every one WCAG-compliant.
              </h3>
              <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                Campaign assets for the Biden-Harris campaign delivered under same-day deadlines, through a live brand transition, and to national Democratic Party channels.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 3. Context ── */}
        <Section id="dnc-context">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Context</p>
          </div>

          <div>
            <SubHeading>The journey of a design ticket request</SubHeading>
            <BodyText>
              The workload at the DNC changed all the time. Some days a protest would break out and I had to drop everything to design something that same day. Other times I got assignments with a week or two of notice. My schedule never looked the same week to week, but I learned to adapt fast.
            </BodyText>
            <BodyText>
              No matter the timeline, every request followed the same path. Here is how a typical ticket moved from brief to handoff.
            </BodyText>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }}>
              <img src={img('design-ticket-process.png')} alt="Flowchart of the design ticket process: request created by brand strategist and ads coordinator, then me as visual design intern, creates draft of design, live review with entire design team, revisions based on feedback, and verification and handoff" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Every graphic went through the same six steps: brief, draft, feedback, revisions, verification, and handoff. *Even in same-day design requests</figcaption>
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>Who I Designed For</SubHeading>
            <BodyText>
              As I did my design requests, I kept two distinct perspective in mind while designing.
            </BodyText>
            <BodyText>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>First, the person scrolling Instagram on their phone.</strong> They were moving fast, so the message had to land in seconds. That meant clear typography, strong contrast, and no clutter.
            </BodyText>
            <BodyText>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>Second, the internal stakeholders who had to approve the graphic.</strong> They needed assets fast and of high quality.
            </BodyText>

            <div className="dnc-persona-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(var(--color-navy-rgb),0.15)' }}>
                    <img src={img('dnc-avatar-sam.jpg')} alt="Sam" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                  <h4 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 'normal', margin: 0 }}>
                    The Scrolling Voter (Sam)
                  </h4>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Understand the message fast', 'Read the text easily', 'Feel connected without overthinking'].map(n => (
                    <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                      <span className="font-landing-body" style={{ fontSize: 15, color: '#222225', lineHeight: 'normal' }}>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(var(--color-navy-rgb),0.15)' }}>
                    <img src={img('dnc-avatar-jordan.jpg')} alt="Jordan" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                  <h4 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 'normal', margin: 0 }}>
                    Brand Strategist (Jordan)
                  </h4>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Trust the brand work is done', 'Have time to give real feedback', 'Get a design that is almost ready to go'].map(n => (
                    <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                      <span className="font-landing-body" style={{ fontSize: 15, color: '#222225', lineHeight: 'normal' }}>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="dnc-challenge-grid" style={{ marginTop: 108, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>The Challenge</SubHeading>
              <BodyText>
                Design requests came in daily basis. The brand was mid-transition, so I had to balance that while still delivering high quality work.
              </BodyText>
              <BodyText>
                Every digital asset reached thousands or even millions of people, which meant real potential for impact. With my background in psychology, I wanted my designs to be inclusive, so I made sure everything met WCAG accessibility. Additionally, the review process with tight deadlines sometimes left me less than a day to finish a request.
              </BodyText>
              <BodyText>
                The process was exciting yet I had to keep tabs on myself be considerate of the constraints.
              </BodyText>
            </div>
            <div>
              <img src={img('balance.webp')} alt="Illustration of a figure labeled 'Balance' with red and blue coloring" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>This was my mentality throughout the design requests</p>
            </div>
          </div>

          <div style={{ marginTop: 108 }}>
            <ChallengeBanner
              icon={<Megaphone size="1em" weight="regular" />}
              iconColor="#416BCC"
              question={<>How might we deliver campaign graphics that are <strong><em>on-brand,</em></strong> <strong><em>accessible,</em></strong> and <strong><em>compelling</em></strong> — consistently and at speed?</>}
            />
          </div>
        </Section>

        {/* ── 4. VP Graphic ── */}
        <Section id="dnc-vp">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>4. VP Graphic</p>
          </div>

          <div className="dnc-brief-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>Kamala Anniversary Graphic</SubHeading>
              <BodyText>
                Kamala Harris is someone who inspires me. When the Vice President was about to hit a milestone anniversary in office, the request came in last minute for an Instagram post.
              </BodyText>
              <BodyText>
                I had worked on many graphics by this point, but this one stood out because of how many things I had to balance at once. The timeline was tight, but the stakes felt high. This was a memorable event, and a lot of people were going to see it.
              </BodyText>
              <BodyText>
                Here is how the Kamala anniversary graphic came together.
              </BodyText>
            </div>
            <div>
              <img src={img('kamala-anniversary-photo.webp')} alt="Vice President Kamala Harris seated in front of American flags" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </div>
          </div>

          <div style={{ marginTop: 108 }}>
            <IterationExplorer />
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>What the team said</SubHeading>
            <BodyText>
              One of my favorite parts about design is the iterative process and the discussions centered on layout, feeling, and more. Not everyone agreed on the same thing, but that is alright. Some wanted a different photo. Some wanted a cleaner layout. At the end of the day, they helped me consider aspects of the designs I hadn't thought about.
            </BodyText>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 32 }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                <strong className="text-[var(--color-cs-heading)]">Takeaway:</strong> I had to narrow in on the solution, so I focused on what made the most sense for the graphic and took that in with the iterations.
              </p>
            </div>

            <div className="dnc-quotes-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { role: 'Ad Strategist', avatar: img('dnc-quote-ad-strategist.avif'), quote: 'I still liked the other photo better. It felt more genuine.', align: 'left' },
                { role: 'Graphic Designer', avatar: img('dnc-quote-graphic-designer.avif'), quote: 'The colors feel much more celebratory now.', align: 'right' },
                { role: 'Design Director', avatar: img('dnc-quote-design-director.avif'), quote: 'Nice speed. Just send it over sooner so we have more breathing room.', align: 'left' },
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

          <div style={{ marginTop: 108 }}>
            <SubHeading>The final solution</SubHeading>
            <BodyText>
              Here is the final Kamala Harris anniversary graphic that went out on Instagram.
            </BodyText>
            <BodyText>
              The design used a warm, celebratory photo of the Vice President with bold typography. The colors came from the new brand guidelines, and the layout kept the focus on her accomplishments without feeling cluttered.
            </BodyText>

            <figure style={{ margin: '48px auto 0', width: '80%' }}>
              <img src={img('dnc-iter-final.webp')} alt="Final Vice President Kamala Harris anniversary graphic, selected design passing WCAG AAA" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>
        </Section>

        {/* ── 5. Collection ── */}
        <Section id="dnc-collection">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>5. Collection</p>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>42 graphics across 4 months</SubHeading>
            <BodyText>
              The VP anniversary graphic was one project. Over the summer, I designed dozens more: policy announcements, campaign updates, voter engagement graphics, event content, and merch. Each one had to be on-brand, accessible, and ready for national distribution.
            </BodyText>
            <BodyText>
              Below is a selection of the work.
            </BodyText>
          </div>

          <div style={{ marginTop: 24 }}>
            <CollectionGallery />
          </div>
        </Section>

        {/* ── 6. Impact ── */}
        <Section id="dnc-impact">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>6. Impact</p>
          </div>

          <div>
            <SubHeading>Impact</SubHeading>
            <BodyText>
              Being part of the Mobilization team at the DNC pushed my visual design skills. I got to learn quickly on my feet, consider multiple perspectives, and also consider the impact of my design work. I also got to practice my interest in accessibility in design and advocated for it regularly within my design work and shared accessibility checking tools with my team. I caught a few WCAG issues along the way, and the team started paying more attention to accessibility because of it.
            </BodyText>

            <div className="dnc-impact-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
              <StatBlock label="In 4 months" stat="40 graphics" description="Designed across Instagram, Facebook, email, and merch" />
              <StatBlock label="Requests" stat="18 same day" description="Turned around within hours while still leaving room for feedback, revisions, and handoff." />
              <StatBlock label="Across Social Media" stat="5,500 likes" description="People saw and responded to the work I made." />
            </div>
          </div>
        </Section>

        {/* ── 7. Reflection ── */}
        <Section id="dnc-reflection">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>7. Reflection</p>
          </div>

          <div className="dnc-reflection-grid" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>Takeaways</SubHeading>
              <BodyText>
                What I will take away from this experience is that design is not just about making things look good. It is about communicating clearly, working fast when you have to, and caring about the details even when no one is watching.
              </BodyText>
              <BodyText>
                I am grateful to the Mobilization team for trusting me with real work. This was my first time designing in a fast paced, high stakes environment, and it confirmed that this is what I want to keep doing.
              </BodyText>
            </div>
            <figure style={{ margin: 0 }}>
              <img
                src={img('dnc-metro-commute.jpeg')}
                alt="Washington DC Metro station platform"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
                Snippet of my morning commute! DC Metro is so cool
              </figcaption>
            </figure>
          </div>
        </Section>

      </div>

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
