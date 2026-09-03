import { useState, useEffect, useRef } from 'react'
import { Asterisk } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import LazyVideo from '../../components/LazyVideo'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ff-intro',             label: 'Context' },
  { id: 'ff-research',          label: 'Research' },
  { id: 'ff-development',       label: 'Development' },
  { id: 'ff-features',          label: 'Solution' },
  { id: 'ff-validation',        label: 'Validation Study' },
  { id: 'ff-reflection',        label: 'Reflection' },
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

const SCATTER_ROTATIONS = [-6, 4, -3, 7]

function PolaroidStack() {
  return (
    <>
      {POLAROIDS.map((photo, i) => (
        <div
          key={photo.src}
          className="rm-polaroid-scatter-card rm-polaroid-scatter-card--animated"
          style={{
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            ['--rm-polaroid-rot' as string]: `${SCATTER_ROTATIONS[i]}deg`,
            animationDelay: `${i * 140}ms`,
          } as React.CSSProperties}
          onAnimationEnd={(e) => e.currentTarget.classList.add('rm-polaroid-scatter-card--settled')}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            style={{ width: '100%', aspectRatio: '210 / 290', objectFit: 'cover', display: 'block' }}
          />
          <p style={{
            fontFamily: 'var(--font-landing-body)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-cs-heading)',
            textAlign: 'center',
            lineHeight: 1.3,
            margin: '12px 0 0',
          }}>
            {photo.caption}
          </p>
        </div>
      ))}
    </>
  )
}

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

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-landing-body text-[17px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
      {children}
    </p>
  )
}

function SubHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties}>
      {tag && (
        <p className="cs-metric-label" style={{ margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{tag}</p>
      )}
      <h3 className="text-[32px] text-[var(--color-cs-heading)] cs-lh-normal rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

// ─── Key finding ──────────────────────────────────────────────────────────────

function KeyFinding({
  index, headline, image, imageAlt,
}: {
  index: number
  headline: [string, string, string] // [before, accent, after]
  image: string
  imageAlt: string
}) {
  return (
    <div style={{ marginTop: 108 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 18 }}>
        <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>
          key finding {index}
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <SubHeading>{headline[0]}<span style={{ color: '#416BCC' }}>{headline[1]}</span>{headline[2]}</SubHeading>
      </div>
      <div className="ff-finding-grid ff-finding-wrapper" style={{ width: '100%', maxWidth: 1220, margin: '0 auto' }} data-reveal>
        <img className="ff-finding-image" src={image} alt={imageAlt} style={{ width: '70%', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
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

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const playPromise = vid.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {})
    }
  }, [])

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
          <div className="max-w-[1080px] px-8 md:px-[42px] pt-14 pb-16">
            <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              PROS Fare Finder Map
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[17px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Designing and shipping a flight map exploration tool for airlines to display on their booking sites, helping travelers make more informed and confident booking decisions.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Product Design Intern' },
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

            
            <a href="#ff-features" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
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

        <div className="cs-fullwidth-figure" style={{ marginTop: 64 }} data-reveal>
          <img src={img('pros-ff-hero.png')} alt="PROS Fare Finder Map interface showing the interactive flight map and destination details" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
        </div>

        <div style={{ marginTop: 64 }}>
          <SubHeading>My Role</SubHeading>
          <BodyText>
              As a product design intern at PROS, I worked on the Fare Finder team alongside a UX designer, visual designer, and product managers to redesign the Fare Finder Map, focusing on personalization and improving usability. I synthesized research, conducted competitive analysis, and built prototypes in Figma to help travelers explore flights and book with confidence.
          </BodyText>
        </div>

        <div style={{ marginTop: 64 }} data-reveal>
          <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Impact</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { stat: '12 weeks', description: 'after handoff, Fare Finder went live' },
              { stat: '45%', description: 'decrease in map abandonment' },
              { stat: '35%', description: 'increase in direct bookings' },
            ].map(({ stat, description }, i) => (
              <div key={description} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, lineHeight: 'normal', margin: '0 0 8px', fontWeight: 400, color: '#416BCC', display: 'block' }} />
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
          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }} data-reveal>
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

        <figure className="cs-fullwidth-figure" style={{ margin: 0 }} data-reveal>
          <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
            <LazyVideo src="/videos/old-fare-finder.webm" style={{ width: '100%', display: 'block' }} />
          </div>
        </figure>

        <div style={{ marginTop: 108 }}>
          <SubHeading>What was the <span style={{ color: '#416BCC' }}>current</span> user experience?</SubHeading>
          <BodyText>
            With the user researcher, I analyzed five guided user interviews through affinity mapping — participants aged 21–35, spanning occasional and regular travelers — to understand how they experienced the current Fare Finder. We used FigJam AI for initial sorting and categorization, then refined the themes through discussion.
          </BodyText>

          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }} data-reveal>
            <img src={img('figjam-ai-affinity-composite.png')} alt="FigJam AI use in Affinity Mapping" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>What are the <span style={{ color: '#416BCC' }}>standards</span> across the booking market?</SubHeading>
          <BodyText>
            I conducted a competitive analysis across 10 platforms, spanning third-party booking sites and airline platforms, using thematic analysis to map the current landscape of flight booking experiences and plotted them against a 2x2 matrix identify gaps and opportunities.
          </BodyText>
        </div>
        <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }} data-reveal>
          <img src={img('competitive-analysis-tables.png')} alt="Competitive analysis tables across direct and indirect competitors" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </figure>

        <figure className="cs-fullwidth-figure" style={{ margin: '48px 0 0' }} data-reveal>
          <img src={img('fare-finder-16-KkcukH.png')} alt="Fare Finder positioning" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
        </figure>

        <KeyFinding
          index={1}
          headline={['Navigation friction was the biggest ', 'barrier', ' to exploration']}
          image={img('key-finding-1.png')}
          imageAlt="Desktop Fare Finder key finding screenshot 1"
        />

        <KeyFinding
          index={2}
          headline={['The map lacked the ', 'context', ' travelers needed to make decisions']}
          image={img('key-finding-2.png')}
          imageAlt="Desktop Fare Finder key finding screenshot 2"
        />

        <KeyFinding
          index={3}
          headline={['Travelers wanted to ', 'discover', ', not just search']}
          image={img('key-finding-3.png')}
          imageAlt="Desktop Fare Finder key finding screenshot 3"
        />

      </Section>

      {/* ── Development ── */}
      <Section id="ff-development">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Development</p>
        </div>

        <div style={{ marginTop: 32 }}>
          <SubHeading tag="Iteration #1">Flexible Dates</SubHeading>
          <BodyText>
            To help travelers make decisions without the pressure of fixed dates, we designed a <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>flexible toggle</strong> for the date selector. We iterated across <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>3 layouts</strong>, sketching in Figma, then using Claude with the current design system to prototype and bring to design critiques.
          </BodyText>
          <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
            <img src={img('iteration-1-flexible-dates.png')} alt="Flexible Dates iterations: Select Dates calendar, Flexible travel month selector, and Trip Duration options" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading tag="Iteration #2">Fare Card & Quick Facts</SubHeading>
          <BodyText>
            To help travelers feel confident booking a fare, we designed the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>Quick Facts feature</strong>. We iterated on how it would integrate into the fare card, exploring content hierarchy, navigation, and button layout, using Figma Make to generate high-fidelity options to refine and critique.
          </BodyText>
          <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
            <img src={img('iteration-2-fare-card.png')} alt="Fare card and Quick Facts panel iterations across five layout variations" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading tag="Iteration #3">Map Views & Interactions</SubHeading>
          <BodyText>
            To give travelers control over their exploration, we designed <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>flexible map views</strong>. We iterated on how the card tray, filters, and recommendations could be shown or hidden, prioritizing scannability and agency at every step.
          </BodyText>
          <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
            <img src={img('iteration-3-map-views.png')} alt="Map view iterations showing the card tray, filters, and recommendations panel shown and hidden" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </figure>
        </div>

      </Section>

      {/* ── Solution ── */}
      <Section id="ff-features">
        <div style={{ marginBottom: 16 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>4. Solution</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Prose>
            <BodyText>
              We designed Fare Finder Premium to feel <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>approachable</strong>, <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>trustworthy</strong>, and <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>supportive</strong> - accurate fare recommendations with personalized design users can trust.
            </BodyText>
          </Prose>
        </div>

        <div style={{ width: '100%', margin: '0 auto 108px' }} data-reveal>
          <div style={{ borderRadius: 8, overflow: 'hidden', background: 'transparent' }}>
            <LazyVideo
              src="/videos/fare-finder-solution-preview.webm"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>

        {[
          {
            n: 1,
            title: 'A Starting Point That Invites Exploration',
            headline: <>Setting the destination to Anywhere <span style={{ color: '#416BCC' }}>supports exploration</span>.</>,
            body: <>We redefined the entry point. Instead of asking travelers to already know where they're going, the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>default starting screen removes that pressure</strong> and lets exploration begin from a blank slate.</>,
            image: img('fare-finder-30-VCz5wN.png'),
            alt: 'New Default Starting Screen',
          },
          {
            n: 2,
            title: 'Dates That Flex With the Trip',
            headline: <>Flexible Dates lets travelers search by <span style={{ color: '#416BCC' }}>trip duration and travel month</span>.</>,
            body: <>Committing to exact dates is another barrier to exploring. By letting users search around a estimated timeframe instead, we <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>removed the pressure</strong> to have everything figured out.</>,
            image: img('fare-finder-32-IuxZgL.png'),
            alt: 'Flexible Dates Component',
          },
          {
            n: 3,
            title: 'Experience-Centered Filtering',
            headline: <>Travel Interests let users explore by <span style={{ color: '#416BCC' }}>experiences</span></>,
            body: <>The filter panel now expands beyond the original filters to include Travel Interests for an <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>experience-based search</strong>. This panel can also be shown or hidden, giving travelers control over how much of the map they see.</>,
            image: img('fare-finder-33-r6pnhW.png'),
            alt: 'Collapsible Filter Panel w/ Travel Interests',
          },
          {
            n: 4,
            title: 'Context That Arrives Exactly When It\'s Needed',
            headline: <>The right details at the right moment <span style={{ color: '#416BCC' }}>for booking</span>.</>,
            body: <>Quick Facts is embedded in the fare card to bring that context directly into the map. Selecting a flight surfaces destination photos, price, and trip type, while Quick Facts fills in the rest: cheapest month to fly, average price, time zones, and nearby airports, <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>everything travelers need</strong> to book confidently.</>,
            image: img('fare-finder-34-vcLxIa.png'),
            alt: 'Expanded Flight Card and Quick Facts Panel',
          },
          {
            n: 5,
            title: 'Recommendations',
            headline: <>Tailored destination suggestions give travelers a <span style={{ color: '#416BCC' }}>starting point</span>.</>,
            body: <>Personalized recommendations live in a <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>collapsible panel</strong> at the bottom of the screen, offering tailored suggestions based on the traveler's origin.</>,
            image: img('fare-finder-35-2kxfyI.png'),
            alt: 'Personalized Destinations Dependent on Origin Input',
          },
        ].map(({ n, title, headline, body, image, alt }) => (
          <div key={n} style={{ marginTop: n === 1 ? 0 : 108 }} data-reveal>
            <p className="cs-metric-label" style={{ margin: '0 0 16px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Feature #{n}: {title}</p>
            <p className="rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, fontWeight: 500, lineHeight: 'normal', color: 'var(--color-cs-heading)', margin: '0 auto 32px', maxWidth: 720, textAlign: 'center' }}>
              {headline}
            </p>
            <div className="rm-solution-grid" style={{ display: 'grid', gridTemplateColumns: '2.6fr 1.4fr', gap: 8, alignItems: 'center' }} data-reveal>
              <img src={image} alt={alt} className="rm-solution-laptop" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                {body}
              </p>
            </div>
          </div>
        ))}

      </Section>

      {/* ── Validation Study ── */}
      <Section id="ff-validation">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>5. Validation Study</p>
        </div>

        <SubHeading>Measuring Impact</SubHeading>

        <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
          <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
            <img src={img('validation-travelers-tested.png')} alt="5 travelers tested across usability sessions" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </figure>

        <div style={{ marginTop: 108 }}>
        <SubHeading>Results</SubHeading>
        <div className="ff-validation-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', marginTop: 24 }} data-reveal>
          <img src={img('stat-map-abandonment.png')} alt="45% Map Abandonment Decrease" className="ff-stat-card-image" style={{ width: 200, height: 'auto', display: 'block', borderRadius: 8, justifySelf: 'center', margin: '0 auto' }} />
          <div>
            <BodyText>
              Three months after handoff, Fare Finder went live. The redesigned map reduced drop-off at the point where travelers previously felt lost or overwhelmed.
            </BodyText>
            <BodyText>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>35% increase in direct bookings</strong> confirmed that giving travelers enough destination context, without sending them to a third-party tool, was the right call.
            </BodyText>
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <p className="cs-caption-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', opacity: 1 }}>Where Fare Finder Goes From Here</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { bold: 'Add', body: ' country boundary overlays to reduce geographic confusion for unfamiliar regions.' },
              { bold: 'Expand', body: ' Quick Facts with pricing trend history and seasonal fare comparisons.' },
              { bold: 'Surface', body: ' flexible date suggestions proactively, based on fare differences across a window.' },
              { bold: 'Introduce', body: ' destination cluster tooltips for travelers who want to discover, not just search.' },
            ].map(({ bold, body }) => (
              <div key={bold} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#416BCC', flexShrink: 0, display: 'flex', marginTop: 3 }}><Asterisk size={16} weight="bold" /></span>
                <p className="font-landing-body" style={{ fontSize: 15, color: '#222225', lineHeight: 'normal', margin: 0 }}>
                  <strong className="text-[var(--color-cs-heading)]">{bold}</strong>{body}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="ff-reflection">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>6. Reflection</p>
        </div>

        <SubHeading>Staying user-centered in a B2B platform.</SubHeading>
        <BodyText>
          In a B2B2C product, airline partners were our direct users, but travelers were the ones living with the experience. Balancing business requirements with user-centered design meant collaborating closely with the PM and User Researcher to make sure traveler needs stayed visible, even when they weren't in the room.
        </BodyText>

        <div style={{ marginTop: 64 }}>
          <SubHeading>Designing within international constraints.</SubHeading>
          <BodyText>
            Travelers asked for border lines and country labels, but standardizing map borders for a global airline audience wasn't possible given how differently regions and territories are perceived around the world. Working through that with my PM and UX Engineer taught me that international products carry constraints tied to geography, politics, and perception that don't show up in a design file.
          </BodyText>
        </div>

        <div style={{ marginTop: 64 }}>
          <SubHeading>What collaboration teaches you.</SubHeading>
          <BodyText>
            Working across PMs, engineers, and designers, and using tools like Figma Make and Claude to generate options quickly, created more moments for real feedback and revision. I learned to distinguish which feedback to act on, when to ask follow-up questions and to whom, and how to tailor the way I present and defend a design decision depending on who's in the room.
          </BodyText>
        </div>

        <div style={{ marginTop: 64 }}>
          <BodyText>
            I'm grateful to the PROS UX design team and my mentors for the conversations, the candid feedback, and a summer that pushed me to grow as a designer.
          </BodyText>
        </div>

        <div className="rm-reflection-collage" style={{ marginTop: 64 }}>
          <div className="rm-polaroid-scatter">
            <PolaroidStack />
          </div>

          <div className="rm-team-photo-wrap" data-reveal>
            <div className="rm-team-photo-card" style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: '12px 12px 10px' }}>
              <img src={img('fare-finder-36-3yud6R.png')} alt="PROS UX Design team" style={{ display: 'block', width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '72vh', objectFit: 'contain' }} />
              <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', textAlign: 'center', lineHeight: 1.3, margin: '12px 0 0' }}>
                UX Design Team Photo
              </p>
            </div>
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
        mediaZoom={1.05}
        objectFit="contain"
        category="consumer"
        bgColor="linear-gradient(135deg, #2b3a8f, #1a2358)"
      />

    </div>
  )
}
