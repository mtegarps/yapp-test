'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Loading screen — Canvas 2D only, zero Three.js.
 *
 * Visual elements (all drawn on a single 2D canvas):
 *   1. Morphing blob orb — simplex noise displacement on a radial shape
 *   2. Inner glow core — pulsating orange/amber gradient
 *   3. Wireframe icosahedron shell — rotating line-drawn polyhedron
 *   4. Orbiting rings — elliptical arcs that spin
 *   5. Floating particles — orbit + drift outward on explode
 *   6. Scanline + vignette overlays (CSS, same as before)
 *   7. Explode state — orb shatters into particles, flash, fade
 *
 * Palette: #0a0a0a bg, #FF6A00 primary, #00b4ff accent, #FF3D00 hot
 */

// ─── Simplex-ish 2D noise (compact) ──────────────────────────────────────────
const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
const P = Array.from({length:256},(_,i)=>i).sort(()=>Math.random()-0.5)
const PERM = [...P,...P]
const dot2 = (g:number[],x:number,y:number) => g[0]*x+g[1]*y
function noise2D(x:number,y:number){
  const F2=0.5*(Math.sqrt(3)-1),G2=(3-Math.sqrt(3))/6
  const s=(x+y)*F2,i=Math.floor(x+s),j=Math.floor(y+s)
  const t=(i+j)*G2,x0=x-(i-t),y0=y-(j-t)
  const i1=x0>y0?1:0,j1=x0>y0?0:1
  const x1=x0-i1+G2,y1=y0-j1+G2,x2=x0-1+2*G2,y2=y0-1+2*G2
  const ii=i&255,jj=j&255
  const gi0=PERM[ii+PERM[jj]]%8,gi1=PERM[ii+i1+PERM[jj+j1]]%8,gi2=PERM[ii+1+PERM[jj+1]]%8
  let n0=0,n1=0,n2=0,t0=0.5-x0*x0-y0*y0,t1=0.5-x1*x1-y1*y1,t2=0.5-x2*x2-y2*y2
  if(t0>=0){t0*=t0;n0=t0*t0*dot2(GRAD[gi0],x0,y0)}
  if(t1>=0){t1*=t1;n1=t1*t1*dot2(GRAD[gi1],x1,y1)}
  if(t2>=0){t2*=t2;n2=t2*t2*dot2(GRAD[gi2],x2,y2)}
  return 70*(n0+n1+n2)
}

// ─── Particle type ───────────────────────────────────────────────────────────
interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  vr: number // radial velocity for explode
}

