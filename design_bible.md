# Nyumbani Design Bible: A Complete Design System

**Version:** 1.0.0  
**Author:** Head of Product Design  
**Target Platform:** Mobile-first Web & Desktop Web

---

## 1. Brand Personality & Trust Philosophy

Nyumbani is a **rental intelligence network**, not a listing board. The brand voice is:

- **Empathetic but Objective**: We understand the anxiety of finding a home in Kenya. We present user facts without editorializing.
- **Restrained & Silent**: Reviews and ratings are the focal point. We exclude loud ads, popups, and decorative widgets.
- **Renter-First Integrity**: Design decisions prioritize renter transparency. Landlords can respond but cannot hide or influence reviews.

---

## 2. Core Product Principles

- **The Utility Principle:** _“If a feature makes the interface more beautiful but slows users from deciding whether to rent a property, remove it.”_ Minimalism, speed, and clarity always take priority over visual complexity.
- **Scope Freeze Active:** No new visual features or dashboards will be introduced in V1 unless they directly improve usability, accessibility, security, trust, or performance.

---

## 3. Color System & Theme Strategy

To launch quickly and cleanly, Nyumbani V1 features **one carefully designed Calm Light Theme**. However, the stylesheet must utilize semantic tokens to support dark mode in V2 without a layout refactor.

### Light Mode Semantic Tokens (V1 Production)

- `--bg-primary`: `hsl(0, 0%, 100%)` (Page background)
- `--bg-secondary`: `hsl(210, 40%, 98%)` (Cards, inputs, sidebars)
- `--text-primary`: `hsl(220, 20%, 10%)` (Headings, primary body copy)
- `--text-muted`: `hsl(215, 15%, 50%)` (Labels, secondary meta-text)
- `--border-subtle`: `hsl(214, 32%, 91%)` (Dividers, card outlines)
- `--accent-emerald`: `hsl(150, 60%, 35%)` (Success indicators, positive scores, verified badges)
- `--accent-amber`: `hsl(38, 92%, 50%)` (Moderate scores, warning labels)
- `--accent-coral`: `hsl(6, 78%, 57%)` (Critical warnings, errors)
- `--brand-indigo`: `hsl(250, 84%, 54%)` (Interactions, focus bounds)

### Dark Mode Semantic Tokens (V2 Roadmap)

- `--bg-primary`: `hsl(220, 20%, 8%)`
- `--bg-secondary`: `hsl(220, 15%, 12%)`
- `--text-primary`: `hsl(210, 40%, 98%)`
- `--text-muted`: `hsl(215, 15%, 65%)`
- `--border-subtle`: `hsl(217, 19%, 20%)`
- `--accent-emerald`: `hsl(150, 65%, 45%)`
- `--accent-amber`: `hsl(38, 95%, 48%)`
- `--accent-coral`: `hsl(6, 85%, 60%)`
- `--brand-indigo`: `hsl(250, 90%, 65%)`

---

## 4. Typography Hierarchy

We specify font sizes in `rem` using `Inter` or `Geist Sans` as the primary family.

- **Display Header**: `2.25rem` (36px) / Line Height: `1.2` / Weight: `700` (Bold)
  - _Usage:_ Homepage Main Hero.
- **Page Title (H1)**: `1.75rem` (28px) / Line Height: `1.25` / Weight: `600` (Semi-Bold)
  - _Usage:_ Property Title, Section Titles.
- **Sub-title (H2)**: `1.25rem` (20px) / Line Height: `1.3` / Weight: `500` (Medium)
  - _Usage:_ Card Headers.
- **Body Copy**: `0.9375rem` (15px) / Line Height: `1.6` / Weight: `400` (Regular)
  - _Usage:_ Reviews text, property details.
- **Metadata & Micro-Copy**: `0.8125rem` (13px) / Line Height: `1.4` / Weight: `500` (Medium)
  - _Usage:_ Review timestamps, badge copy.

