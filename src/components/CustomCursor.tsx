import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${mx + 20}px, ${my - 12}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const inHero = !!(e.target as HTMLElement).closest(".hero-page--landing")
      const overKoi = !!(e.target as HTMLElement).closest(".play-koi-wrap")
      const overCursorLabel = !!(e.target as HTMLElement).closest("[data-cursor-label]")
      const hidden = overKoi || (!inHero && !overCursorLabel)
      labelRef.current?.classList.toggle("is-hidden", hidden)
      if (hidden) return

      const onDark = !!(e.target as HTMLElement).closest(".footer-dark")
      labelRef.current?.classList.toggle("is-light", onDark)

      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]")
      if (card) {
        const label = card.dataset.cursorLabel ?? ""
        if (labelRef.current) {
          labelRef.current.innerHTML = `<span class="cursor-label-text">${label}</span>`
          labelRef.current.classList.add("is-visible")
        }
      } else {
        labelRef.current?.classList.remove("is-visible")
        if (labelRef.current) labelRef.current.innerHTML = ""
      }
    }

    const onOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]")
      if (card) {
        labelRef.current?.classList.remove("is-visible")
        if (labelRef.current) labelRef.current.innerHTML = ""
      }
    }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout",  onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout",  onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={labelRef} className="cursor-label" />
}
