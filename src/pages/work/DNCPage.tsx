import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { MapPin, Gear, Asterisk } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import CountUp from '../../components/case-study/CountUp'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'dnc-intro',            label: 'Introduction' },
  { id: 'dnc-context',          label: 'Context' },
  { id: 'dnc-vp',               label: 'Development' },
  { id: 'dnc-collection',       label: 'Collection' },
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
    <p className="font-landing-body text-[16px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
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
  { file: 'dnc-collection-healthcare.webp',           alt: 'Protect Affordable Health Care graphic',                 label: 'Affordable Health Care' },
  { file: 'dnc-collection-vp-anniversary-navy.png',  alt: 'VP Kamala Harris anniversary graphic, navy background',  label: 'VP Anniversary' },
  { file: 'dnc-collection-jobs-waving.webp',          alt: 'Biden jobs and economy achievements infographic',        label: 'Biden Achievements' },
  { file: 'dnc-collection-ban-weapons-2.webp',        alt: 'Ban Assault Weapons repeating pattern graphic',          label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-training-academy.webp',     alt: 'Summer Training Academy Organizing to Victory graphic',  label: 'Summer Training Academy' },
  { file: 'dnc-collection-vp-anniversary.webp',      alt: 'VP Kamala Harris anniversary graphic',                   label: 'VP Anniversary' },
  { file: 'dnc-collection-bidenomics-101.webp',       alt: 'Bidenomics 101 graphic',                                 label: 'Bidenomics 101' },
  { file: 'dnc-collection-sweatshirt.webp',           alt: 'Biden 2024 sweatshirt',                                  label: 'Biden Sweatshirt' },
  { file: 'dnc-collection-ban-weapons-4.webp',        alt: 'Ban Assault Weapons graphic',                            label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-vp-anniversary-sky.png',   alt: 'VP Kamala Harris anniversary graphic, sky blue background', label: 'VP Anniversary' },
  { file: 'dnc-collection-lgbtq-rights.webp',         alt: 'Protect and Advance LGBTQ+ Rights graphic',              label: 'LGBTQ+ Rights' },
  { file: 'dnc-collection-merch.webp',                alt: 'Biden 2024 merch collection',                            label: 'Merch Collection' },
  { file: 'dnc-collection-ban-weapons-1.webp',        alt: 'Ban Assault Weapons graphic',                            label: 'Ban Assault Weapons' },
  { file: 'dnc-collection-jobs-thumbsup.webp',        alt: 'Biden jobs and economy achievements infographic',        label: 'Biden Achievements' },
  { file: 'dnc-collection-vp-anniversary-green.png', alt: 'VP Kamala Harris anniversary graphic, green background', label: 'VP Anniversary' },
  { file: 'dnc-collection-reproductive-rights.webp',  alt: 'Protect Reproductive Rights and Abortion Access graphic', label: 'Reproductive Rights' },
  { file: 'dnc-collection-ban-weapons-3.webp',        alt: 'Ban Assault Weapons repeating pattern graphic',          label: 'Ban Assault Weapons' },
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
  { label: 'Final', image: 'dnc-iter-final.webp' },
]

function IterationExplorer() {
  return (
    <>
      <SubHeading>VP Anniversary Exploration</SubHeading>
      <BodyText>When a request came in to commemorate Vice President Kamala Harris's milestone anniversary in office, I had under a day to design a graphic going out to a national audience. I tested a few directions before landing on the final version.</BodyText>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24 }}>
        {iterationOptions.map(({ image, label }, i) => (
          <div
            key={image}
            style={{
              background: '#252525',
              aspectRatio: '16/9',
              overflow: 'hidden',
              padding: 16,
              boxSizing: 'border-box',
              borderTopLeftRadius: i === 0 ? 8 : 0,
              borderTopRightRadius: i === 0 ? 8 : 0,
              borderBottomLeftRadius: i === iterationOptions.length - 1 ? 8 : 0,
              borderBottomRightRadius: i === iterationOptions.length - 1 ? 8 : 0,
            }}
          >
            <img src={img(image)} alt={label} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </>
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
              Branding and Digital Design for the DNC
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[16px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Designing social graphics, digital ads, email modules, and merchandise for the Biden-Harris campaign and Democratic initiatives, while adapting to a live brand transition.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',         value: 'Digital Design Intern' },
                { label: 'Timeline',     value: 'Jun – Sep 2023' },
                { label: 'Team',         value: 'Design & Comms Team' },
                { label: 'Tools/Skills', value: 'Figma, Adobe Illustrator, Canva' },
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
            <SubHeading>What is the Democratic National Committee?</SubHeading>
            <BodyText>
              The Democratic National Committee coordinates the Democratic Party's communications, organizing, and campaign strategy. During the summer of 2023, it was running digital operations for the Biden-Harris administration, supporting policy initiatives, voter engagement, and campaign messaging at a national scale.
            </BodyText>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>My Role</SubHeading>
            <BodyText>
              I joined as a Digital Design Intern on the Mobilization team, an in-house design agency producing digital assets for both the Biden-Harris campaign and broader Democratic initiatives. I collaborated with Strategy, Communications, and Fundraising teams on social graphics, email modules, flyers, merchandise, and motion, adapting quickly as priorities shifted and requests came in daily.
            </BodyText>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('branding-transition-collage.png')} alt="Biden-Harris 2024 campaign assets, including social graphics, donor call-to-action pages, bumper stickers, and buttons" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 64 }} data-reveal>
            <p className="cs-metric-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>Impact</p>
            <div className="grid grid-cols-3" style={{ gap: 32 }}>
              {[
                { stat: '120K', description: 'total reach across 40 graphics' },
                { stat: '12', description: 'rapid-turnaround requests delivered within hours' },
                { stat: '5.5K', description: 'engagements on a single VP-level asset' },
              ].map(({ stat, description }, i) => (
                <div key={description} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', margin: '0 0 8px', fontWeight: 500, color: '#416BCC', display: 'block' }} />
                  <p className="font-landing-body" style={{ fontSize: 16, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 2. Context ── */}
        <Section id="dnc-context">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>2. Context</p>
          </div>

          <div>
            <SubHeading>Who I Designed For</SubHeading>
            <BodyText>
              Every graphic had two audiences: the person encountering it in the wild, and the team approving it before it went out.
            </BodyText>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <img src={img('persona-cards-composite.png')} alt="Scrolling Voter and Brand Strategist persona cards" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>My Approach</SubHeading>
            <BodyText>
              Requests came in daily, sometimes with same-day turnarounds. The brand was mid-transition, so every graphic had to honor both old and new guidelines. My approach centered on accuracy, brand consistency, and accessibility standards throughout.
            </BodyText>

            <div style={{ marginTop: 24 }}>
              <div style={{ background: '#CCD6E9', borderRadius: 8, aspectRatio: '16/9', overflow: 'hidden', padding: 16, boxSizing: 'border-box' }}>
                <img src={img('balance.webp')} alt="Illustration of a figure labeled 'Balance' with red and blue coloring" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          <div className="rm-challenge-subheader-style" style={{ marginTop: 108 }}>
            <ChallengeBanner
              label="Mission"
              question={<>How might we design assets that <span style={{ color: '#416BCC' }}>resonate</span> with the audience, <span style={{ color: '#416BCC' }}>reflect the brand</span>, and are <span style={{ color: '#416BCC' }}>accessible</span>?</>}
            />
          </div>
        </Section>

        {/* ── 4. VP Graphic ── */}
        <Section id="dnc-vp">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>3. Development</p>
          </div>

          <div>
            <IterationExplorer />
          </div>
        </Section>

        {/* ── 5. Collection ── */}
        <Section id="dnc-collection">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>4. Collection</p>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>Selected Works</SubHeading>
            <BodyText>
              Over four months, I designed policy announcements, campaign updates, voter engagement graphics, event content, and merchandise. Below is a selection of the work.
            </BodyText>
          </div>

          <div style={{ marginTop: 24 }}>
            <CollectionGallery />
          </div>
        </Section>

        {/* ── 5. Reflection ── */}
        <Section id="dnc-reflection">
          <div style={{ marginBottom: 32 }}>
            <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>5. Reflection</p>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>Adaptability across every team.</SubHeading>
            <BodyText>
              Every team I worked with had different priorities and a different way of giving feedback. Learning to communicate across all of them made me a stronger collaborator and a more intentional designer.
            </BodyText>
          </div>

          <div style={{ marginTop: 64 }}>
            <SubHeading>Fast pace, real growth.</SubHeading>
            <BodyText>
              Juggling multiple projects with real deadlines pushed me to get better at prioritization and time management in ways a classroom cannot replicate.
            </BodyText>
          </div>

          <div style={{ marginTop: 64 }}>
            <BodyText>
              I am grateful to the Mobilization team for the concrete feedback, the design conversations, and for trusting me with accessibility from the start.
            </BodyText>
          </div>

          <figure style={{ margin: '64px 0 0' }}>
            <img
              src={img('dnc-metro-commute.jpeg')}
              alt="Washington DC Metro station platform"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
            />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              Snippet of my morning commute! DC Metro is so cool
            </figcaption>
          </figure>
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
