import { useEffect, useRef } from "react"

// Hand-rolled shader approximation of a "god rays" effect (based on the
// Framer University "god rays" component's visual behavior at high noise
// strength — soft, continuously-morphing color blobs with no visible ray
// structure), not a port of any proprietary source. Plain <canvas> + raw
// GLSL, no react-three-fiber, to keep the Vite setup dependency-free.

type GodRaysProps = {
  colors?: string[]
  noiseScale?: number
  noiseStrength?: number
  speed?: number
  blurAmount?: number
  className?: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return [r, g, b]
}

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const RIPPLE_COUNT = 16

const FRAGMENT_SRC = `
precision highp float;

#define RIPPLE_COUNT ${RIPPLE_COUNT}

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColors[10];
uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform float uRippleTime[RIPPLE_COUNT];
uniform vec2 uRipplePos[RIPPLE_COUNT];
uniform float uRippleAmp[RIPPLE_COUNT];

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    total += snoise(p) * amp;
    p *= 2.0;
    amp *= 0.5;
  }
  return total;
}

// Domain-warped noise: feed noise through noise so the field continuously
// reshapes as it drifts, rather than just translating a fixed blob pattern.
float warpedNoise(vec2 p, float t) {
  vec2 warpA = vec2(fbm(p + vec2(0.0, 0.0) + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 warpB = vec2(
    fbm(p + 1.6 * warpA + vec2(1.7, 9.2) + t * 0.7),
    fbm(p + 1.6 * warpA + vec2(8.3, 2.8) - t * 0.7)
  );
  return fbm(p + 1.4 * warpB);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  // A trailing wake, like dragging a finger through water — small ripples
  // are continuously spawned along the cursor's path on the JS side (plus
  // one bigger "splash" on click), sharing this one ring buffer. Each ripple
  // is a decaying radial wave that displaces the noise-sampling coordinate,
  // so the color blobs ring outward from wherever the cursor has been
  // before settling back — no global pan, no color/brightness change.
  //
  // The direction vector is clamped (not divided by the raw distance) so it
  // stays numerically stable right at each ripple's own center instead of
  // spinning unstably as rDist approaches zero — that instability was the
  // source of the earlier "glitchy" flicker.
  vec2 pRippled = p;
  for (int i = 0; i < RIPPLE_COUNT; i++) {
    float age = uTime - uRippleTime[i];
    if (age >= 0.0 && age < 1.1) {
      float rDist = length(p - uRipplePos[i]);
      float wave = sin(rDist * 19.0 - age * 10.5) * exp(-age * 3.7) * exp(-rDist * 3.5);
      vec2 dir = (p - uRipplePos[i]) / max(rDist, 0.05);
      pRippled += dir * wave * uRippleAmp[i];
    }
  }

  // Slow, continuously-morphing domain-warped noise field — big, soft
  // lava-lamp blobs (low frequency), not fine grain. Two independent
  // fields at different scales/offsets, combined so blobs merge and split.
  float t = uTime * 0.014;
  vec2 noiseCoord = pRippled * (0.11 + uNoiseScale * 0.35);
  float fieldA = warpedNoise(noiseCoord, t) * 0.5 + 0.5;
  float fieldB = warpedNoise(noiseCoord * 0.6 + vec2(3.1, -2.4), t * 0.8 + 4.0) * 0.5 + 0.5;
  float field = max(fieldA, fieldB * 0.85);
  // The raw warped-noise field rarely spans its full theoretical 0..1
  // range, so the upper color stops below were almost never reached —
  // stretch/recenter it so highlights (periwinkle, powder-blue) actually
  // surface as visible accent blobs instead of staying hidden.
  field = smoothstep(0.18, 0.92, field);

  // Royal blue (uColors[0]) is the dominant base — the other 9 tones only
  // show up as smaller, progressively rarer accent blobs where the noise
  // field peaks. Wide smoothstep bands make each color fade gradually into
  // the next rather than reading as distinct, hard-edged chunks.
  vec3 color = uColors[0];
  color = mix(color, uColors[1], smoothstep(0.14, 0.42, field));
  color = mix(color, uColors[2], smoothstep(0.24, 0.50, field));
  color = mix(color, uColors[3], smoothstep(0.34, 0.58, field));
  color = mix(color, uColors[4], smoothstep(0.42, 0.66, field));
  color = mix(color, uColors[5], smoothstep(0.50, 0.74, field));
  color = mix(color, uColors[6], smoothstep(0.58, 0.80, field));
  color = mix(color, uColors[7], smoothstep(0.64, 0.86, field));
  color = mix(color, uColors[8], smoothstep(0.70, 0.90, field));
  color = mix(color, uColors[9], smoothstep(0.76, 0.96, field));

  // Saturation boost — push each pixel away from its own gray value so
  // the blues/violets read as vivid as the reference, not washed out.
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, 1.35);

  // Fine per-pixel grain, independent of the blob field and unaffected by
  // the CSS blur pass (added at full resolution before the low-res blur
  // softens everything else) — gives the "bit of noise texture" look.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.18;

  gl_FragColor = vec4(color, 1.0);
}
`

