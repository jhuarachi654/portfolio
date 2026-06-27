import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { Brain, Ghost, BookOpen, MapPin, Briefcase, User, ChartBar, Stack, Bell, Robot, AirTrafficControl } from '@phosphor-icons/react'
import Footer from '../../components/Footer'
import SectionHeading from '../../components/case-study/SectionHeading'
import ImageFigure from '../../components/case-study/ImageFigure'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'rm-intro',       label: 'Introduction' },
  { id: 'rm-solution',    label: 'Solution Preview' },
  { id: 'rm-research',    label: 'Research' },
  { id: 'rm-development', label: 'Development' },
  { id: 'rm-features',    label: 'Solution' },
  { id: 'rm-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/revenue-management/${file}`
const ff  = (file: string) => `/images/fare-finder/${file}`

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ marginBottom: 8 }}>
      {children}
    </p>
  )
}

// ─── Persona card ─────────────────────────────────────────────────────────────

function PersonaCard({
  type, name, age, location, experience, needs, avatar, avatarStyle,
}: {
  type: string; name: string; age: string; location: string
  experience: string; needs: string[]; avatar: string; avatarStyle?: React.CSSProperties
}) {
  return (
    <div>
      <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          overflow: 'hidden', margin: '0 auto 16px',
          border: '1px solid rgba(30,75,154,0.15)',
          background: '#ffffff',
        }}>
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', ...avatarStyle }} />
        </div>

        {/* Name */}
        <h4 className="font-bold text-navy-dark text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 12px' }}>{name}</h4>

        {/* Age + Location + Experience — single row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <User size={13} style={{ color: 'rgba(30,75,154,0.4)' }} />
            <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{age}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={13} style={{ color: 'rgba(30,75,154,0.4)' }} />
            <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={13} style={{ color: 'rgba(30,75,154,0.4)' }} />
            <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{experience}</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.12)', marginBottom: 16 }} />

        {/* Needs */}
        <p className="font-sans font-bold text-navy" style={{ fontSize: 14, marginBottom: 12 }}>Needs:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {needs.map(n => (
            <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-sans text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>✳</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

// ─── Comparison card (+/−) ────────────────────────────────────────────────────

function ComparisonCard({
  title, pros, cons, verdict,
}: {
  title: string; pros: string; cons: string; verdict?: string
}) {
  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16 }}>
      <h4 className="text-[15px] font-bold text-navy-dark mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
      <div className="space-y-3">
        <div className="flex gap-2">
          <span className="font-bold text-navy text-[16px] leading-none mt-0.5 shrink-0">+</span>
          <p className="font-sans text-navy/70 leading-relaxed" style={{ fontSize: 12 }}>{pros}</p>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-navy/30 text-[16px] leading-none mt-0.5 shrink-0">−</span>
          <p className="font-sans text-navy/70 leading-relaxed" style={{ fontSize: 12 }}>{cons}</p>
        </div>
      </div>
      {verdict && (
        <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50 mt-4 pt-4 border-t border-navy/10" style={{ fontSize: 12 }}>
          ✓ {verdict}
        </p>
      )}
    </div>
  )
}

// ─── Solution feature block (stacked: text → full-width image → impact) ───────

