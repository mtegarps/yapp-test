'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { createNoise } from '@/app/lib/noise'

/**
 * Loading screen dengan sphere 3D yang morph organic.
 * Sphere-nya makin gede dan makin distort seiring progress naik.
 * Ada juga orbiting ring, floating particles, dan scanline overlay
 * biar vibes-nya futuristik.
 */
const LoadingScreen = ({ onFinished }: { onFinished?: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExploding, setIsExploding] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const animRef = useRef<number>(0)
  const explodeRef = useRef(false)

  useEffect(() => { progressRef.current = progress }, [progress])
  useEffect(() => { explodeRef.current = isExploding }, [isExploding])

  // Progress counter — speed-nya variable biar ada feel "loading"
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // Trigger explode dulu sebelum fade out
          setIsExploding(true)
          setTimeout(() => {
            setIsVisible(false)
            onFinished?.()
          }, 1200) // Kasih waktu buat explode animation
          return 100
        }
        const remaining = 100 - prev
        const increment = remaining > 30 ? 1.2 : remaining > 10 ? 0.6 : 1.5
        return Math.min(prev + increment, 100)
      })
    }, 35)
    return () => clearInterval(interval)
  }, [onFinished])

  const initScene = useCallback(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight
    const noise = createNoise()

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)

    // Lighting setup
    scene.add(new THREE.AmbientLight(0x222222, 1))
    const mainLight = new THREE.PointLight(0xff6a00, 3, 20)
    mainLight.position.set(3, 3, 4)
    scene.add(mainLight)
    const rimLight = new THREE.PointLight(0x00b4ff, 2, 15)
    rimLight.position.set(-4, -2, 3)
    scene.add(rimLight)
    const topLight = new THREE.PointLight(0xff3d00, 1.5, 12)
    topLight.position.set(0, 5, 2)
    scene.add(topLight)

    // Morphing blob sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 64)
    const originalPositions = sphereGeo.attributes.position.array.slice() as Float32Array
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
      emissive: new THREE.Color(0xff6a00),
      emissiveIntensity: 0.05,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // Wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(1.6, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff6a00, wireframe: true, transparent: true, opacity: 0.08,
    })
    const wireShell = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireShell)

    // Orbiting rings
    const ringGeo = new THREE.TorusGeometry(2.0, 0.008, 8, 128)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.35 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI * 0.45
    scene.add(ring)

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.005, 8, 128)
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00b4ff, transparent: true, opacity: 0.15 })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI * 0.6
    ring2.rotation.y = Math.PI * 0.3
    scene.add(ring2)

    // Floating particles
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.0 + Math.random() * 2.5
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePositions[i * 3 + 2] = r * Math.cos(phi)
      particleSizes[i] = Math.random() * 2 + 0.5
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
    const particleMat = new THREE.PointsMaterial({
      color: 0xff6a00, size: 0.02, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Env map
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128)
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)
    scene.add(cubeCamera)
    sphereMat.envMap = cubeRenderTarget.texture

    const clock = new THREE.Clock()
    let envUpdated = false
    let explodeStartTime = 0
    // Store velocity per-vertex buat explosion
    const velocities = new Float32Array(originalPositions.length)
    for (let i = 0; i < velocities.length; i += 3) {
      const ox = originalPositions[i], oy = originalPositions[i + 1], oz = originalPositions[i + 2]
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
      // Arah explosion = dari center ke luar + sedikit random
      velocities[i] = (ox / len) * (2 + Math.random() * 3)
      velocities[i + 1] = (oy / len) * (2 + Math.random() * 3)
      velocities[i + 2] = (oz / len) * (2 + Math.random() * 3)
    }

    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const prog = progressRef.current / 100
      const isExplode = explodeRef.current

      // Handle explosion state
      if (isExplode && explodeStartTime === 0) {
        explodeStartTime = t
        // Switch ke wireframe buat dramatic effect
        sphereMat.wireframe = true
        sphereMat.opacity = 0.8
        sphereMat.transparent = true
      }

      const explodeProgress = explodeStartTime > 0 ? Math.min((t - explodeStartTime) / 1.0, 1) : 0

      // Morph blob dengan noise displacement
      const positions = sphereGeo.attributes.position.array as Float32Array
      const noiseScale = 1.2 + prog * 0.8
      const noiseAmp = 0.15 + prog * 0.35
      const timeSpeed = t * 0.6

      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i]
        const oy = originalPositions[i + 1]
        const oz = originalPositions[i + 2]
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
        const nx = ox / len, ny = oy / len, nz = oz / len
        const n = noise(
          nx * noiseScale + timeSpeed,
          ny * noiseScale + timeSpeed * 0.7,
          nz * noiseScale + timeSpeed * 0.5
        )
        const displacement = 1 + n * noiseAmp

        if (explodeProgress > 0) {
          // Explosion! Vertices fly outward
          const easeExplode = 1 - Math.pow(1 - explodeProgress, 3) // ease-out cubic
          positions[i] = ox * displacement + velocities[i] * easeExplode
          positions[i + 1] = oy * displacement + velocities[i + 1] * easeExplode
          positions[i + 2] = oz * displacement + velocities[i + 2] * easeExplode
        } else {
          positions[i] = ox * displacement
          positions[i + 1] = oy * displacement
          positions[i + 2] = oz * displacement
        }
      }
      sphereGeo.attributes.position.needsUpdate = true
      sphereGeo.computeVertexNormals()

      const scale = 0.6 + prog * 0.5
      sphere.scale.setScalar(explodeProgress > 0 ? scale * (1 + explodeProgress * 0.5) : scale)
      sphereMat.emissiveIntensity = 0.03 + prog * 0.2 + explodeProgress * 1.0
      sphereMat.opacity = explodeProgress > 0 ? 0.8 * (1 - explodeProgress) : 1

      sphere.rotation.y = t * 0.15
      sphere.rotation.x = Math.sin(t * 0.1) * 0.2
      wireShell.rotation.y = -t * 0.08
      wireShell.rotation.z = t * 0.05
      wireMat.opacity = explodeProgress > 0
        ? (0.04 + prog * 0.12) * (1 - explodeProgress)
        : 0.04 + prog * 0.12
      ring.rotation.z = t * 0.2
      ring2.rotation.z = -t * 0.15
      ring2.rotation.x = Math.PI * 0.6 + Math.sin(t * 0.3) * 0.1

      // Particles expand outward saat explode
      if (explodeProgress > 0) {
        const pPos = particleGeo.attributes.position.array as Float32Array
        for (let i = 0; i < pPos.length; i += 3) {
          pPos[i] *= 1 + explodeProgress * 0.03
          pPos[i + 1] *= 1 + explodeProgress * 0.03
          pPos[i + 2] *= 1 + explodeProgress * 0.03
        }
        particleGeo.attributes.position.needsUpdate = true
        particleMat.opacity = 0.6 * (1 - explodeProgress * 0.8)
      }

      particles.rotation.y = t * 0.05
      particles.rotation.x = Math.sin(t * 0.08) * 0.1
      mainLight.position.x = 3 + Math.sin(t * 0.5) * 1
      mainLight.position.y = 3 + Math.cos(t * 0.4) * 1
      rimLight.position.x = -4 + Math.sin(t * 0.3) * 1.5

      // Flash of light saat explode
      if (explodeProgress > 0 && explodeProgress < 0.3) {
        mainLight.intensity = 3 + (1 - explodeProgress / 0.3) * 10
      }

      if (!envUpdated && t > 0.1) {
        sphere.visible = false
        cubeCamera.position.copy(sphere.position)
        cubeCamera.update(renderer, scene)
        sphere.visible = true
        envUpdated = true
      }

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
      sphereGeo.dispose(); sphereMat.dispose()
      wireGeo.dispose(); wireMat.dispose()
      ringGeo.dispose(); ringMat.dispose()
      ring2Geo.dispose(); ring2Mat.dispose()
      particleGeo.dispose(); particleMat.dispose()
      cubeRenderTarget.dispose(); renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const cleanup = initScene()
    return () => cleanup?.()
  }, [initScene])

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

          {/* Three.js canvas */}
          <div ref={mountRef} className="absolute inset-0 z-0" />

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
