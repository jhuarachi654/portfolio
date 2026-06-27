import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx, ry = my
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`
      }
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${mx + 20}px, ${my - 12}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const overKoi = !!(e.target as HTMLElement).closest(".play-koi-wrap")
      dotRef.current?.classList.toggle("is-hidden", overKoi)
      ringRef.current?.classList.toggle("is-hidden", overKoi)
      labelRef.current?.classList.toggle("is-hidden", overKoi)
      if (overKoi) return

      const onDark = !!(e.target as HTMLElement).closest(".footer-dark")
      dotRef.current?.classList.toggle("is-light", onDark)
      ringRef.current?.classList.toggle("is-light", onDark)
      labelRef.current?.classList.toggle("is-light", onDark)

      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]")
      if (card) {
        const label = card.dataset.cursorLabel ?? ""
        ringRef.current?.classList.add("is-hovering")
        if (labelRef.current) {
          labelRef.current.innerHTML = `<span class="cursor-label-text">${label}</span>`
          labelRef.current.classList.add("is-visible")
        }
      } else if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        ringRef.current?.classList.add("is-hovering")
        labelRef.current?.classList.remove("is-visible")
        if (labelRef.current) labelRef.current.innerHTML = ""
      } else {
        ringRef.current?.classList.remove("is-hovering")
        labelRef.current?.classList.remove("is-visible")
        if (labelRef.current) labelRef.current.innerHTML = ""
      }
    }

    const onOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]")
      if (card) {
        ringRef.current?.classList.remove("is-hovering")
        labelRef.current?.classList.remove("is-visible")
        if (labelRef.current) labelRef.current.innerHTML = ""
      } else if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        ringRef.current?.classList.remove("is-hovering")
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

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   />
      <div ref={ringRef}  className="cursor-ring"  />
      <div ref={labelRef} className="cursor-label" />
    </>
  )
}