function SolutionBlock({
  index, heading, body, impact, image, imageAlt,
}: {
  index: number; heading: string; body: string; impact: string
  image: string; imageAlt: string
}) {
  const num = String(index).padStart(2, '0')
  return (
    <div style={{ marginTop: index === 1 ? 40 : 64 }}>
      {index > 1 && <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.2)', marginBottom: 64 }} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        {/* Left: text + impact */}
        <div>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>{num}. {heading}</h3>
          <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: 24 }}>{body}</p>
          <div style={{ borderTop: '1px solid rgba(30,75,154,0.2)', paddingTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="text-navy font-bold" style={{ fontSize: 16, flexShrink: 0 }}>→</span>
            <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>
              <strong className="text-navy">User Impact: </strong>{impact}
            </p>
          </div>
        </div>
        {/* Right: image */}
        <img src={image} alt={imageAlt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
      </div>
    </div>
  )
}

// ─── Stakeholder feedback row (icon + two-column) ─────────────────────────────

function FeedbackRow({ feedback, response }: { feedback: string; response: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
      {/* Stakeholder feedback card */}
      <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(30,75,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)', flexShrink: 0 }}>
            <AirTrafficControl size={18} weight="light" />
          </div>
          <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: 0 }}>Stakeholder</h4>
        </div>
        <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{feedback}</p>
      </div>
      {/* My response card */}
      <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16 }}>
        <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: '0 0 16px' }}>My Response</h4>
        <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{response}</p>
      </div>
    </div>
  )
}

// ─── Polaroid deck ────────────────────────────────────────────────────────────

const POLAROIDS = [
  { src: ff('houston-skyline-y0ZIYQ.jpg'),            caption: 'Houston Skyline' },
  { src: ff('coworker-brought-conchas-ldquWV.jpg'),   caption: 'Coworker brought conchas!' },
  { src: ff('team-brainstorming-sessions-paQq5G.jpg'),caption: 'Team Brainstorming Sessions' },
  { src: ff('my-badge-oaEkgi.jpg'),                   caption: 'My Badge' },
]

// Rotation + x-offset for each slot position (0 = front/active, 1, 2, 3 = behind)
const SLOT_STYLE = [
  { rotate: 0,   x: 0,   scale: 1,    zIndex: 4 },
  { rotate: 7,   x: 36,  scale: 0.93, zIndex: 3 },
  { rotate: 13,  x: 64,  scale: 0.87, zIndex: 2 },
  { rotate: -9,  x: -40, scale: 0.90, zIndex: 1 },
]

// ─── Persona toggle ───────────────────────────────────────────────────────────

const PERSONAS = [
  {
    type: 'Junior Analysts',
    name: 'Avery Chen',
    age: '24 yrs old',
    location: 'Houston, TX',
    experience: '1 yr exp',
    description: 'A new analyst learning the ropes and trying to work independently.',
    avatar: img('revenue-management-11-4V1tuQ.png'),
    needs: [
      'Thoughtful guidance that helps her build confidence over time',
      'A clear starting point every time she logs in',
      'To learn on the job without constantly relying on senior colleagues',
    ],
  },
  {
    type: 'Senior Analysts',
    name: 'Alex Reyes',
    age: '42 yrs old',
    location: 'Austin, TX',
    experience: '10 yrs exp',
    description: 'An experienced analyst who needs efficiency without disruption.',
    avatar: img('revenue-management-12-o8jH7a.png'),
    needs: [
      'To make price adjustments quickly without unnecessary steps',
      'Alerts that show what needs attention and filter out what does not',
      'External market data pulled into the platform — no manual sourcing',
    ],
  },
]

function PersonaToggle({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(0)
  const p = PERSONAS[active]

  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginTop: 16 }}>

      {/* Left: selector buttons with descriptions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PERSONAS.map((persona, i) => {
          const isActive = i === active
          return (
            <button
              key={persona.type}
              onClick={() => setActive(i)}
              data-cursor-label="Open persona"
              style={{
                textAlign: 'left',
                padding: 16,
                border: `1px solid ${isActive ? '#1E4B9A' : 'rgba(30,75,154,0.2)'}`,
                background: isActive ? 'rgba(30,75,154,0.1)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <p className="font-sans font-semibold text-navy" style={{ fontSize: 14, margin: '0 0 4px' }}>
                {persona.type}
              </p>
              <p className="font-sans text-[13px] italic" style={{ color: 'var(--color-secondary)', margin: 0 }}>
                {persona.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Right: persona card */}
      <motion.div
        key={p.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PersonaCard
          type={p.type}
          name={p.name}
          age={p.age}
          location={p.location}
          experience={p.experience}
          avatar={p.avatar}
          needs={p.needs}
          avatarStyle={p.type === 'Junior Analysts' ? { objectFit: 'cover', objectPosition: 'center 20%' } : undefined}
        />
      </motion.div>

    </div>
  )
}

