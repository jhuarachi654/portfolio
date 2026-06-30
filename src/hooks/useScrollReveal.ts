import { useEffect, useRef } from "react"

interface Options {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null)
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px", once = true } = opts

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-in")
          if (once) obs.disconnect()
        } else if (!once) {
          el.classList.remove("reveal-in")
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return ref
}
