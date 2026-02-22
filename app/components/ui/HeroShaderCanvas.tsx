'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

/**
 * Shader-based fluid gradient buat hero section.
 * Replace static abstract2.png dengan animated shader
 * yang morph warna organik terus-menerus.
 * Mouse interaction bikin distortion ripple.
 */
export default function HeroShaderCanvas({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  const init = useCallback(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10)
    camera.position.z = 1

    let mouseX = 0.5, mouseY = 0.5

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Simplex-ish noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.15;

          // Mouse distortion
          float dist = distance(uv, uMouse);
          float ripple = sin(dist * 30.0 - uTime * 3.0) * exp(-dist * 5.0) * 0.02;
          uv += ripple;

          // Layer noise buat organic feel
          float n1 = snoise(vec3(uv * 2.0, t)) * 0.5 + 0.5;
          float n2 = snoise(vec3(uv * 4.0 + 100.0, t * 1.3)) * 0.5 + 0.5;
          float n3 = snoise(vec3(uv * 8.0 + 200.0, t * 0.7)) * 0.5 + 0.5;

          // Color palette — dark base dengan aksen orange dan deep purple
          vec3 darkBg = vec3(0.043, 0.043, 0.043);       // #0B0B0B
          vec3 orange = vec3(1.0, 0.45, 0.0);              // #FF7300
          vec3 deepOrange = vec3(0.63, 0.25, 0.05);        // #A1400C
          vec3 purple = vec3(0.15, 0.05, 0.25);
          vec3 darkSurface = vec3(0.09, 0.086, 0.086);     // #171616

          // Mix warna berdasarkan noise layers
          vec3 col = darkBg;
          col = mix(col, darkSurface, n1 * 0.6);
          col = mix(col, deepOrange, pow(n2, 3.0) * 0.4);
          col = mix(col, orange, pow(n3, 5.0) * 0.3);
          col = mix(col, purple, pow(1.0 - n1, 4.0) * 0.2);

          // Subtle vignette
          float vig = 1.0 - pow(distance(vUv, vec2(0.5)) * 1.2, 2.0);
          col *= vig;

          // Scanline super subtle
          float scanline = sin(vUv.y * uResolution.y * 1.5) * 0.5 + 0.5;
          col *= 0.98 + scanline * 0.02;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })

    const geometry = new THREE.PlaneGeometry(1, 1)
    scene.add(new THREE.Mesh(geometry, material))

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / rect.width
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height
    }
    container.addEventListener('mousemove', onMouseMove)

    const clock = new THREE.Clock()
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      material.uniforms.uTime.value = clock.getElapsedTime()
      material.uniforms.uMouse.value.set(mouseX, mouseY)
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
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const cleanup = init()
    return () => cleanup?.()
  }, [init])

  return (
    <div ref={mountRef} className={`w-full h-full ${className}`} />
  )
}
