# Raflux Landing Page

Landing page buat Raflux — platform raffle terdesentralisasi di Base Chain. Dibangun dari desain original, di-slice jadi production-ready Next.js app, dan di-enhance dengan animasi futuristik + Three.js interactivity.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-r183-black)

## Highlights

### Three.js & WebGL
- **Loading screen 3D** — morphing sphere yang makin distort seiring progress, lalu **MELEDAK jadi particles** saat selesai loading
- **Hero shader canvas** — real-time GLSL fluid gradient yang react ke mouse (replace static image)
- **Footer interactive canvas** — texture dengan mouse repulsion, color shift, dan edge glow

### Animasi & Micro-interactions
- **Custom cursor** — dot + ring + trailing particles, glow orange pas hover clickable elements, hidden di mobile
- **Floating background particles** — subtle orange particles yang drift dan flicker di seluruh page
- **Hero stagger entrance** — heading, image, CTA muncul satu-satu dari blur ke fokus
- **Section reveals** — tiap section punya wipe/fade animation saat masuk viewport
- **Button sweep & ripple** — hover bikin color sweep, click bikin ripple effect
- **Product card 3D tilt** — mouse position bikin card miring + shine reflection + glow border
- **Text neon flicker** — "THE FUTURE" heading punya subtle neon glow animation
- **Scroll-driven transforms** — text expand, card flip, horizontal scroll, marquee velocity boost
- **Navbar hide/show** — auto-hide saat scroll down, show saat scroll up, backdrop blur, progress bar

### Accessibility
- **`prefers-reduced-motion`** — semua animasi berat otomatis off kalo user setting reduce motion
- **Semantic HTML** — `<main>`, `<header>`, `<footer>`, `<section>`, `<nav>`
- **Custom cursor** auto-hidden di touch devices

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict, 0 errors)
- **Tailwind CSS 4** + custom CSS animations
- **Framer Motion** — scroll-driven animations, spring physics, drag gestures, stagger variants
- **Three.js** — 3D morphing sphere, GLSL shaders, interactive canvas, particles
- **Lenis** — smooth scrolling

## Setup & Run

```bash
git clone <repo-url>
cd raflux
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```

## Folder Structure

```
app/
├── components/
│   ├── cards/          # ProductCard (3D tilt), ProductAltCard, ProductGrid
│   ├── effects/        # RandomizedTextEffect, CharacterFadeEffect, TypingEffect
│   ├── layout/         # NavBar (hide/show/blur), SmoothScrolling, Taglines
│   ├── sections/       # All main sections (Loading, Footer, CardSwipe, dll)
│   └── ui/             # Marquee, CustomCursor, BackgroundParticles,
│                         FuturisticButton, SectionReveal, HeroShaderCanvas
├── data/               # Dummy data & config constants
├── hooks/              # useCountdown, useReducedMotion
├── lib/                # utils, noise generator
├── types/              # TypeScript type definitions
├── globals.css         # CSS variables, custom keyframes, reduced motion
├── layout.tsx          # Root layout
└── page.tsx            # Homepage (all sections orchestrated)
```

### Kenapa strukturnya kayak gini?

- **`components/`** di-split berdasarkan fungsi — bukan flat file, biar gampang dicari
- **`ui/`** buat reusable primitives yang bisa dipake di project lain
- **`effects/`** text animation effects yang composable
- **`hooks/`** custom hooks (`useCountdown`, `useReducedMotion`)
- **`lib/`** pure functions tanpa React dependency
- Tiap folder punya barrel export (`index.ts`)

## Animations & Interactions

| Feature | Teknik | File |
|---|---|---|
| 3D morphing sphere + explosion | Three.js + noise displacement + vertex velocity | `LoadingScreen.tsx` |
| Hero shader fluid | GLSL fragment shader + simplex noise + mouse ripple | `HeroShaderCanvas.tsx` |
| Interactive footer canvas | Three.js shader + brush mask + color shift + repulsion | `AbstractCanvas.tsx` |
| Custom cursor | Framer Motion spring + trail particles | `CustomCursor.tsx` |
| Background particles | Canvas 2D + RAF + scroll parallax | `BackgroundParticles.tsx` |
| Hero stagger entrance | Framer Motion variants + staggerChildren + blur | `page.tsx` |
| Section reveal | InView + translate + blur transition | `SectionReveal.tsx` |
| Navbar hide/show | useMotionValueEvent + scrollY tracking | `NavBar.tsx` |
| Card 3D tilt | Mouse position → rotateX/Y + shine gradient | `ProductCard.tsx` |
| Button sweep + ripple | CSS translate + Framer Motion scale | `FuturisticButton.tsx` |
| Text scramble | Character swap with pool sampling | `RandomizedTextEffect.tsx` |
| Expanding text | Scroll-driven padding animation | `ExpandingTextSection.tsx` |
| Card fan → flip | Scroll-driven transform + rotateY 180° | `CardSwipeSection.tsx` |
| Horizontal scroll | Vertical scroll → translateX mapping | `HorizontalScrollSection.tsx` |
| Draggable carousel | Framer Motion drag + spring constraints | `RaffleCarousel.tsx` |
| Neon text flicker | CSS keyframe animation | `globals.css` |
| Scroll progress bar | useScroll + useTransform → width | `NavBar.tsx` |

## Performance Notes

- Three.js scenes cleanup proper di `useEffect` return — gak ada memory leak
- Background particles pake Canvas 2D (bukan Three.js) biar lightweight
- Custom cursor di-skip di touch devices
- `prefers-reduced-motion` respected secara global
- Lenis smooth scroll init di root level
- Font Kode Mono di-load via `next/font` (optimized)

## Deploy

```bash
npx vercel
```

Atau connect repo ke Vercel dashboard. Gak perlu env vars atau config tambahan.
