import { useEffect, useRef, useState } from 'react'

const CURSOR_MAP: Record<string, string> = {
  'view-case-study': '/cursors/view-case-study.png',
  'fare-finder': '/cursors/fare-finder.png',
  'rm': '/cursors/rm.png',
  'dnc': '/cursors/dnc.png',
  'expert-ai': '/cursors/expert.ai.png',
  'canopy': '/cursors/canopy.png',
  'snapsplit': '/cursors/snapsplit.png',
  'draw': '/cursors/want-to-draw.png',
  'click': '/cursors/click-to-see-more.png',
  'photos': '/cursors/photos.png',
  'ai-design': '/cursors/ai-design.png',
  'motion-design': '/cursors/motion-design.png',
  'where-im-at': '/cursors/where-im-at.png',
  'why': '/cursors/why-i-am-who-i-am.png',
  'always-good': '/cursors/always-good-to-know.png',
  'hello': '/cursors/helloo.png',
}
const DEFAULT_CURSOR = '/cursors/nice-to-meet-you.png'

export default function SparkleCustomCursor() {
  const [pos, setPos] = useState({ x: -300, y: -300 })
  const [cursorSrc, setCursorSrc] = useState(DEFAULT_CURSOR)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)
  const pendingPos = useRef({ x: -300, y: -300 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pendingPos.current = { x: e.clientX, y: e.clientY }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          setPos({ ...pendingPos.current })
          rafRef.current = null
        })
      }
      if (!visible) setVisible(true)

      // Walk up DOM to find nearest data-cursor attribute
      const el = e.target as HTMLElement | null
      let found = DEFAULT_CURSOR
      let node: HTMLElement | null = el
      while (node && node !== document.body) {
        const key = node.dataset?.cursor
        if (key && CURSOR_MAP[key]) {
          found = CURSOR_MAP[key]
          break
        }
        node = node.parentElement
      }
      setCursorSrc(found)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [visible])

  return (
    <div
      className="pointer-events-none fixed z-[9999] select-none"
      style={{
        left: pos.x + 16,
        top: pos.y + 8,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      <img
        src={cursorSrc}
        alt=""
        style={{ height: 56, width: 'auto', display: 'block' }}
        draggable={false}
      />
    </div>
  )
}