// Same turbulence asset the live grain layer uses (see the <div> below),
// exported so anything drawing a static GodRays frame can reuse the exact
// same texture instead of approximating it.
export const GOD_RAYS_GRAIN_SVG_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${info}`)
  }
  return shader
}

// Draws exactly one frame of the real GodRays shader (identical VERTEX_SRC/
// FRAGMENT_SRC, same uColors/uNoiseScale/uNoiseStrength uniform wiring as the
// live component below) onto an arbitrary canvas, for callers that want a
// static reproduction rather than an approximation. `time` stands in for the
// uTime uniform (the live component just feeds it elapsed ms * speed).
export function renderGodRaysFrame(
  canvas: HTMLCanvasElement,
  opts: { colors: string[]; noiseScale: number; noiseStrength: number; time?: number }
) {
  const { colors, noiseScale, noiseStrength, time = 0 } = opts
  const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
  if (!gl) return

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("GodRays program link error:", gl.getProgramInfoLog(program))
    return
  }
  gl.useProgram(program)

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const aPosition = gl.getAttribLocation(program, "aPosition")
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  const uResolution = gl.getUniformLocation(program, "uResolution")
  const uTime = gl.getUniformLocation(program, "uTime")
  const uColors = gl.getUniformLocation(program, "uColors")
  const uNoiseScale = gl.getUniformLocation(program, "uNoiseScale")
  const uNoiseStrength = gl.getUniformLocation(program, "uNoiseStrength")
  const uRippleTime = gl.getUniformLocation(program, "uRippleTime")
  const uRipplePos = gl.getUniformLocation(program, "uRipplePos")
  const uRippleAmp = gl.getUniformLocation(program, "uRippleAmp")

  const padded = colors.length >= 10 ? colors.slice(0, 10) : [...colors, ...Array(10 - colors.length).fill(colors[colors.length - 1])]
  gl.uniform3fv(uColors, new Float32Array(padded.flatMap(hexToRgb)))
  gl.uniform1f(uNoiseScale, noiseScale)
  gl.uniform1f(uNoiseStrength, noiseStrength)
  // Static frame — no interactivity here, so keep every ripple slot
  // permanently inactive.
  gl.uniform1fv(uRippleTime, new Float32Array(RIPPLE_COUNT).fill(-999))
  gl.uniform2fv(uRipplePos, new Float32Array(RIPPLE_COUNT * 2))
  gl.uniform1fv(uRippleAmp, new Float32Array(RIPPLE_COUNT))
  gl.uniform2f(uResolution, canvas.width, canvas.height)
  gl.uniform1f(uTime, time)

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  gl.deleteProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteBuffer(positionBuffer)
}

export default function GodRays({
  colors = ["#476ED3", "#5379E8", "#5B82F5", "#6F8EF6", "#7CA2FF", "#95B9F8", "#829CF5", "#8CA3FA", "#B7BDF0", "#A9AAF7"],
  noiseScale = 0.2,
  noiseStrength = 0.7,
  speed = 0.5,
  blurAmount = 18,
  className,
}: GodRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return
    const glContext = gl as WebGLRenderingContext

    const vertexShader = compileShader(glContext, glContext.VERTEX_SHADER, VERTEX_SRC)
    const fragmentShader = compileShader(glContext, glContext.FRAGMENT_SHADER, FRAGMENT_SRC)

    const program = glContext.createProgram()!
    glContext.attachShader(program, vertexShader)
    glContext.attachShader(program, fragmentShader)
    glContext.linkProgram(program)
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error("GodRays program link error:", glContext.getProgramInfoLog(program))
      return
    }
    glContext.useProgram(program)

    const positionBuffer = glContext.createBuffer()
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer)
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      glContext.STATIC_DRAW
    )
    const aPosition = glContext.getAttribLocation(program, "aPosition")
    glContext.enableVertexAttribArray(aPosition)
    glContext.vertexAttribPointer(aPosition, 2, glContext.FLOAT, false, 0, 0)

    const uResolution = glContext.getUniformLocation(program, "uResolution")
    const uTime = glContext.getUniformLocation(program, "uTime")
    const uColors = glContext.getUniformLocation(program, "uColors")
    const uNoiseScale = glContext.getUniformLocation(program, "uNoiseScale")
    const uNoiseStrength = glContext.getUniformLocation(program, "uNoiseStrength")
    const uRippleTime = glContext.getUniformLocation(program, "uRippleTime")
    const uRipplePos = glContext.getUniformLocation(program, "uRipplePos")
    const uRippleAmp = glContext.getUniformLocation(program, "uRippleAmp")

    const padded = colors.length >= 10 ? colors.slice(0, 10) : [...colors, ...Array(10 - colors.length).fill(colors[colors.length - 1])]
    const flatColors = new Float32Array(padded.flatMap(hexToRgb))
    glContext.uniform3fv(uColors, flatColors)
    glContext.uniform1f(uNoiseScale, noiseScale)
    glContext.uniform1f(uNoiseStrength, noiseStrength)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let rafId = 0
    const startTime = performance.now()
    let elapsedNow = 0

    // A trailing wake, like a finger dragged through water — a fixed-size
    // ring buffer of small ripples, continuously re-spawned along the
    // cursor's path (plus one bigger "splash" on click), all sharing the
    // same slots so old ones simply get overwritten as new ones spawn.
    const rippleTimes = new Float32Array(RIPPLE_COUNT).fill(-999)
    const ripplePositions = new Float32Array(RIPPLE_COUNT * 2)
    const rippleAmps = new Float32Array(RIPPLE_COUNT)
    let nextRippleSlot = 0
    const lastTrailPos = { x: 0, y: 0, has: false }
    const TRAIL_SPAWN_DIST = 0.045 // in shader p-space units — spaces the trail's ripples along the path
    const TRAIL_AMP = 0.06
    const CLICK_AMP = 0.20

    function spawnRipple(x: number, y: number, amp: number) {
      rippleTimes[nextRippleSlot] = elapsedNow
      ripplePositions[nextRippleSlot * 2] = x
      ripplePositions[nextRippleSlot * 2 + 1] = y
      rippleAmps[nextRippleSlot] = amp
      nextRippleSlot = (nextRippleSlot + 1) % RIPPLE_COUNT
    }

    function toShaderSpace(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect()
      const uvx = (clientX - rect.left) / rect.width
      const uvy = 1 - (clientY - rect.top) / rect.height
      const aspectX = rect.width / rect.height
      return { x: (uvx - 0.5) * aspectX, y: uvy - 0.5 }
    }

    // Listens on window and gates by geometry (is the pointer within the
    // canvas's own bounding rect?) rather than relying on DOM event bubbling.
    // The hero text (name/tagline/credentials) is a *sibling* of this
    // component's wrapper, not a descendant, so clicks landing on or near
    // that text — a large chunk of the hero — would otherwise never bubble
    // to a listener attached anywhere inside this component's own subtree.
    function isOverCanvas(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isOverCanvas(e.clientX, e.clientY)) {
        lastTrailPos.has = false
        return
      }
      const p = toShaderSpace(e.clientX, e.clientY)
      if (!lastTrailPos.has) {
        lastTrailPos.x = p.x; lastTrailPos.y = p.y; lastTrailPos.has = true
        return
      }
      const dx = p.x - lastTrailPos.x, dy = p.y - lastTrailPos.y
      if (Math.hypot(dx, dy) >= TRAIL_SPAWN_DIST) {
        spawnRipple(p.x, p.y, TRAIL_AMP)
        lastTrailPos.x = p.x; lastTrailPos.y = p.y
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!isOverCanvas(e.clientX, e.clientY)) return
      const p = toShaderSpace(e.clientX, e.clientY)
      spawnRipple(p.x, p.y, CLICK_AMP)
    }

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerdown", onPointerDown)
    }

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      const width = parent ? parent.clientWidth : window.innerWidth
      const height = parent ? parent.clientHeight : window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      glContext.viewport(0, 0, canvas!.width, canvas!.height)
      glContext.uniform2f(uResolution, canvas!.width, canvas!.height)
    }
    resize()
    window.addEventListener("resize", resize)

    function render(now: number) {
      elapsedNow = prefersReducedMotion ? 0 : ((now - startTime) / 1000) * speed
      glContext.uniform1f(uTime, elapsedNow)
      glContext.uniform1fv(uRippleTime, rippleTimes)
      glContext.uniform2fv(uRipplePos, ripplePositions)
      glContext.uniform1fv(uRippleAmp, rippleAmps)

      glContext.drawArrays(glContext.TRIANGLES, 0, 6)
      if (!prefersReducedMotion) rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)
    if (prefersReducedMotion) {
      // Still needs one draw with every ripple slot inactive.
      glContext.uniform1fv(uRippleTime, rippleTimes)
      glContext.uniform2fv(uRipplePos, ripplePositions)
      glContext.uniform1fv(uRippleAmp, rippleAmps)
      glContext.uniform1f(uTime, 0)
      glContext.drawArrays(glContext.TRIANGLES, 0, 6)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      glContext.deleteProgram(program)
      glContext.deleteShader(vertexShader)
      glContext.deleteShader(fragmentShader)
      glContext.deleteBuffer(positionBuffer)
    }
  }, [colors, noiseScale, noiseStrength, speed])

  return (
    <div aria-hidden="true" className={`hero-godrays-fade${className ? ` ${className}` : ""}`} style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: blurAmount ? `blur(${blurAmount}px)` : undefined,
          transform: "scale(1.08)",
        }}
      />
      {/* Unblurred grain layer on top — the canvas blur above would otherwise
          smooth away any texture rendered into the canvas itself. */}
      <div
        className="god-rays-grain"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.65,
          // "overlay" renders this SVG turbulence noise dramatically more
          // harshly in Safari than Chrome (a known cross-browser blend-mode
          // rendering difference) — "soft-light" is far more consistent
          // across engines and inherently gentler, at the cost of needing a
          // touch more opacity to read the same in Chrome.
          mixBlendMode: "soft-light",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
