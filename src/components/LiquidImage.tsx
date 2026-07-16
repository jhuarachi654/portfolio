import { useEffect, useRef } from "react"

interface Props {
  src: string
  alt?: string
  style?: React.CSSProperties
}

const VERT = `
  attribute vec2 a_position;
  attribute vec2 a_uv;
  varying vec2 v_uv;
  void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform vec2 u_mouse;
  uniform float u_power;
  uniform float u_radius;
  uniform float u_time;
  uniform float u_aspect;
  varying vec2 v_uv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = v_uv;
    vec2 diff = uv - u_mouse;
    // correct for the canvas's on-screen aspect ratio so the ripple is a
    // true circle around the cursor instead of a stretched ellipse
    vec2 diffScreen = diff;
    diffScreen.x *= u_aspect;
    float dist = length(diffScreen);
    float mask = smoothstep(u_radius, 0.0, dist);
    float n1 = noise(uv * 6.0 + u_time * 0.35) * 2.0 - 1.0;
    float n2 = noise(uv * 13.0 - u_time * 0.55 + 4.2) * 2.0 - 1.0;
    float n = n1 * 0.7 + n2 * 0.3;
    vec2 flow = vec2(
      noise(uv * 5.0 + u_time * 0.2) - 0.5,
      noise(uv * 5.0 - u_time * 0.2 + 9.1) - 0.5
    );
    vec2 disp = (normalize(diff + 0.001) * n + flow * 0.6) * mask * u_power * 0.05;
    gl_FragColor = texture2D(u_tex, uv + disp);
  }
`

export default function LiquidImage({ src, alt, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const powerRef  = useRef(0)
  const targetPowerRef = useRef(0)
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src); gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const quad = new Float32Array([-1,-1,0,1, 1,-1,1,1, -1,1,0,0, 1,1,1,0])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, "a_position")
    const aUV  = gl.getAttribLocation(prog, "a_uv")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(aUV)
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8)

    const uMouse  = gl.getUniformLocation(prog, "u_mouse")
    const uPower  = gl.getUniformLocation(prog, "u_power")
    const uRadius = gl.getUniformLocation(prog, "u_radius")
    const uTime   = gl.getUniformLocation(prog, "u_time")
    const uAspect = gl.getUniformLocation(prog, "u_aspect")

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

      let start = 0
      const render = (now: number) => {
        if (!start) start = now
        const t = (now - start) / 1000

        // ease ripple intensity in/out instead of snapping, so it builds up
        // and settles like real water rather than toggling on contact
        // (position itself tracks the cursor directly — no lag — only the
        // intensity is eased, so the ripple always sits under the cursor)
        powerRef.current += (targetPowerRef.current - powerRef.current) * 0.05

        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform2f(uMouse, targetRef.current.x, targetRef.current.y)
        gl.uniform1f(uPower, powerRef.current)
        gl.uniform1f(uRadius, 0.5)
        gl.uniform1f(uTime, t)
        const rect = canvas.getBoundingClientRect()
        gl.uniform1f(uAspect, rect.width / rect.height)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        rafRef.current = requestAnimationFrame(render)
      }
      rafRef.current = requestAnimationFrame(render)
    }
    img.src = src

    return () => cancelAnimationFrame(rafRef.current)
  }, [src])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect()
    targetRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    }
    targetPowerRef.current = 0.6
  }
  const onMouseLeave = () => { targetPowerRef.current = 0 }

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={600}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-label={alt}
    />
  )
}
