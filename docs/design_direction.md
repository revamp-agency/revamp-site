# Design Direction — Revamp

Based on 8 reference sites + 5 visual reference images. This document defines every visual decision for the build phase. **If it's not in here, it's not on the site.**

---

## 1. Overall aesthetic

**One sentence:** Dark, cinematic, high-animation agency site that feels like a film title sequence — bold typography, scroll-driven storytelling, interactive cursor effects, and glassmorphism UI elements with warm accent glows.

**Vibe keywords:** futuristic, immersive, cinematic, bold, premium, tactile, confident

**Animation intensity: 4 out of 5.** Close to Active Theory / Zentry territory — every section has motion, scroll-driven transitions are layered, cursor interactions are present — but we stop short of full WebGL scenes that tank mobile performance. The site should feel alive without feeling like a tech demo.

**What we are NOT:** minimal/flat (no Linear aesthetic), playful/quirky (no illustrations or emojis), corporate (no stock photos of handshakes), template-looking (no generic SaaS dashboard feel).

---

## 2. Color palette

### Dark theme (default)

| Role | Color | Hex | Notes |
|---|---|---|---|
| Background primary | Near-black | `#0A0A0A` | Not pure black — slightly warm to feel premium, not void |
| Background secondary | Dark charcoal | `#141414` | Cards, elevated surfaces, nav |
| Background tertiary | Soft charcoal | `#1E1E1E` | Hover states, subtle section differentiation |
| Text primary | Off-white | `#F5F5F5` | Headlines and body — not pure white, reduces glare |
| Text secondary | Muted gray | `#8A8A8A` | Subheads, captions, supporting text |
| Text tertiary | Dark gray | `#555555` | Placeholder text, disabled states |
| Accent primary | Warm amber | `#F59E0B` | CTAs, highlights, interactive elements, the "glow" |
| Accent glow | Soft orange | `#F97316` | Background glow effects, gradient blends with amber |
| Glass border | White 10% | `rgba(255,255,255,0.10)` | Glassmorphism card borders |
| Glass fill | White 5% | `rgba(255,255,255,0.05)` | Glassmorphism card backgrounds |

### Light theme (toggle option)

| Role | Color | Hex |
|---|---|---|
| Background primary | Warm white | `#FAFAFA` |
| Background secondary | Light gray | `#F0F0F0` |
| Text primary | Near-black | `#0A0A0A` |
| Text secondary | Medium gray | `#6B6B6B` |
| Accent primary | Warm amber (same) | `#F59E0B` |
| Accent glow | Soft orange (same) | `#F97316` |

### Why warm amber/orange as the accent

Drawn from the reference images — the glassmorphism card (glasseffecttab.jpeg) uses a warm amber glow behind frosted glass, and the cleanmodern.jpeg uses a bold blue BUT the overall references lean warmer and more inviting. Amber is:
- Distinctive (most tech agencies default to blue or green)
- Warm and inviting for non-technical SME owners
- Visible on dark backgrounds without being aggressive
- Associated with innovation, energy, warmth
- Pairs perfectly with glassmorphism effects

### Gradient usage

- **Hero glow:** radial gradient of accent primary → accent glow → transparent, positioned off-center behind hero content
- **Section transitions:** very subtle background color shifts between `#0A0A0A` and `#141414` on scroll (ref: Anton & Irene)
- **Hover states:** subtle amber glow bleeds from interactive elements

---

## 3. Typography

### Font pairing

| Role | Font | Source | Weight range | Fallback |
|---|---|---|---|---|
| **Display / Headlines** | **Cabinet Grotesk** | Fontshare (free) | Bold (700), ExtraBold (800), Black (900) | system-ui, sans-serif |
| **Body / UI** | **Satoshi** | Fontshare (free) | Regular (400), Medium (500), Bold (700) | system-ui, sans-serif |

### Why this pairing

- **Cabinet Grotesk** is a geometric grotesque with personality — wide letterforms, slightly quirky "a" and "g", feels modern and bold without being generic. When set large (80-120px+), it delivers the cinematic oversized typography referenced from Zentry. It's confident and readable.
- **Satoshi** is its perfect body companion — clean, geometric, excellent x-height, beautiful at small sizes, widely used by modern agencies. Bridges the gap between being professional enough for SME trust and modern enough for the aesthetic.
- Both are from **Fontshare** = genuinely free for commercial use, no licensing headaches.
- Neither is overused (unlike Inter/Geist which are everywhere in 2025-26).

### Type scale

