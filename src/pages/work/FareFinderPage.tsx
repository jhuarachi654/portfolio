import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, MapTrifold, Compass, MagnifyingGlass, CheckCircle, XCircle, AirplaneTakeoff, AirplaneInFlight, TrendUp, AirTrafficControl } from '@phosphor-icons/react'
import SectionHeading from '../../components/case-study/SectionHeading'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ff-intro',       label: 'Introduction' },
  { id: 'ff-development', label: 'Development' },
  { id: 'ff-features',    label: 'Solution' },
  { id: 'ff-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/fare-finder/${file}`

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
      <h3 className="text-[22px] text-[var(--color-cs-heading)] leading-snug cs-editorial" style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontWeight: 400, marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

// ─── Persona card ─────────────────────────────────────────────────────────────

function PersonaCard({
  type, name, location, role, goals, needs, note, avatar,
}: {
  type: string; name: string; location: string; role: string
  goals: string[]; needs: string[]; note: string; avatar: string
}) {
  return (
    <div>
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
      {/* Chip label */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <span className="font-landing-body font-semibold" style={{
          fontSize: 13, color: 'var(--color-cs-heading)',
          border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8,
          padding: '4px 14px',
        }}>{type}</span>
      </div>

      {/* Avatar image */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.15)' }}>
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </div>

      {/* Name + meta */}
      <h4 className="font-semibold text-[var(--color-cs-heading)] text-center" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 20, margin: '0 0 8px' }}>{name}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={13} weight="bold" /> {location}
        </span>
        <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Briefcase size={13} weight="bold" /> {role}
        </span>
      </div>

      {/* Goals */}
      <div style={{ marginBottom: 20 }}>
        <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 10 }}>Goals:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {goals.map(g => (
            <li key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
              <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Needs */}
      <div>
        <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 10 }}>Needs:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {needs.map(n => (
            <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
              <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
    <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>
      {note}
    </p>
    </div>
  )
}

// ─── Stat callout ─────────────────────────────────────────────────────────────

function StatBlock({ stat, description, icon }: { stat: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(var(--color-navy-rgb),0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 44, lineHeight: 1, margin: 0, fontWeight: 500, color: 'var(--color-cs-heading)' }} />
      </div>
      <p className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  )
}

// ─── Quote block ──────────────────────────────────────────────────────────────

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div style={{ borderLeft: '2px solid rgba(var(--color-navy-rgb),0.2)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
      <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 8px' }}>"{quote}"</p>
      <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>— {attribution}</p>
    </div>
  )
}

// ─── Solution feature block ───────────────────────────────────────────────────

