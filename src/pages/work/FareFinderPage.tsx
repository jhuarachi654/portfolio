import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, MapTrifold, Compass, MagnifyingGlass, CheckCircle, XCircle, AirplaneTakeoff, AirplaneInFlight, TrendUp, AirTrafficControl } from '@phosphor-icons/react'
import Footer from '../../components/Footer'
import SectionHeading from '../../components/case-study/SectionHeading'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ff-intro',       label: 'Introduction' },
  { id: 'ff-solution',    label: 'Solution Preview' },
  { id: 'ff-research',    label: 'Research' },
  { id: 'ff-development', label: 'Development' },
  { id: 'ff-features',    label: 'Solution' },
  { id: 'ff-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/fare-finder/${file}`

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

// ─── Persona card ─────────────────────────────────────────────────────────────

function PersonaCard({
  type, name, location, role, goals, needs, note, avatar,
}: {
  type: string; name: string; location: string; role: string
  goals: string[]; needs: string[]; note: string; avatar: string
}) {
  return (
    <div>
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
      {/* Chip label */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <span className="font-sans font-semibold" style={{
          fontSize: 13, color: 'var(--color-navy)',
          border: '1px solid rgba(30,75,154,0.2)',
          padding: '4px 14px',
        }}>{type}</span>
      </div>

      {/* Avatar image */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(30,75,154,0.15)' }}>
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </div>

      {/* Name + meta */}
      <h4 className="font-bold text-navy-dark text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 8px' }}>{name}</h4>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
        <span className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={13} weight="bold" /> {location}
        </span>
        <span className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Briefcase size={13} weight="bold" /> {role}
        </span>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.12)', marginBottom: 20 }} />

      {/* Goals */}
      <div style={{ marginBottom: 20 }}>
        <p className="font-sans font-bold text-navy" style={{ fontSize: 14, marginBottom: 10 }}>Goals:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {goals.map(g => (
            <li key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-sans text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>—</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Needs */}
      <div>
        <p className="font-sans font-bold text-navy" style={{ fontSize: 14, marginBottom: 10 }}>Needs:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {needs.map(n => (
            <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-sans text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>—</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
    <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>
      {note}
    </p>
    </div>
  )
}

// ─── Stat callout ─────────────────────────────────────────────────────────────

function StatBlock({ stat, description, icon }: { stat: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(30,75,154,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <CountUp stat={stat} style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, margin: 0, fontWeight: 700, color: 'var(--color-navy)' }} />
      </div>
      <p className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  )
}

// ─── Quote block ──────────────────────────────────────────────────────────────

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div style={{ borderLeft: '2px solid rgba(30,75,154,0.2)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
      <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', fontStyle: 'italic', margin: '0 0 8px' }}>"{quote}"</p>
      <p className="font-sans font-semibold tracking-[0.14em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', margin: 0 }}>— {attribution}</p>
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
    <div style={{ marginTop: index === 1 ? 40 : 64 }}>
      {index > 1 && <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.2)', marginBottom: 64 }} />}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <img src={image} alt={imageAlt} style={{ width: '100%', height: 'auto', display: 'block' }} />
          {caption && (
            <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{caption}</p>
          )}
        </div>
        <div>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>{num}. {heading}</h3>
          <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: outcome ? 20 : 0 }}>{body}</p>
          {outcome && (
            <div style={{ borderTop: '1px solid rgba(30,75,154,0.2)', paddingTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="text-navy font-bold" style={{ fontSize: 16, flexShrink: 0 }}>→</span>
              <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{outcome}</p>
            </div>
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
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
        <div>
          <SubHeading tag="IDEATION">Destinations</SubHeading>
          <BodyText>What if tailored destinations could be accessed at all times?</BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
            {destinationOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
                background: selected === i ? 'rgba(30,75,154,0.08)' : 'transparent',
              }}>
                <span className="font-sans" style={{ fontSize: 14, fontWeight: selected === i ? 600 : 400, color: selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <figure style={{ margin: 0 }}>
          <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{opt.caption}</figcaption>
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
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>IDEATION</p>
      <h3 className="text-[22px] font-bold text-navy-dark leading-snug" style={{ fontFamily: 'var(--font-display)', marginBottom: 12, marginTop: 0 }}>Flexible Dates</h3>
      <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>How might we help travelers who don't have a destination in mind yet open up their options by exploring flights with flexible availability?</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {flexibleDatesOptions.map((o, i) => (
          <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
            border: selected === i ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
            background: selected === i ? 'rgba(30,75,154,0.08)' : 'transparent',
          }}>
            <span className="font-sans" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.4)' }}>{o.label}</span>
          </button>
        ))}
      </div>
      <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 240, objectFit: 'contain', objectPosition: 'top', display: 'block', marginTop: 16 }} />
      <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 8 }}>{opt.caption}</p>
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
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <SubHeading tag="IDEATION">Flight Fare Card</SubHeading>
          <BodyText>How might we give travelers the destination context they need to feel confident enough to book directly from the map?</BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24, alignItems: 'flex-start' }}>
            {flightFareOptions.map((o, i) => (
              <button key={o.label} onClick={() => setSelected(i)} className="cs-tab-btn" style={{
                border: selected === i ? '1px solid #1E4B9A' : '1px solid rgba(30,75,154,0.2)',
                background: selected === i ? 'rgba(30,75,154,0.08)' : 'transparent',
              }}>
                <span className="font-sans" style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? '#1E4B9A' : 'rgba(30,75,154,0.4)' }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <img src={`/images/fare-finder/${opt.image}`} alt={opt.caption} style={{ width: '100%', height: 360, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>{opt.caption}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FareFinderPage() {
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
          <div style={{ background: '#f0f4fb', padding: '4px 4px 0', border: '1px solid rgba(30,75,154,0.2)' }}>
            <video
              src="/videos/Fare-Finder-Video.webm"
              poster="/videos/Fare-Finder-Video-poster.png"
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
              PROS Fare Finder Map
            </h1>
            <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 24 }}>
              Designed and shipped a map-based flight exploration tool for travelers to discover and book their next trip — directly through the airline's site.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: 'Role',     value: 'UX Design Intern' },
                { label: 'Duration', value: 'Jun – Sep 2025' },
                { label: 'Team',     value: 'UX Strategist, UX Researcher, PM' },
                { label: 'Tools',    value: 'Figma, Claude, Figma Make' },
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
      <Section id="ff-intro">
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
          <SubHeading tag="OVERVIEW">Fare Finder Map at PROS</SubHeading>
          <Prose>
            <BodyText>
              This past summer, I interned at PROS, a B2B software company providing digital products for airlines and the travelers they serve. One of the projects I worked on was Fare Finder Map — an interactive flight map tool that showcases flight fares.
            </BodyText>
            <BodyText>
              A Junior Designer and I co-led the redesign to better support free exploration and provide personalized recommendations for everyday travelers.
            </BodyText>
            <a
              href="https://marketplace.pros.com/product-insights/new-fare-finder-map"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Open site"
              className="draw-btn-primary"
              style={{ textDecoration: 'none', marginTop: 8 }}
            >
              <span>Visit Fare Finder →</span>
            </a>
          </Prose>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          {/* Left: video */}
          <div style={{
            background: 'rgba(30,75,154,0.06)',
            border: '1px solid rgba(30,75,154,0.4)',
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <video
              src="/videos/Fare-Finder-Precedent.webm"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', display: 'block' }}
            />
          </div>

          {/* Right: critique */}
          <div>
            <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 20px' }}>
              Precedent Fare Finder critique
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { type: '+', text: 'Map-based exploration already embedded in the airline booking flow' },
                { type: '+', text: "Reaches travelers directly on the airline's site" },
                { type: '-', text: 'Personalized recommendations disappear in full map view' },
                { type: '-', text: 'Difficult to orient — no labels or context to distinguish destinations' },
                { type: '-', text: 'No flexible date options for travelers without set plans' },
                { type: '-', text: 'Flight card lacks the context needed to feel confident booking' },
              ].map(({ type, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 700,
                    flexShrink: 0,
                    lineHeight: 1.5,
                    color: type === '+' ? '#1E4B9A' : 'rgba(30,75,154,0.35)',
                  }}>{type}</span>
                  <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          {/* Left: text */}
          <div>
            <SubHeading tag="MARKET CONTEXT">Friction in flight discovery = fewer bookings</SubHeading>
            <BodyText>
              Flight discovery is the first touchpoint travelers have when planning a trip. Across flight exploration platforms, personalized results and travel-related support have become standard.
            </BodyText>
            <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
              When the direct booking experience on an airline's site falls short of that, <strong style={{ fontStyle: 'italic', color: 'var(--color-navy)' }}>travelers go elsewhere and airlines lose those direct bookings.</strong>
            </p>
          </div>

          {/* Right: image with dark background */}
          <figure style={{ margin: 0 }}>
            <img
              src={img('fare-finder-09-6yOer8.png')}
              alt="Booking solutions on the market"
              style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }}
            />
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>
              Booking solutions on the market
            </figcaption>
          </figure>
        </div>

        <div style={{ marginTop: 48 }}>
          <ChallengeBanner
            question="How might we redesign the Fare Finder Map to make flight exploration more supported and personalized?"
          />
        </div>
      </Section>

      {/* ── Solution Preview ── */}
      <Section id="ff-solution">
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

        <div className="cs-solution-video-wrap">
          <video
            src="/videos/Fare-Finder-Video.webm"
            poster="/videos/Fare-Finder-Video-poster.png"
            autoPlay
            loop
            muted
            playsInline
            className="cs-solution-video"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginTop: 48 }}>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0 }}>
            A new way to discover your next flight destination
          </h3>
          <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
            Fare Finder is a map-based exploration tool with an interface that is <strong>customizable,</strong> <strong>personalized,</strong> and <strong>intuitive.</strong>
          </p>
        </div>
      </Section>

      {/* ── Research ── */}
      <Section id="ff-research">
        <SectionHeading index={3} chapter="Research" heading="" />

        {/* ── System Mapping ── */}
        <div style={{ marginTop: 48 }}>
          <SubHeading tag="USER RESEARCH">Who I Was Designing For</SubHeading>
          <Prose>
            <BodyText>
              To start, I met with the PMs working directly with our airline partners and the User Researcher who knew our end users — the travelers. Those conversations revealed what made Fare Finder unique: <em>it served two distinct users at once, enterprise and consumer, each with their own goals that I had to balance.</em>
            </BodyText>
          </Prose>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
            <img src={img('fare-finder-10-L9E2IY.png')} alt="Product ecosystem diagram" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Product Ecosystem</figcaption>
        </figure>

        {/* ── User Personas ── */}
        <div style={{ marginTop: 48 }}>
          <SubHeading tag="PERSONAS">Two Users, One Product</SubHeading>
          <Prose>
            <BodyText>
              Fare Finder serves two distinct user groups simultaneously — the airline partners who configure and embed it, and the travelers who use it to explore and book flights. Designing for both meant understanding where their goals aligned and where they diverged.
            </BodyText>
          </Prose>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 48 }}>
          <PersonaCard
            type="Enterprise User"
            name="Jordan Taylor"
            avatar={img('fare-finder-11-HTQVpL.png')}
            location="Dallas, Texas"
            role="Director of Digital Strategy"
            goals={[
              'Increase direct bookings',
              'Present a delightful experience to travelers',
            ]}
            needs={[
              'A reliable tool that reflects well on their brand',
              'Seamless integration into existing website',
              'Support travelers with a smooth booking experience',
            ]}
            note="The airline that embeds Fare Finder on their site to serve their travelers."
          />
          <PersonaCard
            type="Consumer User"
            name="Casey Smith"
            avatar={img('fare-finder-12-YXeAOH.png')}
            location="Chicago, Illinois"
            role="Travels for work and leisure"
            goals={[
              'Explore flights while feeling informed',
              'Book seamlessly from the map without confusion',
            ]}
            needs={[
              'A clear, intuitive map interface',
              'Information that helps them make decisions',
              'A smooth path from exploration to booking',
            ]}
            note="The person using Fare Finder to explore and book flights."
          />
        </div>

        {/* Synthesis: 2-col text + image, then full-width image */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          <div>
            <SubHeading tag="RESEARCH SYNTHESIS">Synthesis + AI Integration</SubHeading>
            <BodyText>
              Before I joined the project, usability testing had just concluded. I jumped into the analysis working 1-1 with the User Researcher, trying out FigJam's AI tools for part of the affinity mapping.
            </BodyText>
            <BodyText>
              It was a good starting foundation but needed detailed review, which took additional time. Looking back, this has shown me to consider this trade-off for future potential uses.
            </BodyText>
          </div>
          <figure style={{ margin: 0 }}>
            <img src={img('fare-finder-13-QcRxqH.png')} alt="Relevant features across the booking market" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>FigJam AI use in Affinity Mapping</figcaption>
          </figure>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('fare-finder-14-uaiF3T.png')} alt="Affinity mapping before and after sorting" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Affinity Mapping - Before (AI results) and After Sorting</figcaption>
        </figure>

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="KEY INSIGHTS">Friction Points in the Booking Experience</SubHeading>
          <Prose>
            <BodyText>
              These main findings came from the affinity mapping exercise, pointing to where travelers were experiencing friction and what they wanted from the experience.
            </BodyText>
          </Prose>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 48, alignItems: 'start' }}>
          <StatBlock
            stat="40%"
            icon={<MapTrifold size={20} weight="regular" color="var(--color-navy)" />}
            description="wanted smarter destination recommendations based on their preferences"
          />
          <StatBlock
            stat="60%"
            icon={<Compass size={20} weight="regular" color="var(--color-navy)" />}
            description="had trouble navigating or orienting themselves on the map"
          />
          <StatBlock
            stat="40%"
            icon={<MagnifyingGlass size={20} weight="regular" color="var(--color-navy)" />}
            description="requested country labels and borders to distinguish destinations"
          />
        </div>

        <div style={{ marginTop: 48 }}>
          <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', fontStyle: 'italic', margin: 0 }}>
            This raised a few questions for the redesign: how do we balance navigation improvements with new feature requests? What is feasible and what takes priority? Why?
          </p>
        </div>

        <div style={{ marginTop: 48 }}>
          <ChallengeBanner
            label="Challenge (Revised)"
            question="How might we redesign the Fare Finder Map to make flight exploration more intuitive, personalized, and informative?"
          />
        </div>

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="COMPETITIVE ANALYSIS">Booking Features Across the Market</SubHeading>
          <Prose>
            <BodyText>
              To answer these questions, I looked at how competitors and adjacent platforms — like hotels and vacation rentals — were already solving this. Booking experiences with maps aren't new.
            </BodyText>
            <BodyText>
              These features shared a common goal: helping travelers explore their options intuitively and book with as little effort as possible, all while keeping them informed.
            </BodyText>
          </Prose>
          <figure style={{ margin: '48px 0 0' }}>
            <img src={img('fare-finder-15-18R8vT.png')} alt="State of the market — relevant booking features" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Relevant features across the booking market</figcaption>
          </figure>
        </div>

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="POSITIONING">The Potential of Fare Finder</SubHeading>
          <Prose>
            <BodyText>
              I mapped what I found in a competitive analysis and 2x2 to understand where Fare Finder fit into the landscape and where the opportunity was.
            </BodyText>
            <BodyText>
              PROS reaches more travelers than any platform here because it lives directly on the airline's site. Making it more personal and intuitive is a huge opportunity that could directly drive more bookings on airline sites.
            </BodyText>
          </Prose>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
            <img src={img('fare-finder-16-KkcukH.png')} alt="Fare Finder positioning" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Fare Finder has the opportunity to integrate these features into the direct booking experience</figcaption>
        </figure>
      </Section>

      {/* ── Development ── */}
      <Section id="ff-development">
        <SectionHeading index={4} chapter="Development" heading="Outlining User Flows" tag="IDEATION" />
        <Prose>
          <BodyText>
            I created a user flow for Fare Finder from the perspective of somebody wanting to book a flight, choose a map view, and apply filters. The mapped out user flow revealed a key inconsistency: personalized destinations were only available in the minimized view.
          </BodyText>
          <BodyText>
            Expanding to the full map meant losing them entirely — limiting personalization at the moment when travelers were most actively exploring.
          </BodyText>
        </Prose>

        <figure style={{ margin: '48px 0 0' }}>
          <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 24 }}>
            <img src={img('fare-finder-17-ATi7Ig.png')} alt="User flow diagram" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>User flow revealed a key inconsistency in the booking experience</figcaption>
        </figure>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          <div>
            <SubHeading tag="CONSTRAINT">Global Audience = Global Constraints</SubHeading>
            <BodyText>
              Fare Finder would be featured on global airline sites, so standardizing the map across regions was essential.
            </BodyText>
            <BodyText>
              Travelers requested border lines and country labels for orientation, so I brought a mockup to my PM and UX Engineer. Although feasible technically, standardizing borders for a global audience wasn't possible due to differing perceptions of regions and territories.
            </BodyText>
            <BodyText>
              This pushed me to think: if border lines and labels weren't an option, how else could the design orient travelers without relying on them?
            </BodyText>
          </div>
          <figure style={{ margin: 0 }}>
            <img src={img('fare-finder-18-4UGudS.png')} alt="Destination card layout concepts" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Destination card layout concepts</figcaption>
          </figure>
        </div>

        <DestinationsExplorer />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          <div>
            <SubHeading tag="EXPLORATION">Entry Point</SubHeading>
            <BodyText>How might the entry point support users who don't yet have a destination in mind?</BodyText>
          </div>
          <div>
            <img src={img('fare-finder-23-idFeC5.png')} alt="Flight card layout iterations" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <p className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>New Default Starting Screen</p>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="TESTING">Narrowing Layout with Airline Partners</SubHeading>
          <BodyText>Testing with airline partners surfaced two clear outcomes that shaped the final direction.</BodyText>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            {[
              { label: 'Entry Point validated', body: 'Partners confirmed the concept, but requested more travel-centered visuals beyond the map background.', icon: <CheckCircle size={18} weight="fill" color="var(--color-navy)" /> },
              { label: 'Destinations scrapped', body: 'The layout concepts were cut entirely. The final design lets travelers customize destinations, flight card details, and filters throughout the experience.', icon: <XCircle size={18} weight="fill" color="var(--color-secondary)" /> },
            ].map(({ label, body, icon }) => (
              <div key={label} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {icon}
                  <p className="font-sans font-semibold" style={{ fontSize: 14, color: 'var(--color-navy)', margin: 0 }}>{label}</p>
                </div>
                <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <FlexibleDatesExplorer />

        <FlightFareExplorer />
      </Section>

      {/* ── Solution ── */}
      <Section id="ff-features">
        <SectionHeading index={5} chapter="Solution" heading="How each feature reimagines the booking experience" />

        <SolutionBlock
          index={1}
          heading="Focused Entry"
          body="The entry point for Fare Finder was redefined. We wanted travelers to have a clear and focused starting point, so the destination is set to Anywhere by default to encourage exploration from the start."
          outcome="Travelers arrive oriented, with a clear prompt to begin — not a blank map."
          image={img('fare-finder-30-VCz5wN.png')}
          imageAlt="Focused entry point screen"
          caption="New Default Starting Screen"
        />

        <SolutionBlock
          index={2}
          heading="Customized Map Layout"
          body="Both the filter panel and personalized destinations can be collapsed, expanding the map and shifting focus to flight discovery. Travelers control what they see and when."
          outcome="The map adapts to how a traveler wants to explore — open or guided."
          image={img('fare-finder-31-kf20ST.png')}
          imageAlt="Customized map layout"
          caption="Collapsible Filter Panel and Destinations"
        />

        <SolutionBlock
          index={3}
          heading="Flexible Dates"
          body="Flexible Dates lets travelers search by trip duration and travel month instead of committing to specific dates, reducing the pressure to have everything figured out before they start exploring."
          outcome="Travelers who aren't sure when to go can still explore — without friction."
          image={img('fare-finder-32-IuxZgL.png')}
          imageAlt="Flexible dates component"
          caption="Flexible Dates Component"
        />

        <SolutionBlock
          index={4}
          heading="Filter Panel"
          body="The filter panel expands on the original filters by adding Travel Interests. Instead of starting with a destination, travelers can explore by what they want to experience. The panel can also be shown or hidden."
          outcome="Exploration starts with interests, not a destination in mind."
          image={img('fare-finder-33-r6pnhW.png')}
          imageAlt="Collapsible filter panel with travel interests"
          caption="Collapsible Filter Panel with Travel Interests"
        />

        <SolutionBlock
          index={5}
          heading="Flight Fare Card + Quick Facts"
          body="The redesigned fare card shows destination photos, price, and trip type. Quick Facts fill in the supporting details — cheapest month to fly, average price, time zones, and nearby airports — all without leaving the map, right when it matters most."
          outcome="Travelers get the context to go from browsing to booking, without switching screens."
          image={img('fare-finder-34-vcLxIa.png')}
          imageAlt="Expanded flight card and quick facts panel"
          caption="Expanded Flight Card and Quick Facts Panel"
        />

        <SolutionBlock
          index={6}
          heading="Tailored Flight Recommendations"
          body="Personalized destination recommendations now live in a collapsible panel at the bottom of the screen, giving travelers tailored suggestions based on their origin. The map stays open and uninterrupted while still offering a starting point to begin their search."
          outcome="Personalized suggestions surface without taking over the map."
          image={img('fare-finder-35-2kxfyI.png')}
          imageAlt="Personalized destinations panel"
          caption="Personalized Destinations Dependent on Origin Input"
        />

      </Section>

      {/* ── Reflection ── */}
      <Section id="ff-reflection">
        <SectionHeading index={6} chapter="Reflection" heading="How Fare Finder changed the booking experience" />

        <BodyText>The new Fare Finder shipped in January 2026. The following is the impact it had and direct feedback from our airline partners:</BodyText>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, alignItems: 'start' }}>
          {[
            { icon: <AirplaneTakeoff size={24} weight="thin" color="var(--color-navy)" />, stat: '3 months', label: 'after handoff, Fare Finder went live' },
            { icon: <AirplaneInFlight size={24} weight="thin" color="var(--color-navy)" />, stat: '45%', label: 'decrease in map abandonment' },
            { icon: <TrendUp size={24} weight="thin" color="var(--color-navy)" />, stat: '35%', label: 'increase in direct bookings' },
          ].map(({ icon, stat, label }) => (
            <div key={stat} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(30,75,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <CountUp stat={stat} style={{ fontFamily: 'var(--font-display)', fontSize: 36, margin: 0, lineHeight: 1.1, fontWeight: 700, color: 'var(--color-navy)' }} />
              </div>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {[
            { label: 'Where we landed', body: 'I handed off the designs at the end of my internship. Three months later, Fare Finder shipped — and the results above reflect its measured impact.' },
            { label: 'What I\'d do differently', body: 'If I had more time, I would have planned for more end consumer testing with the PM and User Researcher. Although our direct users were airline partners, Fare Finder ultimately reaches travelers — and their input would have been valuable.' },
          ].map(({ label, body }) => (
            <div key={label} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
              <p className="font-sans font-semibold" style={{ fontSize: 13, color: 'var(--color-navy)', margin: '0 0 6px' }}>{label}</p>
              <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="TAKEAWAYS">What I'd carry forward from a summer of designing for exploration</SubHeading>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { heading: 'Navigating complexity', body: 'Designing inside a live B2B2C product used by airlines taught me to hold two users in mind at once — and to make decisions that served both without compromising either.' },
              { heading: 'AI as a design tool', body: 'Using Figma Make and Claude to generate layout iterations quickly opened up new kinds of conversations with PMs and engineers — and taught me to present ideas, not just artifacts.' },
              { heading: 'Gratitude', body: 'I\'m so grateful to the PROS UX design team for their mentorship, the conversations that shaped my thinking, and for a memorable summer!' },
            ].map(({ heading, body }) => (
              <div key={heading} style={{ background: 'rgba(30,75,154,0.04)', border: '1px solid rgba(30,75,154,0.1)', padding: 20 }}>
                <p className="font-sans font-bold text-navy" style={{ fontSize: 15, margin: '0 0 10px', lineHeight: 1.4 }}>{heading}</p>
                <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img
            src={img('fare-finder-36-3yud6R.png')}
            alt="PROS UX Design team"
            style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>
            PROS UX Design team
          </figcaption>
        </figure>
      </Section>

      </div>

      <NextProject
        title="Democratic National Committee"
        to="/work/democratic-national-committee"
        description="Created campaign assets across social, ads, and email for Biden-Harris."
      />

      <Footer />
    </div>
  )
}