// ─── Icosahedron wireframe data (projected to 2D) ────────────────────────────
function createIcoVertices() {
  const t = (1 + Math.sqrt(5)) / 2
  const raw = [
    [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
    [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
    [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1],
  ]
  // Normalize to unit sphere
  return raw.map(([x,y,z]) => {
    const l = Math.sqrt(x*x+y*y+z*z)
    return [x/l, y/l, z/l] as [number,number,number]
  })
}

const ICO_EDGES = [
  [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
  [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
  [7,8],[7,10],[8,9],[9,5],[10,11],
]

function rotateY(v:[number,number,number], a:number): [number,number,number] {
  const c=Math.cos(a),s=Math.sin(a)
  return [v[0]*c+v[2]*s, v[1], -v[0]*s+v[2]*c]
}
function rotateX(v:[number,number,number], a:number): [number,number,number] {
  const c=Math.cos(a),s=Math.sin(a)
  return [v[0], v[1]*c-v[2]*s, v[1]*s+v[2]*c]
}

const LoadingScreen = ({ onFinished }: { onFinished?: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExploding, setIsExploding] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const animRef = useRef<number>(0)
  const explodeRef = useRef(false)
  const explodeTimeRef = useRef(0)

  useEffect(() => { progressRef.current = progress }, [progress])
  useEffect(() => { explodeRef.current = isExploding }, [isExploding])

  // Progress counter — speed variable biar ada feel "loading"
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExploding(true)
          setTimeout(() => {
            setIsVisible(false)
            onFinished?.()
          }, 1200)
          return 100
        }
        const remaining = 100 - prev
        const increment = remaining > 30 ? 1.2 : remaining > 10 ? 0.6 : 1.5
        return Math.min(prev + increment, 100)
      })
    }, 35)
    return () => clearInterval(interval)
  }, [onFinished])

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let W = 0, H = 0
    const dpr = Math.min(window.devicePixelRatio, 1.5)

    const resize = () => {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 100 + Math.random() * 140,
      speed: (Math.random() - 0.5) * 0.008,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      vr: 1.5 + Math.random() * 4,
    }))

    // Icosahedron vertices
    const icoVerts = createIcoVertices()

    // Blob shape cache — angles for the morphing orb
    const BLOB_SEGMENTS = 120
    const blobAngles = Array.from({ length: BLOB_SEGMENTS }, (_, i) =>
      (i / BLOB_SEGMENTS) * Math.PI * 2
    )

    const startTime = performance.now()

    const draw = (now: number) => {
      animRef.current = requestAnimationFrame(draw)
      const t = (now - startTime) / 1000
      const prog = progressRef.current / 100
      const isExplode = explodeRef.current
      const cx = W / 2
      const cy = H / 2

      // Track explode time
      if (isExplode && explodeTimeRef.current === 0) {
        explodeTimeRef.current = t
      }
      const explodeElapsed = explodeTimeRef.current > 0 ? t - explodeTimeRef.current : 0
      const explodeProg = Math.min(explodeElapsed / 1.0, 1)
      const easeExplode = 1 - Math.pow(1 - explodeProg, 3)

      // Clear
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // ── 1. Orbiting rings (behind orb) ─────────────────────────────────────
      const drawRing = (
        radiusX: number, radiusY: number,
        tilt: number, rotSpeed: number,
        color: string, alpha: number, lineW: number
      ) => {
        const a = alpha * (1 - explodeProg * 0.8)
        if (a <= 0) return
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(tilt + t * rotSpeed)
        ctx.beginPath()
        ctx.ellipse(0, 0, radiusX * (1 + explodeProg * 2), radiusY * (1 + explodeProg * 2), 0, 0, Math.PI * 2)
        ctx.strokeStyle = color
        ctx.globalAlpha = a
        ctx.lineWidth = lineW
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.restore()
      }

      const orbRadius = 70 + prog * 30
      drawRing(orbRadius + 40, orbRadius * 0.35 + 15, 0.45, 0.2, '#FF6A00', 0.3, 1)
      drawRing(orbRadius + 55, orbRadius * 0.3 + 20, 0.9, -0.15, '#00b4ff', 0.12, 0.7)
      drawRing(orbRadius + 30, orbRadius * 0.25 + 10, -0.3, 0.25, '#FF3D00', 0.08, 0.5)

      // ── 2. Wireframe icosahedron shell ─────────────────────────────────────
      const shellAlpha = (0.04 + prog * 0.12) * (1 - explodeProg)
      if (shellAlpha > 0.005) {
        const shellRadius = orbRadius + 20 + explodeProg * 80
        ctx.save()
        ctx.globalAlpha = shellAlpha
        ctx.strokeStyle = '#FF6A00'
        ctx.lineWidth = 0.6
        for (const [a, b] of ICO_EDGES) {
          const va = rotateX(rotateY(icoVerts[a], t * 0.3), t * 0.2)
          const vb = rotateX(rotateY(icoVerts[b], t * 0.3), t * 0.2)
          // Simple perspective projection
          const pza = 2.5 / (2.5 + va[2])
          const pzb = 2.5 / (2.5 + vb[2])
          ctx.beginPath()
          ctx.moveTo(cx + va[0] * shellRadius * pza, cy + va[1] * shellRadius * pza)
          ctx.lineTo(cx + vb[0] * shellRadius * pzb, cy + vb[1] * shellRadius * pzb)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        ctx.restore()
      }

      // ── 3. Morphing blob orb ───────────────────────────────────────────────
      if (explodeProg < 0.95) {
        const noiseScale = 1.5 + prog * 1.0
        const noiseAmp = 0.12 + prog * 0.25
        const blobAlpha = 1 - explodeProg

        // Inner glow
        const glowR = orbRadius * (1.4 + explodeProg * 0.5)
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
        glow.addColorStop(0, `rgba(255, 106, 0, ${0.15 * (0.6 + prog * 0.4) * blobAlpha})`)
        glow.addColorStop(0.4, `rgba(255, 60, 0, ${0.06 * blobAlpha})`)
        glow.addColorStop(1, 'rgba(255, 60, 0, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2)

        // Draw morphing blob shape
        ctx.save()
        ctx.globalAlpha = blobAlpha
        ctx.beginPath()
        for (let i = 0; i <= BLOB_SEGMENTS; i++) {
          const a = blobAngles[i % BLOB_SEGMENTS]
          const nx = Math.cos(a) * noiseScale + t * 0.5
          const ny = Math.sin(a) * noiseScale + t * 0.35
          const n = noise2D(nx, ny)
          const r = orbRadius * (1 + n * noiseAmp) * (1 + explodeProg * 0.3)
          const px = cx + Math.cos(a) * r
          const py = cy + Math.sin(a) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        // Gradient fill — dark metallic with orange highlights
        const blobGrad = ctx.createRadialGradient(
          cx - orbRadius * 0.3, cy - orbRadius * 0.3, 0,
          cx, cy, orbRadius * 1.3
        )
        blobGrad.addColorStop(0, '#2a2a2a')
        blobGrad.addColorStop(0.5, '#1a1a1a')
        blobGrad.addColorStop(0.8, '#111')
        blobGrad.addColorStop(1, '#0a0a0a')
        ctx.fillStyle = blobGrad
        ctx.fill()

        // Orange rim light on blob edge
        ctx.strokeStyle = `rgba(255, 106, 0, ${0.15 + prog * 0.25})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Specular highlight
        const specGrad = ctx.createRadialGradient(
          cx - orbRadius * 0.25, cy - orbRadius * 0.3, 0,
          cx - orbRadius * 0.1, cy - orbRadius * 0.15, orbRadius * 0.5
        )
        specGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 * blobAlpha})`)
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = specGrad
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.restore()

        // Surface noise detail (subtle grain on the blob)
        if (explodeProg < 0.3) {
          ctx.save()
          ctx.globalAlpha = 0.06 * (1 - explodeProg * 3)
          ctx.globalCompositeOperation = 'lighter'
          for (let i = 0; i < 40; i++) {
            const a = blobAngles[i * 3 % BLOB_SEGMENTS]
            const r2 = orbRadius * (0.3 + Math.random() * 0.6)
            const px = cx + Math.cos(a + t * 0.1) * r2
            const py = cy + Math.sin(a + t * 0.1) * r2
            ctx.beginPath()
            ctx.arc(px, py, Math.random() * 2 + 0.5, 0, Math.PI * 2)
            ctx.fillStyle = '#FF6A00'
            ctx.fill()
          }
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1
          ctx.restore()
        }
      }

      // ── 4. Floating particles ──────────────────────────────────────────────
      ctx.save()
      for (const p of particles) {
        p.angle += p.speed
        const explodeRadius = isExplode ? p.vr * easeExplode * 200 : 0
        const r = p.radius + explodeRadius
        const px = cx + Math.cos(p.angle) * r
        const py = cy + Math.sin(p.angle) * r * 0.6 // squish Y for pseudo-3D

        const alpha = p.opacity * (1 - explodeProg * 0.7)
        if (alpha <= 0) continue

        // Particle glow
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 106, 0, ${alpha})`
        ctx.shadowColor = '#FF6A00'
        ctx.shadowBlur = 4
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.restore()

      // ── 5. Explode flash ───────────────────────────────────────────────────
      if (explodeProg > 0 && explodeProg < 0.4) {
        const flashAlpha = (1 - explodeProg / 0.4) * 0.3
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbRadius * 2)
        flashGrad.addColorStop(0, `rgba(255, 140, 40, ${flashAlpha})`)
        flashGrad.addColorStop(0.5, `rgba(255, 80, 0, ${flashAlpha * 0.3})`)
        flashGrad.addColorStop(1, 'rgba(255, 60, 0, 0)')
        ctx.fillStyle = flashGrad
        ctx.fillRect(0, 0, W, H)
      }

      // ── 6. Data stream lines (web3 aesthetic) ──────────────────────────────
      ctx.save()
      ctx.globalAlpha = 0.04 + prog * 0.03
      ctx.strokeStyle = '#FF6A00'
      ctx.lineWidth = 0.5
      for (let i = 0; i < 6; i++) {
        const yOffset = (t * 30 + i * 120) % H
        ctx.beginPath()
        ctx.setLineDash([2, 8 + Math.sin(t + i) * 4])
        ctx.moveTo(0, yOffset)
        ctx.lineTo(W, yOffset)
        ctx.stroke()
      }
      ctx.setLineDash([])
      ctx.globalAlpha = 1
      ctx.restore()
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const cleanup = initCanvas()
    return () => cleanup?.()
  }, [initCanvas])

  const displayProgress = Math.floor(progress)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px) brightness(2)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Canvas 2D — replaces Three.js */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0"
            style={{ display: 'block' }}
          />

          {/* HUD overlay */}
          <div className="relative z-30 flex flex-col items-center pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-baseline gap-1"
            >
              <span
                className="text-[72px] md:text-[96px] font-black tabular-nums leading-none tracking-tighter"
                style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255, 106, 0, 0.7)' }}
              >
                {String(displayProgress).padStart(2, '0')}
              </span>
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255, 106, 0, 0.5)' }}
              >
                %
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-white/25"
            >
              {progress < 30
                ? 'INITIALIZING SYSTEM'
                : progress < 60
                  ? 'LOADING MODULES'
                  : progress < 90
                    ? 'PREPARING INTERFACE'
                    : 'LAUNCHING'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-6 w-[200px] md:w-[280px] h-[1px] bg-white/10 relative overflow-hidden"
            >
              <motion.div
                className="absolute left-0 top-0 h-full bg-[#ff6a00]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#ff6a00]"
                style={{
                  left: `${progress}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px 2px rgba(255, 106, 0, 0.6)',
                }}
              />
            </motion.div>
          </div>

          {/* Corner HUD brackets */}
          <HudCorner position="top-left" />
          <HudCorner position="top-right" />
          <HudCorner position="bottom-left" />
          <HudCorner position="bottom-right" />

          {/* System info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 md:bottom-8 left-4 md:left-10 z-30 pointer-events-none select-none"
          >
            <p className="text-[9px] font-mono uppercase tracking-widest text-white/15">
              SYS.RAFLUX v2.0
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 md:bottom-8 right-4 md:right-10 z-30 pointer-events-none select-none"
          >
            <p className="text-[9px] font-mono uppercase tracking-widest text-white/15">
              DECENTRALIZED RAFFLE PROTOCOL
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Corner bracket decorations buat HUD feel
function HudCorner({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const paths: Record<string, string> = {
    'top-left': 'M0 12V0H12',
    'top-right': 'M40 12V0H28',
    'bottom-left': 'M0 28V40H12',
    'bottom-right': 'M40 28V40H28',
  }
  const posClasses: Record<string, string> = {
    'top-left': 'top-3 left-3 md:top-6 md:left-6',
    'top-right': 'top-3 right-3 md:top-6 md:right-6',
    'bottom-left': 'bottom-3 left-3 md:bottom-6 md:left-6',
    'bottom-right': 'bottom-3 right-3 md:bottom-6 md:right-6',
  }

  return (
    <div className={`absolute ${posClasses[position]} z-30 pointer-events-none`}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d={paths[position]} stroke="rgba(255,106,0,0.2)" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default LoadingScreen