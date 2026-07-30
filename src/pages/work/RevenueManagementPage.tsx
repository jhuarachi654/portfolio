import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { Brain, Ghost, BookOpen, MapPin, Briefcase, User, ChartBar, Stack, Bell, Robot } from '@phosphor-icons/react'
import SectionHeading from '../../components/case-study/SectionHeading'
import ImageFigure from '../../components/case-study/ImageFigure'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'rm-intro',       label: 'Introduction' },
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
  type, name, age, location, experience, needs, avatar, avatarStyle,
}: {
  type: string; name: string; age: string; location: string
  experience: string; needs: string[]; avatar: string; avatarStyle?: React.CSSProperties
}) {
  return (
    <div>
      <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 24 }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          overflow: 'hidden', margin: '0 auto 16px',
          border: '1px solid rgba(var(--color-navy-rgb),0.15)',
          background: '#ffffff',
        }}>
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', ...avatarStyle }} />
        </div>

        {/* Name */}
        <h4 className="font-semibold text-[var(--color-cs-heading)] text-center" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 20, margin: '0 0 12px' }}>{name}</h4>

        {/* Age + Location + Experience — single row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <User size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{age}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{experience}</span>
          </div>
        </div>

        {/* Needs */}
        <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 12 }}>Needs:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {needs.map(n => (
            <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>
              <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 1.5 }}>{n}</span>
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
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16 }}>
      <h4 className="text-[15px] font-semibold text-[var(--color-cs-heading)] mb-4" style={{ fontFamily: 'var(--font-landing-heading)' }}>{title}</h4>
      <div className="space-y-3">
        <div className="flex gap-2">
          <span className="font-bold text-[var(--color-cs-heading)] text-[16px] leading-none mt-0.5 shrink-0">+</span>
          <p className="font-landing-body text-[var(--color-cs-heading)]/70 leading-relaxed" style={{ fontSize: 12 }}>{pros}</p>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-[var(--color-cs-heading)]/30 text-[16px] leading-none mt-0.5 shrink-0">−</span>
          <p className="font-landing-body text-[var(--color-cs-heading)]/70 leading-relaxed" style={{ fontSize: 12 }}>{cons}</p>
        </div>
      </div>
      {verdict && (
        <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]/50 mt-4 pt-4 border-t border-navy/10" style={{ fontSize: 12 }}>
          ✓ {verdict}
        </p>
      )}
    </div>
  )
}

// ─── Solution feature block (stacked: text → full-width image → impact) ───────

