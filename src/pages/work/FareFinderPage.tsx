import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapTrifold, Compass, MagnifyingGlass, AirplaneTakeoff, Rocket, TrendUp, TrendDown, Airplane, Globe, CaretLeft, CaretRight, Asterisk } from '@phosphor-icons/react'
import SectionHeading from '../../components/case-study/SectionHeading'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ff-intro',             label: 'Context' },
  { id: 'ff-research',    label: 'Research' },
  { id: 'ff-development', label: 'Development' },
  { id: 'ff-features',    label: 'Solution' },
  { id: 'ff-impact',      label: 'Impact' },
  { id: 'ff-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/fare-finder/${file}`
const rmImg = (file: string) => `/images/revenue-management/${file}`

// ─── Polaroid deck (same photos as the Revenue Management case study) ─────────

const POLAROIDS = [
  { src: rmImg('conchas.jpeg'),                caption: 'Coworker brought conchas!' },
  { src: rmImg('houston-skyline.avif'),        caption: 'Houston Skyline' },
  { src: rmImg('badge.jpeg'),                  caption: 'My Badge' },
  { src: rmImg('brainstorming-session.jpeg'),  caption: 'Team Sessions' },
]

// Rotation + x-offset for each slot position (0 = front/active, 1, 2, 3 = behind)
const SLOT_STYLE = [
  { rotate: 0,   x: 0,    scale: 1,    zIndex: 4 },
  { rotate: 9,   x: 60,   scale: 0.9, zIndex: 3 },
  { rotate: -16, x: -110, scale: 0.9, zIndex: 1 },
  { rotate: -9,  x: -60,  scale: 0.9, zIndex: 2 },
]

const SLOT_STYLE_MOBILE = [
  { rotate: 0,  x: 0,   scale: 1,    zIndex: 4 },
  { rotate: 6,  x: 34,  scale: 0.9, zIndex: 3 },
  { rotate: -9, x: -62, scale: 0.9, zIndex: 1 },
  { rotate: -5, x: -34, scale: 0.9, zIndex: 2 },
]

function PolaroidDeck() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const photos = isMobile ? POLAROIDS.slice(0, 3) : POLAROIDS
  const n = photos.length

  useEffect(() => {
    setActive(a => a % n)
  }, [n])

  const advance = () => setActive(i => (i + 1) % n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, userSelect: 'none' }}>
      <div
        onClick={advance}
        data-cursor-label="Next"
        className="rm-polaroid-stack"
        style={{ position: 'relative', width: '100%', cursor: 'pointer' }}
      >
        {photos.map((photo, i) => {
          const slot = (i - active + n) % n
          const { rotate, x, scale, zIndex } = (isMobile ? SLOT_STYLE_MOBILE : SLOT_STYLE)[slot]
          return (
            <motion.div
              key={photo.src}
              animate={{ rotate, x, scale, zIndex }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="rm-polaroid-stack-card"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                background: '#fff',
                boxShadow: slot === 0
                  ? '0 8px 40px rgba(0,0,0,0.18)'
                  : '0 3px 16px rgba(0,0,0,0.10)',
                transformOrigin: 'bottom center',
              }}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ width: '100%', aspectRatio: '210 / 290', objectFit: 'cover', display: 'block' }}
              />
              <p className="rm-polaroid-stack-caption" style={{
                fontFamily: 'var(--font-landing-body)',
                fontWeight: 500,
                color: 'var(--color-cs-heading)',
                textAlign: 'center',
                lineHeight: 1.3,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${-rotate}deg)`,
              }}>
                {photo.caption}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              background: i === active ? 'var(--color-navy)' : 'rgba(var(--color-navy-rgb),0.2)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={id}
      data-reveal
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
      <h3 className="text-[32px] text-[var(--color-cs-heading)] cs-lh-normal rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

// ─── Stat callout ─────────────────────────────────────────────────────────────

function StatBlock({ stat, description, icon }: { stat: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>
          {icon}
        </div>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, lineHeight: 'normal', margin: 0, fontWeight: 400, color: '#416BCC' }} />
      </div>
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
    </div>
  )
}

// ─── Solution feature block ───────────────────────────────────────────────────

function SolutionBlock({
  index, heading, body, outcome, image, imageAlt, caption,
}: {
  index: number; heading: string; body: string | string[]; outcome?: string
  image: string; imageAlt: string; caption?: string
}) {
  const paragraphs = Array.isArray(body) ? body : [body]
  return (
    <div style={{ marginTop: 108 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 24, fontWeight: 300, color: 'var(--color-navy)' }}>{index}.</span>
        <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
          {heading}
        </h3>
      </div>
      {paragraphs.map((p, i) => <BodyText key={i}>{p}</BodyText>)}

      {outcome && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>User Impact:</strong> {outcome}
            </p>
          </div>
        </>
      )}

      <img className="cs-fullwidth-figure" src={image} alt={imageAlt} style={{ width: '100%', height: 'auto', display: 'block', margin: '32px auto 0' }} />
      {caption && (
        <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{caption}</p>
      )}
    </div>
  )
}

// ─── Destinations explorer ────────────────────────────────────────────────────

const destinationOptions = [
  { label: 'Minimized Card Layout contains: Origin/Destination and Price', image: 'fare-finder-19-bF3ZmE.png', caption: 'New Default Starting Screen' },
  { label: 'Expanded Card Layout contains: Origin/Destination, Price, and Visual',  image: 'fare-finder-20-6z8BFr.png', caption: 'Validated Entry Point and Destination Layout' },
]

const CIRCLE_BTN: React.CSSProperties = { flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 43, 85, 0.35)', color: '#ffffff', cursor: 'pointer', backdropFilter: 'blur(4px)' }

function ImageCarousel({ src, alt, index, label, onPrev, onNext, height }: { src: string; alt: string; index: number; total: number; label: string; onPrev: () => void; onNext: () => void; height?: number }) {
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
          <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: 8, ...(height ? { height, objectFit: 'contain' as const } : { height: 'auto' }) }} />
          <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{label}</p>
        </motion.div>
      </div>
      <button onClick={onNext} aria-label="Show next" style={CIRCLE_BTN}><CaretRight size={12} weight="bold" /></button>
    </div>
  )
}

function DestinationsExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = destinationOptions[selected]
  const total = destinationOptions.length
  const prev = () => setSelected((selected - 1 + total) % total)
  const next = () => setSelected((selected + 1) % total)
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div className="ff-destinations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, alignItems: 'center' }}>
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Wireframe Tests</p>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>Destinations</h3>
          <BodyText>What if tailored destinations could be accessed at all times?</BodyText>
        </div>
        <div>
          <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} />
        </div>
      </div>
    </div>
  )
}

const entryPointOptions = [
  { label: 'New Default Starting Screen', image: 'entry-point-wireframe.png', caption: 'New default starting screen with annotations for origin input and anywhere option' },
]

function EntryPointExplorer() {
  const opt = entryPointOptions[0]
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div className="ff-entry-point-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, alignItems: 'center' }}>
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Wireframe Tests</p>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>Entry Point</h3>
          <BodyText>How might the entry point support users who don't yet have a destination in mind?</BodyText>
        </div>
        <figure style={{ margin: 0 }}>
          <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
          <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{opt.label}</p>
        </figure>
      </div>
    </div>
  )
}

// ─── Flexible Dates explorer ──────────────────────────────────────────────────

const flexibleDatesOptions = [
  { label: 'Flexible Dates Layouts', image: 'fare-finder-24-GdXvAb.png', caption: 'Flexible Dates Layouts' },
  { label: 'Claude Generated Layouts', image: 'fare-finder-26-9cBwLo.png', caption: 'Claude Generated Layouts' },
  { label: 'Prompt for Flexible Dates on Claude', image: 'fare-finder-25-4SFEs9.png', caption: 'Prompt for Flexible Dates on Claude' },
]

function FlexibleDatesExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = flexibleDatesOptions[selected]
  const total = flexibleDatesOptions.length
  const prev = () => setSelected((selected - 1 + total) % total)
  const next = () => setSelected((selected + 1) % total)
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div className="ff-flexible-dates-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, alignItems: 'center' }}>
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Design &amp; AI</p>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>Flexible Dates</h3>
          <BodyText>How might we help travelers who don't have a destination in mind yet open up their options by exploring flights with flexible availability?</BodyText>
        </div>
        <div>
          <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} height={240} />
          <p className="font-landing-body cs-caption" style={{ fontStyle: 'italic', opacity: 1, marginTop: 16, textAlign: 'left' }}>
            The AI-generated designs were useful for getting ideas on the page, but they were more foundational than innovative. The narrowing and final decisions were still mine to make.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Flight Fare Card explorer ────────────────────────────────────────────────

const flightFareOptions = [
  { label: 'Flight Card Layout Iterations', image: 'fare-finder-27-2A9bhj.png', caption: 'Flight Card Layout Iterations' },
  { label: 'Figma Make Generated Cards',    image: 'fare-finder-29-0uzkCF.png', caption: 'Figma Make Generated Cards' },
  { label: 'Prompt for Quick Facts on Figma Make', image: 'fare-finder-28-sl3Pmw.png', caption: 'Prompt for Quick Facts on Figma Make' },
]

function FlightFareExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = flightFareOptions[selected]
  const total = flightFareOptions.length
  const prev = () => setSelected((selected - 1 + total) % total)
  const next = () => setSelected((selected + 1) % total)
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 32 }}>
      <div className="ff-flight-fare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, alignItems: 'center' }}>
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Design &amp; AI</p>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>Card Layout</h3>
          <BodyText>How might we give travelers the destination context they need to feel confident enough to book directly from the map?</BodyText>
        </div>
        <div>
          <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} height={360} />
          <p className="font-landing-body cs-caption" style={{ fontStyle: 'italic', opacity: 1, marginTop: 16, textAlign: 'left' }}>
            Figma Make produced more realistic results but still needed careful evaluation. It sparked ideas while reinforcing that AI output should always be questioned.
          </p>
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
        src="/videos/Fare-Finder-Video.webm"
        poster="/videos/Fare-Finder-Video-poster.png"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', transform: 'scale(1.3)' }}
      />
      <PlayPauseButton playing={playing} onToggle={handleToggle} />
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FareFinderPage() {
  useCaseToc(TOC, 'Fare Finder')
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: '#003854', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', padding: 32, border: '1px solid #d1d1d1' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <h1 className="text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              PROS Fare Finder Map
            </h1>
            <p className="font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Designing and shipping a flight map exploration tool for airlines to display on their booking sites, helping travelers make more informed and confident booking decisions.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'UX Design Intern' },
                { label: 'Timeline', value: 'Jun – Sep 2025' },
                { label: 'Team',     value: 'Fare Finder Team' },
                { label: 'Tools/Skills', value: 'Figma, Figma Make' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
                </div>
              ))}
            </div>

            
            <a href="#ff-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Context ── */}
      <Section id="ff-intro">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>1. Context</p>
        </div>

        <div style={{ marginTop: 32 }}>
          <SubHeading>What is PROS?</SubHeading>
          <BodyText>
            PROS is a B2B SaaS company serving the airline and aviation industry. Fare Finder Map is an interactive flight map tool that airlines embed on their booking sites, giving travelers a way to explore destinations and fares before booking.
          </BodyText>
        </div>

        <div className="cs-fullwidth-figure" style={{ marginTop: 64 }}>
          <img src={img('pros-ff-hero.png')} alt="PROS Fare Finder Map interface showing the interactive flight map and destination details" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
        </div>

        <div style={{ marginTop: 64 }}>
          <SubHeading>My Role</SubHeading>
          <BodyText>
              As a product design intern at PROS, I worked on the Fare Finder team alongside a UX designer, visual designer, and product managers to redesign the Fare Finder Map, focusing on personalization and improving usability. I synthesized research, conducted competitive analysis, and built prototypes in Figma to help travelers explore flights and book with confidence.
          </BodyText>
        </div>

        <div style={{ marginTop: 64 }}>
          <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Impact</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { stat: '3 months', description: 'after handoff, Fare Finder went live' },
              { stat: '45%', description: 'decrease in map abandonment' },
              { stat: '35%', description: 'increase in direct bookings' },
            ].map(({ stat, description }) => (
              <div key={description}>
                <p className="cs-stat-number-accent" style={{ margin: '0 0 8px' }}>{stat}</p>
                <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 108 }}>
          <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Problem</p>
          <SubHeading>Personalization and discovery support were <span style={{ color: '#416BCC' }}>missing.</span></SubHeading>
          <Prose>
            <BodyText>
              Flight discovery is where a traveler's journey begins — and where they were dropping off. Usability testing revealed they were abandoning the experience for third-party platforms offering more personalization and guided exploration. A competitive analysis confirmed the gap: across booking platforms, these features had become the expectation, not the exception.
            </BodyText>
          </Prose>
          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
            <img src={img('booking-maps-comparison.jpg')} alt="Booking solutions on the market" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

        <div className="rm-challenge-subheader-style" style={{ marginTop: 108 }}>
          <ChallengeBanner
            label="Mission"
            question={<>How might we redesign the Fare Finder Map to make flight exploration <span style={{ color: '#416BCC' }}>more supported</span> and <span style={{ color: '#416BCC' }}>personalized</span>?</>}
          />
        </div>

      </Section>

      {/* ── Research ── */}
      <Section id="ff-research">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>2. Research</p>
        </div>

        <figure className="cs-fullwidth-figure" style={{ margin: 0 }}>
          <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
            <LazyVideo src="/videos/old-fare-finder.webm" style={{ width: '100%', display: 'block' }} />
          </div>
        </figure>

        <div style={{ marginTop: 108 }}>
          <SubHeading>What was the <span style={{ color: '#416BCC' }}>current</span> user experience?</SubHeading>
          <BodyText>
            With the user researcher, I analyzed five guided user interviews through affinity mapping — participants aged 21–35, spanning occasional and regular travelers — to understand how they experienced the current Fare Finder. We used FigJam AI for initial sorting and categorization, then refined the themes through discussion.
          </BodyText>

          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
            <img src={img('figjam-ai-affinity-composite.png')} alt="FigJam AI use in Affinity Mapping" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>What did the flight booking market look like?</SubHeading>
          <BodyText>
            I conducted a competitive analysis across 10 platforms, spanning third-party booking sites and airline platforms, using thematic analysis to map the current landscape of flight booking experiences and identify gaps and opportunities.
          </BodyText>
        </div>
        <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
          <img src={img('competitive-analysis-tables.png')} alt="Competitive analysis tables across direct and indirect competitors" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </figure>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Friction Points in the Booking Experience</SubHeading>
          <Prose>
            <BodyText>
              Before I joined, usability testing had just concluded. I jumped into the analysis working 1-1 with the User Researcher. These main findings came from the affinity mapping exercise, pointing to where travelers were experiencing friction and what they wanted from the experience.
            </BodyText>
          </Prose>
        </div>

        <div className="ff-friction-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          <StatBlock
            stat="60%"
            icon={<MagnifyingGlass size="1em" weight="regular" />}
            description="requested for country labels and borders"
          />
          <StatBlock
            stat="80%"
            icon={<Compass size="1em" weight="regular" />}
            description="of travelers experienced navigation friction"
          />
          <StatBlock
            stat="40%"
            icon={<MapTrifold size="1em" weight="regular" />}
            description="requested more exploratory features"
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Prose>
            <BodyText>
              This raised a few questions for the redesign: how do we balance navigation improvements with new feature requests? What is feasible and what takes priority? Why?
            </BodyText>
          </Prose>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>The Potential of Fare Finder</SubHeading>
          <Prose>
            <BodyText>
              I mapped what I found in a competitive analysis and 2x2 to understand where Fare Finder fit into the landscape and where the opportunity was.
            </BodyText>
            <BodyText>
              PROS reaches more travelers than any platform here because it lives directly on the airline's site. Making it more personal and intuitive is a huge opportunity that could directly drive more bookings on airline sites.
            </BodyText>
          </Prose>
          <figure className="cs-fullwidth-figure" style={{ margin: '48px 0 0' }}>
            <img src={img('fare-finder-16-KkcukH.png')} alt="Fare Finder positioning" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Fare Finder positioned as simple and personalized relative to competitors</figcaption>
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <ChallengeBanner
            icon={<AirplaneTakeoff size="1em" weight="regular" />}
            iconColor="#416BCC"
            label="Challenge (Revised)"
            question={<>How might we redesign the Fare Finder Map to make flight exploration <strong><em>more intuitive, personalized,</em></strong> and <strong><em>informative</em></strong>?</>}
          />
        </div>
      </Section>

      {/* ── Development ── */}
      <Section id="ff-development">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Development</p>
        </div>

        <Prose>
          <BodyText>
            I created a user flow for Fare Finder from the perspective of somebody wanting to book a flight, choose a map view, and apply filters. The mapped out user flow revealed a key inconsistency: personalized destinations were only available in the minimized view.
          </BodyText>
          <BodyText>
            Expanding to the full map meant losing them entirely, limiting personalization at the moment when travelers were most actively exploring.
          </BodyText>
        </Prose>

        <figure className="cs-fullwidth-figure" style={{ margin: '48px 0 0' }}>
          <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden', background: '#EEEFF1', padding: 32 }}>
            <img src={img('fare-finder-17-ATi7Ig.png')} alt="User flow diagram" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>User flow diagram showing personalized recommendations missing from expanded map view</figcaption>
        </figure>

        <div style={{ marginTop: 108 }}>
          <div className="ff-global-map-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>Global Audience = Global Constraints</SubHeading>
              <Prose>
                <BodyText>
                  Fare Finder would be featured on global airline sites, so standardizing the map across regions was essential.
                </BodyText>
                <BodyText>
                  Travelers requested border lines and country labels for orientation, so I brought a mockup to my PM and UX Engineer. Although feasible technically, standardizing borders for a global audience wasn't possible due to differing perceptions of regions and territories.
                </BodyText>
                <BodyText>
                  This pushed me to think: if border lines and labels weren't an option, how else could the design orient travelers without relying on them?
                </BodyText>
              </Prose>
            </div>
            <figure style={{ margin: 0 }}>
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
                <img src={img('global-map-mockup.png')} alt="Scrapped mockup exploring border lines and country labels" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Scrapped mockup exploring border lines and country labels for user orientation.</figcaption>
            </figure>
          </div>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Wireframing Entry and Destinations</SubHeading>
          <DestinationsExplorer />
          <EntryPointExplorer />
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Narrowing Layout w/ External Testing</SubHeading>
          <figure style={{ margin: '0 auto 24px', width: '80%' }}>
            <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
              <LazyVideo src="/videos/fare-finder-narrowed-layout.webm" style={{ width: '100%', display: 'block' }} />
            </div>
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>New Default Starting Screen</figcaption>
          </figure>
          <BodyText>
            After testing with airline partners, the <strong className="font-semibold" style={{ color: 'var(--color-cs-heading)' }}>Entry Point was validated</strong>. However, there were requests for more travel-centered visual options beyond the map background image.
          </BodyText>
          <BodyText>
            The Destinations layout concepts were scrapped entirely. The final design chosen gives travelers control over what they see on the screen. Personalized destinations, flight card details, and filters are all elements they can show and hide throughout their booking experience.
          </BodyText>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>AI in the Design Process</SubHeading>
          <FlexibleDatesExplorer />
          <FlightFareExplorer />
        </div>
      </Section>

      {/* ── Solution ── */}
      <Section id="ff-features">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>4. Solution</p>
        </div>

        {/* Video container */}
        <div style={{ width: '100%', margin: '0 auto' }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', background: 'transparent' }}>
            <LazyVideo
              src="/videos/fare-finder-solution-preview.webm"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>

        {/* TL:DR */}
        <div style={{ marginTop: 32 }}>
          <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>TL:DR</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
            <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
              A new way to find your next flight destination
            </h3>
            <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
              Fare Finder is an map-based exploration tool with an interface that is <strong className="font-semibold" style={{ color: 'var(--color-cs-heading)' }}>customizable, personalized,</strong> and <strong className="font-semibold" style={{ color: 'var(--color-cs-heading)' }}>intuitive.</strong>
            </p>
          </div>
        </div>

        <SolutionBlock
          index={1}
          heading="Focused Entry"
          body="The entry point for Fare Finder was redefined. We wanted travelers to have a clear and focused starting point, so the destination is set to Anywhere by default to encourage exploration from the start."
          image={img('fare-finder-30-VCz5wN.png')}
          imageAlt="Focused entry point screen"
          caption="New Default Starting Screen"
        />

        <SolutionBlock
          index={2}
          heading="Flexible Dates"
          body="We wanted to remove another barrier to exploration. Flexible Dates lets travelers search by trip duration and travel month instead of committing to specific dates, reducing the pressure to have everything figured out before users start exploring."
          image={img('fare-finder-32-IuxZgL.png')}
          imageAlt="Flexible dates component"
          caption="Flexible Dates Component"
        />

        <SolutionBlock
          index={3}
          heading="Filter Panel"
          body={[
            'The filter panel expands on the original filters by adding Travel Interests. Instead of starting with a destination, travelers can explore by what they want to experience.',
            'The panel can also be shown or hidden, giving travelers control over what they see on the map.',
          ]}
          image={img('fare-finder-33-r6pnhW.png')}
          imageAlt="Collapsible filter panel with travel interests"
          caption="Collapsable Filter Panel w/ Travel Interests embedded in"
        />

        <SolutionBlock
          index={4}
          heading="Flight Fare Card + Quick Facts"
          body={[
            'For travelers who are still exploring, the right context at the right moment is what moves them from browsing to booking. The redesigned fare card and Quick Facts bring that directly into the map.',
            'When a traveler selects a flight, the fare card shows destination photos, price, and trip type. Quick Facts fill in the supporting details like cheapest month to fly, average price, time zones, and nearby airports. All without leaving the map, right when it matters most.',
          ]}
          image={img('fare-finder-34-vcLxIa.png')}
          imageAlt="Expanded flight card and quick facts panel"
          caption="Expanded flight card and quick facts panel"
        />

        <SolutionBlock
          index={5}
          heading="Tailored Flight Recommendations"
          body={[
            'Personalized destination recommendations were missing from the original map view. Now they live in a collapsible panel at the bottom of the screen, giving travelers tailored suggestions based on their origin.',
            'This keeps the map open and uninterrupted while still giving travelers a starting point to begin their search or a set of options to compare when they are ready.',
          ]}
          image={img('fare-finder-35-2kxfyI.png')}
          imageAlt="Personalized destinations panel"
          caption="Personalized Destinations dependent on Origin Input"
        />

      </Section>

      {/* ── Impact ── */}
      <Section id="ff-impact">
        <SectionHeading index={5} chapter="Impact" heading="How Fare Finder changed the booking experience" />

        <BodyText>By the time these features were defined and validated by airline partners, my internship ended before usability testing could be completed.</BodyText>
        <BodyText>
          Looking back, if I had more time, the <strong className="font-semibold" style={{ color: 'var(--color-cs-heading)' }}>one thing I would have done differently was request and plan for more end consumer testing</strong> with the PM and User Researcher. Although our direct users were airline partners, Fare Finder ultimately reaches travelers and their input would have been valuable.
        </BodyText>
        <BodyText>The new Fare Finder shipped in January 2026. The following is the impact it had and direct feedback from our airline partners:</BodyText>

        <div className="ff-reflection-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          <StatBlock stat="3 months" icon={<Rocket size="1em" weight="regular" />} description="after handoff, Fare Finder went live" />
          <StatBlock stat="45%" icon={<TrendDown size="1em" weight="regular" />} description="decrease in map abandonment" />
          <StatBlock stat="35%" icon={<TrendUp size="1em" weight="regular" />} description="increase in direct bookings" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginTop: 32 }}>
          {[
            { quote: 'This is a direction that gives travelers the necessary context and control of their own experience.', attribution: 'Airline Partner (name withheld per NDA)', icon: <Airplane size="1em" weight="regular" /> },
            { quote: 'This redefines the experience to be much more exploratory with fewer barriers for entry and support tools.', attribution: 'Airline Partner (name withheld per NDA)', icon: <Globe size="1em" weight="regular" /> },
          ].map(({ quote, attribution, icon }) => (
            <div key={attribution} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 20 }}>
              <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 10px' }}>"{quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>
                  {icon}
                </div>
                <p className="font-landing-body cs-caption" style={{ textAlign: 'left', margin: 0 }}>{attribution}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="ff-reflection">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>6. Reflection</p>
        </div>

        <div className="ff-reflection-carry-forward-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          <figure style={{ margin: 0 }}>
            <img
              src={img('fare-finder-36-3yud6R.png')}
              alt="PROS UX Design team"
              style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }}
            />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              PROS UX Design team
            </figcaption>
          </figure>
          <div>
            <SubHeading>What I'd carry forward from a summer of designing for exploration</SubHeading>
            <BodyText>
              Interning at PROS put me in situations I hadn't navigated before. Designing inside a live product used by airlines, working within a B2B2C model for the first time, and learning to balance the distinct needs of airline partners and travelers. That discomfort pushed me to be a more holistic and adaptable designer.
            </BodyText>
            <BodyText>
              I also got the chance to use tools like Figma Make and Claude to build out design layouts quickly prompting moments of discussion and revisions. Presenting those layouts to PMs, Engineers, and Designers also taught me to tailor my visuals and storytelling to the audience.
            </BodyText>
            <BodyText>
              I'm so grateful to the PROS UX design team for their mentorship, the conversations that shaped my thinking, and for a memorable summer!
            </BodyText>
          </div>
        </div>
      </Section>

      </div>

      <NextProject
        title="Democratic National Committee"
        to="/work/democratic-national-committee"
        tags={["Consumer", "Digital Design Intern"]}
        description="Created campaign assets across social, ads, and email for Biden-Harris."
        lottie="/videos/DNC-Video.json"
        mediaZoom={1.5}
        objectFit="contain"
        category="consumer"
        bgColor="linear-gradient(135deg, #2b3a8f, #1a2358)"
      />

    </div>
  )
}