---

## 5. Spacing System

Built on a strict **8px grid** to ensure consistency across responsive break-points:

- `4px` (xxs) — Label-to-input gap, icon-to-text gap.
- `8px` (xs) — Inner badge padding, grid item micro-spacing.
- `16px` (sm) — Button padding, review card inner padding.
- `24px` (md) — Main page gutters (mobile), property card padding.
- `48px` (lg) — Section gap (mobile), desktop layout margins.
- `80px` (xl) — Section gap (desktop).

---

## 6. Corner Radius Rules

We utilize structural rounding to evoke a friendly yet premium aesthetic.

- `4px` (Sharp) — Small badges, tooltips.
- `8px` (Soft) — Form input fields, buttons, small image thumbnails.
- `16px` (Symmetric) — Property cards, modals, review cards, search bars.
- `9999px` (Pill) — Status tags, rating pills, tag filters.

---

## 7. Elevation and Shadows

- `shadow-sm` (Border substitute): `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `shadow-md` (Property Cards): `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
- `shadow-lg` (Dropdowns & Modals): `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`

---

## 8. Icon Style

- Use a single library: **Lucide Icons** (2px stroke thickness).
- No filled icons except when an active state is highlighted (e.g., a filled star or bookmark).

---

## 9. Illustration Style

- Use minimal, black-and-white, or single-accent line drawings (Notion style).
- For abstract empty states, use simple geometric wireframes of building blocks.

---

## 10. Photography Guidelines

- **Realism over Aesthetics**: Photos must be natural and unedited. No wide-angle lenses that distort room sizes.
- **Aspect Ratio**: 4:3 is the standard for property grids.
- **Captions**: Every image in a property gallery must have an optional caption indicating which part of the apartment is pictured.

---

## 11. Property Card Design Philosophy

- **The Card is a Summary**: It must tell the user: Location, Price, Health Score, and the most outstanding vector warning (if any).
- **Layout Structure**:
  - Top: 4:3 Image with floating Property Health Score pill.
  - Bottom: Apartment Title (Medium), Neighborhood/Street (Muted), Price (Bold Green/Obsidian), Vector Row (Small indicators of Water, Noise, Security).

---

## 12. Review Card Design Philosophy

- **Structured Over Emotional:** Reviews must translate experiences into structured indicators. Standard subjective complaints are broken down into:
  - Water reliability rating (1-5 stars).
  - Deposit refund status (Yes/No/Partial/Ongoing).
  - Maintenance response time (Fast/Slow/Never).
  - Internet reliability (Stable/Unstable).
  - Noise level (Quiet/Moderate/Loud).
  - Security feeling (Safe/Unsafe).
  - Caretaker responsiveness (Responsive/Unresponsive).
- **Verification Anchoring**: At the top-left, the author handle is clearly visible next to their verification badge (e.g., `Verified Resident`).
- **Readability**: Line height must be `1.6` for the review text. Long text (>4 lines) is truncated with a clean "Read more" trigger.

---

## 13. Search Experience Philosophy

- **Omnipresent & Instant**: The search bar should always be easily accessible. In desktop, `Ctrl + K` or `Cmd + K` opens the search modal (Linear/Arc inspiration).
- **Natural Language Typing**: Instead of selecting dropdowns, users can type: _"2 bedroom in Kilimani under 50k"_ and receive pre-filtered results.

---

## 14. Mobile-First Layout Principles

- **Bottom Sheet Modals**: All filters and settings on mobile slide up from the bottom (Airbnb style). They are thumb-accessible and swipeable to close.
- **Sticky Actions**: The "Write Review" or "Contact Caretaker" button is sticky at the bottom of the viewport with a blurred background blur (`backdrop-filter: blur(8px)`).

---

## 15. Desktop Layout Principles

