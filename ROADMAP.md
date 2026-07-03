# Nyumbani Product Roadmap

Nyumbani is a modern rental intelligence platform for Kenya. This roadmap details completed milestones and upcoming product goals.

---

## 🏁 Completed Milestones

### **Sprint 1 — Initialize Project Foundation**

- Supabase integration configuration.
- Path aliasing setups and TypeScript strict mode configurations.
- ESLint configurations.

### **Sprint 2 — Reusable Design System Package**

- Decoupled core buttons, cards, selections, badges, and layout components into `packages/ui` using Tailwind CSS v4.
- Integrated Framer Motion spring physics.

### **Sprint 3A — Public Discovery Experience**

- Engineered responsive homepage landing hero blocks and featured cards list.
- Created layout sitemap footers.

### **Sprint 3B — Intelligent Search Experience**

- Upgraded Arrow-key selection and autocompletes.
- Introduced removable filter chips and nearby suggestions for empty states.
- Configured URL state-driven query transitions.

### **Sprint 3C — Property Experience**

- Implemented `property/[slug]` dynamic routes.
- Added image lightbox carousels and health rating progress bars.
- Prerendered dynamic slugs at build-time.

### **Sprint 4A — Production Data Layer**

- Replaced mock datasets with typed Supabase database connections.
- Introduced clean Repository-Service-Mapper architecture.

### **Sprint 4A.5 — Production Hardening & Developer Experience** (Current)

- Centralized structured logging with recursive redactions and request correlation.
- Diagnostics check endpoint `/api/health`.
- Vitest test coverage reports.
- Branded design system error layouts and dynamic sitemaps.
- GitHub Actions CI/CD workflows.

---

## 🏃 In Progress

### **Sprint 4B — User Authentication**

- Implement Google OAuth login redirect boundaries.
- Protect moderator paths.

---

## 🔮 Upcoming Milestones

### **Sprint 5 — Conversational Review Wizard**

- Multi-screen evaluation funnel (1 question per page).
- Anti-spam rate limit tokens.

### **Sprint 6 — Landlord Ownership Verification**

- Bills upload claims queue.

---

## 📥 Product Backlog

- Push WhatsApp notification reports.
- Real-time chat messages between tenants and owners.
