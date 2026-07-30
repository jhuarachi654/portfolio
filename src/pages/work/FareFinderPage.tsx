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
      <h3 className="text-[22px] font-bold text-[var(--color-cs-heading)] leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 0 }}>
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
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
      {/* Chip label */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <span className="font-landing-body font-semibold" style={{
          fontSize: 13, color: 'var(--color-cs-heading)',
          border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12,
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
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(var(--color-navy-rgb),0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 44, lineHeight: 1, margin: 0, fontWeight: 700, color: 'var(--color-cs-heading)' }} />
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
  const num = String(index).padStart(2, '0')
  return (
    <div style={{ marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>{num}. {heading}</h3>
          <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: outcome ? 20 : 0 }}>{body}</p>
          {outcome && (
            <div style={{ paddingTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="text-[var(--color-cs-heading)] font-bold" style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.3 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{outcome}</p>
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
  { label: 'Minimized Card Layout', image: 'fare-finder-19-bF3ZmE.png', caption: 'New Default Starting Screen' },
  { label: 'Expanded Card Layout',  image: 'fare-finder-20-6z8BFr.png', caption: 'Validated Entry Point and Destination Layout' },
]

function DestinationsExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = destinationOptions[selected]
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
        <div>
          <SubHeading>Destinations</SubHeading>
          <BodyText>I explored two layout directions for the destination cards: a minimized card layout that kept more of the map visible, and an expanded card layout that showed more information per destination.</BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
            {destinationOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
                background: 'transparent',
              }}>
                <span className="font-landing-body" style={{ fontSize: 14, fontWeight: selected === i ? 600 : 400, color: selected === i ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <figure style={{ margin: 0 }}>
          <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{opt.caption}</figcaption>
        </figure>
      </div>
    </div>
  )
}

// ─── Flexible Dates explorer ──────────────────────────────────────────────────

const flexibleDatesOptions = [
  { label: 'Final Designs', image: 'fare-finder-24-GdXvAb.png', caption: 'Flexible Dates Layouts' },
  { label: 'Claude Generated Content', image: 'fare-finder-26-9cBwLo.png', caption: 'Claude Generated Layout' },
  { label: 'Prompt', image: 'fare-finder-25-4SFEs9.png', caption: 'Prompt for Flexible Dates on Claude' },
]

function FlexibleDatesExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = flexibleDatesOptions[selected]
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <h3 className="text-[22px] font-bold text-[var(--color-cs-heading)] leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 0 }}>Flexible Dates</h3>
      <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>How might we <strong className="font-semibold text-[var(--color-cs-heading)]">help travelers who don't have a destination in mind</strong> yet open up their options by exploring flights with flexible availability?</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {flexibleDatesOptions.map((o, i) => (
          <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
            border: selected === i ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
            background: 'transparent',
          }}>
            <span className="font-landing-body" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)' }}>{o.label}</span>
          </button>
        ))}
      </div>
      <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 240, objectFit: 'contain', objectPosition: 'top', display: 'block', marginTop: 16 }} />
      <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 8 }}>{opt.caption}</p>
    </div>
  )
}

// ─── Flight Fare Card explorer ────────────────────────────────────────────────

const flightFareOptions = [
  { label: 'Flight Card Layout Iterations', image: 'fare-finder-27-2A9bhj.png', caption: 'Flight Card Layout Iterations' },
  { label: 'Figma Make Generated Cards',    image: 'fare-finder-29-0uzkCF.png', caption: 'Figma Make Generated Cards' },
  { label: 'Prompt',                        image: 'fare-finder-28-sl3Pmw.png', caption: 'Prompt for Quick Facts on Figma Make' },
]

