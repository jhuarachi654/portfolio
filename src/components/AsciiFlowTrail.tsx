import { useRef, useEffect } from "react"

interface Props {
  tint?: string
  glyphSet?: number
  scale?: number
  radius?: number
  strength?: number
  turbulence?: number
  tailLength?: number
  momentum?: number
  trackMouse?: number
  mix?: number
}

export default function AsciiFlowTrail({
  tint = "#FFFFFF",
  glyphSet = 3,
  scale = 24,
  radius = 20,
  strength = 82,
  turbulence = 100,
  tailLength = 100,
  momentum = 42,
  trackMouse = 60,
  mix = 100,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()
  const mousePos = useRef({ x: 100, y: 100 })
  const smoothPos = useRef({ x: 100, y: 100 })
  const trail = useRef<Array<{ x: number; y: number; life: number }>>([])
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener("mousemove", handleMouse)

    const charSets: Record<number, string> = {
      0: "●•·. ",
      1: "■□▪▫ ",
      2: "█▓▒░ ",
      3: "▣▤▥▦▧▨▩ ",
      4: "◆◇◈○◉◊◌ ",
    }
    const baseChars = charSets[glyphSet] ?? "@%#*+=-:. "
    const chars = baseChars.split("").reverse().join("")

    let tintR = 255, tintG = 255, tintB = 255
    if (tint.startsWith("#")) {
      tintR = parseInt(tint.slice(1, 3), 16)
      tintG = parseInt(tint.slice(3, 5), 16)
      tintB = parseInt(tint.slice(5, 7), 16)
    }

    const animate = () => {
      time.current += 0.016
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const autoX = canvas.width / 2 + Math.sin(time.current * 0.7) * (canvas.width * 0.35)
      const autoY = canvas.height / 2 + Math.cos(time.current * 0.5) * (canvas.height * 0.35)
      const trackFactor = trackMouse / 100
      const targetX = mousePos.current.x * trackFactor + autoX * (1 - trackFactor)
      const targetY = mousePos.current.y * trackFactor + autoY * (1 - trackFactor)

      const momentumFactor = 1 - (momentum / 100) * 0.95
      smoothPos.current.x += (targetX - smoothPos.current.x) * momentumFactor
      smoothPos.current.y += (targetY - smoothPos.current.y) * momentumFactor

      trail.current.push({ x: smoothPos.current.x, y: smoothPos.current.y, life: 1.0 })

      const maxLength = Math.floor((tailLength / 100) * 50) + 5
      while (trail.current.length > maxLength) trail.current.shift()

      const decay = 0.02 * (1 - tailLength / 100) + 0.01
      trail.current.forEach(p => (p.life -= decay))
      trail.current = trail.current.filter(p => p.life > 0)

      const charSize = Math.max(6, Math.floor((16 * scale) / 100))
      ctx.font = `${charSize}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.globalCompositeOperation = "source-over"

      const cols = Math.ceil(canvas.width / charSize)
      const rows = Math.ceil(canvas.height / charSize)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * charSize + charSize / 2
          const y = row * charSize + charSize / 2
          let intensity = 0

          trail.current.forEach(point => {
            const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
            const maxDist = (radius / 100) * 150
            if (dist < maxDist) {
              const value = (1 - dist / maxDist) * point.life * (strength / 100)
              intensity = Math.max(intensity, value)
            }
          })

          if (turbulence > 0 && intensity > 0) {
            const turb = Math.sin(x * 0.01 + time.current) * Math.cos(y * 0.01 + time.current * 0.7) * (turbulence / 1000)
            intensity += turb
          }

          // Bayer dithering (glyphSet 3)
          if (glyphSet === 3 && intensity > 0) {
            const bayer = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
            const threshold = bayer[row % 4][col % 4] / 16
            intensity = intensity > threshold ? 1 : intensity * 0.5
          }

          intensity = Math.max(0, Math.min(1, intensity))

          if (intensity > 0.01) {
            const charIndex = Math.min(chars.length - 1, Math.floor(intensity * chars.length))
            const alpha = intensity * (mix / 100)
            ctx.fillStyle = `rgba(${tintR}, ${tintG}, ${tintB}, ${alpha})`
            ctx.fillText(chars[charIndex], x, y)
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateSize)
      window.removeEventListener("mousemove", handleMouse)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
    />
  )
}
