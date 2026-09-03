import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import { Receipt, Quotes } from '@phosphor-icons/react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import CountUp from '../../components/case-study/CountUp'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ss-intro',            label: 'Context' },
  { id: 'ss-solution-preview', label: 'Solution Preview' },
  { id: 'ss-research',         label: 'Research' },
  { id: 'ss-development',      label: 'Development' },
  { id: 'ss-features',         label: 'Solution' },
  { id: 'ss-testing',          label: 'Testing' },
  { id: 'ss-reflection',       label: 'Learnings' },
]

const img = (file: string) => `/images/snapsplit/${file}`

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
        <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]/50" style={{ fontSize: 13, marginBottom: 6 }}>{tag}</p>
      )}
      <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 500, lineHeight: 'normal', marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function StatBlock({ stat, label, description }: { stat: string; label: string; description: string }) {
  return (
    <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24, height: '100%', boxSizing: 'border-box' }}>
      <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 8px' }}>{label}</p>
      <CountUp stat={stat} style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 32, lineHeight: 'normal', margin: '0 0 12px', fontWeight: 500, color: '#416BCC', display: 'block' }} />
      <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>{description}</p>
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
            <p className="font-landing-body" style={{ fontSize: 15, color: 'var(--color-secondary)', margin: 0, lineHeight: 'normal' }}>
              <strong style={{ color: 'var(--color-cs-heading)', fontWeight: 700 }}>User Impact:</strong> {userImpact}
            </p>
          </div>
        </>
      )}
      <img src={img(image)} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, marginTop: 16 }} />
    </div>
  )
}

// ─── Solution Preview Lottie — deferred to idle so it doesn't compete with the hero on load ──