- **Split Pane Design**: For Search Results, the left pane displays list cards, while the right pane shows the interactive map. The divider can be dragged or collapsed.
- **Multi-Column Detail**: Property pages use a three-column layout (Gallery/Main Details | Reviews | Sticky Booking/Contact sidebar).

---

## 16. Navigation Philosophy

- **Zero Bloat**: No top-level dropdown menus. Navigation consists of: Search, Write Review, and Owner Hub.
- **Breadcrumbs**: Always show the user where they are: `Home / Nairobi / Roysambu / Sunrise Apartments`.

---

## 17. Animation Philosophy

- **Subtle & Soft**: Transitions use standard springs instead of linear eases.
  - _Spring Config:_ `stiffness: 150, damping: 20`
- **Timing**: Page transitions should never exceed `200ms`. Motion should feel organic, mimicking physical materials.

---

## 18. Loading States

- **No Blank Pages**: Use inline loaders (spinning rings) for buttons or specific fields, never full-page blocking indicators unless executing a submission.
- **Progressive Loading**: Load text first, then UI shell structure, then images using placeholder blur hashes.

---

## 19. Empty States

- **Clear Call to Action**: An empty state (e.g., search found no properties) must contain a clear resolution path:
  - _No reviews found:_ "Be the first to write a review for this building." (Action button included).
- **Illustration:** A single, clean line illustration.

---

## 20. Error States

- **Contextual Recovery**: Error messages must explain _why_ (e.g., "Network signal lost") and provide a "Try again" action button.
- **Visual Styling**: Rendered in soft Coral backgrounds with dark red text, positioned inline right above the action element.

---

## 21. Skeleton Loading Guidelines

- Match card shapes exactly.
- Apply a pulsing animation using a smooth gray-to-white gradient (`@keyframes pulse`).
- Text blocks are represented by horizontal rounded rectangles of varying widths (e.g., 60%, 80%, 40%) to mimic natural paragraph shapes.

---

## 22. Accessibility Standards

- **Contrast Ratio**: All text must achieve WCAG AA contrast standards (minimum `4.5:1` for regular text).
- **Keyboard Navigation**: Every interactive element must be reachable via `Tab` and show a visible focus ring (`--brand-indigo`).
- **Screen Readers**: Use detailed `aria-label` tags on icons and rating grids (e.g., `aria-label="Water reliability rating: 4 stars out of 5"`).

---

## 23. Map Design Guidelines

- **Performance is a Product Feature:** Do not load an interactive map automatically on mobile.
- **Static Map Previews:** Display a lightweight static map preview. Only load the interactive map after the user explicitly taps "Open Interactive Map".
- **Interactive Markers**: Property pins show the starting rent or the Health Score directly on the marker. When clicked, a small popover card appears.

---

## 24. Form Design

- **Floating Labels**: Input fields use modern floating labels that scale down when the input is active.
- **Focus Ring**: On active selection, the input border shifts to `--brand-indigo` with a 2px outer outline.
- **Error Messaging**: Always display validation errors instantly (on-blur) in red text below the field.

---

## 25. Button Hierarchy

1.  **Primary Button**: Filled block color (`--brand-indigo` or `--text-primary`), high contrast, rounded `8px`.
2.  **Secondary Button**: Bordered with muted border (`--border-subtle`) and thin text, or soft gray background.
3.  **Tertiary Button**: Text-only link with subtle hover underline.

---

## 26. Badge System

Badges must be small, capitalized, and use rounded pill corners (`9999px`). They sit beside headers or inside lists to provide immediate metadata.

---

## 27. Property Health Score Visual Language

- **The Pill**: The score is represented as a solid colored pill containing the score value (e.g., `4.8`).
- **Color Rules**:
  - `4.0 - 5.0`: Soft Emerald background, dark green text.
  - `3.0 - 3.9`: Soft Amber background, dark brown/amber text.
  - `1.0 - 2.9`: Soft Coral background, dark red text.

---

