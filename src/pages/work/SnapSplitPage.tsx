import { useEffect, useRef, useState } from 'react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ss-intro',       label: 'Problem' },
  { id: 'ss-research',    label: 'Research' },
  { id: 'ss-development', label: 'Development' },
  { id: 'ss-features',    label: 'Solution' },
  { id: 'ss-reflection',  label: 'Learnings' },
]

const img = (file: string) => `/images/snapsplit/${file}`

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
      <h3 className="text-[22px] text-[var(--color-cs-heading)] leading-snug cs-editorial" style={{ fontFamily: 'var(--font-landing-heading)', fontStyle: 'italic', fontWeight: 400, marginBottom: 8, marginTop: 0 }}>
        {children}
      </h3>
    </div>
  )
}

function ChapterHeading({ index, heading }: { index: number; heading: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>{index}.</span>
        <h2 className="font-normal text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
          {heading}
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
  )
}

function FeatureBlock({ label, body, image, alt }: { label: string; body: string; image: string; alt: string }) {
  return (
    <div style={{ marginTop: 64 }}>
      <h3 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3, margin: '0 0 8px' }}>{label}</h3>
      <BodyText>{body}</BodyText>
      <img src={img(image)} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, marginTop: 16 }} />
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
          <div style={{ background: '#8fd9c4', borderRadius: 8, position: 'relative', aspectRatio: '16/9', overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
            <HeroVideo />
          </div>
        </div>

        <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32 }}>
          <div className="max-w-[1080px] px-8 md:px-14 pt-14 pb-16">
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-cs-heading)', marginBottom: 8, borderLeft: '2px solid var(--color-navy)', paddingLeft: 10 }}>Freelance</p>
            <h1 className="text-[44px] sm:text-[58px] font-bold text-[var(--color-cs-heading)] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              SnapSplit
            </h1>
            <p className="font-landing-body text-[15px] leading-[1.7]" style={{ color: 'var(--color-secondary)', marginBottom: 20, maxWidth: 600 }}>
              I redesigned the bill-splitting experience for Billclub.io, a startup that helps groups divide costs by scanning receipts. My contributions include running usability tests with 5 users, identifying that 80% dropped off during bill assignment, redesigning the entire flow to be collaborative instead of solo, and validating the solution with 6 participants. The result: task completion increased by 60%.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Design Systems Leads' },
                { label: 'Timeline', value: '12/1/23 - 6/15/24' },
                { label: 'Team',     value: 'Johanna Huarachi' },
                { label: 'Skills',   value: 'User Research' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>

            <a href="#ss-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ss-intro">
          <ChapterHeading index={1} heading="Problem" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>The host was doing everything. Assigning items, chasing people down, managing the whole flow alone. Most users dropped off before finishing.</SubHeading>
          </div>

          <ChallengeBanner
            question={<>How can we redesign bill splitting so the <strong className="font-semibold">entire group shares the work</strong> instead of one person doing everything?</>}
          />
        </Section>

        {/* ── 2. Research ── */}
        <Section id="ss-research">
          <ChapterHeading index={2} heading="Research" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Key insights about the bill splitting experience</SubHeading>
            <Prose>
              <BodyText>
                4 out of 5 users abandoned at the assignment screen. I ran usability tests with 5 users. This pattern showed up: users scanned their receipt, items populated, and then assignment. Billclub.io asked them to go through each item and assign it to each person. For a group dinner, this meant dozens of decisions. Only 1 user finished.
              </BodyText>
              <BodyText>
                The solo host burden was exhausting. One person had to remember what everyone ordered, make decisions for the whole group, and tap through every single item. It turned a social moment into an admin task.
              </BodyText>
              <BodyText>
                Users wanted speed and trust. Talking to young adults revealed what mattered: split bills as fast as possible and trust the math. These principles became the foundation for everything that followed.
              </BodyText>
            </Prose>
          </div>
        </Section>

        {/* ── 3. Development ── */}
        <Section id="ss-development">
          <ChapterHeading index={3} heading="Development" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Stop making one person do all the work. Let people claim their own items. Turn bill splitting into something the group does together.</SubHeading>
            <Prose>
              <BodyText>
                I explored three approaches to distributing the assignment step across the group. The first was a host-controlled drag and drop interface — faster, but the host was still doing all the work alone. The second was a voting system where group members voted on shared items — distributed, but introduced ambiguity about overlapping orders.
              </BodyText>
              <BodyText>
                The third was individual claiming: each group member opens their own page and taps the items they ordered. Assignment becomes a personal action rather than a host action. This eliminated the bottleneck entirely because the work is distributed across everyone simultaneously.
              </BodyText>
              <BodyText>
                Individual claiming was the only approach that solved the problem at its source. The dev team confirmed it was feasible within the current architecture. I built the new flow around it: host scans the receipt, host verifies items and adds the group, everyone claims their own items, and final amounts calculate automatically.
              </BodyText>
            </Prose>

            <img src={img('snapsplit-flow-fix.png')} alt="Bill Splitter flow: Receipt upload, Item review, Collaborative Group Assignment task, Payment and tracking" style={{ width: '100%', height: 'auto', display: 'block', marginTop: 16 }} />
          </div>
        </Section>

        {/* ── 4. Solution ── */}
        <Section id="ss-features">
          <ChapterHeading index={4} heading="Solution" />

          <FeatureBlock
            label="Quick Upload"
            body="The host starts the split by taking a photo of the receipt. The app scans the image and extracts every item and cost automatically, removing the manual entry step that was causing hosts to abandon the process before it reached the group. Skipping the itemized typing step meant a split could start in seconds instead of minutes, before the host had a chance to lose momentum or give up."
            image="snapsplit-quick-upload.jpg"
            alt="Quick Upload: scanning a receipt to instantly extract items and costs"
          />
          <FeatureBlock
            label="Item Review"
            body="Before sharing with the group, the host reviews every item the scan extracted, corrects errors, and confirms the tax and tip. Catching scan errors early is what made a group willing to rely on one shared link instead of a screenshot of a receipt passed around a group chat. In testing, hosts who had a review step were more likely to send the link rather than abandon the process, because they felt confident the bill was right before it went out."
            image="snapsplit-item-review.jpg"
            alt="Item Review screen confirming recognized items and tax and tip"
          />
          <FeatureBlock
            label="Group Assignment"
            body="Each group member opens their own page and taps the items they ordered. Their running total updates in real time as they claim items. The host assigns nothing. This is the single change most responsible for the jump in task completion. Distributing assignment across the group removed the bottleneck that caused host abandonment, because no single person is responsible for the entire bill anymore."
            image="snapsplit-group-assignment.jpg"
            alt="Group Assignment screen where each member claims their own items"
          />
          <FeatureBlock
            label="Payment Tracking"
            body="After claiming items, each group member sees their final share broken down by subtotal, tax, and tip. A bill overview stays accessible throughout the entire experience. Keeping that overview visible throughout the flow meant no one had to ask what they owed twice, one of the most common frustrations hosts raised about the original version."
            image="snapsplit-payment-tracking.jpg"
            alt="Payment Tracking and Bill Overview screens"
          />
        </Section>

        {/* ── 5. Reflection ── */}
        <Section id="ss-reflection">
          <ChapterHeading index={5} heading="Learnings" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>The numbers shifted dramatically.</SubHeading>
            <BodyText>
              We tested high-fidelity prototypes with 6 participants, comparing legacy vs. redesigned collaborative flow.
            </BodyText>
            <BodyText>
              Legacy flow: 1 out of 5 completed. Redesigned flow: 5 out of 6 completed. That's a 60% increase in task completion.
            </BodyText>

            <div style={{ marginTop: 24, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 8, padding: '16px 20px' }}>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: '0 0 8px', fontStyle: 'italic' }}>"This is easier when everyone can just grab what they ordered"</p>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>When the work was shared across the group, users stayed engaged. Collaborative assignment eliminated the bottleneck.</p>
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Key Takeaways</SubHeading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { heading: 'Trust your research', body: "When 4 out of 5 users showed the same behavior, I had enough data to make a decision. Working as the only designer on a startup team taught me to move fast and trust what users were telling me." },
                { heading: 'Advocate for fundamental change', body: "The hardest part was convincing the team to rebuild the core flow instead of polishing what existed. In a startup, time is everything. I had to show clear evidence that incremental fixes wouldn't solve the real problem." },
              ].map(({ heading, body }) => (
                <div key={heading} className="cs-info-box" style={{ padding: 20 }}>
                  <p className="font-semibold text-[var(--color-cs-heading)] cs-serif-label" style={{ fontSize: 16, margin: '0 0 10px', lineHeight: 1.4 }}>{heading}</p>
                  <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
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
