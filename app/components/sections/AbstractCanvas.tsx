'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

/**
 * Interactive canvas pakai Three.js.
 * Texture-nya perlahan gerak (wave distortion),
 * dan pas mouse hover ada efek "brush" gelap
 * yang perlahan fade back ke gambar asli.
 */
export default function AbstractCanvas({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  const init = useCallback(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0b0b)
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10)
    camera.position.z = 1

    // Brush canvas 2D buat mask
    const aspect = width / height
    const brushH = 512
    const brushW = Math.round(brushH * aspect)
    const brushCanvas = document.createElement('canvas')
    brushCanvas.width = brushW
    brushCanvas.height = brushH
    const brushCtx = brushCanvas.getContext('2d')!
    brushCtx.fillStyle = 'black'
    brushCtx.fillRect(0, 0, brushW, brushH)
    const brushTexture = new THREE.CanvasTexture(brushCanvas)

    const loader = new THREE.TextureLoader()
    const imageTexture = loader.load('/abstract2.png', tex => {
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
    })

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: imageTexture },
        uBrush: { value: brushTexture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTexture;
        uniform sampler2D uBrush;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;

          // Mouse repulsion — texture "kabur" dari cursor
          if (uMouse.x > 0.0) {
            vec2 mouseUv = uMouse;
            vec2 diff = uv - mouseUv;
            float dist = length(diff);
            float repulsion = exp(-dist * 8.0) * 0.03;
            uv += normalize(diff) * repulsion;
          }

          // Wave distortion yang lebih organic
          float wave1 = sin(uv.x * 3.0 + uTime * 0.4) * 0.006;
          float wave2 = cos(uv.y * 4.0 + uTime * 0.3) * 0.005;
          float wave3 = sin((uv.x + uv.y) * 2.5 + uTime * 0.25) * 0.004;
          float wave4 = cos(uv.x * 5.0 - uTime * 0.2) * 0.003;
          vec2 distortedUv = uv + vec2(wave1 + wave3, wave2 + wave4);

          vec4 texColor = texture2D(uTexture, distortedUv);

          // Color shift over time — gradual hue rotation
          float shift = sin(uTime * 0.1) * 0.15;
          mat3 colorShift = mat3(
            1.0, shift * 0.3, 0.0,
            0.0, 1.0, shift * 0.2,
            shift * 0.1, 0.0, 1.0
          );
          texColor.rgb = colorShift * texColor.rgb;

          // Brush mask
          vec4 brushColor = texture2D(uBrush, vUv);
          float mask = brushColor.r;

          // Edge glow pas dekat border canvas
          float edgeGlow = smoothstep(0.0, 0.08, vUv.x) *
                           smoothstep(0.0, 0.08, 1.0 - vUv.x) *
                           smoothstep(0.0, 0.15, vUv.y) *
                           smoothstep(0.0, 0.15, 1.0 - vUv.y);
          vec3 glowColor = vec3(1.0, 0.45, 0.0) * (1.0 - edgeGlow) * 0.08;

          vec3 darkColor = vec3(0.043, 0.043, 0.043);
          vec3 finalColor = mix(darkColor, texColor.rgb, mask) + glowColor;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    })

    const geometry = new THREE.PlaneGeometry(1, 1)
    scene.add(new THREE.Mesh(geometry, material))

    let mouseX = -1, mouseY = -1, isHovering = false
    const fadeSpeed = 4

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / rect.width
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height
      isHovering = true
      material.uniforms.uMouse.value.set(mouseX, mouseY)
    }
    const onMouseLeave = () => { isHovering = false; mouseX = -1; mouseY = -1 }
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const rect = container.getBoundingClientRect()
      mouseX = (touch.clientX - rect.left) / rect.width
      mouseY = 1.0 - (touch.clientY - rect.top) / rect.height
      isHovering = true
      material.uniforms.uMouse.value.set(mouseX, mouseY)
    }
    const onTouchEnd = () => { isHovering = false; mouseX = -1; mouseY = -1 }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd)

    const clock = new THREE.Clock()
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      material.uniforms.uTime.value = clock.getElapsedTime()

      if (isHovering && mouseX >= 0 && mouseY >= 0) {
        const bx = mouseX * brushW
        const by = (1.0 - mouseY) * brushH
        const radius = 40
        const gradient = brushCtx.createRadialGradient(bx, by, 0, bx, by, radius)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.35)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        brushCtx.fillStyle = gradient
        brushCtx.beginPath()
        brushCtx.arc(bx, by, radius, 0, Math.PI * 2)
        brushCtx.fill()
      }

      brushCtx.fillStyle = `rgba(255, 255, 255, ${0.008 * fadeSpeed})`
      brushCtx.fillRect(0, 0, brushW, brushH)
      brushTexture.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth, h = container.clientHeight
      renderer.setSize(w, h)
      material.uniforms.uResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
      geometry.dispose(); material.dispose()
      imageTexture.dispose(); brushTexture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const cleanup = init()
    return () => cleanup?.()
  }, [init])

  return (
    <div
      ref={mountRef}
      className={`w-full cursor-crosshair ${className}`}
      style={{ height: '210px' }}
    />
  )
}
