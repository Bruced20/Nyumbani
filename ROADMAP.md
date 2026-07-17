# Nyumbani Product Experience Roadmap

Nyumbani is a Kenyan rental intelligence and trust platform. This roadmap tracks the program
from engineering foundation through product experience transformation to launch.

**Guiding principle:** the product should communicate trust through restraint — clarity,
confidence, and calm, not visual spectacle. References: Airbnb, Apple, Stripe, Linear,
Notion, Google Maps, Zillow (information architecture only).

---

## ✅ PHASE A — Engineering Foundation (Complete)

| Sprint | Scope                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| 1      | Project foundation: Supabase config, path aliases, strict TypeScript, ESLint                                           |
| 2      | Reusable design system package (`packages/ui`), Tailwind v4, Framer Motion                                             |
| 3A–3C  | Public discovery: homepage, intelligent search (URL state, autocomplete), property pages (galleries, health bars, SSG) |
| 4A     | Production data layer: typed Supabase, Repository–Service–Mapper architecture                                          |
| 4A.5   | Production hardening: structured logging, health checks, Vitest coverage, CI/CD, SEO                                   |
| 5A     | Production authentication: Google OAuth, anonymous identity layer, RLS policies                                        |

## ✅ PHASE B — Design Language (Complete)

| Sprint | Scope                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| D1     | Design System v2: calm-trust principles, warm neutral palette, semantic tokens (`brand-primary`, `status-*`) |
| D2     | Shared component refinement: motion discipline, focus rings, touch targets, reduced motion                   |
| D3     | Page experience & information hierarchy: whitespace over containers, editorial reviews, quieter typography   |

---

## 🏃 PHASE C — Product Experience (Current)

Only a handful of pages determine whether someone trusts Nyumbani: **Homepage, Search,
Property page, Review flow, Owner Hub, Admin Dashboard.** They receive the majority of
design effort. Each phase concludes with a full review before the next begins.

### P0 — Layout & Responsive Foundation

Audit every page. Correct container widths, grid systems, responsive behavior, overflow,
typography wrapping, spacing rhythm, alignment, and reading lengths across desktop, tablet,
and mobile. Objective: eliminate every broken or awkward layout.
_Prerequisite engineering fixes (StarRating hoist, truthful review presentation,
reduced-motion consistency, focus-trap hook, doc/token sync) land before P0._

### P1 — Homepage

Full redesign, not refinement. Search becomes the hero. Storytelling, hierarchy, trust,
whitespace, first impressions.

### P2 — Search Experience

Search is the flagship feature. Redesign search bar, autocomplete, filters, results, map
interaction, loading, empty states, sorting, and the mobile experience.

### P3 — Property Experience

Redesign the entire property page: gallery, health score (key visual anchor), editorial
reviews, owner responses, location, amenities, trust indicators, information hierarchy.

### P4 — Owner Experience

Redesign every owner-facing screen: Owner Hub, claim flow, verification, dashboard,
property management, analytics, response tools. Should feel like professional software.

### P5 — Admin Console

A first-class internal product: moderation, verification, fraud reports, users, audit
logs, analytics, property approvals, spam detection, community health.

### P6 — Mobile Experience

Review every screen on mobile: navigation, bottom sheets, touch targets, spacing,
scrolling, gestures, typography, responsiveness.

### P7 — Final Polish

Complete product review: remove visual noise, consistency pass, remaining bugs,
transitions, empty states, loading states. The application must feel cohesive.

---

## 🔮 PHASE D — Platform Maturity & Launch

- Moderator tools (censor text / preserve vector ratings policy)
- Spam detection & anti-fraud
- Landlord ownership verification (bills upload claims queue)
- Analytics
- Performance
- Launch

## 📥 Product Backlog

- WhatsApp notification reports
- Real-time tenant ↔ owner chat

---

## Success Criteria (Phase C exit)

1. The product feels intentionally designed rather than assembled.
2. Every major user journey is clear and effortless.
3. Layouts are robust across all breakpoints.
4. Visual hierarchy naturally guides attention; the interface inspires trust.
5. The design system is applied consistently; every page belongs to the same product.
6. Public experience and internal dashboards share the same craftsmanship.
7. No feature is redesigned at the expense of existing functionality.
8. Engineering quality and product quality are finally at the same level.
