# Product Requirements Document (PRD)

## Project: **Nyumbani** (Rental Transparency Platform for Kenya)

**Author:** Product & Architecture Team  
**Status:** Scope Frozen (Ready for Implementation)  
**Target Region:** Kenya (Nairobi initially)

---

## 1. Product Vision & Trust Philosophy

Current rental platforms in Kenya act merely as digital brochures for landlords and agents. They list highly-curated photographs, pricing, and broker contact info, but completely ignore the operational reality of living in the property. Tenants only discover major structural or environmental issues _after_ signing a lease and paying a non-refundable deposit.

**Nyumbani** (meaning _home_ in Swahili) is a community-driven rental transparency platform. Our vision is to **democratize rental information** by creating a trust network. Nyumbani doesn't just show what a house looks like; it reveals **what it is actually like to live there**.

> [!IMPORTANT]
> **Renter-First Trust Philosophy:**
> The renter is the primary customer of Nyumbani. Landlords are important participants, but the platform will always prioritize transparency and trust for renters. Owners may publicly respond to reviews but cannot remove reviews simply because they disagree with them or because the review is negative.

---

## 2. Core Product Principles

- **The Utility Principle:** _“If a feature makes the interface more beautiful but slows users from deciding whether to rent a property, remove it.”_ Minimalism, speed, and clarity always take priority over visual complexity.
- **The Final Product Rule:** _“No feature may be implemented unless it satisfies at least one of these goals: Improves trust, Improves transparency, Improves usability, Improves performance, Improves accessibility.”_ If it satisfies none of these, it does not belong in Version 1.
- **Structured Over Emotional:** Reviews focus on structured experiences rather than emotional accusations. Subjective statements are converted into structured questions to reduce legal risk while increasing usefulness.
- **Trust First:** Verification is not an afterthought. Ratings and claims must be validated using low-friction methods (e.g., Google Sign-In, utility bills, rent transaction references).
- **Extreme Transparency:** Negative reviews cannot be paid away. Landlords can respond publicly and report clear violations of guidelines, but they cannot censor honest feedback.
- **Anonymity as the Default:** Every contributor is anonymous. The public must NEVER see a contributor's Google account, name, email, phone number, or Google profile photo. Google authentication exists only for internal trust, abuse mitigation, and moderation. Users may optionally enable a public display name from their profile settings, but anonymity remains the system default.
- **Mobile-First & Data-Light:** Kenya's internet landscape is mobile-dominated. The platform must load under 1.5 seconds on 3G connections, utilize highly optimized image compression, and minimize JS payload to respect user data bundles.

---

## 3. Target Audience

We serve three primary user groups:

1.  **House Hunters (Guests)**
    - _Who:_ Urban professionals, students, and families searching for new housing.
    - _Behavior:_ Search extensively from mobile devices; will not create accounts unless they want to save or review.
2.  **Community Contributors (Verified Reviewers)**
    - _Who:_ Current or former tenants of a listed property.
    - _Identity:_ Displayed publicly only via role-based anonymous identities:
      - `Current Resident`
      - `Former Resident`
      - `Verified Resident`
      - `Neighbour`
      - `Community Contributor`
3.  **Property Owners (Verified Landlords & Managers)**
    - _Who:_ Professional property developers, landlords, or property management agencies.
    - _Behavior:_ Need validation of their premium services and high-quality maintenance standards to justify rental prices.

---

## 4. Feature Roadmap & Scope Freeze

> [!WARNING]
> **Scope Freeze Active:**
> From this point onward, no additional major features will be introduced unless they significantly improve usability, accessibility, security, trust, or performance. Avoid feature creep. The goal is to polish the existing vision rather than continually expanding it.

### Phase 1: The MVP (Focus: Information Density & Core Trust)

The MVP establishes the data foundation and verifies demand within key pilot neighborhoods in Nairobi (e.g., Kilimani, Westlands, Roysambu, Kasarani).

