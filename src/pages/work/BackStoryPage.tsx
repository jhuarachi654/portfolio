import { useEffect, useRef, useState } from 'react'
import { ChatCircleText, Users, Quotes } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import StatCallout from '../../components/case-study/StatCallout'
import PlayPauseButton from '../../components/PlayPauseButton'
import SkeletonImage from '../../components/SkeletonImage'
import { useCaseToc } from '../../hooks/useCaseToc'

// Development/Solution/Testing/Learnings aren't written yet — keep the code below intact
// (guarded by SHOW_DRAFT) so it's ready to flip back on once real content lands.
const SHOW_DRAFT = false

const TOC = [
  { id: 'bs-intro',            label: 'Context' },
  { id: 'bs-research',         label: 'Research' },
  ...(SHOW_DRAFT ? [
    { id: 'bs-development',      label: 'Development' },
    { id: 'bs-features',         label: 'Solution' },
    { id: 'bs-testing',          label: 'Testing' },
    { id: 'bs-reflection',       label: 'Learnings' },
  ] : []),
]

const img = (file: string) => `/images/backstory/${file}`

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
    <p className="font-landing-body text-[15px]" data-reveal style={{ '--reveal-delay': '140ms', lineHeight: 1.3, color: 'var(--color-secondary)', marginBottom: 16, marginTop: 0 } as React.CSSProperties}>
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

function ChapterHeading({ index, heading }: { index: number; heading: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p className="cs-metric-label" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{index}. {heading}</p>
    </div>
  )
}

// ─── Feature block — numbered solution section with image + optional User Impact callout ──

function FeatureBlock({ index, label, body, userImpact, image, alt, first = false }: { index: number; label: string; body: string; userImpact?: string; image: string; alt: string; first?: boolean }) {
  return (
    <div style={{ marginTop: first ? 0 : 108 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 24, fontWeight: 300, color: 'var(--color-navy)' }}>{index}.</span>
        <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>{label}</h3>
      </div>
      <BodyText>{body}</BodyText>
      {userImpact && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 16, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>User Impact:</strong> {userImpact}
            </p>
          </div>
        </>
      )}
      <img src={img(image)} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, marginTop: 16 }} />
    </div>
  )
}

// ─── Quote card — avatar-bubble pattern, alternating alignment (matches Expert.ai's ea-quotes-container) ──

function QuoteCards({ quotes }: { quotes: { role: string; avatar?: string; quote: string; align: 'left' | 'right' }[] }) {
  return (
    <div className="bs-quotes-container" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
      {quotes.map(({ role, avatar, quote, align }, i) => (
        <div key={i} style={{ maxWidth: '80%', marginLeft: align === 'right' ? 'auto' : 0, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: avatar ? undefined : 'rgba(var(--color-navy-rgb),0.06)', color: '#416BCC' }}>
              {avatar ? (
                <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <Users size={16} weight="regular" />
              )}
            </div>
            <span className="font-landing-body" style={{ fontSize: 13, color: 'var(--color-secondary)', opacity: 0.7 }}>{role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 'normal', color: '#222225', margin: 0 }}>{quote}</p>
            <span style={{ color: '#416BCC', flexShrink: 0, lineHeight: 'normal', display: 'flex', alignItems: 'flex-end' }}>
              <Quotes size={22} weight="fill" />
            </span>
          </div>
        </div>
      ))}
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
        src="/videos/BackStory-Video.webm"
        poster="/videos/BackStory-Video-poster.png"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
      />
      <PlayPauseButton playing={playing} onToggle={handleToggle} />
    </>
  )
}

