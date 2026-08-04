import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { Brain, Ghost, BookOpen, MapPin, User, ChartBar, Stack, Bell, Robot, Asterisk, CheckCircle, MinusCircle, CaretLeft, CaretRight, AirplaneTakeoff, Cake, Gear, ChatCircleText, ArrowBendUpRight } from '@phosphor-icons/react'
import ImageFigure from '../../components/case-study/ImageFigure'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'rm-intro',             label: 'Context' },
  { id: 'rm-solution-preview',  label: 'Solution Preview' },
  { id: 'rm-research',    label: 'Research' },
  { id: 'rm-development', label: 'Development' },
  { id: 'rm-features',    label: 'Solution' },
  { id: 'rm-impact',      label: 'Impact' },
  { id: 'rm-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/revenue-management/${file}`

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
    <p className="font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 }}>
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
      <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

// ─── Persona card ─────────────────────────────────────────────────────────────

function PersonaCard({
  type, name, age, location, experience, needs, avatar, avatarStyle, description,
}: {
  type: string; name: string; age: string; location: string
  experience: string; needs: string[]; avatar: string; avatarStyle?: React.CSSProperties
  description: string
}) {
  return (
    <div>
      <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
        {/* Type badge */}
        <div style={{ display: 'inline-block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '6px 14px', marginBottom: 24 }}>
          <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-cs-heading)' }}>{type}</span>
        </div>

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

        {/* Age + Location + Experience */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Cake size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{age}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Gear size={13} style={{ color: 'rgba(var(--color-navy-rgb),0.4)' }} />
            <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>{experience}</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '0 0 20px' }} />

        {/* Needs */}
        <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: '0 0 12px' }}>Needs:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {needs.map(n => (
            <li key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
              <span className="font-landing-body text-[13px]" style={{ color: '#222225', lineHeight: 'normal' }}>{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{description}</p>
    </div>
  )
}

// ─── Solution feature block (stacked: text → full-width image → impact) ───────

function SolutionBlock({
  index, heading, body, userImpact, image, imageAlt, caption,
}: {
  index: number; heading: string; body: string | string[]; userImpact?: string
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

      {userImpact && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>User Impact:</strong> {userImpact}
            </p>
          </div>
        </>
      )}

      <img src={image} alt={imageAlt} className="rm-my-markets-feature-img" style={{ height: 'auto', display: 'block', margin: '32px auto 0', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
      {caption && <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>{caption}</p>}
    </div>
  )
}

// ─── Stakeholder feedback row (icon + two-column) ─────────────────────────────

function FeedbackRow({ feedback, response }: { feedback: string; response: string }) {
  return (
    <div style={{ marginTop: 16 }}>
      {/* Stakeholder feedback card */}
      <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC' }}><ChatCircleText size={16} weight="bold" /></span>
            <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: 0 }}>Stakeholder Feedback</p>
          </div>
          <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{feedback}</p>
        </div>

        {/* My response */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC' }}><ArrowBendUpRight size={16} weight="bold" /></span>
            <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: 0 }}>My Response</p>
          </div>
          <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{response}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Polaroid deck ────────────────────────────────────────────────────────────

const POLAROIDS = [
  { src: img('conchas.jpeg'),                caption: 'Coworker brought conchas!' },
  { src: img('houston-skyline.avif'),        caption: 'Houston Skyline' },
  { src: img('badge.jpeg'),                  caption: 'My Badge' },
  { src: img('brainstorming-session.jpeg'),  caption: 'Team Sessions' },
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

// ─── Persona toggle ───────────────────────────────────────────────────────────

const PERSONAS = [
  {
    type: 'Junior Analysts',
    name: 'Avery Chen',
    age: '24 years old',
    location: 'Houston, Texas',
    experience: '1 year of experience',
    description: 'A new analyst learning the ropes and trying to work independently.',
    avatar: img('revenue-management-11-4V1tuQ.png'),
    needs: [
      'To learn on the job without constantly relying on senior colleagues',
      'A clear starting point every time she logs in',
      'Thoughtful guidance that helps her build confidence over time',
    ],
  },
  {
    type: 'Senior Analysts',
    name: 'Alex Reyes',
    age: '42 years old',
    location: 'Houston, Texas',
    experience: '10 years of experience',
    description: 'An experienced analyst who needs efficiency without disruption.',
    avatar: img('revenue-management-12-o8jH7a.png'),
    needs: [
      'To make price adjustments efficiently without unnecessary steps',
      'Alerts that show him what needs attention and leave out what does not',
      'External market data brought into the platform so he does not have to source it himself',
    ],
  },
]

function PersonaGrid({ className = '', style: styleProp }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start', ...styleProp }}>
      {PERSONAS.map(p => (
        <PersonaCard
          key={p.name}
          type={p.type}
          name={p.name}
          age={p.age}
          location={p.location}
          experience={p.experience}
          avatar={p.avatar}
          needs={p.needs}
          description={p.description}
          avatarStyle={p.type === 'Junior Analysts' ? { objectFit: 'cover', objectPosition: 'center 20%' } : undefined}
        />
      ))}
    </div>
  )
}

const MARKET_OPTIONS = [
  { title: 'Compact Cards Layout', image: img('revenue-management-23-VWDfyX.png'), pros: 'More markets on screen and color coding helps with scanning.', cons: 'Not as much context. Action buttons hidden added friction.', verdict: true },
  { title: 'Grid Cards Layout', image: img('revenue-management-22-dMGTox.png'), pros: 'More markets visible at once than expanded cards.', cons: 'Cognitive overload and no defined CTA.' },
  { title: 'Expanded Cards Layout', image: img('revenue-management-21-yRkD3C.png'), pros: 'Clear guidance upfront. Action buttons are visible without extra clicks.', cons: "Takes up too much vertical space and doesn't scale." },
]

const CIRCLE_BTN: React.CSSProperties = { flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 43, 85, 0.35)', color: '#ffffff', cursor: 'pointer', backdropFilter: 'blur(4px)' }

function MyMarketsExplorer() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const option = MARKET_OPTIONS[active]
  const total = MARKET_OPTIONS.length
  const goPrev = () => { setDirection(-1); setActive((active - 1 + total) % total) }
  const goNext = () => { setDirection(1); setActive((active + 1) % total) }

  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 108 }}>
      <div className="rm-my-markets-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Wireframe Tests</p>
          <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)', marginBottom: 8 }}><AirplaneTakeoff size="1em" weight="regular" /></span>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: '0 0 8px' }}>
            My Markets: Exploring Card Layout
          </h3>
          <BodyText>
            How might we display market cards so analysts can scan quickly without losing important context?
          </BodyText>
          <BodyText>
            We explored three levels of card density.
          </BodyText>
        </div>

        {/* Right: arrows flanking sliding image + pros/cons */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" onClick={goPrev} aria-label="Show previous wireframe test" style={CIRCLE_BTN}>
              <CaretLeft size={12} weight="bold" />
            </button>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <motion.div
                key={active}
                initial={{ x: direction === 1 ? 24 : -24 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}
              >
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, marginTop: 8 }}>{option.title}</p>
                <div style={{ border: '1px solid #d1d1d1', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 1 }}><CheckCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Pros:</span> {option.pros}</span>
                  </p>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-cs-heading)', flexShrink: 0, display: 'flex', marginTop: 1 }}><MinusCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Cons:</span> {option.cons}</span>
                  </p>
                </div>
              </motion.div>
            </div>
            <button type="button" onClick={goNext} aria-label="Show next wireframe test" style={CIRCLE_BTN}>
              <CaretRight size={12} weight="bold" />
            </button>
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
    pros: 'A dedicated space for deeper AI assistance. Accessible to anyone when they needed more help.',
    cons: 'Users had to navigate to a different screen.',
  },
  {
    title: 'Left Chat Panel',
    image: img('revenue-management-16-1hN5yG.png'),
    pros: 'Always visible.',
    cons: 'Risked feeling intrusive or like AI was leading the experience.',
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
  const [direction, setDirection] = useState(1)
  const option = AI_OPTIONS[active]
  const total = AI_OPTIONS.length
  const goPrev = () => { setDirection(-1); setActive((active - 1 + total) % total) }
  const goNext = () => { setDirection(1); setActive((active + 1) % total) }

  return (
    <div className="cs-card-box" style={{ padding: 32, marginTop: 108 }}>
      <div className="rm-ai-assistant-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'center' }}>
        {/* Left: context */}
        <div>
          <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 6, marginTop: 0 }}>Wireframe Tests</p>
          <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)', marginBottom: 8 }}><Robot size="1em" weight="regular" /></span>
          <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: '0 0 8px' }}>
            AI Assistant: Exploring Placement
          </h3>
          <BodyText>
            How might we offer AI help that's there when you need it and invisible when you don't?
          </BodyText>
        </div>

        {/* Right: arrows flanking sliding image + pros/cons */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" onClick={goPrev} aria-label="Show previous wireframe test" style={CIRCLE_BTN}>
              <CaretLeft size={12} weight="bold" />
            </button>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <motion.div
                key={active}
                initial={{ x: direction === 1 ? 24 : -24 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}
              >
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, marginTop: 8 }}>{option.title}</p>
                <div style={{ border: '1px solid #d1d1d1', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={option.image} alt={option.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 1 }}><CheckCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Pros:</span> {option.pros}</span>
                  </p>
                  <p className="font-landing-body" style={{ fontSize: 13, color: '#222225', lineHeight: 'normal', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-cs-heading)', flexShrink: 0, display: 'flex', marginTop: 1 }}><MinusCircle size={16} weight="regular" /></span>
                    <span><span className="font-bold text-[var(--color-cs-heading)]">Cons:</span> {option.cons}</span>
                  </p>
                </div>
              </motion.div>
            </div>
            <button type="button" onClick={goNext} aria-label="Show next wireframe test" style={CIRCLE_BTN}>
              <CaretRight size={12} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SPREAD_ROTATIONS = [-6, 3, -3, 5]

function PolaroidDeck({ fullWidth = false }: { fullWidth?: boolean }) {
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

  if (fullWidth) {
    return (
      <div className="rm-polaroid-deck" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '24px 0 8px', width: '80%', margin: '0 auto' }}>
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="rm-polaroid-card"
            style={{
              flex: '0 1 200px',
              width: 200,
              background: '#fff',
              padding: '16px 16px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              rotate: SPREAD_ROTATIONS[i],
              cursor: 'pointer',
              transformOrigin: 'bottom center',
              zIndex: i,
            }}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              style={{ width: '100%', height: 224, objectFit: 'cover', display: 'block' }}
            />
            <p style={{
              fontFamily: 'var(--font-landing-body)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-cs-heading)',
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 'normal',
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          <div style={{ background: '#12213a', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid #d1d1d1' }}>
            <HeroLottie />
          </div>
        </div>

        {/* Text content below image */}
        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
          <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            PROS Revenue Management Platform
          </h1>

          <p className="font-landing-body text-[15px] " style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
            During my UX Design internship at PROS, I worked on product strategy and developed AI features for the Revenue Management (RM) platform for airline analysts of all experience levels.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginBottom: 0 }}>
            {[
              { label: 'Role',     value: 'UX Design Intern' },
              { label: 'Timeline', value: 'Jun – Sep 2025' },
              { label: 'Team',     value: 'Visual Designer, UX Researcher, PM' },
              { label: 'Tools/Skills', value: 'Figma, Claude, Figma Make' },
            ].map(({ label, value }) => (
              <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
              </div>
            ))}
          </div>

          <a href="#rm-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
        </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Context ── */}
      <Section id="rm-intro" className="">
        {/* Chapter label + indicator — full width */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>1.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Context
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

        <div style={{ marginTop: 108 }}>
          <PolaroidDeck />
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Revenue Management Platform @ PROS</SubHeading>
          <BodyText>
            PROS is a B2B software company that builds digital products for commercial airlines and their internal teams. I worked with the UX Strategist, User Researcher, and Project Manager to define the design direction for the Revenue Management Platform (RM) with dual focus to modernize the platform and explore AI integration.
          </BodyText>

          <figure style={{ margin: '32px 0 0' }}>
            <img src="/images/revenue-management/previous-rm-screens.avif" alt="Historical/Forecast Graph, Traffic Mix Data Visualization, and Flight Calendar Grid View from the previous Revenue Management platform" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Precedent Revenue Management Screens for Market JFK-PIT</figcaption>
          </figure>
        </div>

        <div className="rm-intro-grid" style={{ marginTop: 108, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          <Prose>
            <SubHeading>How Covid-19 affected the Airline Industry & RM</SubHeading>
            <BodyText>
              When COVID-19 hit, travel came to a halt. Airlines faced widespread layoffs, including airline analysts. With them went years of institutional knowledge.
            </BodyText>
            <BodyText>
              When hiring picked back up, a new generation of analysts entered the field. The RM platform has a steep learning curve. It assumed users would have expert guidance or in-depth tutorials.
            </BodyText>
            <BodyText>
              However, the new generation of analysts prefers to learn differently as they've shown a preference for AI tools. Meanwhile, Senior analysts still make up a significant portion of the user base and have established workflows.
            </BodyText>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>The challenge:</strong> How might we support Junior analysts without disrupting the workflows Senior analysts rely on?
              </p>
            </div>
          </Prose>

          <figure style={{ margin: 0 }}>
            <img src={img('revenue-management-10-eiVem1.png')} alt="Major US airlines to lay off thousands of workers as Covid-19 support expires" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Airplanes parked at Southern California Logistics Airport in July 2020. (Credit: Ryan Patterson)</figcaption>
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <ChallengeBanner
            icon={<AirplaneTakeoff size="1em" weight="regular" />}
            iconColor="#416BCC"
            question={<>How might we <strong><em>modernize</em></strong> the RM platform and meaningfully <strong><em>integrate AI</em></strong> to support both Senior analysts and Junior analysts?</>}
          />
        </div>
      </Section>

      {/* ── Solution Preview ── */}
      <Section id="rm-solution-preview" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>2.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Solution Preview
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

        {/* Video container */}
        <div style={{ width: '100%', margin: '0 auto' }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', background: 'transparent' }}>
            <LazyVideo
              src="/videos/revenue-management-solution-preview.webm"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>

        {/* TL:DR */}
        <div style={{ marginTop: 32 }}>
          <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>TL:DR</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
            <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
              A clearer and supportive data platform for Airline Analysts
            </h3>
            <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
              Revenue management is how airlines price flights and manage seat inventory, now clearer, faster, and with built-in AI.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Research ── */}
      <Section id="rm-research" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>3.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Research
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
            marginBottom: 32,
          }} />
        </div>
        <SubHeading>Pain Points in the Analyst Experience</SubHeading>
        <Prose>
          <BodyText>
            I joined the RM team after user research was already conducted. To get up to speed, I met with the User Researcher and UX Strategist to review the findings. I also talked with the PM, who had been working directly with airline analysts and the Customer Support team.
          </BodyText>
          <BodyText>
            From the research and these conversations, I walked away with three key pain points:
          </BodyText>
        </Prose>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
          {[
            { icon: <Brain size="1em" />, title: 'High Cognitive Load', description: 'Junior Analysts were dropped into complex views without context or clear priorities.' },
            { icon: <Ghost size="1em" />, title: 'Low User Adoption', description: 'Junior Analysts abandoned tasks mid-way and opted for AI workarounds.' },
            { icon: <BookOpen size="1em" />, title: 'Training Dependency', description: 'Junior Analysts relied on Senior Analysts and AI for guidance when stuck.' },
          ].map(({ icon, title, description }) => (
            <div key={title} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '24px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#416BCC', fontSize: 'clamp(20px, 3vw, 28px)' }}>
                {icon}
              </div>
              <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 12px' }}>{title}</p>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '0 0 12px' }} />
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
            </div>
          ))}
        </div>
        <p className="font-landing-body cs-caption" style={{ marginTop: 20 }}>
          Main Pain Points from User Research/Internal Interviews
        </p>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Distinctive Users with Varying Levels of Expertise</SubHeading>
          <BodyText>
            Both the user research and internal interviews revealed that the main users of RM were now composed of Junior and Senior Analysts. I outlined these user personas to align the team and guide our design direction.
          </BodyText>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              The personas made one thing clear: Junior Analysts needed help getting started and building confidence. Senior Analysts needed speed. Designing for one would frustrate the other so the solution had to find the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>balance between both.</strong>
            </p>
          </div>
        </div>

        <PersonaGrid className="rm-persona-grid" style={{ marginTop: 32 }} />

        <div style={{ marginTop: 108 }}>
          <SubHeading>Mapping out the Current State</SubHeading>
          <BodyText>
            I mapped out the relationship between users, the platform, and the three pain points. High cognitive load pushed Junior Analysts in two directions. Some left the platform entirely. Others turned to workarounds, relying on Senior Analysts or AI to get by.
          </BodyText>
          <BodyText>
            For Senior Analysts, that meant interruptions every time a Junior asked for help. Sometimes they had to stop their own work to guide or manage the Junior. The platform served neither user well.
          </BodyText>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              The redesign had to do two things: <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>reduce the friction</strong> that pushed Juniors away, and <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>match the convenience of the workarounds</strong> they'd already discovered.
            </p>
          </div>
        </div>

        <figure style={{ margin: '32px 0 0' }}>
          <img src={img('revenue-management-13-pX9ss5.png')} alt="How the current RM experience affects Senior and Junior Analysts differently" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>How the current RM experience affects Senior and Junior Analysts differently</figcaption>
        </figure>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Same Platform, Different Experiences</SubHeading>
          <BodyText>
            I wanted to see exactly where Junior and Senior experiences diverged. That would help me narrow in on where a redesign would have the most impact.
          </BodyText>
          <BodyText>
            Even though they were using the same platform, their paths looked completely different. The divergence starts at login. Juniors land without direction. Seniors land with purpose.
          </BodyText>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              Juniors couldn't initiate tasks while Seniors could, so we focused on that earliest divergence: the landing experience.
            </p>
          </div>
        </div>

        <figure style={{ margin: '48px 0 0' }}>
          <img src={img('revenue-management-14-3LKss2.png')} alt="Comparative look at how Junior and Senior Analysts move through the same platform" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto', border: '1px solid #d1d1d1', borderRadius: 8 }} />
          <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>A comparative look at how Junior and Senior Analysts move through the same platform differently, highlighting where design opportunities exist.</figcaption>
        </figure>

        <div style={{ marginTop: 108 }}>
          <ChallengeBanner
            icon={<AirplaneTakeoff size="1em" weight="regular" />}
            iconColor="#416BCC"
            label="Challenge (Revised)"
            question={<>How might we <strong><em>modernize</em></strong> the landing experience to help Junior analysts get started and Senior analysts work more <strong><em>efficiently?</em></strong></>}
          />
        </div>

      </Section>

      {/* ── Development ── */}
      <Section id="rm-development" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>4.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Development
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
            marginBottom: 32,
          }} />
        </div>
        <SubHeading>Approved Concepts</SubHeading>
        <BodyText>
          After identifying the core pain points, we brainstormed concepts to address them. I suggested starting with My Markets, a core screen where research showed Juniors spent the most time getting lost. The team agreed and suggested adding Market Overview, which Senior analysts commonly use.
        </BodyText>
        <BodyText>
          From there, we brainstormed two additional features: an AI assistant and an onboarding experience. We discussed who each feature was for and agreed that both had to serve Junior and Senior analysts.
        </BodyText>

        <div className="grid lg:grid-cols-2 gap-6" style={{ marginTop: 8 }}>
          {[
            { icon: <ChartBar size="1em" weight="light" />, title: 'My Markets',      description: 'A dashboard that shows analysts which markets need attention first.', reason: 'I suggested this because research showed Juniors spend the most time here.' },
            { icon: <Stack size="1em" weight="light" />,    title: 'Market Overview', description: 'Analytics with booking outlooks and trend data. Context an analyst needs to understand their markets.', reason: 'The team added this because Senior analysts use it regularly.' },
            { icon: <Bell size="1em" weight="light" />,     title: 'Onboarding',      description: 'A welcome message and a quick tour. Just enough to orient new users and introduce what changed.', reason: 'Seniors need a brief rundown. Juniors need more guidance. The onboarding had to work for both.' },
            { icon: <Robot size="1em" weight="light" />,    title: 'AI Assistant',    description: "Context-aware guidance that suggests next steps based on what's on screen.", reason: 'Juniors were already using external AI tools. I wanted to bring that help directly into the platform and support Senior analysts too.' },
          ].map(({ icon, title, description, reason }) => (
            <div key={title}>
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24 }}>
                <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', marginBottom: 8, marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: '#416BCC', fontSize: '1em' }}>{icon}</span>
                  {title}
                </h3>
                <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
                <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                <span className="font-landing-body text-[13px]" style={{ color: 'var(--color-secondary)', lineHeight: 'normal' }}>{reason}</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Placement */}
        <AIPlacementExplorer />

        <div style={{ marginTop: 108 }}>
          <SubHeading>AI Assistant: Hybrid Approach</SubHeading>
          <BodyText>
            After bringing the options to design critique sessions with the entire UX design team. We decided to scrap the left panel entirely. It suggested the AI was leading the experience and removed user agency. But no single option felt right on its own.
          </BodyText>
          <BodyText>
            So we combined what worked from each. A right side panel for quick, optional help that keeps the user in control. Embedded AI suggestions for lightweight guidance. And a dedicated AI chat screen for deeper assistance.
          </BodyText>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              With this solution, Juniors get support to build confidence. Seniors get support to stay efficient.
            </p>
          </div>

          <div className="rm-ai-verdict-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
            {[
              { title: 'Right Chat Panel', image: img('revenue-management-17-Edz70r.png'), verdict: 'Chosen (further exploration)' },
              { title: 'Embedded AI', image: img('revenue-management-18-w7PI4H.png'), verdict: 'Chosen (subtle, lightweight)' },
              { title: 'Full Chat Experience', image: img('revenue-management-15-ewOSo5.png'), verdict: 'Chosen (separate from main workflow)' },
            ].map(({ title, image, verdict }) => (
              <div key={title}>
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, marginTop: 0 }}>{title}</p>
                <div style={{ marginBottom: 10 }}>
                  <img src={image} alt={title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
                </div>
                <p className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                  <strong className="text-[var(--color-cs-heading)]">Verdict:</strong> {verdict}
                </p>
              </div>
            ))}
          </div>

          <p className="font-landing-body cs-caption" style={{ marginTop: 32 }}>
            Note: These are not production final designs. This is what we accomplished by the end of my internship.
          </p>
        </div>


        {/* My Markets layout */}
        <MyMarketsExplorer />

        <div className="rm-starting-point-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', marginTop: 108 }}>
          {/* Left */}
          <div>
            <SubHeading>My Markets: Compact Cards</SubHeading>
            <BodyText>
              We chose compact rows as the default view as it can scale for dozens of markets and supports both users.
            </BodyText>
            <BodyText>
              Seniors can scan quickly because density and color coding put information in reach. Juniors can see clear priorities without feeling overwhelmed because critical markets rise to the top.
            </BodyText>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
              <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
                We got internal validation from our PMs, the UX team, and the VP of Design.
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, marginTop: 0 }}>Compact Cards Layout</p>
            <img src={img('revenue-management-23-VWDfyX.png')} alt="Compact Cards Layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid #d1d1d1', borderRadius: 8 }} />
          </div>
        </div>
      </Section>

      {/* ── Solution ── */}
      <Section id="rm-features" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>5.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Solution
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
            marginBottom: 32,
          }} />
        </div>

        {/* Solution Overview — all four screens with arrows between them */}
        <div style={{ marginBottom: 32 }}>
          <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 'normal', margin: '0 0 8px' }}>
            Solution Overview
          </h3>
          <BodyText>
            This is the whole user flow from dashboard to specific market content to AI chat.
          </BodyText>
          <div className="rm-solution-overview-grid" style={{
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
                <img src={screen.image} alt={screen.alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
                <figcaption className="font-landing-body text-left" style={{ fontSize: 14, lineHeight: 'normal', color: 'var(--color-secondary)', marginTop: 12 }}>{screen.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <p className="font-landing-body cs-caption" style={{ marginTop: 32 }}>
          Note: These are not production final designs. This is what we accomplished by the end of my internship.
        </p>

        <SolutionBlock
          index={1}
          heading="My Markets"
          body="This is the first screen analysts see when they log in. Compact rows are scalable and scannable for large market datasets. Each row shows the market, its status, revenue, average fare, and passenger numbers. Color coding helps you see what needs attention right away. Critical markets rise to the top."
          userImpact="So Juniors know where to start, and Seniors can scan through quickly."
          image={img('revenue-management-25-IfGhSb.png')}
          imageAlt="My Markets screen"
          caption="The new My Markets page. Each row shows market, status, revenue, fare, and passengers."
        />

        <SolutionBlock
          index={2}
          heading="AI Embedded & Chat Panel"
          body={[
            "Juniors were already leaving the platform to use outside AI tools. So we brought that help directly into RM.",
            "We also added a \"Get Market Insights\" button at the top of My Markets. Click it, and it surfaces AI insights about market performance. We also added a chat panel on the right side with suggested prompts you can ask.",
          ]}
          userImpact="If you're a Junior, you can use these to get unstuck. If you're a Senior, you can ignore them or close the panel entirely. The help is there if you need it."
          image={img('revenue-management-26-GAa39U.png')}
          imageAlt="AI embedded insights and chat panel"
          caption="The chat panel slides out from the right. The button sits above the market table. AI help is accessible but not mandatory."
        />

        <SolutionBlock
          index={3}
          heading="Market Overview"
          body="This is where analysts go to dive deep into a specific market. It shows booking outlooks, revenue trends, and competitive context."
          userImpact="Senior analysts use this screen all the time. We kept their workflows the same but cleaned up the layout so Juniors could follow the data more easily."
          image={img('revenue-management-27-Hhvw4d.png')}
          imageAlt="Market Overview screen"
          caption="A detailed view of a single market (MIA-CUN) composed of summary, booking outlook, and forecast."
        />

        <SolutionBlock
          index={4}
          heading="Full Chat Screen"
          body="The chat panel works for quick questions. But sometimes you need more space to dig into a problem. That's what the full chat screen is for. Here, the AI can show detailed booking trends, share forecasting data, and walk through analysis step by step."
          userImpact="When a Junior needs a deeper analysis, they can open a dedicated chat screen. Seniors also have access to this support if they want it."
          image={img('revenue-management-28-DIN9ZJ.png')}
          imageAlt="Full AI chat screen"
          caption="The full chat view is separate from the main workflow."
        />

      </Section>

      {/* ── Impact ── */}
      <Section id="rm-impact" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>6.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Impact
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
            marginBottom: 32,
          }} />
        </div>

        <SubHeading>Stakeholder Feedback</SubHeading>
        <BodyText>We presented our designs to stakeholders. They liked the direction but wanted AI to be more front and center. Here's what they said, and how we responded.</BodyText>
        <div style={{ marginTop: 16 }}>
          <FeedbackRow
            feedback="Why don't we move the AI chat panel to the left side? That way, the chat drives what is seen on the right."
            response="That would make AI feel like the leader. Seniors would lose the ability to ignore it."
          />
          <FeedbackRow
            feedback="What if the first thing they see is a chat prompt?"
            response="Juniors might benefit. But Seniors would feel forced into a workflow they don't want."
          />
        </div>

        {/* A/B Testing */}
        <div style={{ marginTop: 108 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* Left: heading + body + question boxes */}
            <div>
              <SubHeading>Questions I would have asked in A/B testing</SubHeading>
              <BodyText>
                We didn't get to resolve this before the internship ended. Our next step would have been A/B testing our version against a more chat centered layout. Here's a quick mockup of what that could look like, plus the questions I would have asked users.
              </BodyText>

              {/* Questions */}
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 20, marginBottom: 12 }}>
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 12px' }}>Questions I would've asked</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'How do you usually figure out where to start?',
                    'Walk me through how you check your markets today.',
                    'Did you notice the chat panel? Did you use it?',
                  ].map(q => (
                    <li key={q} style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, lineHeight: 'normal', color: '#222225', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>{q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics box */}
              <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 20 }}>
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 12px' }}>What I would have measured</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Time to first click',
                    'Number of chat interactions per session',
                    'Task completion rate without chat',
                    'How often the chat panel was closed or ignored',
                  ].map(m => (
                    <li key={m} style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, lineHeight: 'normal', color: '#222225', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: image */}
            <img src={img('revenue-management-29-3udItG.png')} alt="A/B test mockup — chat-centered layout" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
          </div>
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="rm-reflection" className="">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300, color: 'var(--color-navy)' }}>7.</span>
            <h2 className="font-bold cs-editorial text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 'normal', margin: 0 }}>
              Reflection
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
            marginBottom: 32,
          }} />
        </div>

        <div className="rm-reflection-grid" style={{ marginTop: 108, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          <div>
            <img src={img('ux-houston-team.webp')} alt="PROS UX Design team" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            <p className="font-landing-body cs-caption" style={{ marginTop: 12 }}>PROS UX Design team</p>
          </div>
          <div>
            <SubHeading>Reflecting on RM</SubHeading>
            <BodyText>
              Walking away from this project, I'm grateful for the transformative experience I've had at PROS.
            </BodyText>
            <BodyText>
              Through UX strategy for the RM platform, I had the unique opportunity to balance the needs of two different users. Juniors needed guidance to figure out where to start, and Seniors needed to move fast without anything getting in their way.
            </BodyText>
            <BodyText>
              Integrating AI thoughtfully was a transformative experience. Figuring out where AI should live and where it shouldn't was an interesting concept to explore from the user's perspective and to advocate for them by designing meaningfully.
            </BodyText>
            <BodyText>
              I'm grateful to my team at PROS for trusting me with a modernization initiative for a B2B airline platform and for challenging my thinking. This project isn't finished, but I am proud of what we figured out and excited to see how it turns out.
            </BodyText>
          </div>
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