- **Location-Based Search**: Simple text search auto-completing Nairobi neighborhoods and apartment names. No heavy maps on first page load.
- **Lightweight Mobile Maps**: On mobile, do not load an interactive map automatically. Instead, display a lightweight static map preview. Load the interactive map only after the user explicitly taps "Open Interactive Map".
- **Property Page Hierarchy**:
  1.  Property Images
  2.  Property Name
  3.  Verified Owner or Community Listing Badge
  4.  Rent and House Type
  5.  Property Health Score
  6.  Quick Facts (Water, Internet, Security, Deposit, Parking, Road Access, Public Transport)
  7.  AI Community Summary (Interprets the facts and reviews)
  8.  Community Ratings
  9.  Resident Reviews (Focusing on structured experiences)
  10. Owner Responses
- **Structured Reviews (The 5 Vectors + Local Context)**: Subjective text statements are translated into structured questions:
  - _Water Reliability:_ Council vs. Borehole water, frequency of dry taps, tank storage capacity.
  - _Security:_ Gated status, guards, street lighting, local crime reports.
  - _Noise Levels:_ Adjacency to clubs, churches, mosques, and busy matatu routes.
  - _Internet Availability:_ Coverage of major providers (Safaricom Home Fibre, Zuku, JTL Faiba, Starlink).
  - _Transport & Access:_ Road condition (muddy in rainy season), distance to nearest stage/boda-boda point.
  - _Deposit Handling:_ Was the deposit refunded? (Yes/No/Partial/Ongoing).
  - _Caretaker Responsiveness:_ Service response times (Fast/Slow/Never).
- **Conversational Review Wizard**: Employs a one-question-per-screen layout on mobile to reduce friction and form drop-offs.
- **Calm Light Theme**: Launch with one carefully designed Calm Light theme. Use semantic design tokens so Dark Mode can be introduced in V2 without major refactoring.
- **Anonymous Google Sign-In verification**: Reviewers verify their identity via Google Sign-In. Email details are encrypted and stored for abuse mitigation, but publicly hidden. SMS OTP is removed from the loop.
- **Manual Owner Verification**: Landlords submit ownership proof (utility bill, land registry document, or rental management license) to claim their property page and receive a "Verified Owner" badge.

### Phase 2: Version 2 (Scale, Search & Verification Enhancements)

- **Interactive Map Search**: Fast, responsive map plotting rental listings, color-coded by Property Health Score.
- **Dark Mode Support**: Enabled via the semantic design tokens set up in Phase 1.
- **Verified Resident Badging**: Reviewers who upload a lease agreement copy, rent receipt, or KPLC token purchase history receive a "Verified Resident" badge on their reviews.
- **Advanced Kenyan Filtering**: Filters for specific local criteria: "24/7 Water", "Fiber Internet Installed", "No Adjacent Clubs", "No Broker Fee".
- **Landlord Dashboard**: A dedicated dashboard for verified owners to edit property listings, post vacancy updates, respond to reviews, and track analytics on listing views.
- **Airtime/M-Pesa Contributor Rewards**: Gamifying review submission in newly listed properties by offering micro-payouts (e.g., 50 KES airtime/M-Pesa) for verified reviews of under-reviewed listings.

### Phase 3: Version 3 (Ecosystem & Monetization)

- **Deposit Protection/Escrow System**: A secure deposit holding system to resolve the #1 dispute in Kenya: landlords refusing to refund security deposits.
- **Nyumbani Certified Inspection**: A paid service where Nyumbani-trained agents physically inspect and verify the water pressure, actual fiber speeds, and soundproofing of apartments, adding a "Nyumbani Certified" badge.
- **Automated Tenant-Landlord Matchmaking**: Smart notification system alerting renters when a vacant unit matching their specific criteria (e.g., "Westlands, 2-Bedroom, >4.5 Health Score, <50k KES") becomes available.
- **Premium Owner Features**: Paid promotion of listings for owners with a sustained Health Score of >4.0.

---

## 5. Information Architecture & Sitemap

### Page Breakdown & Purposes

