# CLAUDE.md — Project Context for Revamp

**This file is automatically loaded by Claude Code and referenced in Cursor. Read it fully before taking any action in this project.**

---

## What this project is

Revamp is an Italian web development agency building custom-coded websites and digital tools for SMEs (small and medium businesses) at accessible prices. This repo is the agency's own flagship marketing website.

The site itself is both a product and a portfolio: every interaction, animation, and design choice is a silent case study demonstrating what Revamp can build for clients. It must be visibly more impressive than anything target clients have seen, while the copy stays dead simple for non-technical business owners.

**Tagline:** "Costruiamo il futuro digitale delle imprese italiane." (Building the digital future of Italian business.)

---

## Where the context lives

Before building anything, read these docs in the `docs/` folder:

- **`docs/decisions_log.md`** — every locked decision. Brand, pricing, positioning, scope, services. If something contradicts this file, the file wins.
- **`docs/content_master.md`** — all website copy, every page, every section, in Italian and English. The source of truth for text.
- **`docs/design_direction.md`** — colors, typography, animation language, component vocabulary, responsive rules. The source of truth for visuals.
- **`docs/todo.md`** — phase-by-phase checklist of what's done and what's next.
- **`docs/references/inspiration_sites.md`** — the 8 reference sites and what to extract from each.
- **`docs/legal/`** — GDPR-compliant privacy, cookie, and terms docs in IT and EN.

**Rule:** never invent copy, colors, fonts, or structural decisions. They are already written. Read the relevant doc, then implement.

---

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (customized to our design tokens)
- **Animations:** Framer Motion (primary), GSAP + ScrollTrigger (scroll-driven), Lenis (smooth scroll)
- **Icons:** lucide-react
- **Internationalization:** next-intl (Italian + English)
- **Utilities:** clsx, tailwind-merge
- **Deployment:** Vercel (auto-deploy on push to `main`)

Do not add libraries without asking. Default to the stack above.

---

## Design tokens (dark theme default)

```css
--bg-primary: #0A0A0A;      /* near-black, warm */
--bg-secondary: #141414;    /* cards, nav elevated */
--bg-tertiary: #1E1E1E;     /* hover states */
--text-primary: #F5F5F5;    /* off-white, headlines + body */
--text-secondary: #8A8A8A;  /* muted, subheads */
--text-tertiary: #555555;   /* placeholders */
--accent: #F59E0B;          /* warm amber — CTAs, highlights */
--accent-glow: #F97316;     /* soft orange — glows, gradients */
--glass-border: rgba(255,255,255,0.10);
--glass-fill: rgba(255,255,255,0.05);
```

Light theme mirrors these with inverted backgrounds. Amber accent stays the same in both.

## Typography

- **Display (headlines):** Cabinet Grotesk — Black 900, ExtraBold 800, Bold 700. Tight tracking (-0.02 to -0.03em). Sizes: hero 96-120px desktop, section 64-80px, sub-head 36-48px.
- **Body / UI:** Satoshi — Regular 400, Medium 500, Bold 700. Line-height 1.6-1.7. Body 16-20px.
- **Source:** Fontshare (free commercial use).

## Spacing rhythm

- Section vertical spacing: 160px desktop, 80px mobile
- Max content width: 1440px, centered
- Edge padding: 80px desktop, 24px mobile
- 12-column grid desktop, 4-column mobile

---

## Core rules for any code you write

1. **Content comes from `docs/content_master.md`.** Never write your own copy. Pull from the doc. If a section is missing or unclear, stop and ask.
2. **Italian is the primary language.** English is secondary. All UI strings must use next-intl with both locales.
3. **"Tu" form in Italian.** Informal, modern. Never "Lei".
4. **Every section animates in.** Use Framer Motion `whileInView` with fade-up pattern (translateY: 30 → 0, opacity: 0 → 1), stagger children, ease-out, duration 0.4-0.8s. Consistent across the site.
5. **Mobile reduces animation intensity ~30%.** No parallax, no custom cursor, no 3D particles on mobile. Simpler fade-ins only. Respect `prefers-reduced-motion` always.
6. **Glassmorphism for cards.** `rgba(255,255,255,0.05)` background, `backdrop-filter: blur(12px)`, `rgba(255,255,255,0.10)` border, 16px border-radius, 32px padding. On hover: border brightens, subtle amber glow box-shadow.
7. **Typography is tight and large.** Headlines tracked tight, oversized. Body gets generous line-height.
8. **No stock photography. No illustrations. No emojis in UI.** Type-driven, abstract gradient glows, monochrome tech logos.
9. **Accent amber is for CTAs and highlights only.** Do not decorate with it. It's a tool, not a color.
10. **Accessibility is non-negotiable.** Minimum 16px body text, visible focus rings, alt text on everything, `prefers-reduced-motion` respected.

---

## Commands

```bash
npm run dev      # local dev server at localhost:3000
npm run build    # production build (run before committing risky changes)
npm run lint     # eslint check
```

Before committing anything significant, run `npm run build` to catch errors early. Vercel will fail the deploy if the build breaks.

---

## Git conventions

- Branch: work directly on `main` for now (two-person team)
- Commit messages: lowercase, short, imperative. "add hero section", "fix nav mobile spacing", "refactor services grid"
- Push frequently — Vercel auto-deploys, both founders see changes live

---

## What to do when uncertain

If a request is ambiguous, if a doc contradicts another doc, if a design decision isn't written down — **stop and ask**. Don't invent. The planning docs are the source of truth; fabricating around them creates inconsistency that's expensive to fix later.

---

## Working style

- **Build one component or section at a time.** Don't try to generate the entire homepage in a single pass.
- **Verify visually after every change.** The dev server should be running; check `localhost:3000` after each meaningful edit.
- **Prefer small, readable components.** Break large sections into sub-components. File structure under `src/components/` should mirror the homepage section order.
- **Comment sparingly.** Code should be self-explanatory. Comment only the non-obvious (complex GSAP timelines, tricky animation calculations).
- **TypeScript strict.** No `any`. Proper types for props, state, refs.

---

## Current phase

Phase 3 complete. Entering **Phase 4 — Build**. First tasks:

1. Set up global CSS with the color tokens above
2. Load Cabinet Grotesk + Satoshi from Fontshare CDN (or self-hosted)
3. Set up next-intl with IT + EN locales
4. Set up Lenis smooth scroll wrapper
5. Build the top navigation component
6. Build the homepage Hero section (first real section)

Everything after that follows the homepage section order in `docs/content_master.md`.