function FlightFareExplorer() {
  const [selected, setSelected] = useState(0)
  const opt = flightFareOptions[selected]
  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <SubHeading>Flight Fare Card</SubHeading>
          <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 16px' }}>How might we <strong className="font-semibold text-[var(--color-cs-heading)]">give travelers the destination context</strong> they need to feel confident enough to book directly from the map?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24, alignItems: 'flex-start' }}>
            {flightFareOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid var(--color-cs-heading)' : '1px solid rgba(var(--color-navy-rgb),0.2)',
                background: 'transparent',
              }}>
                <span className="font-landing-body" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 360, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
          <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{opt.caption}</p>
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
          <div style={{ background: '#003854', padding: '4%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-cs-heading)', marginBottom: 8, borderLeft: '2px solid var(--color-navy)', paddingLeft: 10 }}>PROS</p>
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              Fare Finder
            </h1>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              Fare Finder is a flight search map that airlines embed on their websites. Travelers use it to explore destinations and book flights without leaving the airline's site. It should be the most direct way to book. But it wasn't.
            </p>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              The map was hard to navigate, recommended no destinations, and offered no context about the cities it showed. Travelers trying to explore had no starting point. Many left for competitor sites instead.
            </p>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              We redesigned the map to fix that, adding city guides, personalized travel recommendations, and a simpler way to browse by destination type. Bookings rose 29%. The new experience kept travelers on the airline's site.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'UX Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2025' },
                { label: 'Team',     value: 'UX Strategist, UX Researcher, PM' },
                { label: 'Tools',    value: 'Figma, Claude, Figma Make' },
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
          <SubHeading>The map assumed travelers already knew where they wanted to go</SubHeading>
          <Prose>
            <BodyText>
              Travelers came to Fare Finder to explore flight options, but the map gave them no starting point and no guidance. There were no destination recommendations, no way to filter by what kind of trip they wanted, and no context about the destinations on screen. Travelers who could not orient themselves left the site and booked through a third party instead.
            </BodyText>
            <BodyText>
              To understand the problem more precisely, I met with the PMs working directly with airline partners and the User Researcher who had run usability testing with travelers. Those conversations established two things: who was making design decisions possible, and who the design had to work for.
            </BodyText>
            <BodyText>
              Airline partners are the airlines that configure and embed Fare Finder on their sites. They care about direct bookings, brand consistency, and seamless integration. Their needs shaped what was technically feasible and what had to stay consistent across deployments. Travelers are the people actually using the map to find and book flights. Their experience drove every design decision.
            </BodyText>
          </Prose>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-10-L9E2IY.png')} alt="Product ecosystem diagram" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>How Fare Finder Reaches Travelers</figcaption>
        </figure>

        <div style={{ marginTop: 86 }}>
          <SubHeading>Travelers left when they could not find a starting point or a reason to stay</SubHeading>
          <Prose>
            <BodyText>
              Usability testing had just concluded before I joined. I worked through the findings with the User Researcher to identify where the experience was breaking down. Three friction points came up consistently.
            </BodyText>
          </Prose>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          <StatBlock
            stat="19%"
            icon={<Compass size={20} weight="regular" color="var(--color-cs-heading)" />}
            description="had trouble navigating or orienting themselves on the map"
          />
          <StatBlock
            stat="13%"
            icon={<MapTrifold size={20} weight="regular" color="var(--color-cs-heading)" />}
            description="wanted destination recommendations based on their preferences"
          />
          <StatBlock
            stat="13%"
            icon={<MagnifyingGlass size={20} weight="regular" color="var(--color-cs-heading)" />}
            description="asked for country labels and borders to help distinguish destinations"
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Prose>
            <BodyText>
              All three pointed at the same gap: the map expected travelers to arrive knowing what they wanted and where to look. Most did not.
            </BodyText>
            <BodyText>
              A review of the existing map confirmed the pattern. Personalized recommendations disappeared when travelers expanded to full map view, exactly when they were most actively exploring. There was no way to search by trip duration or travel month for travelers without set dates. Flight cards showed a price and a route but nothing about the destination itself, which was not enough context for someone still deciding where to go.
            </BodyText>
          </Prose>
        </div>

        <div style={{ marginTop: 86 }}>
          <ChallengeBanner
            question={<>How might we <strong className="font-semibold">redesign the Fare Finder map</strong> to make flight exploration more supported and personalized?</>}
          />
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>Competitors had already built the personalization Fare Finder was missing</SubHeading>
          <Prose>
            <BodyText>
              Before moving to design, I looked at how other platforms were solving the same problem. Booking experiences with maps are not new. Competitors and adjacent platforms like hotel and vacation rental sites had already established patterns: personalized suggestions based on origin, travel interest filters, contextual information panels, and layouts that let travelers choose how much of the map they see.
            </BodyText>
            <BodyText>
              PROS has one advantage none of those platforms have. Fare Finder lives directly on the airline's site. Travelers are already there. The opportunity was to bring the personalization and guidance those platforms offer into the direct booking experience, where it could actually influence a booking rather than send the traveler somewhere else.
            </BodyText>
          </Prose>
          <figure style={{ margin: '48px 0 0' }}>
            <img src={img('fare-finder-15-18R8vT.png')} alt="State of the market — relevant booking features" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
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
            question={<>How might we <strong className="font-semibold">redesign the Fare Finder map</strong> to make flight exploration more intuitive, personalized, and informative?</>}
          />
        </div>
      </Section>

      {/* ── Development ── */}
      <Section id="ff-development">
        <SectionHeading index={2} chapter="Development" heading="Four problems to solve: entry point, layout, dates, and flight context" />
        <Prose>
          <BodyText>
            The revised challenge pointed us to four areas. The entry point, where travelers landed with no starting context. The layout, which buried personalized recommendations the moment travelers expanded the map. The date selection, which required travelers to commit to specific dates before they could explore. And the flight card, which showed a price without enough destination context to support a booking decision.
          </BodyText>
          <BodyText>
            I mapped out the full user flow to understand where the experience broke down in sequence. A traveler landing on Fare Finder would enter an origin, choose a map view, apply filters, select a destination, choose a flight, and book. The flow revealed a key inconsistency: personalized destination recommendations were only available in the minimized view. Expanding to the full map, which is when travelers were most actively exploring, removed them entirely.
          </BodyText>
        </Prose>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-17-ATi7Ig.png')} alt="User flow diagram" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>User flow diagram showing personalized recommendations missing from expanded map view</figcaption>
        </figure>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center', marginTop: 86 }}>
          <div>
            <SubHeading>Travelers wanted country borders. We could not use them. That changed the design question.</SubHeading>
            <BodyText>
              Fare Finder would be featured on airline sites serving travelers around the world. Standardizing the map across regions was essential. Travelers in the usability study had asked for country borders and labels to help them orient on the map. I brought a mockup to my PM and UX Engineer. Although technically feasible, standardizing borders for a global audience was not possible. Different regions have different and sometimes disputed perceptions of where borders fall. Using any single version of those borders would be politically and legally problematic across markets.
            </BodyText>
            <BodyText>
              That constraint changed the question. If borders and labels were not available as orientation tools, the design had to orient travelers another way. The answer was destination cards that stayed visible at all times, giving travelers a named starting point without depending on map geography to do that work.
            </BodyText>
          </div>
          <figure style={{ margin: 0 }}>
            <img src={img('fare-finder-18-4UGudS.png')} alt="Destination card layout concepts" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
            <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Destination card layout concepts</figcaption>
          </figure>
        </div>

        <DestinationsExplorer />

        <div style={{ marginTop: 86 }}>
          <SubHeading>Entry Point</SubHeading>
          <BodyText>How might the entry point support users who don't yet have a destination in mind?</BodyText>
          <div style={{ marginTop: 24 }}>
            <img src={img('fare-finder-23-idFeC5.png')} alt="Flight card layout iterations" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>New Default Starting Screen</p>
          </div>
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>Partners validated the entry point and cut the destination card layouts entirely</SubHeading>
          <BodyText>Testing with airline partners confirmed the entry point concept and established the direction. Partners validated the entry point. They asked for more travel-centered visuals beyond the map background. The destination card layouts were cut entirely in favor of a more flexible approach: letting travelers customize which destinations, flight details, and filters appeared throughout the experience rather than locking them into a fixed card format.</BodyText>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            {[
              { label: 'Entry Point', body: 'Validated, with a request for richer visuals.', icon: <CheckCircle size={18} weight="fill" color="var(--color-cs-heading)" /> },
              { label: 'Destination Cards', body: 'Scrapped. Replaced with user-controlled customization throughout.', icon: <XCircle size={18} weight="fill" color="var(--color-secondary)" /> },
            ].map(({ label, body, icon }) => (
              <div key={label} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
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
          <SubHeading>I used Figma Make and Claude to generate layout options fast enough to decide in one meeting</SubHeading>
          <BodyText>
            With the direction settled, I used Figma Make and Claude to generate layout iterations for the flight card and flexible date components. This opened up a faster conversation with PMs and engineers about what was feasible and what was worth pursuing. Rather than presenting one direction at a time, I could show multiple options in one session and get to a decision faster.
          </BodyText>
        </div>

        <FlexibleDatesExplorer />

        <FlightFareExplorer />
      </Section>

      {/* ── Solution ── */}
      <Section id="ff-features">
        <SectionHeading index={3} chapter="Solution" heading="" />

        <SolutionBlock
          index={1}
          heading="Focused Entry"
          body="When travelers land on Fare Finder, the destination field is set to Anywhere by default. This gives travelers who do not yet have a destination in mind a prompt to start exploring immediately, without requiring them to know where they want to go before they can use the map. Travelers with a specific destination can type it directly."
          image={img('fare-finder-30-VCz5wN.png')}
          imageAlt="Focused entry point screen"
          caption="New Default Starting Screen"
        />

        <SolutionBlock
          index={2}
          heading="Customizable Map Layout"
          body="Travelers can collapse both the filter panel and the destinations panel to expand the map, choosing how much guidance they want versus how much map they see. A traveler who wants to explore visually collapses both panels. A traveler who wants guided suggestions keeps them open. The map adapts to how a traveler wants to explore rather than forcing a single layout on everyone."
          image={img('fare-finder-31-kf20ST.png')}
          imageAlt="Customized map layout"
          caption="Collapsible Filter Panel and Destinations"
        />

        <SolutionBlock
          index={3}
          heading="Flexible Dates"
          body="Flexible Dates lets travelers search by trip duration and travel month instead of committing to specific dates. A traveler who knows they want a long weekend in summer but has not picked exact dates can explore options without hitting a dead end. The feature removes the requirement to have a trip fully planned before the map becomes useful."
          image={img('fare-finder-32-IuxZgL.png')}
          imageAlt="Flexible dates component"
          caption="Flexible Dates Component"
        />

        <SolutionBlock
          index={4}
          heading="Filter Panel"
          body="The filter panel adds Travel Interests, a set of categories like beach, city, or adventure, letting travelers search by the kind of experience they want rather than a destination they have already decided on. A traveler with no destination in mind can use interests as a starting point instead. The panel can be shown or hidden depending on how much guidance a traveler wants."
          image={img('fare-finder-33-r6pnhW.png')}
          imageAlt="Collapsible filter panel with travel interests"
          caption="Collapsible Filter Panel with Travel Interests"
        />

        <SolutionBlock
          index={5}
          heading="Flight Fare Card and Quick Facts"
          body="When a traveler selects a destination on the map, a flight fare card appears showing destination photos, the starting price, and trip type. Quick Facts, a set of supporting details that appear below the card, show the cheapest month to fly, average price, time zones, and nearby airports. All of this appears without leaving the map. A traveler gets enough context to decide whether a destination is worth booking before they navigate to checkout."
          image={img('fare-finder-34-vcLxIa.png')}
          imageAlt="Expanded flight card and quick facts panel"
          caption="Expanded Flight Card and Quick Facts Panel"
        />

        <SolutionBlock
          index={6}
          heading="Tailored Flight Recommendations"
          body="Personalized destination recommendations now live in a collapsible panel at the bottom of the screen. Suggestions are generated based on the traveler's origin, so a traveler flying from Miami sees different options than one flying from Chicago. The map stays open and uninterrupted. Travelers who want a starting point have one. Travelers who want to explore the map on their own can collapse the panel and ignore it."
          image={img('fare-finder-35-2kxfyI.png')}
          imageAlt="Personalized destinations panel"
          caption="Personalized Destinations Dependent on Origin Input"
        />

      </Section>

      {/* ── Reflection ── */}
      <Section id="ff-reflection">
        <SectionHeading index={4} chapter="Reflection" heading="How Fare Finder changed the booking experience" />

        <BodyText>The new Fare Finder shipped in January 2026. PROS measured the following outcomes across airline partner sites:</BodyText>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          {[
            { icon: <AirplaneTakeoff size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '10 wks', label: 'to ship after handoff' },
            { icon: <AirplaneInFlight size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '37%', label: 'decrease in map abandonment' },
            { icon: <TrendUp size={24} weight="thin" color="var(--color-cs-heading)" />, stat: '29%', label: 'increase in direct bookings' },
          ].map(({ icon, stat, label }) => (
            <div key={stat} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 36, margin: 0, lineHeight: 1.1, fontWeight: 700, color: 'var(--color-cs-heading)' }} />
              </div>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <BodyText>The designs shipped three months after handoff. PROS measured the results.</BodyText>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {[
            { label: 'Where we landed', body: 'I handed off the designs at the end of my internship. Three months later, Fare Finder shipped and the results above reflect its measured impact.' },
            { label: 'What I would do differently', body: 'If I had more time, I would have planned for more end consumer testing with the PM and User Researcher. Our direct users were airline partners, but Fare Finder ultimately reaches travelers, and their input earlier in the process would have surfaced friction points before handoff rather than after.' },
          ].map(({ label, body }) => (
            <div key={label} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
              <p className="font-semibold cs-serif-label" style={{ fontSize: 16, margin: '0 0 6px' }}>{label}</p>
              <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>What I'd carry forward from a summer of designing for exploration</SubHeading>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { heading: 'Designing for two users meant the airline partner set the boundaries and the traveler set the bar', body: 'Designing inside a live product used by airlines taught me to hold two users in mind at once and to make decisions that served both without compromising either. The airline partner determined what was technically and legally possible. The traveler\'s experience determined whether any of it was worth shipping.' },
              { heading: 'Using AI to generate iterations changed how I presented options to PMs and engineers', body: 'Using Figma Make and Claude to generate layout iterations quickly changed how I presented ideas. Instead of advocating for one direction, I could put multiple options on the table in the same conversation and let the best one emerge from discussion rather than from my own pre-filtering.' },
            ].map(({ heading, body }) => (
              <div key={heading} className="cs-info-box" style={{ padding: 20 }}>
                <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 10px', lineHeight: 1.4 }}>{heading}</p>
                <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img
            src={img('fare-finder-36-3yud6R.png')}
            alt="PROS UX Design team"
            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }}
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