export default function BackStoryPage() {
  useCaseToc(TOC, 'BackStory')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: 'rgba(var(--color-navy-rgb),0.06)', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.1)' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-[42px] pt-14 pb-16">
            <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              BackStory
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              Designing Backstory, a TikTok-native feature that combats misinformation by giving users the full context behind a piece of content: community notes, verified third-party sources, and the ability to contribute their own voice.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Interaction Designer, User Researcher, Prototyper' },
                { label: 'Timeline', value: 'Jan – Aug 2026' },
                { label: 'Team',     value: 'Johanna Huarachi, Kyle Samonte, Mai Kao, Mackenzie Hart\nAdvisors (IDEO)' },
                { label: 'Skills',   value: 'Research, Prototyping, Interaction Design, Usability Testing, AI-Assisted Design' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal', whiteSpace: 'pre-line' }}>{value}</p>
                </div>
              ))}
            </div>

            <a href="#bs-features" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        <div className="max-w-[1080px] px-8 md:px-[42px]" style={{ marginBottom: 108 }}>
          <figure style={{ margin: '0 0 32px' }} data-reveal>
            <SkeletonImage src={img('backstory-solution-preview.jpeg')} alt="BackStory fact-check panel over a TikTok post, showing Community Notes and Professional verdict tabs" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
          </figure>

          <div className="bs-what-is-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>What is Backstory?</SubHeading>
              <BodyText>
                Backstory is a conceptual TikTok-native feature that combats misinformation by giving viewers the full context behind a piece of content: community notes, verified third-party sources, and the ability to contribute their own voice, all without leaving the app.
              </BodyText>
            </div>
            <div>
              <SubHeading>My Role</SubHeading>
              <BodyText>
                As part of a four-person MDes capstone team at CCA, advised by IDEO, I contributed to early ideation and research before leading the design and development of the native pop-up screen. I iterated from lo-fi wireframes to hi-fi designs and a coded React prototype.
              </BodyText>
            </div>
          </div>

          <div style={{ marginTop: 108 }}>
            <SubHeading>AI Artists are <span style={{ color: '#416BCC' }}>more common</span> than it seems</SubHeading>
            <BodyText>
              A friend discovered a soul-blues artist through her father. She added songs, looked them up, and found nothing. No social media, no trace of a real person. Eddie Dalton has 138,000 followers across Spotify, Apple Music, and SoundCloud. He is entirely AI-generated. <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>She felt deceived.</strong>
            </BodyText>
            <BodyText>
              Stories like this became the <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>foundation of Backstory.</strong>
            </BodyText>

            <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
              <SkeletonImage src={img('backstory-ai-artist-discovery.png')} alt="Fictional AI-generated artist Eddie Dalton's analytics dashboard beside a Reddit post describing the discovery" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
            </figure>
          </div>
        </div>

        {/* ── 1. Context ── */}
        <Section id="bs-intro">
          <ChapterHeading index={1} heading="Context" />

          <SubHeading>Why Backstory</SubHeading>
          <BodyText>
            TikTok is where young people learn about the world. It is also where misinformation spreads faster than users can verify it, because checking a claim means leaving the app entirely.
          </BodyText>
          <BodyText>
            For my MDes capstone at CCA, my team and I spent six months designing Backstory, a TikTok-native feature that brings the full context of a piece of content directly into the feed. Rather than asking users to do more work, we surfaced community notes and verified third-party sources in one place, so anyone could get the whole picture without ever leaving the app.
          </BodyText>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--color-navy-rgb),0.15)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#416BCC', fontSize: 18, lineHeight: 'normal', flexShrink: 0 }}>→</span>
            <p className="font-landing-body" style={{ fontSize: 16, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              At the beginning of the project, we needed to establish a baseline for how Gen Z was interacting with social media and how they approached misinformation when they encountered it.
            </p>
          </div>

          <figure style={{ margin: '32px 0 0' }} data-reveal>
            <SkeletonImage src={img('backstory-why-backstory.png')} alt="Hands scrolling on a phone" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              Everyday we scroll on social media and encounter misinformation whether we are aware of it or not
            </figcaption>
          </figure>

          <ChallengeBanner
            icon={<ChatCircleText size="1em" weight="regular" />}
            iconColor="#416BCC"
            question={<>How might we help <strong><em>US-based Gen Z social media users</em></strong> quickly verify and label misinformation?</>}
          />
        </Section>

        {/* ── 2. Research ── */}
        <Section id="bs-research">
          <ChapterHeading index={2} heading="Research" />

          <SubHeading>A Diary Study on Misinformation</SubHeading>
          <BodyText>
            Rather than retrospective interviews, we tracked real-time encounters. Participants screenshotted suspicious or misleading posts from their normal social media use as they happened, then joined follow-up depth interviews. Three behavioral patterns emerged.
          </BodyText>

          <figure className="cs-fullwidth-figure" style={{ margin: '24px 0 0' }} data-reveal>
            <SkeletonImage src={img('backstory-diary-study-board.png')} alt="Diary study compilation board of screenshotted social media posts with participant annotations" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
          </figure>

          <div className="bs-finding-grid" style={{ marginTop: 108, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', justifyItems: 'center' }}>
            <div>
              <p className="cs-caption-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', opacity: 1 }}>Finding 01</p>
              <SubHeading>Gen Z mistakes a curated feed for a safe one.</SubHeading>
              <BodyText>
                Participants actively blocked accounts and tapped "not interested" — and believed this had trained their algorithm to filter out misinformation. It hadn't.
              </BodyText>
            </div>

            <figure style={{ margin: 0, width: '100%' }} data-reveal>
              <SkeletonImage src={img('backstory-quote-nate.png')} alt="Quote from Nate, 25: I couldn't really find any posts to add to the diary study. I feel like I spam-blocked people and made my feed more real." style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.2)' }} wrapperStyle={{ display: 'block', width: '100%' }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <p className="cs-caption-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', opacity: 1 }}>Finding 02</p>
            <SubHeading>Awareness of misinformation doesn't change behavior.</SubHeading>
            <BodyText>
              Gen Z knows social media is untrustworthy. They stay anyway. FOMO and social connection consistently outweigh the discomfort of an unreliable platform.
            </BodyText>

            <figure style={{ margin: '24px 0 0', maxWidth: 400 }} data-reveal>
              <SkeletonImage src={img('backstory-quote-kiki.png')} alt="Quote from Kiki, 24: I stay on social media since it's the easiest way to stay connected... I hate FOMO." style={{ width: '100%', height: 'auto', display: 'block' }} wrapperStyle={{ display: 'block', width: '100%' }} />
            </figure>
          </div>

          <div style={{ marginTop: 108 }}>
            <p className="cs-caption-label" style={{ margin: '0 0 16px', textTransform: 'uppercase', opacity: 1 }}>Finding 03</p>
            <SubHeading>Crowdsourcing alone isn't enough.</SubHeading>
            <BodyText>
              Community notes were seen as useful but insufficient. Participants wanted a hybrid: the speed of crowd input paired with the credibility of professional fact-checkers.
            </BodyText>

            <figure style={{ margin: '24px 0 0', maxWidth: 400 }} data-reveal>
              <SkeletonImage src={img('backstory-quote-daniel.png')} alt="Quote from Daniel, 27: Community Notes helps me clock something false pretty often. I do wish it had something more professional like how Wikipedia does it." style={{ width: '100%', height: 'auto', display: 'block' }} wrapperStyle={{ display: 'block', width: '100%' }} />
            </figure>
          </div>
        </Section>

        {SHOW_DRAFT && <>
        {/* ── 3. Development ── */}
        <Section id="bs-development">
          <ChapterHeading index={3} heading="Development" />

          <SubHeading>[ Design vision / the direction you landed on ]</SubHeading>
          <Prose>
            <BodyText>
              [ What the solution had to do differently, and why. Two to three sentences. ]
            </BodyText>
          </Prose>

          <div style={{ marginTop: 32 }}>
            <SubHeading>[ How you got there ]</SubHeading>
            <BodyText>
              [ Optional: approaches explored and why they were rejected, or how the direction was validated with the team. ]
            </BodyText>
          </div>

          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }} data-reveal>
            <SkeletonImage src={img('backstory-flow-placeholder.png')} alt="[ Flow diagram placeholder ]" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              [ Caption describing the redesigned flow ]
            </figcaption>
          </figure>
        </Section>

        {/* ── 4. Solution ── */}
        <Section id="bs-features">
          <ChapterHeading index={4} heading="Solution" />

          <FeatureBlock
            first
            index={1}
            label="[ Feature name ]"
            body="[ What this screen/feature does and why it matters. ]"
            userImpact="[ The concrete effect on the user. ]"
            image="backstory-feature-1-placeholder.png"
            alt="[ Feature 1 placeholder ]"
          />
          <FeatureBlock
            index={2}
            label="[ Feature name ]"
            body="[ What this screen/feature does and why it matters. ]"
            userImpact="[ The concrete effect on the user. ]"
            image="backstory-feature-2-placeholder.png"
            alt="[ Feature 2 placeholder ]"
          />
          <FeatureBlock
            index={3}
            label="[ Feature name ]"
            body="[ What this screen/feature does and why it matters. ]"
            userImpact="[ The concrete effect on the user. ]"
            image="backstory-feature-3-placeholder.png"
            alt="[ Feature 3 placeholder ]"
          />
        </Section>

        {/* ── 5. Testing ── */}
        <Section id="bs-testing">
          <ChapterHeading index={5} heading="Testing" />

          <SubHeading>Quantitative Results</SubHeading>
          <BodyText>
            [ How you tested (method, participant count) and what changed between the before/after conditions. ]
          </BodyText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 24 }}>
            <StatCallout stat="[ 0 of 0 ]" description="[ Legacy/before condition ]" />
            <StatCallout stat="[ 0 of 0 ]" description="[ Redesigned/after condition ]" />
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>What Users Said</SubHeading>
            <BodyText>
              [ One or two sentences summarizing the qualitative feedback pattern. ]
            </BodyText>

            <QuoteCards
              quotes={[
                { role: '[ Participant role ]', avatar: '/images/expert-ai/legal-analyst.avif', quote: '[ Placeholder quote — replace with real feedback quote. ]', align: 'left' },
                { role: '[ Participant role ]', avatar: '/images/expert-ai/government-analyst.avif', quote: '[ Placeholder quote — replace with real feedback quote. ]', align: 'right' },
                { role: '[ Participant role ]', avatar: '/images/expert-ai/data-analyst.avif', quote: '[ Placeholder quote — replace with real feedback quote. ]', align: 'left' },
              ]}
            />
          </div>
        </Section>

        {/* ── 6. Learnings ── */}
        <Section id="bs-reflection">
          <ChapterHeading index={6} heading="Learnings" />

          <div className="bs-takeaways-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>Takeaways</SubHeading>
              <BodyText>
                [ Takeaway 1: what the project taught you, tied to a specific moment or decision. ]
              </BodyText>
              <BodyText>
                [ Takeaway 2: the hardest part, and how you worked through it. ]
              </BodyText>
              <BodyText>
                [ Takeaway 3: closing reflection. ]
              </BodyText>
            </div>
            <figure style={{ margin: 0 }} data-reveal>
              <SkeletonImage src={img('backstory-closing-placeholder.png')} alt="[ Closing photo placeholder ]" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} wrapperStyle={{ display: 'block', width: '100%' }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>[ Caption ]</figcaption>
            </figure>
          </div>
        </Section>
        </>}

      </div>

      {SHOW_DRAFT ? (
        <NextProject
          title="[ Next project title ]"
          to="/work/[ next-project-slug ]"
          tags={["[ Tag ]", "[ Tag ]", "[ Tag ]"]}
          description="[ One-line description of the next project. ]"
          bgColor="#000000"
        />
      ) : (
        <NextProject
          title="Revenue Management"
          to="/work/revenue-management"
          tags={["Enterprise", "AI", "Internship"]}
          description="Modernized UI and integrated AI features into an enterprise pricing and seat inventory platform for airline analysts."
          lottie="/videos/Revenue-Management-Video.json"
          mediaZoom={1.1}
          bgColor="#12213a"
        />
      )}

    </div>
  )
}