const MARKET_OPTIONS = [
  { title: 'Grid Cards', image: img('revenue-management-22-dMGTox.png'), pros: 'More markets visible at once than expanded cards.', cons: 'Cognitive overload and no defined CTA.' },
  { title: 'Compact Cards', image: img('revenue-management-23-VWDfyX.png'), pros: 'More markets on screen and color coding helps with scanning.', cons: 'Less context upfront. Action buttons hidden added friction.', verdict: true },
  { title: 'Expanded Cards', image: img('revenue-management-21-yRkD3C.png'), pros: 'Clear guidance upfront. Action buttons visible without extra clicks.', cons: "Takes up too much vertical space and doesn't scale." },
]

function MyMarketsExplorer() {
  const [active, setActive] = useState(0)
  const option = MARKET_OPTIONS[active]

  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>Exploring Card Layout</p>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 16px' }}>
            My Markets
          </h3>
          <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 32px' }}>
            How might we display market cards so analysts can scan quickly without losing important context?
          </p>
          <div className="cs-option-btns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MARKET_OPTIONS.map((o, i) => (
              <button
                key={o.title}
                onClick={() => setActive(i)}
                className="cs-tab-btn"
                data-cursor-label="Open option"
                style={{
                  border: `1px solid ${i === active ? '#1E4B9A' : 'rgba(30,75,154,0.2)'}`,
                  background: i === active ? 'rgba(30,75,154,0.1)' : 'transparent',
                  color: i === active ? '#1E4B9A' : 'rgba(30,75,154,0.5)',
                }}
              >
                {o.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 16 }}
          >
            <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-bold text-navy" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>+</span>
              <p className="font-sans" style={{ fontSize: 12, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-navy">Pros:</strong> {option.pros}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-sans text-navy/30" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>−</span>
              <p className="font-sans" style={{ fontSize: 12, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-navy">Cons:</strong> {option.cons}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AI_OPTIONS = [
  {
    title: 'Full Chat Experience',
    image: img('revenue-management-15-ewOSo5.png'),
    pros: 'Dedicated space for deeper AI assistance. Accessible to anyone who needs it.',
    cons: 'Users had to navigate to a different screen.',
  },
  {
    title: 'Left Chat Panel',
    image: img('revenue-management-16-1hN5yG.png'),
    pros: 'Always visible.',
    cons: 'Risked feeling intrusive — AI leading the experience.',
  },
  {
    title: 'Right Chat Panel',
    image: img('revenue-management-17-Edz70r.png'),
    pros: 'Visible and optional. Did not lead the experience, kept user control.',
    cons: 'Still took up screen space.',
  },
  {
    title: 'Embedded AI',
    image: img('revenue-management-18-w7PI4H.png'),
    pros: 'Subtle, lightweight suggestions within the existing interface.',
    cons: 'Risked cluttering the screen if overused.',
  },
]

function AIPlacementExplorer() {
  const [active, setActive] = useState(0)
  const option = AI_OPTIONS[active]

  return (
    <div style={{ border: '1px solid rgba(30,75,154,0.2)', background: 'rgba(30,75,154,0.04)', padding: 32, marginTop: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left: context + 2x2 buttons */}
        <div>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>Exploring Placement</p>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 16px' }}>
            AI Assistant
          </h3>
          <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 32px' }}>
            "How might we offer AI help that's there when you need it and invisible when you don't?"
          </p>
          <div className="cs-option-btns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {AI_OPTIONS.map((o, i) => (
              <button
                key={o.title}
                onClick={() => setActive(i)}
                className="cs-tab-btn"
                data-cursor-label="Open option"
                style={{
                  border: `1px solid ${i === active ? '#1E4B9A' : 'rgba(30,75,154,0.2)'}`,
                  background: i === active ? 'rgba(30,75,154,0.1)' : 'transparent',
                  color: i === active ? '#1E4B9A' : 'rgba(30,75,154,0.5)',
                }}
              >
                {o.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right: image + pros/cons below */}
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 16 }}
          >
            <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-bold text-navy" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>+</span>
              <p className="font-sans" style={{ fontSize: 12, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-navy">Pros:</strong> {option.pros}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-sans text-navy/30" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>−</span>
              <p className="font-sans" style={{ fontSize: 12, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-navy">Cons:</strong> {option.cons}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SPREAD_ROTATIONS = [-6, 3, -3, 5]

function PolaroidDeck({ fullWidth = false }: { fullWidth?: boolean }) {
  const [active, setActive] = useState(0)
  const n = POLAROIDS.length

  if (fullWidth) {
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center', padding: '24px 0 8px', width: '80%', margin: '0 auto' }}>
        {POLAROIDS.map((photo, i) => (
          <motion.div
            key={photo.src}
            whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            style={{
              flex: 1,
              background: '#fff',
              padding: '10px 10px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              rotate: SPREAD_ROTATIONS[i],
              cursor: 'pointer',
              transformOrigin: 'bottom center',
            }}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              style={{ width: '100%', aspectRatio: '1/1.2', objectFit: 'cover', display: 'block' }}
            />
            <p className="font-sans" style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 12,
              color: 'var(--color-secondary)',
              lineHeight: 1.4,
            }}>
              {photo.caption}
            </p>
          </motion.div>
        ))}
      </div>
    )
  }

  const advance = () => setActive(i => (i + 1) % n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, userSelect: 'none' }}>
      <div
        onClick={advance}
        data-cursor-label="Next"
        style={{ position: 'relative', width: '100%', height: 279, cursor: 'pointer' }}
      >
        {POLAROIDS.map((photo, i) => {
          const slot = (i - active + n) % n
          const { rotate, x, scale, zIndex } = SLOT_STYLE[slot]
          return (
            <motion.div
              key={photo.src}
              animate={{ rotate, x, scale, zIndex }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: -105,
                background: '#fff',
                padding: '10px 10px 45px',
                boxShadow: slot === 0
                  ? '0 8px 40px rgba(0,0,0,0.18)'
                  : '0 3px 16px rgba(0,0,0,0.10)',
                width: 210,
                transformOrigin: 'bottom center',
              }}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ width: '100%', height: 224, objectFit: 'cover', display: 'block' }}
              />
              <p className="font-sans" style={{
                textAlign: 'center',
                marginTop: 12,
                fontSize: 12,
                color: 'var(--color-secondary)',
                lineHeight: 1.4,
                margin: '12px 0 0',
              }}>
                {photo.caption}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {POLAROIDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              background: i === active ? '#1E4B9A' : 'rgba(30,75,154,0.2)',
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

// ─── Hero Lottie ──────────────────────────────────────────────────────────────

function HeroLottie() {
  const [data, setData] = useState<object | null>(null)
  useEffect(() => {
    fetch('/videos/Revenue-Management-Video.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])
  return (
    <div className="w-full overflow-hidden">
      {data && (
        <Lottie animationData={data} loop autoplay style={{ width: '100%', display: 'block' }} />
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenueManagementPage() {
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
        {/* Hero Lottie */}
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, marginBottom: 48 }}>
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)' }}>
            <HeroLottie />
          </div>
        </div>

        {/* Text content below image */}
        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
          <h1 className="text-[44px] sm:text-[58px] font-bold text-navy-dark leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            PROS Revenue Management
          </h1>

          <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 16 }}>
            During my UX Design internship at PROS, I worked on product strategy and developed AI features for the Revenue Management (RM) platform for airline analysts of all experience levels.
          </p>

          {/* Meta row — 4 bordered boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { label: 'Role',     value: 'UX Design Intern' },
              { label: 'Duration', value: 'Jun – Sep 2025' },
              { label: 'Team',     value: 'UX Strategist, UX Researcher, PM' },
              { label: 'Tools',    value: 'Figma, Claude, Figma Make' },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{ padding: '8px', border: '1px solid rgba(30,75,154,0.2)' }}
              >
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
      <Section id="rm-intro" className="">
        {/* Chapter label + indicator — full width */}
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

        {/* Row 1: h3 + body text */}
        <div style={{ marginBottom: 32 }}>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>OVERVIEW</p>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0, marginBottom: 8 }}>
            Revenue Management Platform at PROS
          </h3>
          <Prose>
            <BodyText>
              This past summer, I interned at PROS, a B2B software company that builds digital products for commercial airlines and their internal teams. I worked with the UX Strategist, User Researcher, and Project Manager to define the design direction for the Revenue Management Platform — with a dual focus: modernize the platform and explore AI integration.
            </BodyText>
          </Prose>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(30,75,154,0.08)', margin: '48px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>CONTEXT</p>
            <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0, marginBottom: 8 }}>
              How Covid-19 affected the Airline Industry & RM
            </h3>
            <BodyText>
              When COVID-19 hit, travel came to a halt. Airlines faced widespread layoffs, including airline analysts. With them went years of institutional knowledge. When hiring picked back up, a new generation of analysts entered the field.
            </BodyText>
            <BodyText>
              The RM platform has a steep learning curve — it assumed users would have expert guidance or in-depth tutorials. However, the new generation of analysts prefers to learn differently and has shown a preference for AI tools. Meanwhile, Senior analysts still make up a significant portion of the user base and have established workflows.
            </BodyText>
          </div>

          <figure style={{ margin: 0 }}>
            <img src={img('revenue-management-10-eiVem1.png')} alt="Major US airlines to lay off thousands of workers as Covid-19 support expires" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
            <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Airplanes parked at Southern California Logistics Airport in July 2020. (Credit: Ryan Patterson)</figcaption>
          </figure>
        </div>

        <ChallengeBanner
          question="How might we modernize the RM platform and successfully integrate AI to support both new and more senior analysts?"
        />
      </Section>

      {/* ── Solution Preview ── */}
      <Section id="rm-solution" className="">
        {/* Chapter label + indicator */}
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

        {/* Full-width video container */}
        <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', overflow: 'hidden', marginBottom: 8 }}>
          <video
            src="/videos/RM-Solution.webm"
            autoPlay
            loop
            muted
            playsInline
            className="cs-solution-video-inner"
            style={{ width: '75%', display: 'block', margin: '0 auto' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginTop: 8 }}>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0 }}>
            A clearer and supportive data platform for Airline Analysts
          </h3>
          <BodyText>
            Revenue Management is the platform airlines use to price flights and manage seat inventory — now redesigned to be clearer, faster, and with AI built in where it matters.
          </BodyText>
        </div>
      </Section>

      {/* ── Research ── */}
      <Section id="rm-research" className="">
        <SectionHeading index={3} chapter="Research" heading="Pain Points in the Analyst Experience" tag="USER RESEARCH" />
        <Prose>
          <BodyText>
            I joined the RM team after user research was already conducted. To get up to speed, I met with the User Researcher and UX Strategist to review findings, and spoke with the PM who had worked directly with airline analysts and the Customer Support team.
          </BodyText>
          <BodyText>
            From those conversations, three pain points stood out:
          </BodyText>
        </Prose>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
          {[
            { icon: <Brain size={24} weight="light" />, title: 'High Cognitive Load',  body: 'Junior Analysts were dropped into complex views without context or guidance.' },
            { icon: <Ghost size={24} weight="light" />, title: 'Low User Adoption',    body: 'Junior Analysts abandoned tasks mid-way and opted for AI workarounds outside the platform.' },
            { icon: <BookOpen size={24} weight="light" />, title: 'Training Dependency', body: 'Junior Analysts relied on Senior colleagues and external AI when they got stuck.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16 }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(30,75,154,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-navy)',
                marginBottom: 12,
              }}>
                {icon}
              </div>
              <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 8, marginTop: 0 }}>{title}</h4>
              <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 6 }}>USER PERSONAS</p>
          <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0, marginBottom: 8 }}>
            Distinctive Users with Varying Levels of Expertise
          </h3>
          <BodyText>
            Both the user research and internal interviews revealed that the main users of RM were Junior and Senior Analysts. I outlined these user personas to align the team and guide our design direction.
          </BodyText>
        </div>

        <PersonaToggle className="mt-12" />

        <div className="mt-16">
          <SubHeading tag="SYSTEMS MAPPING">Mapping out the Current State</SubHeading>
          <BodyText>
            I mapped the relationship between users, the platform, and the three pain points. High cognitive load pushed Junior Analysts in two directions: some left the platform entirely, others turned to workarounds — relying on Senior colleagues or outside AI to get unstuck. The platform served neither user well.
          </BodyText>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
            <img src={img('revenue-management-13-pX9ss5.png')} alt="How the current RM experience affects Senior and Junior Analysts differently" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>How the current RM experience affects Senior and Junior Analysts differently</figcaption>
        </figure>


        <div style={{ marginTop: 48 }}>
          <SubHeading tag="USER JOURNEYS">Same Platform, Different Experiences</SubHeading>
          <BodyText>
            Even though Junior and Senior analysts used the same platform, their paths looked completely different. The divergence started at login — Juniors landed without direction, Seniors landed with purpose.
          </BodyText>
          <BodyText>
            Focusing on the earliest divergence pointed us toward the most impactful place to start: the landing experience.
          </BodyText>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <div style={{ background: '#f0f4fb', border: '1px solid rgba(30,75,154,0.2)', padding: 24 }}>
            <img src={img('revenue-management-14-3LKss2.png')} alt="Comparative look at how Junior and Senior Analysts move through the same platform" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>A comparative look at how Junior and Senior Analysts move through the same platform differently</figcaption>
        </figure>

        <div style={{ marginTop: 48 }}>
          <ChallengeBanner
            label="Challenge (Revised)"
            question="How might we modernize the landing experience to help Junior analysts get started and Senior analysts work more efficiently?"
          />
        </div>

      </Section>

      {/* ── Development ── */}
      <Section id="rm-development" className="">
        <SectionHeading index={4} chapter="Development" heading="Approved Concepts" tag="IDEATION" />
        <BodyText>
          After identifying the core pain points, we brainstormed concepts to address them. I suggested starting with My Markets — the screen where research showed Juniors got lost most. The team agreed and added Market Overview, which Seniors use regularly. We then explored an AI assistant and an onboarding experience, agreeing both had to serve analysts at every level.
        </BodyText>

        <div className="grid sm:grid-cols-2 gap-5" style={{ marginTop: 8 }}>
          {[
            { icon: <ChartBar size={24} weight="light" />, title: 'My Markets',      body: 'A dashboard showing analysts which markets need attention first.' },
            { icon: <Stack size={24} weight="light" />,    title: 'Market Overview', body: 'Analytics with booking outlooks and trend data for deeper market context.' },
            { icon: <Bell size={24} weight="light" />,     title: 'Onboarding',      body: 'A welcome message and quick tour — just enough to orient new users.' },
            { icon: <Robot size={24} weight="light" />,    title: 'AI Assistant',    body: 'Context-aware guidance that suggests next steps based on what is on screen.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16, display: 'flex', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1px solid rgba(30,75,154,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-navy)', flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: 0, marginBottom: 4 }}>{title}</h4>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Placement */}
        <AIPlacementExplorer />

        <div style={{ marginTop: 48 }}>
          <SubHeading tag="AI PLACEMENT">Chosen AI Assistant: Hybrid Approach</SubHeading>
          <BodyText>
            After design critique sessions, we scrapped the left panel — it removed user agency. No single option felt right on its own, so we combined what worked: a right panel for quick optional help, embedded AI for lightweight guidance, and a dedicated chat screen for deeper assistance.
          </BodyText>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
            {[
              { title: 'Right Chat Panel', image: img('revenue-management-17-Edz70r.png'), verdict: 'Chosen (further exploration)' },
              { title: 'Embedded AI', image: img('revenue-management-18-w7PI4H.png'), verdict: 'Chosen (subtle, lightweight)' },
              { title: 'Full Chat Experience', image: img('revenue-management-15-ewOSo5.png'), verdict: 'Chosen (separate workflow)' },
            ].map(({ title, image, verdict }) => (
              <div key={title}>
                <p className="font-bold text-navy" style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 8 }}>{title}</p>
                <div style={{ marginBottom: 10 }}>
                  <img src={image} alt={title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
                </div>
                <p className="font-sans" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
                  <strong className="text-navy">Verdict:</strong> {verdict}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* My Markets layout */}
        <MyMarketsExplorer />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginTop: 48 }}>
          {/* Left */}
          <div>
            <SubHeading tag="LAYOUT EXPLORATION">Chosen My Markets: Compact Cards</SubHeading>
            <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: 16 }}>
              We chose compact rows as the default view as it can scale for dozens of markets and supports both users.
            </p>
            <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: 24 }}>
              Seniors can scan quickly because density and color coding put information in reach. Juniors can see clear priorities without feeling overwhelmed because critical markets rise to the top.
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span className="text-navy font-bold" style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>→</span>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>
                We got internal validation from our PMs, the UX team, and the VP of Design.
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <img src={img('revenue-management-23-VWDfyX.png')} alt="Compact Cards Layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
          </div>
        </div>
      </Section>

      {/* ── Solution ── */}
      <Section id="rm-features" className="">
        <SectionHeading index={5} chapter="Solution" heading="" />

        <SolutionBlock
          index={1}
          heading="My Markets"
          body="This is the first screen analysts see when they log in. Compact rows are scalable and scannable for large market datasets. Each row shows the market, its status, revenue, average fare, and passenger numbers. Color coding helps you see what needs attention right away. Critical markets rise to the top."
          impact="So Juniors know where to start, and Seniors can scan through quickly."
          image={img('revenue-management-25-IfGhSb.png')}
          imageAlt="My Markets screen"
        />

        <SolutionBlock
          index={2}
          heading="AI Embedded & Chat Panel"
          body={'Juniors were already leaving the platform to use outside AI tools. So we brought that help directly into RM. A "Get Market Insights" button surfaces AI insights about market performance. A chat panel on the right offers suggested prompts and is always optional.'}
          impact="If you're a Junior, you can use these to get unstuck. If you're a Senior, you can ignore them or close the panel entirely. The help is there if you need it."
          image={img('revenue-management-26-GAa39U.png')}
          imageAlt="AI embedded insights and chat panel"
        />

        <SolutionBlock
          index={3}
          heading="Market Overview"
          body="This is where analysts go to dive deep into a specific market. It shows booking outlooks, revenue trends, and competitive context. Senior analysts use this screen constantly — we kept their workflows the same while cleaning up the layout so Juniors could follow the data more easily."
          impact="Senior workflows stay intact. Juniors can follow the data with less effort."
          image={img('revenue-management-27-Hhvw4d.png')}
          imageAlt="Market Overview screen"
        />

        <SolutionBlock
          index={4}
          heading="Full Chat Screen"
          body="The chat panel handles quick questions. For deeper analysis, the full chat screen gives AI more room to show detailed booking trends, share forecasting data, and walk through analysis step by step."
          impact="When a Junior needs a deeper analysis, they can open a dedicated chat screen. Seniors also have access to this support if they want it."
          image={img('revenue-management-28-DIN9ZJ.png')}
          imageAlt="Full AI chat screen"
        />

        {/* Stakeholder Feedback */}
        <div style={{ marginTop: 48 }}>
        <Prose>
          <SubHeading tag="FEEDBACK">Stakeholder Feedback & Validation</SubHeading>
          <BodyText>
            We presented our designs to stakeholders. They liked the direction but wanted AI to be more front and center. Here is what they said, and how we responded.
          </BodyText>
        </Prose>

        <div style={{ marginTop: 16 }}>
          <FeedbackRow
            feedback="Why don't we move the AI chat panel to the left side? That way, the chat drives what is seen on the right."
            response="That would make AI feel like the leader of the experience. Seniors would lose the ability to ignore it."
          />
          <FeedbackRow
            feedback="What if the first thing they see is a chat prompt?"
            response="Juniors might benefit. But Seniors would feel forced into a workflow they don't want."
          />
        </div>
        </div>

        {/* A/B Testing */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* Left: heading + body + question boxes */}
            <div>
              <h3 className="font-bold text-navy-dark" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 16px' }}>
                Questions I would have asked in A/B testing
              </h3>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 16px' }}>
                We didn't get to resolve this before the internship ended. Our next step would have been A/B testing our version against a more chat-centered layout. Here is a quick mockup of what that could look like, plus the questions I would have asked users.
              </p>

              {/* Questions box */}
              <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16, marginBottom: 8 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 12px' }}>Questions I would've asked</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'How do you usually figure out where to start?',
                    'Walk me through how you check your markets today.',
                    'Did you notice the chat panel? Did you use it?',
                  ].map(q => (
                    <li key={q} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, lineHeight: 1.6, color: 'var(--color-secondary)', display: 'flex', gap: 8 }}>
                      <span className="text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>{q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics box */}
              <div style={{ border: '1px solid rgba(30,75,154,0.2)', padding: 16 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 12px' }}>What I would have measured</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Time to first click',
                    'Number of chat interactions per session',
                    'Task completion rate without chat',
                    'How often the chat panel was closed or ignored',
                  ].map(m => (
                    <li key={m} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, lineHeight: 1.6, color: 'var(--color-secondary)', display: 'flex', gap: 8 }}>
                      <span className="text-navy/40 shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: image */}
            <img src={img('revenue-management-29-3udItG.png')} alt="A/B test mockup — chat-centered layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(30,75,154,0.2)' }} />
          </div>
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="rm-reflection" className="">
        <SectionHeading index={6} chapter="Reflection" heading="" />

        <SubHeading tag="TAKEAWAYS">What I'd carry forward from a summer of product strategy</SubHeading>
        <BodyText>At PROS I had the unique opportunity to modernize a B2B airline pricing platform while balancing the needs of two very different users — and to advocate for them both through every design decision.</BodyText>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
          {[
            { heading: 'Designing for two users at once', body: 'Juniors needed guidance to figure out where to start; Seniors needed to move fast without friction. Holding both in mind simultaneously sharpened how I think about role-based design.' },
            { heading: 'Integrating AI thoughtfully', body: 'Figuring out where AI should live and where it shouldn\'t was one of the most interesting design challenges I\'ve navigated — and taught me to advocate for users in ambiguous product territory.' },
            { heading: 'Gratitude', body: 'I\'m grateful to my team at PROS for trusting me with a modernization initiative for a live enterprise platform and for challenging my thinking at every step.' },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ background: 'rgba(30,75,154,0.04)', border: '1px solid rgba(30,75,154,0.1)', padding: 20 }}>
              <p className="font-sans font-bold text-navy" style={{ fontSize: 15, margin: '0 0 10px' }}>{heading}</p>
              <p className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src="/images/revenue-management/ux-houston-team.webp" alt="PROS UX Design team" style={{ width: '75%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-sans font-semibold tracking-[0.14em] uppercase text-center" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>PROS UX Design team</figcaption>
        </figure>
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