| Element | Font | Size (desktop) | Size (mobile) | Weight | Letter spacing |
|---|---|---|---|---|---|
| Hero headline | Cabinet Grotesk | 96-120px | 48-56px | Black (900) | -0.03em (tight) |
| Section headline | Cabinet Grotesk | 64-80px | 36-44px | ExtraBold (800) | -0.02em |
| Sub-headline | Cabinet Grotesk | 36-48px | 24-28px | Bold (700) | -0.01em |
| Body large | Satoshi | 20px | 18px | Regular (400) | 0em |
| Body | Satoshi | 16px | 16px | Regular (400) | 0em |
| Body small / Caption | Satoshi | 14px | 14px | Medium (500) | 0.01em |
| Button text | Satoshi | 16px | 16px | Bold (700) | 0.02em |
| Nav links | Satoshi | 16px | 16px | Medium (500) | 0.01em |
| Overline / Label | Satoshi | 12-13px | 12px | Bold (700) | 0.08em (wide), uppercase |

### Typography rules

- Headlines are **always tight-tracked** (negative letter-spacing). This is what makes them feel cinematic vs. default.
- Body text has **generous line-height** (1.6-1.7) for readability — our audience is non-technical, they need breathing room.
- **One headline per section.** No stacking of H2 + H3 + subtitle + description in a hierarchy soup.
- **Oversized numbers** (€200, 10, 7 giorni) get display treatment — Cabinet Grotesk Black, 80px+, used as visual anchors.
- **Embossed / ghost text** in the background (ref: glasseffecttab.jpeg) — very large (200px+), very low opacity (5-8%), used sparingly as texture, not readable content.

---

## 4. Spacing & layout

### Grid

- **12-column grid** on desktop, 4-column on mobile
- **Max content width:** 1440px, centered
- **Edge padding:** 80px desktop, 24px mobile
- **Section vertical spacing:** 160px desktop, 80px mobile (generous — let each section breathe)
- **Component gap (within sections):** 48px desktop, 32px mobile

### Rhythm rules

- Sections alternate between **full-width immersive** (hero, price shock, founding clients, final CTA) and **contained grid** (services, process, FAQ)
- Full-width sections bleed to viewport edges with background color/gradient
- Contained sections live within the 1440px max-width
- Every section gets at least **80px of vertical breathing room** on mobile — no cramped stacking

---

## 5. Component vocabulary

### Cards (services grid, FAQ, features)

- **Style:** Glassmorphism on dark theme
- **Background:** `rgba(255,255,255,0.05)` with `backdrop-filter: blur(12px)`
- **Border:** 1px solid `rgba(255,255,255,0.10)`
- **Border radius:** 16px (large, rounded — ref: boxesmoderndesign.jpeg)
- **Padding:** 32px
- **Hover state:** border brightens to `rgba(255,255,255,0.20)`, subtle amber glow appears as box-shadow (`0 0 40px rgba(245,158,11,0.08)`)
- **On light theme:** white cards with subtle shadow instead of glass effect

### Buttons

- **Primary CTA:** solid amber background (`#F59E0B`), near-black text (`#0A0A0A`), 12px border-radius, 16px 32px padding, Satoshi Bold 16px. Hover: slight scale (1.02) + glow.
- **Secondary CTA:** transparent background, 1px white/10% border, white text. Hover: background fills to white/5%.
- **Ghost / text link:** no background, no border, text with arrow (→). Hover: text shifts right 4px.
- **All buttons:** 48px minimum height for touch targets on mobile

### Navigation

- **Desktop:** fixed top bar, transparent on hero, transitions to `#0A0A0A/90%` with backdrop-blur on scroll. Logo left, links center, CTA right, language toggle right.
- **Mobile:** hamburger icon → full-screen overlay menu with centered links, ambient background glow, smooth open/close animation.
- **Active link indicator:** subtle amber underline, 2px, with animated width transition.

### Forms

- **Style:** dark input fields with glass border (ref: glasseffecttab.jpeg)
- **Input background:** `rgba(255,255,255,0.05)`
- **Input border:** 1px solid `rgba(255,255,255,0.10)`, brightens on focus to `rgba(245,158,11,0.50)` (amber focus ring)
- **Border radius:** 12px
- **Label:** Satoshi Medium 14px, above field
- **Placeholder:** `#555555`
- **Submit button:** primary CTA style

### FAQ accordion

- **Closed state:** question text + subtle "+" icon
- **Open state:** "+" rotates to "×", answer slides down with smooth height animation
- **Divider:** 1px `rgba(255,255,255,0.08)` between items
- **No outer border/background on the accordion items** — keep it clean and editorial

---

## 6. Animation language

### Global animation principles

