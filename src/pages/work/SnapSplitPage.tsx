import { useEffect, useRef, useState } from 'react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ss-intro',       label: 'Introduction' },
  { id: 'ss-solution',    label: 'Solution Preview' },
  { id: 'ss-research',    label: 'Research' },
  { id: 'ss-development', label: 'Development' },
  { id: 'ss-features',    label: 'Solution' },
  { id: 'ss-reflection',  label: 'Reflection' },
]

const img = (file: string) => `/images/snapsplit/${file}`

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`max-w-[1080px] px-8 md:px-14 cs-section ${className}`}
      style={{ marginTop: 256 }}
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

function ChapterHeading({ index, heading }: { index: number; heading: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span className="text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-landing-heading)', fontSize: 28, fontWeight: 300 }}>{index}.</span>
        <h2 className="font-bold text-[var(--color-cs-heading)]" style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, margin: 0 }}>
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
      <img src={img(image)} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, marginTop: 16 }} />
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
          <div style={{ background: '#8fd9c4', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
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
              A bill-splitting app for friend groups. Rebranded and redesigned to cut the core task from 4 minutes to 30 seconds.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Role',     value: 'Freelance Designer' },
                { label: 'Duration', value: 'Dec 2023 – Sep 2024' },
                { label: 'Team',     value: 'Sole Designer + Dev Team' },
                { label: 'Tools',    value: 'Figma' },
              ].map(({ label, value }) => (
                <div key={label} className="cs-info-box" style={{ padding: '10px 12px' }}>
                  <p className="cs-metric-label" style={{ marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-landing-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-cs-heading)', margin: 0, lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>

            <a href="#ss-solution" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ss-intro">
          <ChapterHeading index={1} heading="Introduction" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>The Solo Burden</SubHeading>
            <Prose>
              <BodyText>
                SnapSplit is a bill-splitting app for friend groups. In its original version, one person, the host, had to manually enter every item from a receipt, then assign portions to each person by hand. It was slow, and it made one person responsible for the entire group's math.
              </BodyText>
              <BodyText>
                While the host struggled through this legacy flow, every other group member was completely disconnected from the process. They had no visibility into what they owed until the host finished, and hosts often abandoned the split partway through.
              </BodyText>
            </Prose>
          </div>

          <div style={{ marginTop: 86 }}>
            <img src={img('snapsplit-legacy-critique.jpg')} alt="Legacy design critique of the SnapSplit host-assignment flow: information overload and confusing iconography" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12 }} />
          </div>

          <div style={{ marginTop: 32, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, background: 'transparent', padding: 20 }}>
            <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
              <strong style={{ color: 'var(--color-cs-heading)' }}>Reframing the brief:</strong> the original framing asked how to reduce drop-offs and frustration in the host's flow. But the real problem wasn't the host's flow alone, it was that only the host had a flow at all.
            </p>
          </div>

          <ChallengeBanner
            label="Challenge (Revised)"
            question={<>How might we design a bill-splitting platform to make splitting bills <strong className="font-semibold">fast</strong>, <strong className="font-semibold">fair</strong>, and <strong className="font-semibold">stress-free</strong>?</>}
          />
        </Section>

        {/* ── 2. Solution Preview ── */}
        <Section id="ss-solution">
          <ChapterHeading index={2} heading="Solution Preview" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Legacy vs. Redesign</SubHeading>
            <BodyText>
              The redesign turned item assignment from a host's solo task into a shared group task, giving every member their own page to claim items, review their share, and track what they owe.
            </BodyText>

            <img src={img('snapsplit-legacy-vs-redesign.jpg')} alt="Legacy SnapSplit UI compared to the redesigned collaborative UI" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, marginTop: 16 }} />
            <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-center cs-caption-label" style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 12 }}>Task completion up from 50% to 80%; core task time cut from 4 min to 30s</p>
          </div>
        </Section>

        {/* ── 3. Research ── */}
        <Section id="ss-research">
          <ChapterHeading index={3} heading="Research" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Who Needed This</SubHeading>
            <BodyText>
              Splitting a bill involves two very different perspectives at once: the host doing the work, and the friends waiting on their share. Both needed a faster, less stressful way to settle up.
            </BodyText>
            <img src={img('snapsplit-user-needs.png')} alt="User needs statement: bill splitters who want to divide bills quickly and fairly" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, marginTop: 16 }} />
          </div>
        </Section>

        {/* ── 4. Development ── */}
        <Section id="ss-development">
          <ChapterHeading index={4} heading="Development" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>The Fix</SubHeading>
            <BodyText>
              The goal was to solve the Solo Burden and the resulting host abandonment by turning item assignment into a shared step in the flow, not just the host's problem to solve alone.
            </BodyText>

            <img src={img('snapsplit-flow-fix.png')} alt="Bill Splitter flow: Receipt upload, Item review, Collaborative Group Assignment task, Payment and tracking" style={{ width: '100%', height: 'auto', display: 'block', marginTop: 16 }} />
          </div>
        </Section>

        {/* ── 5. Solution ── */}
        <Section id="ss-features">
          <ChapterHeading index={5} heading="Solution" />

          <div style={{ marginTop: 86 }}>
            <BodyText>
              Four connected moments carry a group from receipt to settled bill: uploading, reviewing, claiming, and tracking payment.
            </BodyText>
          </div>

          <FeatureBlock
            label="Quick Upload"
            body="Removing manual entry was the highest-leverage fix on the host's side of the Solo Burden. Skipping the itemized typing step meant a split could start in seconds instead of minutes, before the host had a chance to lose momentum or give up."
            image="snapsplit-quick-upload.jpg"
            alt="Quick Upload: scanning a receipt to instantly extract items and costs"
          />
          <FeatureBlock
            label="Item Review"
            body="Giving hosts a review step before sending the bill out kept trust intact. Catching scan errors early is what made a group willing to rely on one shared link instead of a screenshot of a receipt passed around a group chat."
            image="snapsplit-item-review.jpg"
            alt="Item Review screen confirming recognized items and tax and tip"
          />
          <FeatureBlock
            label="Group Assignment"
            body="This is the core of the redesign: assignment moved from the host's solo, repetitive task to a real-time action every group member takes for themselves. It's the single change most responsible for the jump in task completion."
            image="snapsplit-group-assignment.jpg"
            alt="Group Assignment screen where each member claims their own items"
          />
          <FeatureBlock
            label="Payment Tracking"
            body="Visibility didn't stop at assignment. Keeping the bill overview accessible throughout the flow meant no one had to ask what they owed twice, one of the most common frustrations hosts raised about the legacy version."
            image="snapsplit-payment-tracking.jpg"
            alt="Payment Tracking and Bill Overview screens"
          />
        </Section>

        {/* ── 6. Reflection ── */}
        <Section id="ss-reflection">
          <ChapterHeading index={6} heading="Reflection" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Validating the Redesign</SubHeading>
            <BodyText>
              I tested the collaborative flow with recent grads and young professionals who regularly split bills with friends. The feedback validated the core shift: putting item assignment in everyone's hands, not just the host's.
            </BodyText>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {[
                { role: 'Recent grad, 3 months post-college', quote: "Finally! I don't feel like I'm doing everyone's homework when we split the bill." },
                { role: 'First-year professional, living alone', quote: 'This actually makes splitting bills less awkward.' },
                { role: 'Recent grad, 3 months post-college', quote: 'I always dreaded splitting bills because I ended up being the accountant. This makes it fair for everyone.' },
              ].map(({ role, quote }, i) => (
                <div key={i} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: '12px 16px', maxWidth: '75%', marginLeft: i % 2 === 1 ? 'auto' : 0 }}>
                  <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]" style={{ fontSize: 11, marginBottom: 6 }}>{role}</p>
                  <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{quote}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>Impact</SubHeading>
            <BodyText>
              Task completion improved substantially once the assignment step became a shared, real-time task instead of a solo one.
            </BodyText>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
              <div className="cs-info-box" style={{ padding: 20 }}>
                <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 8 }}>Task Completion</p>
                <p className="cs-stat-number" style={{ fontSize: 40, lineHeight: 1, margin: '0 0 8px' }}>50% → 80%</p>
                <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>Task completion metric following the host/member effort redesign, a 60% increase.</p>
              </div>
              <div className="cs-info-box" style={{ padding: 20 }}>
                <p className="font-landing-body font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 8 }}>Core Task Time</p>
                <p className="cs-stat-number" style={{ fontSize: 40, lineHeight: 1, margin: '0 0 8px' }}>4 min → 30s</p>
                <p className="font-landing-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>The redesigned, collaborative claiming flow cut the core splitting task down dramatically.</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 86 }}>
            <SubHeading>What I'd carry forward</SubHeading>
            <BodyText>
              Designing, building, and shipping SnapSplit solo taught me to hold both the host's and the group's needs in mind at once, and to validate a reframed problem statement with real users before committing to a direction.
            </BodyText>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
              {[
                { heading: 'Reframe before you solve', body: "The original brief was about reducing host drop-off. Looking closer revealed the real issue: only the host had a task at all. Reframing the HMW led to a fundamentally better solution." },
                { heading: 'Validate with real users', body: 'Testing the collaborative flow with people who actually split bills regularly confirmed the shift was worth making, and surfaced language and moments worth refining further.' },
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