function SolutionPreviewLottie() {
  const [data, setData] = useState<object | null>(null)

  useEffect(() => {
    const load = () => fetch('/videos/SnapSplit-Solution-Preview.json').then(r => r.json()).then(setData).catch(() => {})
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load)
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(load, 0)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="ss-solution-preview-media" style={{ width: '100%', background: 'rgba(var(--color-navy-rgb),0.04)', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, overflow: 'hidden' }}>
      {data && (
        <Lottie
          animationData={data}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          style={{ width: '100%', display: 'block' }}
        />
      )}
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
        src="/videos/SnapSplit-Video.webm"
        poster="/videos/SnapSplit-Video-poster.png"
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

export default function SnapSplitPage() {
  useCaseToc(TOC, 'SnapSplit')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen cs-page">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section>
        <div className="cs-hero-lottie-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 64, marginBottom: 48 }}>
          <div style={{ background: '#8fd9c4', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(var(--color-navy-rgb),0.2)' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-[42px] pt-14 pb-16">
            <h1 className="case-study-hero-reveal text-[44px] sm:text-[58px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>
              SnapSplit
            </h1>
            <p className="case-study-hero-reveal font-landing-body text-[15px]" style={{ lineHeight: 'normal', color: 'var(--color-secondary)', marginBottom: 20 }}>
              SnapSplit is a startup that uses AI to scan receipts, extract items, and make bill splitting easier for groups. As the founding designer, I identified a critical drop-off point in the user flow that was leading hosts to abandon the bill-splitting process before it was complete. I led the redesign of that flow, which drove completion from 20% to 83%. Alongside the UX work, I also led a full rebrand of the platform.
            </p>
            <div className="case-study-hero-reveal grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Founding Designer, User Researcher, Brand Designer' },
                { label: 'Timeline', value: '6 months' },
                { label: 'Team',     value: 'PM, Lead Developer, AI Engineer, Market Researcher' },
                { label: 'Skills',   value: 'User Research, Usability Testing, Prototyping, Branding' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6, textTransform: 'uppercase', fontWeight: 400, opacity: 0.7 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 'normal' }}>{value}</p>
                </div>
              ))}
            </div>
            <p className="case-study-hero-reveal font-landing-body" style={{ fontSize: 13, lineHeight: 'normal', color: 'var(--color-secondary)', opacity: 0.8, marginTop: 12 }}>
              Note: Billclub.io was rebranded during this project and renamed SnapSplit. This case study refers to the product as Billclub.io throughout, since that was its name at the time of the redesign.
            </p>

            <a href="#ss-features" className="case-study-hero-reveal cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Context ── */}
        <Section id="ss-intro">
          <ChapterHeading index={1} heading="Context" />

          <SubHeading>Where I was starting</SubHeading>
          <BodyText>
            When I joined Bill Club (now rebranded to SnapSplit), it was a fintech startup in beta — users had access and we were actively testing features, but the product hadn't officially launched. My team included a PM, market researcher, developers, and an AI engineer. I was their first designer. Alongside the UX work, I was also tasked with establishing the brand and defining a design system.
          </BodyText>
          <BodyText>
            In my first meeting with the team, the priority became clear: analytical trends showed a high drop-off rate in the user flow, but there was no clear explanation for why it was happening or what to do about it. That became my first focus.
          </BodyText>

          <figure style={{ margin: '0 0 32px' }}>
            <img src={img('snapsplit-legacy-critique.jpg')} alt="Legacy design: the host manually splits and assigns each item to each person one by one" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              These are the initial designs of SnapSplit, with notes on accessibility and clarity.
            </figcaption>
          </figure>

        </Section>

        {/* ── 2. Solution Preview ── */}
        <Section id="ss-solution-preview">
          <ChapterHeading index={2} heading="Solution Preview" />

          <SolutionPreviewLottie />

          <div style={{ marginTop: 32 }}>
            <p className="font-sans font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, marginBottom: 16, color: 'var(--color-cs-heading)', opacity: 0.5 }}>TL:DR</p>
            <div className="rm-intro-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              <h3 className="text-[24px] text-[var(--color-cs-heading)] cs-lh-normal" style={{ fontFamily: 'var(--font-landing-heading)', fontWeight: 400, lineHeight: 'normal', margin: 0 }}>
                What We Built
              </h3>
              <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: 'var(--color-secondary)', margin: 0 }}>
                Over six months, I led the work to solve SnapSplit's high abandonment issue. Through research, I found that the assignment step, where the host had to manually divide and distribute items, was creating too much friction for one person to handle alone. I redesigned the flow to distribute that effort across the group, turning bill splitting into a shared experience rather than a solo task. Completion rates rose from 20% to 83%.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 3. Research ── */}
        <Section id="ss-research">
          <ChapterHeading index={3} heading="Research" />

          <SubHeading>Understanding the Drop-Off</SubHeading>
          <BodyText>
            To investigate the abandonment issue, I ran five one-on-one sessions with young adults, combining interviews with usability testing, conducted both in person and remotely. I gave each participant the same task: scan a receipt and divide it among a group of three.
          </BodyText>
          <BodyText>
            The pattern was consistent across sessions. The beginning of the flow was seamless, participants scanned the receipt and watched items populate without issue. The breakdown came at the assignment step, where they had to assign items to each person in the group. Participants became confused, lost their place, and had to scroll back and forth between the receipt and the assignment screen. Four out of five gave up and showed visible frustration. The one participant who completed the task said they would not use the app again, especially on the go.
          </BodyText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 24 }}>
            <StatBlock stat="80%" label="Drop-off rate" description="On the item dividing and assignment screens" />
            <div style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: 24, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p className="font-landing-body tracking-[0.12em] uppercase cs-caption-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', margin: '0 0 8px' }}>User Quote</p>
                <p className="font-landing-body" style={{ fontSize: 15, lineHeight: 'normal', color: '#222225', margin: 0, fontStyle: 'italic' }}>
                  "I would not use the app again, especially on the go."
                </p>
              </div>
              <span style={{ color: '#416BCC', flexShrink: 0, lineHeight: 'normal', display: 'flex', alignSelf: 'flex-end' }}>
                <Quotes size={22} weight="fill" />
              </span>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>Who I was designing for</SubHeading>
            <BodyText>
              Before jumping to solutions, I needed to understand who was actually struggling with this. Billclub.io's users were young adults splitting dinner with friends, roommates dividing utilities, etc. These were social moments that had turned into admin tasks.
            </BodyText>
            <BodyText>
              Talking to young adults revealed what mattered. They wanted to split bills as fast as possible and they needed to trust the math, especially since Billclub.io shows the split but doesn't handle actual payments.
            </BodyText>
            <BodyText>
              Speed and trust. Those principles became the foundation for everything that followed.
            </BodyText>

            <figure style={{ margin: '32px 0 0' }}>
              <img src={img('snapsplit-bill-splitters.jpg')} alt="A group of young adults, the target users for SnapSplit" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Bill splitter(s)</figcaption>
            </figure>
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>What the host was stuck with</SubHeading>
            <BodyText>
              One person had to remember what everyone ordered. One person had to make decisions for the whole group. One person had to tap through every single item. While the host struggled through this, everyone else was completely disconnected from the process.
            </BodyText>

            {/* Quote cards — paraphrased placeholders, not attributed to specific test participants */}
            <div className="ss-quotes-container" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              {[
                { role: 'Usability test, host role', avatar: '/images/expert-ai/legal-analyst.avif', quote: "I don't want to be the one deciding who owes what for six people.", align: 'left' },
                { role: 'Usability test, host role', avatar: '/images/expert-ai/government-analyst.avif', quote: "By the time everyone paid me back, I'd already forgotten who ordered what.", align: 'right' },
                { role: 'Usability test, host role', avatar: '/images/expert-ai/data-analyst.avif', quote: 'It felt like homework instead of just hanging out with my friends.', align: 'left' },
              ].map(({ role, avatar, quote, align }, i) => (
                <div key={i} style={{ maxWidth: '80%', marginLeft: align === 'right' ? 'auto' : 0, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>Objectives</SubHeading>
            <BodyText>
              From what I learned about how bill splitters actually behave, the experience needed to be:
            </BodyText>

            <figure style={{ margin: '24px 0 0' }}>
              <img src={img('snapsplit-objectives.jpg')} alt="How traits translate to objectives: Effortless, Distributed, Trustworthy" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>How the observed traits translated into design objectives</figcaption>
            </figure>
          </div>

          <ChallengeBanner
            icon={<Receipt size="1em" weight="regular" />}
            iconColor="#416BCC"
            question={<>How can we redesign bill splitting so the <strong><em>entire group shares the work</em></strong> instead of one person doing everything?</>}
          />
        </Section>

        {/* ── 4. Development ── */}
        <Section id="ss-development">
          <ChapterHeading index={4} heading="Development" />

          <SubHeading>Making It Collaborative</SubHeading>
          <Prose>
            <BodyText>
              Stop making one person do all the work. Instead of the host assigning items to everyone, let people claim their own items. Turn bill splitting into something the group does together. This meant rethinking the entire flow. The host would scan and set up the bill, then share it with the group. Everyone could jump in at the same time, select what they ordered, and see the total update in real time.
            </BodyText>
          </Prose>

          <figure className="cs-fullwidth-figure" style={{ margin: '32px 0 0' }}>
            <img src={img('snapsplit-flow-fix.png')} alt="Bill Splitter flow: Receipt upload, Item review, Collaborative Group Assignment task, Payment and tracking" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8 }} />
            <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>
              The new flow distributes the work across the group while keeping the process simple and visual.
            </figcaption>
          </figure>
        </Section>

        {/* ── 5. Solution ── */}
        <Section id="ss-features">
          <ChapterHeading index={5} heading="Solution" />

          <FeatureBlock
            first
            index={1}
            label="Quick Upload"
            body="The host starts the split by photographing the receipt. The app scans the image and extracts every item and cost automatically, removing the manual entry step that caused hosts to abandon before the group even joined."
            image="snapsplit-quick-upload.jpg"
            alt="Quick Upload: scanning a receipt to instantly extract items and costs"
          />
          <FeatureBlock
            index={2}
            label="Item Review"
            body="Before sharing with the group, the host reviews every item the scan extracted, corrects errors, and confirms tax and tip. This step exists to build data trust before the split begins — hosts who had a review step were more likely to send the link instead of abandoning the process."
            image="snapsplit-item-review.jpg"
            alt="Item Review screen confirming recognized items and tax and tip"
          />
          <FeatureBlock
            index={3}
            label="Group Assignment"
            body="Each group member opens their own page and taps the items they ordered. Their running total updates in real time as they claim items. The host assigns nothing. This is the single change most responsible for the jump in completion — sharing assignment across the group unstuck the flow, because no one person carries the whole bill anymore."
            image="snapsplit-group-assignment.jpg"
            alt="Group Assignment screen where each member claims their own items"
          />
          <FeatureBlock
            index={4}
            label="Payment Tracking"
            body="After claiming items, each group member sees their final share broken down by subtotal, tax, and tip. A bill overview stays accessible throughout the experience, so no one has to ask what they owed twice."
            image="snapsplit-payment-tracking.jpg"
            alt="Payment Tracking and Bill Overview screens"
          />
        </Section>

        {/* ── 6. Testing ── */}
        <Section id="ss-testing">
          <ChapterHeading index={6} heading="Testing" />

          <SubHeading>Quantitative Results</SubHeading>
          <BodyText>
            We tested high-fidelity prototypes with 6 participants, comparing the legacy flow against the redesigned experience. The difference was clear: the legacy flow saw only 1 out of 5 participants complete the bill split — most got stuck at the assignment step and abandoned the task. The redesigned flow changed that, with 5 out of 6 participants completing the entire process.
          </BodyText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 24 }}>
            <StatBlock stat="1 of 5" label="Legacy flow" description="Participants completed the bill split" />
            <StatBlock stat="5 of 6" label="Redesigned flow" description="Participants completed the entire process" />
          </div>

          <div style={{ marginTop: 32 }}>
            <SubHeading>What Users Said</SubHeading>
            <BodyText>
              When the work was shared across the group instead of falling on one person, users stayed engaged. Users said the design made the process feel fair and approachable, and the data backed it up.
            </BodyText>

            <div className="ss-quotes-container" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              {[
                { role: 'Recent grad, 3 months post-college', avatar: '/images/expert-ai/legal-analyst.avif', quote: 'I always dreaded splitting bills because I ended up being the accountant. This makes it fair for everyone.', align: 'left' },
                { role: 'Recent grad, 3 months post-college', avatar: '/images/expert-ai/government-analyst.avif', quote: 'Finally! I don’t feel like I’m doing everyone’s homework when we split the bill.', align: 'right' },
                { role: 'First-year professional, living alone', avatar: '/images/expert-ai/data-analyst.avif', quote: 'This actually makes splitting bills less awkward.', align: 'left' },
              ].map(({ role, avatar, quote, align }, i) => (
                <div key={i} style={{ maxWidth: '80%', marginLeft: align === 'right' ? 'auto' : 0, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(var(--color-navy-rgb),0.2)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={avatar} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
          </div>
        </Section>

        {/* ── 7. Reflection ── */}
        <Section id="ss-reflection">
          <ChapterHeading index={7} heading="Learnings" />

          <div className="ss-takeaways-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <SubHeading>Takeaways</SubHeading>
              <BodyText>
                Working as the only designer on a start-up team taught me to move quickly and trust my research. When most users showed the same behavior, I had enough data to make a decision.
              </BodyText>
              <BodyText>
                The hardest part was convincing the team to embrace a solution that needed rebuilding the main flow instead of just improving what was already there. In a startup, time is everything. To persuade the team to invest in a significant change, I needed to show clear evidence that small fixes wouldn't work.
              </BodyText>
              <BodyText>
                This project taught me that sometimes the best design work isn't visible in the UI. It's about knowing when to question the underlying model and having the determination to see it through.
              </BodyText>
            </div>
            <figure style={{ margin: 0 }}>
              <img src={img('snapsplit-team-meetings.png')} alt="Video call with the Billclub.io team" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              <figcaption className="font-landing-body cs-caption" style={{ marginTop: 12 }}>Team meetings</figcaption>
            </figure>
          </div>
        </Section>

      </div>

      <NextProject
        title="PROS Revenue Management"
        to="/work/revenue-management"
        tags={["Enterprise", "AI", "Product Design Intern"]}
        description="Modernized an AI-powered airline pricing platform for 50+ carrier analysts."
        lottie="/videos/Revenue-Management-Video.json"
        restTime={1.5}
        mediaZoom={1.1}
        category="ai"
        bgColor="#12213a"
      />

    </div>
  )
}