1. **Everything enters from below or from opacity 0.** Nothing pops in from the sides. Nothing appears without transition.
2. **Timing:** ease-out curves for entrances, ease-in-out for interactions. Duration: 0.4-0.8s for section reveals, 0.15-0.25s for micro-interactions.
3. **Stagger:** when multiple elements enter (e.g., services grid cards), they stagger with 0.05-0.1s delay between each.
4. **Scroll-driven, not time-driven.** Animations trigger on scroll position via Intersection Observer or Framer Motion `whileInView`, not on page load timers.
5. **Mobile:** reduce animation intensity by ~30%. No parallax on mobile. No cursor effects. Simpler transitions. Performance > spectacle on phones.

### Specific animation patterns (mapped to references)

| Pattern | Where on site | Reference | Implementation |
|---|---|---|---|
| **Hero animation loop** | Hero section background | Locomotive | Full-viewport video/animation asset (produced separately), or falling back to animated gradient with subtle particle motion via canvas/Three.js |
| **Scroll-driven section color shifts** | Between all major sections | Anton & Irene | Background color interpolates between `#0A0A0A` and `#141414` (and occasionally amber-tinted `#1A1408`) based on scroll position. Smooth, not stepped. |
| **Full-page hover reveal on services** | Services grid | Studio Freight | Hovering on a service card triggers a viewport-wide overlay showing expanded details — icon enlarges, description appears, background darkens behind other cards. This is the **signature interaction**. |
| **Cursor-reactive text** | Hero headline | Artefakt | Mouse proximity causes letter-level distortion, glow, or displacement. Implemented via custom shader or canvas overlay. Falls back to simple hover glow on mobile/touch. |
| **Interactive 3D element** | Hero background or "Why Revamp" section | Auros Global | Particle field / dot sphere that responds to cursor movement. Implemented in Three.js or canvas. Keep lightweight — max 500 particles. Invisible on mobile (replaced with static gradient). |
| **Scroll-driven reveals** | Every section entrance | Bending Spoons (quality bar) | Elements fade up (translateY: 30px → 0, opacity: 0 → 1) with stagger. Smooth, polished, consistent. |
| **Number counting** | Price shock section, stats | Zentry | Large numbers (€200, 10 clients) animate from 0 to target value on scroll into view. Duration ~1.5s, ease-out. |
| **Tech stack infinite scroll** | Tech banner section | Common pattern | Logos scroll horizontally in infinite loop, monochrome, subtle. Pauses on hover. |
| **Parallax depth** | Section transitions, large text | Mersi, Zentry | Background elements scroll at 0.5-0.7x speed vs content. Desktop only. |
| **Text color transition on scroll** | Manifesto page, "Why Revamp" | Auros Global | Text starts as `#555555` (dark gray, almost invisible on dark bg), transitions to `#F5F5F5` as it scrolls into center of viewport. Words or lines reveal sequentially. |
| **Embossed ghost text** | Behind hero, behind CTA sections | glasseffecttab.jpeg reference | Ultra-large text (200px+), 5-8% opacity, positioned behind main content as texture. Subtle ambient drift animation (translateY oscillation, 20s loop). |
| **Page transitions** | Between all routes | Studio Freight / Locomotive | Fade + slight upward slide (300ms). Keep fast — users hate slow page transitions. |
| **Loading screen** | First visit only | Zentry | Logo wordmark appears, brief animation (1-2s max), then hero reveals. Don't overdo this — first-visit only, skippable. |
| **Custom cursor** | Desktop only | Artefakt | Small dot (8px) + larger circle follower (32px) with slight delay. Cursor enlarges on hover over interactive elements. Amber color on hover over CTAs. |

### Libraries for implementation

| Library | Purpose | Notes |
|---|---|---|
| **Framer Motion** | Section reveals, page transitions, micro-interactions, stagger | Primary animation library. Use `whileInView`, `AnimatePresence`, `motion` components. |
| **GSAP + ScrollTrigger** | Scroll-driven effects, parallax, number counting, text reveals | For anything scroll-position-dependent. GSAP is more precise than Framer Motion for scroll work. |
| **Lenis** | Smooth scroll | Replaces native scroll with buttery-smooth inertia scrolling. Essential for the cinematic feel. |
| **Three.js** (lightweight) | 3D particle element in hero | Only if hero video isn't used. Keep the scene simple — particles + cursor tracking. |
| **Canvas API** | Cursor-reactive text effect | For the Artefakt-style text distortion. Lighter than Three.js for 2D effects. |

---

## 7. Imagery & media direction