## 28. Trust Badge Design

- **Visual Symbol**: A clean shield icon with a central tick.
- **Application**: Appears near the page header to indicate that the building's operational data has been audited and matched with city data or resident receipts.

---

## 29. Verified Owner Badge

- **Visual Symbol**: A small green checkmark pill next to the landlord's name.
- **Copy**: `Verified Owner`
- **Meaning**: The landlord has submitted a valid title deed or utility bill confirming ownership of the building.

---

## 30. Verified Resident Badge

- **Visual Symbol**: A teal checkmark badge on a review card.
- **Copy**: `Verified Resident`
- **Meaning**: The reviewer has uploaded active proof of tenancy (lease, rent receipt, KPLC token).

---

## 31. Community Listing Badge

- **Visual Symbol**: A light slate/gray outline pill.
- **Copy**: `Community Listing`
- **Meaning**: Created by crowdsourced community users, not claimed by the property owner yet.

---

## 32. Anonymous Reviewer Visual Language

- **Anonymity by Default**: The public must NEVER see a contributor's Google account, name, email, phone number, or Google profile photo. Google authentication exists only for internal trust and abuse moderation.
- **Role-Based Anonymous Identities**: Contributors are displayed using one of the following exact role tags:
  - `Current Resident`
  - `Former Resident`
  - `Verified Resident`
  - `Neighbour`
  - `Community Contributor`
- **Visuals**: Generic circular avatar silhouette representing anonymity.

---

## 33. Review Timeline Design

- **Vertical Spine**: Reviews are aligned along a thin left-hand timeline axis.
- **Chronological Order**: Ordered newest to oldest.
- **Milestones**: Major events (e.g., _"Property management changed"_ or _"New generator installed"_) are flagged as milestones along the timeline.

---

## 34. Search Filters

- **Horizontal Pill Carousel**: Primary quick filters (e.g., price, beds) are displayed as a horizontal swipeable row of pills.
- **Advanced Panel**: Sliding drawer containing secondary filters (e.g., specific ISPs, water sources).

---

## 35. Property Comparison Design

- **Split Column Matrix**: Desktop comparative view displaying two or three selected properties side-by-side.
- **Row-by-Row Metrics**: The 5 vectors (Water, Noise, Security, Internet, Transport) are compared as matching horizontal bars, highlighting the superior property.

---

## 36. AI Summary Card Design

- **Property Page Visual Hierarchy**: The property page strictly follows this hierarchy to ensure transparency precedes AI interpretation:
  1.  Property Images
  2.  Property Name
  3.  Verified Owner or Community Listing Badge
  4.  Rent and House Type
  5.  Property Health Score
  6.  Quick Facts (Water, Internet, Security, Deposit, Parking, Road Access, Public Transport)
  7.  AI Community Summary (Synthesizes facts/sentiment)
  8.  Community Ratings
  9.  Resident Reviews
  10. Owner Responses
- **Visual Styling**: A card with a subtle gradient border matching `--brand-indigo` and a sparkles icon.

---

## 37. Responsive Behaviour

- **Breakpoints**:
  - Mobile: `< 640px` (Single-column layout, bottom-sheets, sticky CTAs).
  - Tablet: `640px - 1024px` (Two-column grids, collapsible sidebars).
  - Desktop: `> 1024px` (Full split-screen search maps, multi-column profiles).

---

## 38. Motion Guidelines

- **Page Scale In**: When navigating, new pages slide up from the bottom slightly (`30px`) while fading in.
- **Card Exit/Entry**: Items entering list views use staggered delays of `30ms` per card to create a smooth waterfall appearance.

---

## 39. Micro-interactions

- **Rating Select**: When filling the 5 vectors, clicking a star triggers a small scale pop animation (`1.2x` spring) before settling.
- **Bookmark Toggle**: Clicking the bookmark icon triggers a subtle wiggle motion to confirm saved state.
