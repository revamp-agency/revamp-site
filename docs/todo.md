# Revamp Website — Build Checklist

From zero to live site. Tick things as you go. See `decisions_log.md` for everything already locked.

---

## PHASE 0 — Foundation ✅ *(complete, domain check deferred)*

- [x] Folder structure created in Obsidian vault
- [x] Decisions log pre-filled with everything from chats
- [x] **Domain check** — deferred until pre-build. Test: `revamp.it`, `revamp.agency`, `revamp.studio`, `revamp.dev`, `getrevamp.it`, `revampstudio.it`
- [x] **Tagline pick** — "Costruiamo il futuro digitale delle imprese italiane."
- [x] **Co-founder sync** — confirmed, aligned on all decisions
- [x] **Ventures separation confirmed** — Revamp 100% focused on the agency

---

## PHASE 1 — References & visual direction ✅ *(complete)*

- [x] Browse galleries and agency references
- [x] Screenshot references → saved to `00_planning/references/images/`
- [x] Fill in `00_planning/references/inspiration_sites.md` — 8 sites with detailed notes
- [x] I draft `00_planning/design_direction.md` — colors, fonts, animation language, components
- [x] Review & lock

---

## PHASE 2 — Content & structure ✅ *(complete, pending review during build)*

- [x] I draft `00_planning/content_master.md` section by section in IT + EN:
  - [x] Navigation
  - [x] Hero
  - [x] Price shock
  - [x] Services grid (8 cards + expanded descriptions)
  - [x] Custom Software section
  - [x] How we work (4 steps)
  - [x] Why Revamp (3 pillars)
  - [x] Tech stack banner
  - [x] Founding Clients offer
  - [x] FAQ (8 Q&A)
  - [x] Final CTA + form
  - [x] Footer
  - [x] Servizi page (all 8 deep)
  - [x] Clienti Fondatori page
  - [x] Chi Siamo manifesto
  - [x] Contatti page
  - [x] SEO meta titles + descriptions (all pages, IT + EN)
- [x] I draft all 6 legal docs in `02_legal/`:
  - [x] privacy_it.md
  - [x] privacy_en.md
  - [x] cookie_it.md
  - [x] cookie_en.md
  - [x] terms_it.md
  - [x] terms_en.md

**Note:** Content to be refined during build phase once visuals are generated. Legal docs are templates — consider professional review before scaling.

---

## PHASE 3 — Pre-build setup *(~2 hours)*

**Accounts:**
- [ ] GitHub
- [ ] Vercel (via GitHub)
- [ ] Cursor ($20/month)
- [ ] Domain purchased at Namecheap or Aruba
- [ ] Formspree or Resend
- [ ] Plausible or GA4
- [ ] Iubenda free tier

**Assets:**
- [ ] Logo (wordmark in Cabinet Grotesk for now)
- [ ] Favicon via realfavicongenerator.net
- [ ] OG image (1200×630 with logo + tagline)
- [ ] Tech stack logos from svgl.app
- [ ] Fonts downloaded: Cabinet Grotesk + Satoshi from Fontshare

**Project init:**
- [ ] Install Node.js LTS
- [ ] Cursor installed, Claude Sonnet 4.6 set as model
- [ ] `npx create-next-app@latest revamp --typescript --tailwind --app`
- [ ] `npx shadcn@latest init`
- [ ] `npm install framer-motion gsap @studio-freight/lenis lucide-react next-intl`
- [ ] Git init, GitHub repo created, pushed
- [ ] Vercel connected, "hello world" deployed

---

## PHASE 4 — Build *(~25 hours)*

- [ ] Set up globals.css with color tokens from `design_direction.md`
- [ ] Set up font loading in `layout.tsx`
- [ ] Set up i18n (next-intl) for IT/EN
- [ ] Set up Lenis smooth scroll
- [ ] Build top nav (logo, links, language toggle, CTA)
- [ ] Build mobile menu
- [ ] Build footer

**Homepage sections:**
- [ ] Hero
- [ ] Price shock
- [ ] Services grid
- [ ] Custom Software section
- [ ] How we work
- [ ] Why Revamp
- [ ] Tech stack moving banner
- [ ] Founding Clients
- [ ] FAQ accordion
- [ ] Final CTA + form

**Other pages:**
- [ ] Servizi
- [ ] Clienti Fondatori
- [ ] Chi Siamo
- [ ] Contatti
- [ ] Privacy / Cookie / Terms

**Polish pass:**
- [ ] Custom cursor (desktop)
- [ ] Scroll-triggered animations on every section
- [ ] Hover micro-interactions
- [ ] Page transitions
- [ ] Loading animation on first visit
- [ ] Dark/light theme toggle

---

## PHASE 5 — QA *(~3 hours)*

- [ ] Mobile testing on real phone
- [ ] Cross-browser: Chrome, Safari, Firefox
- [ ] Language toggle works on every page
- [ ] Form submission → real email arrives
- [ ] PageSpeed Insights 90+ mobile on every page
- [ ] All meta titles + descriptions unique
- [ ] Open Graph image works
- [ ] sitemap.xml + robots.txt
- [ ] Every image has alt text
- [ ] Cookie banner appears + works
- [ ] Privacy/Cookie/Terms reachable from footer
- [ ] Spelling check in IT and EN
- [ ] All links click through

---

## PHASE 6 — Launch *(~2 hours)*

- [ ] Add real domain in Vercel
- [ ] Update DNS at registrar
- [ ] HTTPS confirmed
- [ ] Analytics tracking installed
- [ ] Sitemap submitted to Google Search Console
- [ ] Form test on live domain
- [ ] Screenshot day zero

---

## PHASE 7 — Post-launch *(ongoing)*

- [ ] Send link to 5-10 friends for feedback
- [ ] Fix flagged issues
- [ ] Start cold outreach with link in email signature
- [ ] Lead tracker set up (Notion or sheet)
- [ ] Plan Founding Client #1 acquisition
- [ ] Retainer/maintenance plan structure decided
- [ ] 1-month review scheduled
