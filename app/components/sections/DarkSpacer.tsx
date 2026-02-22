'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function DarkSpacer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)   // Three.js
  const rainRef   = useRef<HTMLCanvasElement>(null)   // Rain lines (Canvas 2D)

  // ── Three.js wave grid ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 1)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 100)
    camera.position.set(0, 4, 10)
    camera.lookAt(0, 0, 0)

    const COLS = 60, ROWS = 20, SPACING = 0.5
    const count     = COLS * ROWS
    const positions = new Float32Array(count * 3)
    const baseX     = new Float32Array(count)
    const baseZ     = new Float32Array(count)

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c
        const x = (c - COLS / 2) * SPACING
        const z = (r - ROWS / 2) * SPACING
        positions[i * 3]     = x
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = z
        baseX[i] = x
        baseZ[i] = z
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const dotMat = new THREE.PointsMaterial({
      size: 0.045, color: new THREE.Color('#FF7300'),
      transparent: true, opacity: 0.45, sizeAttenuation: true,
    })
    scene.add(new THREE.Points(geometry, dotMat))

    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#FF7300'), transparent: true, opacity: 0.04,
    })
    for (let r = 0; r < ROWS; r += 3) {
      const pts: THREE.Vector3[] = []
      for (let c = 0; c < COLS; c++)
        pts.push(new THREE.Vector3((c - COLS / 2) * SPACING, 0, (r - ROWS / 2) * SPACING))
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
    }
    for (let c = 0; c < COLS; c += 4) {
      const pts: THREE.Vector3[] = []
      for (let r = 0; r < ROWS; r++)
        pts.push(new THREE.Vector3((c - COLS / 2) * SPACING, 0, (r - ROWS / 2) * SPACING))
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
    }

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf: number
    const posAttr = geometry.attributes.position as THREE.BufferAttribute

    const animate = (t: number) => {
      raf = requestAnimationFrame(animate)
      const time = t * 0.001
      for (let i = 0; i < count; i++) {
        const x = baseX[i], z = baseZ[i]
        posAttr.setY(i,
          Math.sin(x * 0.7 + time * 1.1) * 0.5 +
          Math.sin(z * 0.9 + time * 0.7) * 0.4 +
          Math.sin((x + z) * 0.4 + time * 0.5) * 0.3
        )
      }
      posAttr.needsUpdate = true
      camera.position.x = Math.sin(time * 0.08) * 1.5
      camera.position.y = 3.5 + Math.sin(time * 0.12) * 0.5
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      dotMat.dispose()
    }
  }, [])

  // ── Rain lines (Canvas 2D) ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = rainRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Each rain line: x position, current y, length, speed, opacity
    type Drop = { x: number; y: number; len: number; speed: number; opacity: number; width: number }
    let drops: Drop[] = []
    let W = 0, H = 0

    const init = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight

      // Spawn ~1 drop per 40px of width
      const count = Math.floor(W / 40)
      drops = Array.from({ length: count }, () => ({
        x:       Math.random() * W,
        y:       Math.random() * -H,           // start above canvas
        len:     40 + Math.random() * 120,     // 40–160px long
        speed:   60 + Math.random() * 120,     // px/s
        opacity: 0.08 + Math.random() * 0.22,  // subtle
        width:   0.5 + Math.random() * 0.8,
      }))
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()

    let last = performance.now()
    let raf: number

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now

      // Clear with very slight trail (not full clear = glow trail effect)
      ctx.clearRect(0, 0, W, H)

      drops.forEach(d => {
        d.y += d.speed * dt

        // Gradient: transparent at top, orange in middle, transparent at bottom
        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y)
        grad.addColorStop(0,   `rgba(255, 115, 0, 0)`)
        grad.addColorStop(0.3, `rgba(255, 115, 0, ${d.opacity * 0.4})`)
        grad.addColorStop(0.7, `rgba(255, 115, 0, ${d.opacity})`)
        grad.addColorStop(1,   `rgba(255, 115, 0, 0)`)

        ctx.save()
        ctx.strokeStyle = grad
        ctx.lineWidth   = d.width
        ctx.beginPath()
        ctx.moveTo(d.x, d.y - d.len)
        ctx.lineTo(d.x, d.y)
        ctx.stroke()
        ctx.restore()

        // Tiny bright head dot
        ctx.save()
        ctx.shadowColor  = '#FF7300'
        ctx.shadowBlur   = 6
        ctx.fillStyle    = `rgba(255, 115, 0, ${d.opacity * 1.5})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.width * 0.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Reset when fully off-screen
        if (d.y - d.len > H) {
          d.y       = -d.len - Math.random() * 100
          d.x       = Math.random() * W
          d.len     = 40 + Math.random() * 120
          d.speed   = 60 + Math.random() * 120
          d.opacity = 0.08 + Math.random() * 0.22
        }
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <section className="relative bg-black h-[250px] lg:h-[350px] border-t border-border overflow-hidden section-shadow">
      {/* Layer 1: Three.js wave grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Layer 2: Rain lines */}
      <canvas
        ref={rainRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        style={{ display: 'block' }}
      />

      {/* Decorative column lines */}
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-none z-10">
        <div className="border-r border-border/10 h-full" />
        <div className="border-r border-border/10 h-full" />
        <div className="h-full" />
      </div>

      {/* Corner bracket */}
      <div className="absolute top-0 right-0 w-[140px] lg:w-[200px] h-full max-h-[300px] border-l border-b border-border/20 z-10" />

      {/* Fade top & bottom */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  )
}