| Page Name                      | URL Path            | Primary Purpose                                                                                        | User Type Access           |
| :----------------------------- | :------------------ | :----------------------------------------------------------------------------------------------------- | :------------------------- |
| **Homepage**                   | `/`                 | Capture search intent, educate users on the trust philosophy, and drive review contributions.          | All (Public)               |
| **Search Results**             | `/search`           | Display properties matching location/filters with a clear indicator of their Property Health Scores.   | All (Public)               |
| **Property Detail**            | `/property/:slug`   | Show detailed crowdsourced vectors, reviews, photo gallery, vacancy status, and owner contact details. | All (Public)               |
| **Write Review Wizard**        | `/review/new`       | Multi-step interactive form to capture ratings across the 5 vectors and verify via Google Login.       | Guests (To write a review) |
| **Owner Hub & Sign Up**        | `/owners`           | Landing page to onboard landlords, explaining the "Verified Owner" trust advantage.                    | Owners (Public/Signup)     |
| **Owner Dashboard**            | `/owners/dashboard` | Console for owners to claim properties, update vacancies, and respond to reviews.                      | Authenticated Owners       |
| **Transparency & Methodology** | `/about`            | Explains the scoring algorithms, data security policy, and how anonymity is guaranteed.                | All (Public)               |

---

## 6. Complete User Journeys

### User Journey A: The Guest (House Hunter - "Amina")

1.  **Entry:** Amina lands on the Nyumbani Homepage on her mobile phone. She sees a clean, Google-like search bar.
2.  **Search:** She types "Roysambu" and presses enter.
3.  **Browse:** The Search Results page lists 15 apartments in Roysambu. Each card clearly shows the Rent (e.g., 20,000 KES), Property Health Score (e.g., 4.2/5), and quick icons for Water Reliability (e.g., "Borehole & Council") and Noise (e.g., "Moderate").
4.  **Deep Dive:** She clicks on "Sunrise Apartments". The Property Detail page loads instantly. She views:
    - The property name, rent, and verified owner badge.
    - The rating breakdowns (Water: 4.8/5, Noise: 2.1/5 due to an adjacent church).
    - Anonymous reviews: _"Water is always there, but Sundays are extremely loud due to the church next door. Caretaker is friendly."_
    - Owner's reply: _"We have installed double-pane soundproofing windows on the church-facing side of the building to mitigate this."_
5.  **Action:** Amina clicks "View Contact Info" or "WhatsApp Caretaker". She is **not** forced to create an account. She connects directly with the owner, fully aware of the noise situation but reassured by the water supply and landlord response.

### User Journey B: The Community Contributor (Current Tenant - "Josphat")

1.  **Entry:** Josphat clicks "Write a Review" on the Nyumbani Homepage.
2.  **Property Search:** He searches for his building, "Parklands Heights".
3.  **Conversational Wizard (One Question per Screen):**
    - _Screen 1:_ Water - 1 Star (Taps dry, expensive tankers needed).
    - _Screen 2:_ Security - 5 Stars (Double gate, CCTV).
    - _Screen 3:_ Caretaker - 1 Star (Slow/Never responds).
    - _Screen 4:_ Recommendation - No (Would not recommend).
    - _Screen 5:_ Text context: _"Great security, but water has been dry for a month. Management is ignoring us."_
4.  **Google Authentication & Identity Selector:** He signs in via Google on the final screen, and chooses the public label _"Current Resident"_.
5.  **Publication:** The system publishes the review immediately. His email is encrypted and never exposed to the public or the landlord.

### User Journey C: The Property Owner (Landlord - "Mama Grace")

1.  **Onboarding:** Mama Grace visits `/owners`. She reads about how verified listings get 3x more views and higher trust ratings.
2.  **Account Creation:** She registers using her email and phone number.
3.  **Claim Property:** She searches for her building on the platform. If it doesn't exist, she inputs the details (Address, Rent, Photos, Amenities).
4.  **Verification:** She uploads a scanned utility bill (KPLC or Nairobi Water) showing the building name/address.
5.  **Dashboard:** Within 24 hours, the Nyumbani admin team verifies her. She gets a dashboard showing:
    - A "Verified Owner" badge next to her properties.
    - Her property's overall Health Score (e.g., 4.7/5).
    - Direct notifications for new reviews, allowing her to quickly reply to tenant feedback.