function SolutionBlock({
  index, heading, body, outcome, image, imageAlt, caption,
}: {
  index: number; heading: string; body: string; outcome?: string
  image: string; imageAlt: string; caption?: string
}) {
  return (
    <div style={{ marginTop: 86 }}>
      <div className="ff-solution-block-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-navy)' }}>{index}.</span>{' '}{heading}
          </h3>
          <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: outcome ? 20 : 0 }}>{body}</p>
          {outcome && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(var(--color-navy-rgb),0.12)' }}>
              <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>
                <span style={{ color: 'var(--color-navy)', fontWeight: 700, marginRight: 6 }}>→</span><strong style={{ color: 'var(--color-cs-heading)', fontWeight: 600 }}>User Impact:</strong>{' '}{outcome}
              </p>
            </div>
          )}
        </div>
        <div>
          <img src={image} alt={imageAlt} style={{ width: '100%', height: 'auto', display: 'block' }} />
          {caption && (
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{caption}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Destinations explorer ────────────────────────────────────────────────────

const destinationOptions = [
  { label: 'Minimized Card Layout contains: Origin/Destination and Price', image: 'fare-finder-19-bF3ZmE.png', caption: 'New Default Starting Screen' },
  { label: 'Expanded Card Layout contains: Origin/Destination, Price, and Visual',  image: 'fare-finder-20-6z8BFr.png', caption: 'Validated Entry Point and Destination Layout' },
]

const CIRCLE_BTN: React.CSSProperties = { width: 38, height: 38, borderRadius: '50%', background: 'rgba(62,66,66,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)', fontSize: 18, flexShrink: 0, transition: 'background 0.15s' }

function ImageCarousel({ src, alt, index, total, label, onPrev, onNext, height }: { src: string; alt: string; index: number; total: number; label: string; onPrev: () => void; onNext: () => void; height?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={onPrev} style={CIRCLE_BTN}>‹</button>
      <figure style={{ flex: 1, minWidth: 0, margin: 0 }}>
        <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.07)', ...(height ? { height, objectFit: 'contain' as const, objectPosition: 'top' } : { height: 'auto' }) }} />
        <figcaption className="font-landing-body" style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-cs-heading)', opacity: 0.45, marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label} · {index + 1} / {total}</figcaption>
      </figure>
      <button onClick={onNext} style={CIRCLE_BTN}>›</button>
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
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div>
        <SubHeading>Destinations</SubHeading>
        <BodyText>I explored two layout directions for the destination cards: a minimized card layout that kept more of the map visible, and an expanded card layout that showed more information per destination.</BodyText>
        <div style={{ marginTop: 20 }}>
          <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} />
        </div>
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
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 11, color: 'var(--color-cs-heading)', opacity: 0.5, marginBottom: 6, marginTop: 0 }}>HMW</p>
      <h3 className="text-[22px] text-[var(--color-cs-heading)] leading-snug cs-editorial" style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontWeight: 400, marginBottom: 8, marginTop: 0 }}>Flexible Dates</h3>
      <p className="font-landing-body" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--color-cs-heading)', margin: 0 }}>How might we <strong className="font-semibold">help travelers who don't have a destination in mind</strong> yet open up their options by exploring flights with flexible availability?</p>
      <div style={{ marginTop: 16 }}>
        <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} height={240} />
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
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div className="ff-flight-fare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 11, color: 'var(--color-cs-heading)', opacity: 0.5, marginBottom: 6, marginTop: 0 }}>HMW</p>
          <h3 className="text-[22px] text-[var(--color-cs-heading)] leading-snug cs-editorial" style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontWeight: 400, marginBottom: 8, marginTop: 0 }}>Card Layout</h3>
          <p className="font-landing-body" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--color-cs-heading)', margin: 0 }}>How might we <strong className="font-semibold">give travelers the destination context</strong> they need to feel confident enough to book directly from the map?</p>
        </div>
        <div>
          <ImageCarousel src={`/images/fare-finder/${opt.image}`} alt={opt.caption} index={selected} total={total} label={opt.label} onPrev={prev} onNext={next} height={360} />
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
          <div style={{ background: '#003854', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', padding: 32, border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              Fare Finder Map
            </h1>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              Designed and shipped a flight map tool for travelers to explore and to be informed in order to book their next trip.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'UX Design Intern' },
                { label: 'Timeline', value: 'Jun – Sep 2025' },
                { label: 'Team',     value: 'Fare Finder Team' },
                { label: 'Tools/Skills', value: 'Figma, Figma Make' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>

            
            <a href="#ff-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Introduction ── */}
      <Section id="ff-intro">
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
          <SubHeading>Friction in flight discovery = fewer bookings.</SubHeading>
          <Prose>
            <BodyText>
              This past summer, I interned at PROS, a B2B software company providing digital products for airlines and the travelers they serve. One of the projects I worked on was Fare Finder Map, an interactive flight map-based tool that showcases flight fares.
            </BodyText>
            <BodyText>
              A Junior Designer and I co-led the redesign of the Fare Finder Map to better support free exploration and provide personalized recommendations for everyday travelers.
            </BodyText>
            <BodyText>
              Flight discovery is the first touchpoint travelers have when planning a trip. Across flight exploration platforms, personalized results and travel-related support have become standard. When the direct booking experience on an airline's site falls short of that, travelers go elsewhere and airlines lose those direct bookings.
            </BodyText>
          </Prose>
        </div>

        <div style={{ marginTop: 86 }}>
          <ChallengeBanner
            question={<>How might we <strong className="font-semibold">redesign the Fare Finder Map</strong> to make flight exploration more supported and personalized?</>}
          />
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-10-L9E2IY.png')} alt="Product ecosystem diagram" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>How Fare Finder Reaches Travelers</figcaption>
        </figure>

        <div style={{ marginTop: 86 }}>
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
            icon={<MagnifyingGlass size={20} weight="regular" color="var(--color-cs-heading)" />}
            description="requested for country labels and borders"
          />
          <StatBlock
            stat="80%"
            icon={<Compass size={20} weight="regular" color="var(--color-cs-heading)" />}
            description="of travelers experienced navigation friction"
          />
          <StatBlock
            stat="40%"
            icon={<MapTrifold size={20} weight="regular" color="var(--color-cs-heading)" />}
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

        <div style={{ marginTop: 86 }}>
          <ChallengeBanner
            question={<>How might we <strong className="font-semibold">redesign the Fare Finder Map</strong> to make flight exploration more supported and personalized?</>}
          />
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>Booking Features Across the Market</SubHeading>
          <Prose>
            <BodyText>
              To answer these questions, I looked at how competitors and adjacent platforms like hotels and vacation rentals were already solving this. Booking experiences with maps aren't new. These features shared a common goal: helping travelers explore their options intuitively and book with as little effort as possible, all while keeping them informed.
            </BodyText>
            <BodyText>
              PROS reaches more travelers than any platform here because it lives directly on the airline's site. Making it more personal and intuitive is a huge opportunity that could directly drive more bookings on airline sites.
            </BodyText>
          </Prose>
          <figure style={{ margin: '48px 0 0' }}>
            <img src={img('fare-finder-15-18R8vT.png')} alt="State of the market — relevant booking features" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
            <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Relevant features across the booking market</figcaption>
          </figure>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-16-KkcukH.png')} alt="Fare Finder positioning" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Fare Finder positioned as simple and personalized relative to competitors</figcaption>
        </figure>

        <div style={{ marginTop: 86 }}>
          <ChallengeBanner
            label="Challenge (Revised)"
            question={<>How might we <strong className="font-semibold">redesign the Fare Finder Map</strong> to make flight exploration more intuitive, personalized, and informative?</>}
          />
        </div>
      </Section>

      {/* ── Development ── */}
      <Section id="ff-development">
        <SectionHeading index={2} chapter="Development" heading="Global Audience = Global Constraints" />
        <Prose>
          <BodyText>
            I created a user flow for Fare Finder from the perspective of somebody wanting to book a flight, choose a map view, and apply filters. The mapped out user flow revealed a key inconsistency: personalized destinations were only available in the minimized view. Expanding to the full map meant losing them entirely, limiting personalization at the moment when travelers were most actively exploring.
          </BodyText>
          <BodyText>
            Fare Finder would be featured on global airline sites, so standardizing the map across regions was essential. Travelers requested border lines and country labels for orientation, so I brought a mockup to my PM and UX Engineer. Although feasible technically, standardizing borders for a global audience wasn't possible due to differing perceptions of regions and territories.
          </BodyText>
          <BodyText>
            This pushed me to think: if border lines and labels weren't an option, how else could the design orient travelers without relying on them?
          </BodyText>
        </Prose>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-17-ATi7Ig.png')} alt="User flow diagram" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>User flow diagram showing personalized recommendations missing from expanded map view</figcaption>
        </figure>

        <div style={{ marginTop: 86 }}>
          <SubHeading>What if tailored destinations could be accessed at all times?</SubHeading>
          <BodyText>
            The destination card layout concepts explored how to keep personalized recommendations visible even as travelers expanded to explore the full map. We tested minimized and expanded card layouts to understand which gave travelers the right amount of context without cluttering the map.
          </BodyText>
          <figure style={{ margin: '24px 0 0' }}>
            <img src={img('fare-finder-18-4UGudS.png')} alt="Destination card layout concepts" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
            <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Destination card layout concepts</figcaption>
          </figure>
        </div>

        <DestinationsExplorer />

        <div style={{ marginTop: 86 }}>
          <SubHeading>Narrowing Layout w/ External Testing</SubHeading>
          <BodyText>After testing with airline partners, the Entry Point was validated. However, there were requests for more travel-centered visual options beyond the map background image. The Destinations layout concepts were scrapped entirely. The final design chosen gives travelers control over what they see on the screen. Personalized destinations, flight card details, and filters are all elements they can show and hide throughout their booking experience.</BodyText>
          <div style={{ marginTop: 24 }}>
            <img src={img('fare-finder-23-idFeC5.png')} alt="Entry point screen" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>New Default Starting Screen</p>
          </div>
          <div className="ff-validated-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            {[
              { label: 'Entry Point', body: 'Validated, with a request for richer visuals.', icon: <CheckCircle size={18} weight="fill" color="var(--color-cs-heading)" /> },
              { label: 'Destination Cards', body: 'Scrapped. Replaced with user-controlled customization throughout.', icon: <XCircle size={18} weight="fill" color="var(--color-secondary)" /> },
            ].map(({ label, body, icon }) => (
              <div key={label} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {icon}
                  <p className="font-landing-body font-semibold" style={{ fontSize: 14, color: 'var(--color-cs-heading)', margin: 0 }}>{label}</p>
                </div>
                <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>AI in the Design Process</SubHeading>
          <BodyText>
            The AI-generated designs were useful for getting ideas on the page, but they were more foundational than innovative. The narrowing and final decisions were still mine to make. Figma Make produced more realistic results but still needed careful evaluation. It sparked ideas while reinforcing that AI output should always be questioned.
          </BodyText>
        </div>

        <FlexibleDatesExplorer />

        <FlightFareExplorer />
      </Section>

      {/* ── Solution ── */}
      <Section id="ff-features">
        <SectionHeading index={3} chapter="Solution" heading="" />

        {/* Solution Overview — key screens with numbered captions */}
        <div style={{ marginBottom: 32 }}>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
            Solution Overview
          </h3>
          <BodyText>
            A breakdown of the features in the redesigned Fare Finder that helps travelers explore and book with confidence.
          </BodyText>
          <div className="ff-solution-overview-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginTop: 24,
          }}>
            {[
              { image: img('fare-finder-30-VCz5wN.png'), alt: 'Focused entry point screen', caption: '1. Traveler lands on Fare Finder with a focused entry point' },
              { image: img('fare-finder-31-kf20ST.png'), alt: 'Customized map layout', caption: '2. Adjusts the map layout to explore at their own pace' },
              { image: img('fare-finder-34-vcLxIa.png'), alt: 'Expanded flight card and quick facts panel', caption: '3. Selects a destination and reviews the flight fare card and quick facts' },
              { image: img('fare-finder-35-2kxfyI.png'), alt: 'Personalized destinations panel', caption: '4. Browses tailored flight recommendations to keep exploring' },
            ].map(screen => (
              <figure key={screen.alt} style={{ margin: 0 }}>
                <img src={screen.image} alt={screen.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                <figcaption className="font-landing-body text-left" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', marginTop: 12 }}>{screen.caption}</figcaption>
              </figure>
            ))}
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
          body="The filter panel expands on the original filters by adding Travel Interests. Instead of starting with a destination, travelers can explore by what they want to experience. The panel can also be shown or hidden, giving travelers control over what they see on the map."
          image={img('fare-finder-33-r6pnhW.png')}
          imageAlt="Collapsible filter panel with travel interests"
          caption="Collapsable Filter Panel w/ Travel Interests embedded in"
        />

        <SolutionBlock
          index={4}
          heading="Flight Fare Card + Quick Facts"
          body="For travelers who are still exploring, the right context at the right moment is what moves them from browsing to booking. The redesigned fare card and Quick Facts bring that directly into the map. When a traveler selects a flight, the fare card shows destination photos, price, and trip type. Quick Facts fill in the supporting details like cheapest month to fly, average price, time zones, and nearby airports. All without leaving the map, right when it matters most."
          image={img('fare-finder-34-vcLxIa.png')}
          imageAlt="Expanded flight card and quick facts panel"
          caption="Expanded flight card and quick facts panel"
        />

        <SolutionBlock
          index={5}
          heading="Tailored Flight Recommendations"
          body="Personalized destination recommendations were missing from the original map view. Now they live in a collapsible panel at the bottom of the screen, giving travelers tailored suggestions based on their origin. This keeps the map open and uninterrupted while still giving travelers a starting point to begin their search or a set of options to compare when they are ready."
          image={img('fare-finder-35-2kxfyI.png')}
          imageAlt="Personalized destinations panel"
          caption="Personalized Destinations dependent on Origin Input"
        />

      </Section>

      {/* ── Reflection ── */}
      <Section id="ff-reflection">
        <SectionHeading index={4} chapter="Reflection" heading="How Fare Finder changed the booking experience" />

        <BodyText>By the time these features were defined and validated by airline partners, my internship ended before usability testing could be completed. The new Fare Finder shipped in January 2026. The following is the impact it had and direct feedback from our airline partners.</BodyText>

        <div className="ff-reflection-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          {[
            { icon: <AirplaneTakeoff size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '10 wks', label: 'after handoff, Fare Finder went live' },
            { icon: <AirplaneInFlight size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '37%', label: 'decrease in map abandonment' },
            { icon: <TrendUp size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '29%', label: 'increase in direct bookings' },
          ].map(({ icon, stat, label }) => (
            <div key={stat} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 36, margin: 0, lineHeight: 1.1, fontWeight: 500, color: 'var(--color-cs-heading)' }} />
              </div>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
          {[
            { quote: '"This is a direction that gives travelers the necessary context and control of their own experience."', attribution: 'Airline Partner (name withheld per NDA)' },
            { quote: '"This redefines the experience to be much more exploratory with fewer barriers for entry and support tools."', attribution: 'Airline Partner (name withheld per NDA)' },
          ].map(({ quote, attribution }) => (
            <div key={attribution} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
              <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: '0 0 8px', fontStyle: 'italic' }}>{quote}</p>
              <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 11, color: 'var(--color-secondary)', margin: 0 }}>{attribution}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>What I'd carry forward from a summer of designing for exploration</SubHeading>
          <BodyText>
            Interning at PROS put me in situations I hadn't navigated before. Designing inside a live product used by airlines, working within a B2B2C model for the first time, and learning to balance the distinct needs of airline partners and travelers. That discomfort pushed me to be a more holistic and adaptable designer.
          </BodyText>
          <BodyText>
            I also got the chance to use tools like Figma Make and Claude to build out design layouts quickly prompting moments of discussion and revisions. Presenting those layouts to PMs, Engineers, and Designers also taught me to tailor my visuals and storytelling to the audience. I'm so grateful to the PROS UX design team for their mentorship, the conversations that shaped my thinking, and for a memorable summer!
          </BodyText>
          <BodyText>
            Looking back, if I had more time, the one thing I would have done differently was request and plan for more end consumer testing with the PM and User Researcher. Although our direct users were airline partners, Fare Finder ultimately reaches travelers and their input would have been valuable.
          </BodyText>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img
            src={img('fare-finder-36-3yud6R.png')}
            alt="PROS UX Design team"
            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }}
          />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>
            PROS UX Design team
          </figcaption>
        </figure>
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