### Photography
- **None.** No stock photos, no team photos (founders section removed), no client photos (no clients yet).
- If photography is ever added later (client case studies), it should be high-contrast, desaturated, with amber color grading.

### Video / motion
- **Hero:** a short (5-10s) looping motion piece — abstract, dark, ambient light, particles or fluid simulation. To be produced separately (After Effects, Cavalry, or AI-generated). If no video is ready at launch, fall back to the Three.js particle scene.
- **No other video on the site.**

### Graphics
- **Abstract gradient glows** as section backgrounds — soft, off-center, organic shapes (not geometric blobs). Think "light leaking through fog."
- **Tech stack logos:** monochrome white, 50% opacity, SVG format from svgl.app
- **Service icons:** Lucide icons library (already in shadcn), white stroke, 24-32px, inside glass cards

### 3D
- **One 3D interactive element max** (the particle sphere in the hero area). Don't overdo 3D — it's a trust/credibility killer if it looks amateurish.

---

## 8. Responsive strategy

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Single column, no parallax, no cursor effects, no 3D particle element, simplified animations |
| Tablet | 768-1024px | 8-column grid, reduced animation, no custom cursor |
| Desktop | 1024-1440px | Full experience |
| Large desktop | > 1440px | Content max-width 1440px, centered, backgrounds extend to viewport edges |

### Mobile-specific rules

- Hero headline drops from 96-120px to 48-56px
- Services grid becomes vertical stack (1 card per row), no hover-reveal interaction — replaced with tap-to-expand
- 3D particle element hidden entirely — replaced with static gradient background
- Cursor effects hidden
- Parallax disabled
- All animations reduced to simple fade-in reveals
- Touch targets minimum 48px
- Bottom CTA bar (fixed, floating) with "Richiedi un preventivo" on scroll — disappears when the inline form is visible

---

## 9. Dark/light theme toggle

- **Default:** dark
- **Toggle:** small icon in the nav bar (sun/moon). Smooth transition (300ms) on all colors simultaneously.
- **Persistence:** save preference in `localStorage`, respect `prefers-color-scheme` on first visit
- **What changes:** backgrounds, text colors, card styles (glass → shadow), border colors
- **What stays the same:** accent amber, fonts, spacing, layout, animations

---

## 10. Accessibility notes

Even with a dark, animation-heavy site, we respect accessibility:
- **Color contrast:** text primary on background primary = 14.5:1 (exceeds AAA). Accent amber on dark bg = 8.2:1 (exceeds AA).
- **Reduced motion:** respect `prefers-reduced-motion` — disable all parallax, transitions, and particle effects. Keep simple fade reveals only.
- **Focus states:** visible amber focus rings on all interactive elements (keyboard navigation)
- **Font sizes:** minimum 16px body, never smaller than 14px for any readable text
- **Alt text:** on all icons and images (even decorative ones get `alt=""`)

---

## 11. Reference map — what comes from where

| Design decision | Primary reference | Secondary reference |
|---|---|---|
| Overall dark cinematic feel | Zentry | cleanmodern.jpeg |
| Glassmorphism cards + forms | glasseffecttab.jpeg | boxesmoderndesign.jpeg |
| Scroll-driven color transitions | Anton & Irene | Auros Global |
| Services hover-reveal interaction | Studio Freight | — |
| Hero video/animation | Locomotive | — |
| Oversized cinematic typography | Zentry | cleanmodern.jpeg |
| Cursor-reactive text | Artefakt | — |
| Interactive 3D particles | Auros Global | — |
| Warm amber accent color | glasseffecttab.jpeg | — |
| Animation polish standard | Bending Spoons | — |
| Scroll-driven image/text reveals | Mersi Architecture | — |
| Split-screen layout option | screendivisionifneeded.jpeg | — |
| Card component style | boxesmoderndesign.jpeg | glasseffecttab.jpeg |
| Full landing page section rhythm | cleanlayout.jpeg | — |
| Embossed ghost text | glasseffecttab.jpeg | Zentry |

---

## 12. Anti-references — what to explicitly avoid

- **Generic SaaS templates** (Tailwind UI defaults, shadcn default cards without customization)
- **Blue accent color** (every tech startup uses it — cleanmodern.jpeg uses blue but we're going amber for differentiation)
- **Stock photography** of any kind
- **Illustrations / cartoon graphics** (not the vibe)
- **Flat design without depth** (we want glass, glow, layers)
- **Slow or heavy loading** (optimize aggressively — the animation richness must not come at the cost of 5+ second load times)
- **Overly complex WebGL** that breaks on mid-tier devices
- **Light mode as default** (dark is the brand identity, light is an option)
