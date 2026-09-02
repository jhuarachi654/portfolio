import { useEffect, useRef, useState } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { User, AirplaneTakeoff, Timer } from '@phosphor-icons/react'
import ImageFigure from '../../components/case-study/ImageFigure'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'rm-intro',       label: 'Context' },
  { id: 'rm-research',    label: 'Research' },
  { id: 'rm-development', label: 'Development' },
  { id: 'rm-features',    label: 'Solution' },
  { id: 'rm-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/revenue-management/${file}`

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
    <p className="font-landing-body text-[17px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
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

// ─── Polaroid stack (single-active, click to advance) ─────────────────────────

const POLAROIDS = [
  { src: img('conchas.jpeg'),                caption: 'Coworker brought conchas!' },
  { src: img('houston-skyline.avif'),        caption: 'Houston Skyline' },
  { src: img('badge.jpeg'),                  caption: 'My Badge' },
  { src: img('brainstorming-session.jpeg'),  caption: 'Team Sessions' },
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
          <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal rm-hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
            Modernizing PROS' Revenue Management Platform
          </h1>

          <p className="case-study-hero-reveal font-landing-body text-[17px] " style={{ color: 'var(--color-secondary)', marginBottom: 20 }}>
            Modernizing dashboard to improve scannability and data visualization, and defining AI components and interactions to better support airline analysts' pricing and analysis workflows.
          </p>

          <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginBottom: 0 }}>
            {[
              { label: 'Role',     value: 'Product Design Intern' },
              { label: 'Timeline', value: 'Jun – Sep 2025 (10 weeks)' },
              { label: 'Team',     value: 'Visual Designer, UX Researcher, PM' },
              { label: 'Tools/Skills', value: 'Figma, Claude, Figma Make' },
            ].map(({ label, value }) => (
              <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
              </div>
            ))}
          </div>

          <a href="#rm-features" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
        </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Context ── */}
      <Section id="rm-intro" className="">
        {/* Chapter label + indicator — full width */}
        <div style={{ marginBottom: 16 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>1. Context</p>
        </div>

        <div style={{ marginTop: 32 }}>
          <SubHeading>What is PROS?</SubHeading>
          <BodyText>
            PROS is a B2B SaaS company serving the airline and aviation industry. Revenue Management is their flagship product, designed to streamline the complex process of identifying fare trends and monitoring inventory to determine fare pricing.
          </BodyText>
        </div>

        <div className="cs-fullwidth-figure" style={{ marginTop: 64 }}>
          <img src="/images/revenue-management/pros-rm-hero.png" alt="PROS RM platform interface showing the My Markets dashboard and PROS AI assistant chat" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
        </div>

        <div style={{ marginTop: 64 }}>
          <SubHeading>My Role</SubHeading>
          <BodyText>
            As a product design intern at PROS, I worked on the Revenue Management team alongside a UX strategist, product manager, and user researcher on two initiatives: modernizing the RM dashboard layout for improved scannability and defining AI components and interactions. I designed in Figma, built prototypes using Windsurf and Claude Code, provided developer annotations, and conducted user research to help analysts make informed, confident pricing decisions efficiently.
          </BodyText>
        </div>

        <div style={{ marginTop: 64 }}>
          <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Impact</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { stat: '2', description: 'AI components added to the design system' },
              { stat: '48%', description: 'improvement in analyst satisfaction scores' },
              { stat: '35%', description: 'reduction in fare price decision time' },
            ].map(({ stat, description }) => (
              <div key={description}>
                <p className="cs-stat-number-accent" style={{ margin: '0 0 8px' }}>{stat}</p>
                <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 108, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Prose>
            <SubHeading>Covid-19 had changed <span style={{ color: '#416BCC' }}>45%</span> of RM's user base</SubHeading>
            <BodyText>
              The pandemic brought travel to a halt, leading to widespread layoffs across the airline industry. When hiring picked back up, approximately 45% of RM's users were a newer generation of analysts. The platform had a steep learning curve, and growing AI adoption among users signaled a need for redesign.
            </BodyText>
          </Prose>

          <figure className="rm-visual-80" style={{ margin: 0, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <img src={img('why-now-covid-headline.png')} alt="Major US airlines to lay off thousands of workers as Covid-19 support expires" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
          </figure>
        </div>

        <div className="rm-challenge-subheader-style" style={{ marginTop: 108 }}>
          <ChallengeBanner
            label="Mission"
            question={<>How might we <span style={{ color: '#416BCC' }}>modernize</span> and <span style={{ color: '#416BCC' }}>integrate AI</span> to support analysts with decision making?</>}
          />
        </div>
      </Section>

      {/* ── Research ── */}
      <Section id="rm-research" className="">
        {[
          {
            n: 1,
            headline: <>The platform assumed <span style={{ color: '#416BCC' }}>expertise analysts didn't have</span>.</>,
            body: <>Analysts were dropped into complex views with no guidance, leading to <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>cognitive overload</strong>, low confidence, and a <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>reliance on workarounds</strong> or external tools.</>,
            image: img('problem-1-complex-platform.png'),
            alt: 'Dense, data-heavy RM Advantage screens with complex tables and charts',
            noCard: true,
          },
          {
            n: 2,
            headline: <>Analysts were leaving the platform <span style={{ color: '#416BCC' }}>to find help elsewhere</span>.</>,
            body: <>Due to a steep learning curve, analysts turned to <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>external AI tools or peers</strong> for support, leaving them <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>less confident and less independent</strong> in their workflows.</>,
            image: img('problem-2-external-tools.png'),
            alt: 'Claude and ChatGPT chat interfaces, the external AI tools analysts turned to instead',
            noCard: false,
          },
        ].map(({ n, headline, body, image, alt, noCard }) => (
          <div key={n} style={{ marginTop: 64, textAlign: 'center' }}>
            <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Problem #{n}</p>
            <p className="rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, fontWeight: 500, lineHeight: 'normal', color: 'var(--color-cs-heading)', margin: '0 auto 16px', maxWidth: 640 }}>
              {headline}
            </p>
            <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: '0 auto', maxWidth: 560 }}>
              {body}
            </p>
            {image && (
              <img src={image} alt={alt} className="rm-visual-80" style={{ width: '100%', height: 'auto', display: 'block', margin: '32px auto 0', ...(noCard ? {} : { border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }) }} />
            )}
          </div>
        ))}

        <div style={{ marginTop: 108 }}>
          <p className="cs-metric-label" style={{ margin: '0 0 32px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>2. Research</p>
          <SubHeading>What was <span style={{ color: '#416BCC' }}>holding analysts back</span>?</SubHeading>
          <BodyText>
            Through interviews with customer support specialists and analysis of eight user interviews with airline analysts, I gathered perspectives from both sides — those who use the platform and those who support them — to understand where and why analysts were struggling.
          </BodyText>

          <div className="grid grid-cols-2 rm-visual-80" style={{ marginTop: 32, width: '100%', marginLeft: 'auto', marginRight: 'auto', gap: 64 }}>
            <img src={img('method-user-interviews.png')} alt="User Interviews — Customer Support Specialist and Internal Research team" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            <img src={img('method-drop-off-trends.png')} alt="Drop-rate Trends — Half of analysts would leave the platform to access AI tools" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <SubHeading>Continuous, <span style={{ color: '#416BCC' }}>native support</span> had not been considered.</SubHeading>
          <BodyText>
            The platform was built with the assumption that analysts would learn through traditional training and peer guidance. But nearly half the user base was navigating a steep learning curve, turning to external AI tools to fill knowledge gaps. There was a clear need for built-in, continuous support that matched how analysts actually worked.
          </BodyText>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Defining the User Base</SubHeading>
          <BodyText>
            Through user interviews, I confirmed that RM's user base had significantly shifted, now composed of roughly equal parts newer and senior analysts. I defined personas with their behaviors and needs clearly for the team, to show the two contrasting users and serve as a reference as we worked toward a solution that balanced both.
          </BodyText>

          <img src={img('persona-cards-composite.png')} alt="Junior Analyst persona (Avery Chen) and Senior Analyst persona (Alex Reyes) cards" className="rm-visual-80" style={{ width: '100%', margin: '32px auto 0', height: 'auto', display: 'block', borderRadius: 8 }} />
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Mapping the Analyst Journey</SubHeading>
          <BodyText>
            To narrow the scope of the redesign, I mapped a comparative journey for both analyst types to identify specific <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>pain points, friction</strong>, and where a redesign would have the most impact. We found that the two experiences diverge significantly at login — seniors know exactly where to go, while juniors land without direction.
          </BodyText>
        </div>

        <figure className="cs-fullwidth-figure" style={{ margin: '48px 0 0' }}>
          <img src={img('revenue-management-14-3LKss2.png')} alt="Comparative look at how Junior and Senior Analysts move through the same platform" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto', border: '1px solid #d1d1d1', borderRadius: 8 }} />
        </figure>

      </Section>

      {/* ── Development ── */}
      <Section id="rm-development" className="">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Development</p>
        </div>
        <SubHeading>Validating Through Iteration</SubHeading>
        <BodyText>
          Over 4 weeks of weekly validation sessions with users and stakeholders, I iterated on 4 key areas based on ongoing feedback:
        </BodyText>

        <img src={img('4-key-areas.png')} alt="Four key areas iterated on: Getting Started, Market Dashboard, AI Integration, and Market Analytics" className="rm-visual-80" style={{ width: '100%', margin: '32px auto 0', height: 'auto', display: 'block', borderRadius: 8 }} />

        <div style={{ marginTop: 108 }}>
          <SubHeading>AI Integration Across the Market</SubHeading>
          <BodyText>
            To bring the experience of external AI tools into PROS, we conducted a competitive analysis to understand how AI was being integrated across other platforms — what <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>interaction patterns</strong> and <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>mental models</strong> users already had. We looked at dashboard integration, chat experiences, and onboarding flows.
          </BodyText>
          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}>
              <img src={img('ai-exploration.png')} alt="AI Competitive Analysis — dashboard integration, onboarding, and chat experiences across platforms" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </figure>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Defining the role of AI</SubHeading>
          <BodyText>
            To address the ambiguity around AI integration, we explored layouts through sketch wireframes on FigJam ranging from heavy to light AI presence, using <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>trust</strong> and <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>user agency</strong> as guiding principles.
          </BodyText>

          <div className="rm-visual-80" style={{ width: '100%', margin: '32px auto 0' }}>
            <img src={img('ai-role-full-side-left.png')} alt="Full Chat View and Side Chat View (Left) wireframe comparison" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
            <img src={img('ai-role-side-embedded.png')} alt="Side Chat View (Right) and Embedded AI Insights wireframe comparison" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} />
          </div>
        </div>

        <div style={{ marginTop: 108 }}>
          <SubHeading>Market Scannability</SubHeading>
          <BodyText>
            Analysts review hundreds of markets a day and make pricing decisions that need to be <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>fast and accurate</strong>. When exploring flight fare card display layouts, I prioritized <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>scannability and KPIs</strong>, using Claude Code to rapidly iterate high-fidelity mockups. Each iteration explored different card sizes, balancing cognitive load and visual hierarchy to surface the right information when needed.
          </BodyText>

          <div className="rm-visual-80" style={{ width: '100%', margin: '32px auto 0', background: '#EFEFEF', borderRadius: 8, padding: 32 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <img src={img('market-scan-list-view.png')} alt="My Markets list view with search, filters, and status-grouped rows" className="rm-market-scan-img" style={{ width: 'calc(50% - 8px)', minWidth: 0, flexShrink: 1, height: 'auto', display: 'block', borderRadius: 8 }} />
              <img src={img('market-scan-card-grid-view.png')} alt="My Markets card grid view grouped by severity with Ask AI actions" className="rm-market-scan-img" style={{ width: 'calc(50% - 8px)', minWidth: 0, flexShrink: 1, height: 'auto', display: 'block', borderRadius: 8 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <img src={img('market-scan-detailed-view.png')} alt="My Markets onboarding checklist with detailed market cards" className="rm-market-scan-img" style={{ width: 'calc(50% - 8px)', minWidth: 0, height: 'auto', display: 'block', borderRadius: 8 }} />
            </div>
          </div>
        </div>

      </Section>

      {/* ── Solution ── */}
      <Section id="rm-features" className="">
        {[
          {
            n: 1,
            title: 'Market Dashboard',
            headline: <>All critical flight routes surface in <span style={{ color: '#416BCC' }}>one scannable view at login</span>.</>,
            body: <>A prioritized market list with color coding and key KPIs gives analysts a <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>clear starting point</strong>, reducing time spent searching for what needs attention.</>,
            image: img('solution-1-market-dashboard.png'),
            alt: 'My Markets dashboard with prioritized, color-coded market list',
          },
          {
            n: 2,
            title: 'Market Overview',
            headline: <>Every market tells its <span style={{ color: '#416BCC' }}>full story in one place</span>.</>,
            body: <>Booking outlooks, revenue trends, and competitive pricing consolidated into a single view, so analysts have the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>context they need</strong> without switching between tools.</>,
            image: img('solution-2-market-overview.png'),
            alt: 'Market Overview screen with booking outlook, revenue trends, and competitive pricing',
          },
          {
            n: 3,
            title: 'AI Chat Panel',
            headline: <>Contextual AI guidance surfaces directly within the <span style={{ color: '#416BCC' }}>analyst's workflow</span>.</>,
            body: <>An embedded chat panel with suggested prompts gives analysts <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>on-demand support</strong> through a seamless, non-disruptive presence within the existing workflow.</>,
            image: img('solution-3-ai-chat-panel.png'),
            alt: 'AI embedded insights and chat panel',
          },
          {
            n: 4,
            title: 'Full AI Chat Screen',
            headline: <>Deeper analysis gets its own <span style={{ color: '#416BCC' }}>dedicated space</span>.</>,
            body: <>When analysts need to dig deeper, they can open a full chat screen where PROS AI walks through booking trends, forecasting, and analysis step by step, with the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>ability to save</strong> conversations for later reference.</>,
            image: img('solution-4-full-ai-chat.png'),
            alt: 'Full AI chat screen',
          },
        ].map(({ n, title, headline, body, image, alt }) => (
          <div key={n} style={{ marginTop: n === 1 ? 0 : 108 }}>
            <p className="cs-metric-label" style={{ margin: '0 0 16px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Solution #{n}: {title}</p>
            <p className="rm-subheading" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, fontWeight: 500, lineHeight: 'normal', color: 'var(--color-cs-heading)', margin: '0 auto 32px', maxWidth: 640, textAlign: 'center' }}>
              {headline}
            </p>
            <div className="rm-solution-grid" style={{ display: 'grid', gridTemplateColumns: '3.2fr 1fr', gap: 8, alignItems: 'center' }}>
              <img src={image} alt={alt} className="rm-solution-laptop" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <p className="font-landing-body" style={{ fontSize: 17, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                {body}
              </p>
            </div>
          </div>
        ))}

      </Section>

      {/* ── Design System ── */}
      <Section className="">
        <div style={{ marginTop: 0 }}>
          <SubHeading>Contributing to the Design System</SubHeading>
          <BodyText>
            As part of the modernization, the UX strategist and I documented two new AI components — a contextual <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>market selector</strong> and <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>tailored prompts</strong> — across both the full and side chat panel experiences, adding them to PROS's existing design system for developer handoff.
          </BodyText>
          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}>
              <img src={img('design-system.png')} alt="PROS AI Chat design system components — market selector and tailored prompts across full and side chat panels" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </figure>
        </div>
      </Section>

      {/* ── Reflection ── */}
      <Section id="rm-reflection" className="">
        <div style={{ marginBottom: 32 }}>
          <p className="cs-metric-label" style={{ margin: '0 0 32px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>5. Reflection</p>

          <SubHeading>This was my first role contributing to how AI is used in a product.</SubHeading>
          <BodyText>
            This was my first project navigating the ambiguity of integrating AI into a platform. Working closely with the UX strategist and user researcher, I was pushed to think deeper about analysts' mental models, balance user needs with technical feasibility, and grow in how I communicate my design decisions.
          </BodyText>
          <BodyText>
            This experience showed me that modernizing a product while navigating new features like AI comes down to one thing: making sure it truly serves the people you are designing for. I'm excited to see how this project evolves. Thank you, PROS!
          </BodyText>

          <div className="rm-reflection-collage">
            <div className="rm-polaroid-scatter">
              <PolaroidStack />
            </div>

            <div className="rm-team-photo-wrap">
              <div className="rm-team-photo-card" style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: '12px 12px 10px' }}>
                <img src={img('ux-houston-team.webp')} alt="PROS UX Design team" style={{ display: 'block', width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '72vh', objectFit: 'contain' }} />
                <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', textAlign: 'center', lineHeight: 1.3, margin: '12px 0 0' }}>
                  UX Design Team Photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      </div>

      <NextProject
        title="PROS Fare Finder Map"
        to="/work/fare-finder"
        tags={["Enterprise", "Product Design Intern"]}
        description="Designing and shipping a flight map exploration tool for airlines to display on their booking sites, helping travelers make more informed and confident booking decisions."
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
