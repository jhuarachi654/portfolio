import { useEffect, useRef, useState } from 'react'
import ChallengeBanner from '../../components/case-study/ChallengeBanner'
import NextProject from '../../components/case-study/NextProject'
import ReadingProgress from '../../components/case-study/ReadingProgress'
import PlayPauseButton from '../../components/PlayPauseButton'
import { useCaseToc } from '../../hooks/useCaseToc'

const TOC = [
  { id: 'ss-intro',       label: 'Introduction' },
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
              SnapSplit is a bill-splitting app for friend groups. In the original version, one person did all the work while everyone else waited. I redesigned the flow to make splitting a shared task, rebranded the product, and cut the core task from 4 minutes to 30 seconds.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

            <a href="#ss-features" className="cs-jump-btn" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({ behavior: "smooth" }); }}><span>↓ Jump to solution</span></a>
          </div>
        </div>
      </section>

      <div className="cs-outer-wrap" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. Introduction ── */}
        <Section id="ss-intro">
          <ChapterHeading index={1} heading="Introduction" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>The problem was not that the host dropped off. It was that only the host had anything to do.</SubHeading>
            <Prose>
              <BodyText>
                SnapSplit is a mobile app that helps friend groups split restaurant bills. One person, the host, uploads a photo of the receipt. The app scans the items and costs. The group settles up based on what each person ordered.
              </BodyText>
              <BodyText>
                In the original version, the host did everything. They uploaded the receipt, manually entered every item, and assigned each portion to each person by hand. The process took around 4 minutes and required sustained attention throughout. Hosts frequently abandoned the split partway through, leaving the group with nothing resolved.
              </BodyText>
              <BodyText>
                The original brief asked how to reduce host drop-off. Informational interviews with frequent bill splitters pointed to a more fundamental issue. The host was doing work that belonged to the whole group. Every other group member sat idle while one person managed the entire bill. Group members had no step to complete, no visibility into what was happening, and no way to know what they owed until the host finished.
              </BodyText>
              <BodyText>
                That finding changed the design direction. Making the host's solo task faster would not fix the underlying problem. The goal became giving every group member their own step in the process.
              </BodyText>
            </Prose>
          </div>

          <ChallengeBanner
            question={<>How might we design a bill-splitting experience that is <strong className="font-semibold">fast</strong>, <strong className="font-semibold">fair</strong>, and <strong className="font-semibold">stress-free</strong> for everyone in the group?</>}
          />
        </Section>

        {/* ── 2. Research ── */}
        <Section id="ss-research">
          <ChapterHeading index={2} heading="Research" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Hosts were abandoning because the workload was unfair, not because the interface was hard to use</SubHeading>
            <Prose>
              <BodyText>
                I ran informational interviews with recent graduates and young professionals who split bills regularly with friends. I wanted to understand not just where the flow broke down but why people avoided itemized splitting altogether.
              </BodyText>
              <BodyText>
                Hosts described the manual entry step as the point where they gave up. Entering every item individually while friends waited was slow enough that splitting evenly felt like the easier option, even when it was less fair. Group members described a different frustration: they had no visibility into the bill while the host worked through it, and asking what they owed before the host finished felt awkward.
              </BodyText>
              <BodyText>
                I followed the interviews with usability testing on the original flow. Task completion sat at 50%. The drop-off happened almost entirely at the item assignment step, the moment where the host assigned each item to each person individually. That step concentrated all the work in one place when the group was sitting right there to share it.
              </BodyText>
            </Prose>

            <div style={{ marginTop: 32, border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, background: 'transparent', padding: 20 }}>
              <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', margin: 0 }}>
                <strong style={{ color: 'var(--color-cs-heading)' }}>User needs statement:</strong> As a young adult who frequently splits expenses with friends, I want to divide bills quickly and fairly so I can pay my share, avoid uncomfortable money conversations, and get back to enjoying time with my group.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 3. Development ── */}
        <Section id="ss-development">
          <ChapterHeading index={3} heading="Development" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Three directions for making assignment collaborative, one that worked within the app's constraints</SubHeading>
            <Prose>
              <BodyText>
                I explored three approaches to distributing the assignment step across the group. The first was a host-controlled drag and drop interface where the host could assign items faster by dragging them to each person's column. This kept assignment with the host and made it slightly faster, but it did not address the core problem: the host was still doing all the work alone.
              </BodyText>
              <BodyText>
                The second was a voting system where the host sent a list of items and group members voted on which ones they shared. This distributed the task but introduced ambiguity about who owed what when items overlapped.
              </BodyText>
              <BodyText>
                The third was individual claiming: each group member opens their own page and taps the items they ordered. Assignment becomes a personal action rather than a host action. This eliminated the bottleneck entirely because the work is now distributed across everyone in the group simultaneously.
              </BodyText>
              <BodyText>
                Individual claiming was the only approach that solved the problem at its source. The dev team confirmed it was feasible within the current architecture. I built the new flow around it.
              </BodyText>
              <BodyText>
                The new flow has four connected steps. The host uploads the receipt and reviews the scanned items. The host shares a link with the group. Every group member opens their own page and claims what they ordered. Everyone tracks payment from a shared bill overview, a screen showing each person's total, itemized by subtotal, tax, and tip.
              </BodyText>
              <BodyText>
                As part of the overall redesign I also rebranded SnapSplit. The original interface used icons that tested as confusing in the informational interviews, particularly the split button which users could not identify without a label. The rebrand replaced ambiguous icons with labeled actions throughout, simplified the color system, and reorganized each screen's hierarchy to surface the most important action at the top.
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
          <ChapterHeading index={5} heading="Reflection" />

          <div style={{ marginTop: 86 }}>
            <SubHeading>Task completion rose from 50% to 80%. Core task time dropped from 4 minutes to 30 seconds.</SubHeading>
            <BodyText>
              Both figures come from usability testing of the redesigned prototype with the same group as the original testing: recent graduates and young professionals who split bills regularly. Three responses from those sessions:
            </BodyText>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {[
                { role: 'Recent grad, 3 months post-college', quote: "Finally, I don't feel like I'm doing everyone's homework when we split the bill." },
                { role: 'First-year professional, living alone', quote: 'This actually makes splitting bills less awkward.' },
                { role: 'Recent grad, 3 months post-college', quote: 'I always dreaded splitting bills because I ended up being the accountant. This makes it fair for everyone.' },
              ].map(({ role, quote }, i) => (
                <div key={i} style={{ border: '1px solid rgba(var(--color-navy-rgb),0.2)', borderRadius: 12, padding: '12px 16px', maxWidth: '75%', marginLeft: i % 2 === 1 ? 'auto' : 0 }}>
                  <p className="font-landing-body font-semibold tracking-[0.12em] uppercase text-[var(--color-cs-heading)]" style={{ fontSize: 11, marginBottom: 6 }}>{role}</p>
                  <p className="font-landing-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-secondary)', margin: 0 }}>{quote}</p>
                </div>
              ))}
            </div>

            <BodyText>
              All three responses pointed at the same thing the metrics showed: the original design had concentrated a group task in one person's hands.
            </BodyText>
          </div>

          <div style={{ marginTop: 86 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { heading: 'Reframe before you solve', body: "The original brief described a host drop-off problem. The informational interviews showed the drop-off was a symptom of a structural problem: item assignment was a solo task in a group experience. Fixing the symptom would have produced a faster solo flow. Fixing the structure produced a flow that worked for everyone in the group." },
                { heading: 'Validate before you commit', body: 'Testing the collaborative flow with people who actually split bills regularly confirmed the direction was right. It also surfaced details the metrics alone did not show. The social discomfort of waiting for the host to finish was a finding that came directly from conversations, not from task completion rates. That finding shaped how the payment tracking screen was designed, specifically the decision to make the bill overview persistent rather than only visible at the end.' },
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