function SolutionBlock({
  index, heading, body, image, imageAlt,
}: {
  index: number; heading: string; body: string
  image: string; imageAlt: string
}) {
  const num = String(index).padStart(2, '0')
  return (
    <div style={{ marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        {/* Left: text */}
        <div>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>{num}. {heading}</h3>
          <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: 0 }}>{body}</p>
        </div>
        {/* Right: image */}
        <img src={image} alt={imageAlt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
      </div>
    </div>
  )
}

// ─── Stakeholder feedback row (icon + two-column) ─────────────────────────────

function FeedbackRow({ feedback, response }: { feedback: string; response: string }) {
  return (
    <div style={{ marginTop: 16 }}>
      {/* Stakeholder feedback card */}
      <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4 className="font-semibold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 16, lineHeight: 1, margin: '0 0 4px' }}>Stakeholder Feedback</h4>
          <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{feedback}</p>
        </div>

        {/* My response */}
        <div>
          <h4 className="font-semibold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 16, lineHeight: 1, margin: '0 0 4px' }}>Our Response</h4>
          <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{response}</p>
        </div>
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
    age: '24',
    location: 'Houston, TX',
    experience: '1 yr exp',
    description: 'A new analyst learning the ropes and trying to work independently.',
    avatar: img('revenue-management-11-4V1tuQ.png'),
    needs: [
      'Guidance that builds confidence over time',
      'A clear starting point every time she logs in',
      'To learn on the job without relying on Senior colleagues',
    ],
  },
  {
    type: 'Senior Analysts',
    name: 'Alex Reyes',
    age: '42',
    location: 'Austin, TX',
    experience: '10 yrs exp',
    description: 'An experienced analyst who needs efficiency without disruption.',
    avatar: img('revenue-management-12-o8jH7a.png'),
    needs: [
      'To make price adjustments quickly without extra steps',
      'Alerts that surface what needs attention',
      'External market data pulled in directly, no manual sourcing',
    ],
  },
]

function PersonaToggle({ className = '', style: styleProp }: { className?: string; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0)
  const p = PERSONAS[active]

  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', ...styleProp }}>

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
                border: `1px solid ${isActive ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.2)'}`, borderRadius: 12,
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 4px' }}>
                {persona.type}
              </p>
              <p className="font-landing-body text-[13px] italic cs-persona-desc" style={{ margin: 0 }}>
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
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
            My Markets
          </h3>
          <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 32px' }}>
            How might we <strong className="font-semibold text-[var(--color-cs-heading)]">display market cards so analysts can scan quickly</strong> without losing important context?
          </p>
          <div className="cs-option-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {MARKET_OPTIONS.map((o, i) => (
              <button
                key={o.title}
                onClick={() => setActive(i)}
                className="cs-tab-btn"
                data-cursor-label="Open option"
                style={{
                  border: `1px solid ${i === active ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.2)'}`, borderRadius: 12,
                  background: 'transparent',
                  color: i === active ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.5)',
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
            <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-bold text-[var(--color-cs-heading)]" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>+</span>
              <p className="font-landing-body" style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-[var(--color-cs-heading)]">Pros:</strong> {option.pros}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-landing-body text-[var(--color-cs-heading)]/30" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>−</span>
              <p className="font-landing-body" style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-[var(--color-cs-heading)]">Cons:</strong> {option.cons}
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
    cons: 'Risked feeling intrusive, with AI leading the experience.',
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
    <div className="cs-card-box" style={{ padding: 32, marginTop: 86 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left: context + 2x2 buttons */}
        <div>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
            AI Assistant
          </h3>
          <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 32px' }}>
            "How might we <strong className="font-semibold text-[var(--color-cs-heading)]">offer AI help</strong> that's there when you need it and invisible when you don't?"
          </p>
          <div className="cs-option-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AI_OPTIONS.map((o, i) => (
              <button
                key={o.title}
                onClick={() => setActive(i)}
                className="cs-tab-btn"
                data-cursor-label="Open option"
                style={{
                  border: `1px solid ${i === active ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.2)'}`, borderRadius: 12,
                  background: 'transparent',
                  color: i === active ? 'var(--color-cs-heading)' : 'rgba(var(--color-navy-rgb),0.5)',
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
            <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-bold text-[var(--color-cs-heading)]" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>+</span>
              <p className="font-landing-body" style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-[var(--color-cs-heading)]">Pros:</strong> {option.pros}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="font-landing-body text-[var(--color-cs-heading)]/30" style={{ fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>−</span>
              <p className="font-landing-body" style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0, lineHeight: 1.6 }}>
                <strong className="text-[var(--color-cs-heading)]">Cons:</strong> {option.cons}
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
            <p className="font-landing-body" style={{
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
              <p className="font-landing-body" style={{
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

// ─── Hero Lottie — autoplays by default; the button is the sole manual control ──

function HeroLottie() {
  const [data, setData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    // Defers the 4MB Lottie fetch/parse off the initial render's critical
    // path — the hero image is fixed-size regardless, so the rest of the
    // page can paint before this heavy JSON.parse runs.
    const load = () => fetch('/videos/Revenue-Management-Video.json').then(r => r.json()).then(setData).catch(() => {})
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
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.1)' }}
        />
      )}
      {data && <PlayPauseButton playing={playing} onToggle={handleToggle} />}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenueManagementPage() {
  useCaseToc(TOC, 'Revenue Management')
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        {/* Hero Lottie — paused by default, plays on hover */}
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: '#12213a', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <HeroLottie />
          </div>
        </div>

        {/* Text content below image */}
        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
          <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-cs-heading)', marginBottom: 8, borderLeft: '2px solid var(--color-navy)', paddingLeft: 10 }}>PROS</p>
          <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            Revenue Management
          </h1>

          <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
            Revenue Management is an analytics platform that helps airlines price flights and forecast demand. Pricing analysts use it to decide which routes to prioritize and where to adjust fares.
          </p>
          <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
            COVID disrupted the airline industry and left Revenue Management with two conflicting user groups: tenured Senior Analysts handling core pricing and newly hired Junior Analysts learning on the job. The platform had been built for experienced users and now had to support both.
          </p>
          <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
            I redesigned key workflows to bridge that gap. I added contextual AI guidance for new analysts, made pricing adjustments faster for senior analysts, and brought external market data into the platform for both. An adaptive experience for users at every level.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginBottom: 0 }}>
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

          <figure style={{ margin: '32px 0 0' }}>
            <img src="/images/revenue-management/ux-houston-team.webp" alt="PROS UX Design team" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
            <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>PROS UX Design team</figcaption>
          </figure>


          <a href="#rm-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
        </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Introduction ── */}
      <Section id="rm-intro" className="">
        {/* Chapter label + indicator — full width */}
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

        {/* Row 1: h3 + body text */}
        <div style={{ marginBottom: 32 }}>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: 0, marginBottom: 8 }}>
            The platform assumed expertise that no longer existed
          </h3>
          <Prose>
            <BodyText>
              PROS builds software for commercial airlines. I joined the Revenue Management platform team as a UX Design Intern, working alongside a UX Strategist, User Researcher, and Project Manager.
            </BodyText>
          </Prose>
        </div>

        <div style={{ marginTop: 86, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <BodyText>
              Revenue Management analysts identify underperforming flight routes and adjust pricing to recover revenue. Pricing decisions directly affect how much revenue an airline recovers on a given route.
            </BodyText>
            <BodyText>
              The platform was built assuming analysts would arrive with deep expertise. After COVID layoffs reduced much of that experienced workforce, Junior analysts were hired to fill the gaps without the institutional knowledge the platform assumed they had. Senior analysts were still present and still relied on the platform daily. Now there were two very different users sharing the same tool, and it had been designed for neither of them.
            </BodyText>
          </div>

          <figure style={{ margin: 0 }}>
            <img src={img('revenue-management-10-eiVem1.png')} alt="Major US airlines to lay off thousands of workers as Covid-19 support expires" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
            <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Airplanes parked at Southern California Logistics Airport in July 2020. (Credit: Ryan Patterson)</figcaption>
          </figure>
        </div>

        <ChallengeBanner
          question={<>How might we <strong className="font-semibold">modernize the RM platform</strong> and successfully <strong className="font-semibold">integrate AI</strong> to support both new and more senior analysts?</>}
        />
      </Section>

      {/* ── Research ── */}
      <Section id="rm-research" className="">
        <SectionHeading index={2} chapter="Research" heading="" />
        <SubHeading>The platform assumed you already knew how to use it</SubHeading>
        <Prose>
          <BodyText>
            Junior Analysts were dropped into complex views without context or guidance. When they got stuck, they left the platform entirely and used outside AI tools. When that was not enough, they pulled Senior colleagues away from their own work. All three responses pointed at the same problem: the platform assumed you already knew how to use it.
          </BodyText>
        </Prose>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
          {[
            { icon: <Brain size={24} weight="light" />, title: 'High Cognitive Load',  body: 'Junior Analysts were dropped into complex views without context or guidance.' },
            { icon: <Ghost size={24} weight="light" />, title: 'Low User Adoption',    body: 'Junior Analysts abandoned tasks mid-way and opted for AI workarounds outside the platform.' },
            { icon: <BookOpen size={24} weight="light" />, title: 'Training Dependency', body: 'Junior Analysts relied on Senior colleagues and external AI when they got stuck.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(var(--color-navy-rgb),0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-cs-heading)',
                marginBottom: 12,
              }}>
                {icon}
              </div>
              <h4 className="font-semibold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 16, marginBottom: 8, marginTop: 0 }}>{title}</h4>
              <p className="font-landing-body text-[13px] leading-relaxed" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 86 }}>
          <SubHeading>Two users pulling in opposite directions</SubHeading>
          <BodyText>
            Those pain points only told half the story. Senior Analysts were not struggling the same way, they knew the platform well and moved through it quickly. Any change that helped Juniors had to avoid disrupting the workflows Seniors depended on.
          </BodyText>
          <BodyText>
            Junior and Senior Analysts needed opposite things. Juniors needed guidance, orientation, and support when stuck. Seniors needed speed, familiarity, and no interruptions. Every design decision had to work for both.
          </BodyText>
          <BodyText>
            Avery Chen represents the Junior: one year of experience, assigned a set of markets to manage, and no clear starting point when she logs in. She needs to know where to begin, get unstuck without pulling a Senior away from their work, and build confidence over time without the platform making every decision for her.
          </BodyText>
        </div>

        <PersonaToggle className="" style={{ marginTop: 32 }} />

        <figure style={{ margin: '86px 0 0' }}>
          <img src={img('revenue-management-13-pX9ss5.png')} alt="How the current RM experience affects Senior and Junior Analysts differently" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>How the current RM experience affects Senior and Junior Analysts differently</figcaption>
        </figure>


        <div style={{ marginTop: 86 }}>
          <SubHeading>The divergence started at login</SubHeading>
          <BodyText>
            Seniors landed knowing exactly where to go. Juniors landed and clicked around trying to figure out what needed attention. The earliest point of divergence was the most impactful place to start.
          </BodyText>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('revenue-management-14-3LKss2.png')} alt="Comparative look at how Junior and Senior Analysts move through the same platform" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>A comparative look at how Junior and Senior Analysts move through the same platform differently</figcaption>
        </figure>

        <div style={{ marginTop: 86 }}>
          <ChallengeBanner
            label="Challenge (Revised)"
            question={<>How might we <strong className="font-semibold">modernize the landing experience</strong> to help Junior analysts get started and Senior analysts work more efficiently?</>}
          />
        </div>

      </Section>

      {/* ── Development ── */}
      <Section id="rm-development" className="">
        <SectionHeading index={3} chapter="Development" heading="" />
        <SubHeading>Starting from the reframe, not the full platform</SubHeading>
        <BodyText>
          The revised challenge narrowed our focus to the screens that mattered most. My Markets is the main landing screen analysts see when they log in, a dashboard that lists every market they are responsible for, and it was where Juniors got lost. Market Overview is where analysts go to understand a single market in depth, pulling together booking trends, revenue data, and competitive context in one place, and Seniors relied on it constantly. We also scoped an AI assistant to address the outside tool dependency, and onboarding to give new users a starting point.
        </BodyText>
        <BodyText>
          We descoped onboarding before high fidelity. Research showed Juniors dropped off mid-task, not at first login, so the higher priority was supporting them once they were already inside the platform.
        </BodyText>

        <div className="grid lg:grid-cols-2 gap-5" style={{ marginTop: 8 }}>
          {[
            { icon: <ChartBar size={24} weight="light" />, title: 'My Markets',      body: 'A dashboard showing analysts which markets need attention first.' },
            { icon: <Stack size={24} weight="light" />,    title: 'Market Overview', body: 'Analytics with booking outlooks and trend data for deeper market context.' },
            { icon: <Bell size={24} weight="light" />,     title: 'Onboarding',      body: 'A welcome message and quick tour to orient new users.' },
            { icon: <Robot size={24} weight="light" />,    title: 'AI Assistant',    body: 'Context-aware guidance that suggests next steps based on what is on screen.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16, display: 'flex', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1px solid rgba(var(--color-navy-rgb),0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-cs-heading)', flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 className="font-semibold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 16, margin: 0, marginBottom: 4 }}>{title}</h4>
                <p className="font-landing-body text-[13px] leading-relaxed" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Placement */}
        <AIPlacementExplorer />

        <div style={{ marginTop: 86 }}>
          <SubHeading>No single option was enough on its own</SubHeading>
          <BodyText>
            We explored four directions for the AI assistant. The left panel was scrapped after design critique because positioning AI to drive the right side of the screen made it feel mandatory, and a Senior doing a familiar task would have to work around it every time. The full chat experience required navigating away from the task entirely, which broke the flow for anyone who just needed a quick answer. The right panel worked for quick questions, but a Junior who is lost does not always know what to ask. The embedded button surfaced insights in context but could not handle anything that needed a fuller explanation.
          </BodyText>
          <BodyText>
            None of those options worked on their own. The hybrid kept what each did well. The embedded button surfaces help before Avery knows she needs it, the right panel is there when she does, and the full chat screen handles anything that needs more depth. A Senior who never needs any of it can close the AI panel and work as they always have.
          </BodyText>
          <div className="rm-ai-verdict-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
            {[
              { title: 'Right Chat Panel', image: img('revenue-management-17-Edz70r.png'), verdict: 'Chosen (further exploration)' },
              { title: 'Embedded AI', image: img('revenue-management-18-w7PI4H.png'), verdict: 'Chosen (subtle, lightweight)' },
              { title: 'Full Chat Experience', image: img('revenue-management-15-ewOSo5.png'), verdict: 'Chosen (separate workflow)' },
            ].map(({ title, image, verdict }) => (
              <div key={title}>
                <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, marginBottom: 8 }}>{title}</p>
                <div style={{ marginBottom: 10 }}>
                  <img src={image} alt={title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
                </div>
                <p className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
                  <strong className="text-[var(--color-cs-heading)]">Verdict:</strong> {verdict}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* My Markets layout */}
        <MyMarketsExplorer />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginTop: 86 }}>
          {/* Left */}
          <div>
            <SubHeading>The starting point had to be obvious without explanation</SubHeading>
            <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', marginBottom: 24 }}>
              With the AI direction settled, we turned to My Markets. Grid cards looked cleaner but buried critical markets, and with dozens of routes on screen there was no clear starting point. Expanded cards showed more detail per market but only a handful fit on screen at once, which broke down at real scale. I suggested compact rows and the team validated it. Compact rows scale to dozens of markets, use color coding to sort by severity so the most urgent markets rise to the top automatically, and keep the most important numbers visible at a glance.
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span className="text-[var(--color-cs-heading)] font-bold" style={{ fontSize: 16, flexShrink: 0, marginTop: 2, lineHeight: 1.3 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>
                We presented the direction to our PMs, the UX team, and the VP of Design. All three validated the approach. The validated direction became the four screens that shipped.
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <img src={img('revenue-management-23-VWDfyX.png')} alt="Compact Cards Layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </div>
        </div>
      </Section>

      {/* ── Solution ── */}
      <Section id="rm-features" className="">
        <SectionHeading index={4} chapter="Solution" heading="" />

        {/* Solution Overview — all four screens with arrows between them */}
        <div style={{ marginBottom: 32 }}>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
            Solution Overview
          </h3>
          <BodyText>
            This is the whole user flow from dashboard to specific market content to AI chat.
          </BodyText>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginTop: 24,
          }}>
            {[
              { image: img('revenue-management-25-IfGhSb.png'), alt: 'My Markets screen', caption: '1. Analyst logs in to the My Markets dashboard' },
              { image: img('revenue-management-26-GAa39U.png'), alt: 'AI embedded insights and chat panel', caption: '2. Opens a market and requests AI insights' },
              { image: img('revenue-management-27-Hhvw4d.png'), alt: 'Market Overview screen', caption: '3. Reviews the full market detail' },
              { image: img('revenue-management-28-DIN9ZJ.png'), alt: 'Full AI chat screen', caption: '4. Continues the conversation in the full AI chat' },
            ].map(screen => (
              <figure key={screen.alt} style={{ margin: 0 }}>
                <img src={screen.image} alt={screen.alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 6 }} />
                <figcaption className="font-landing-body text-left" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', marginTop: 12 }}>{screen.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <SolutionBlock
          index={1}
          heading="My Markets"
          body="My Markets is the first screen analysts see when they log in. Markets are sorted by severity automatically, with color coding surfacing the most critical ones at the top. Revenue, average fare, and passenger counts are visible without opening anything. Junior Analysts do not have to know what critical looks like before they can find it. Senior Analysts read the same list in a compact, scannable format."
          image={img('revenue-management-25-IfGhSb.png')}
          imageAlt="My Markets screen"
        />

        <SolutionBlock
          index={2}
          heading="AI Embedded and Chat Panel"
          body={'Research showed Junior Analysts were leaving the platform to use outside AI tools when they got stuck making pricing decisions. Rather than send them elsewhere, we brought that help into the platform. A Get Market Insights button, designed as part of this project, surfaces AI analysis for any market directly on the screen. A chat panel on the right offers suggested prompts for analysts who need more guidance. Senior Analysts have access to the same surfaces when a market calls for a closer look. Market data that previously required manual sourcing is pulled in directly.'}
          image={img('revenue-management-26-GAa39U.png')}
          imageAlt="AI embedded insights and chat panel"
        />

        <SolutionBlock
          index={3}
          heading="Market Overview"
          body="Market Overview is the screen analysts use to understand a single market in depth. It brings together booking trends, showing how seat sales are tracking over time, revenue data, and competitive context in one place. Senior Analysts use this screen constantly to inform their pricing decisions, so the underlying workflow stayed the same. The same AI surfaces from My Markets carry over here. Junior Analysts can now follow the data without having memorized what each field means, because the layout surfaces the most important signals first."
          image={img('revenue-management-27-Hhvw4d.png')}
          imageAlt="Market Overview screen"
        />

        <SolutionBlock
          index={4}
          heading="Full Chat Screen"
          body="The side panel handles quick questions. For anything that needs more, analysts can open the full chat screen, which gives AI room to walk through an analysis step by step, surface booking trends, and show forecasting data in full. Junior Analysts open it when a suggested prompt is not enough to understand what is happening in a market. Senior Analysts use it to go deeper on complex markets without pulling information from multiple places."
          image={img('revenue-management-28-DIN9ZJ.png')}
          imageAlt="Full AI chat screen"
        />

        {/* Stakeholder Feedback */}
        <div style={{ marginTop: 86 }}>
        <Prose>
          <SubHeading>A disagreement we held and a question we left open</SubHeading>
          <BodyText>
            Before shipping, we presented the designs and hit a disagreement we could not resolve.
          </BodyText>
        </Prose>

        <div style={{ marginTop: 16 }}>
          <FeedbackRow
            feedback="Why not move the AI chat panel to the left? That way the chat drives what analysts see on the right."
            response="That would make AI feel like the leader of the experience. Seniors would lose the ability to ignore it."
          />
          <FeedbackRow
            feedback="What if the first thing they see is a chat prompt?"
            response="Juniors might benefit. But Seniors would feel forced into a workflow they do not want."
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <BodyText>
            The disagreement stayed unresolved before the internship ended. Rather than guess at the answer, the right next step was to test it.
          </BodyText>
        </div>
        </div>

        {/* A/B Testing */}
        <div style={{ marginTop: 86 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* Left: heading + body + question boxes */}
            <div>
              <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>
                What we would have tested
              </h3>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: '0 0 16px' }}>
                We would have run an A/B test against a more chat centered layout to answer one question: did the AI placement we defended actually work for both users?
              </p>

              {/* Metrics box */}
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: 16 }}>
                <h4 style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 16, fontWeight: 600, color: 'var(--color-cs-heading)', margin: '0 0 12px' }}>What I would have measured</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Time to first action after login',
                    'Whether analysts completed tasks without opening the chat',
                    'How often the chat panel was opened, used, and closed without returning',
                    'How often the embedded button was used versus the full chat screen',
                  ].map(m => (
                    <li key={m} style={{ fontFamily: 'var(--font-landing-body)', fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', display: 'flex', gap: 8 }}>
                      <span className="font-bold text-[var(--color-cs-heading)] shrink-0" style={{ fontSize: 16, lineHeight: 1.3 }}>→</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: '16px 0 0' }}>
                These four would tell us whether the balance held. If Juniors finish tasks without touching the panel, the embedded button is doing its job. If they open the panel frequently, we underexposed it. If Seniors close it immediately every session, the optional placement was right. If neither group uses the embedded button, we buried it.
              </p>
            </div>

            {/* Right: image */}
            <img src={img('revenue-management-29-3udItG.png')} alt="A/B test mockup — chat-centered layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </div>
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="rm-reflection" className="">
        <SectionHeading index={5} chapter="Reflection" heading="" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24 }}>
          {[
            { heading: 'Designing for two users at once', body: 'Every time a decision worked for one it had to be checked against the other. The compact rows, the optional panel, keeping Market Overview\'s workflow intact: none of those are neutral choices. They are each a specific answer to the question of what happens to the Senior if we fix this for the Junior. That constraint made every decision harder and more precise.' },
            { heading: 'Integrating AI thoughtfully', body: 'The core tension was that AI help and user control pull in opposite directions. Every version that gave AI more control made the product faster for a Junior and more disruptive for a Senior. The version that shipped keeps AI available without making it the default.' },
            { heading: 'Knowing when to hold a position and when to test it', body: 'The stakeholder exchange about the left panel was not a disagreement about aesthetics. It was a disagreement about which user the product was optimizing for. Naming that made it possible to hold the position in the room. Not resolving it by the end of the internship was not a failure. It was an honest acknowledgment that the question deserved data, not a guess.' },
          ].map(({ heading, body }) => (
            <div key={heading}>
              <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 10px' }}>{heading}</p>
              <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </Section>

      </div>

      <NextProject
        title="PROS Fare Finder Map"
        to="/work/fare-finder"
        tags={["Enterprise", "Product Design Intern"]}
        description="Designed and shipped a flight map tool for travelers to explore and book their next trip."
        video="/videos/Fare-Finder-Video.webm"
        poster="/videos/Fare-Finder-Video-poster.png"
        restTime={4}
        mediaZoom={1.3}
        mediaPadding={16}
        objectFit="contain"
        category="enterprise"
        bgColor="#12213a"
      />

    </div>
  )
}
