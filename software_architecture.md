# Nyumbani Software Architecture Document (SAD)

**Version:** 1.1.0  
**Status:** Architecture Frozen  
**Author:** Staff Software Architect

---

## 1. Overall System Architecture

Nyumbani is designed as a modular, serverless web application combining **Next.js App Router** (React + TypeScript) on the frontend/backend edge, with **Supabase** acting as the Managed Database, Authentication, and File Storage provider.

```
┌────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                  │
│  ┌──────────────────────────┐  ┌────────────────────┐  │
│  │   Next.js React Pages    │  │ Server Actions /   │  │
│  │   (Server Components)    │  │ API Route Handlers │  │
│  └────────────┬─────────────┘  └─────────┬──────────┘  │
└───────────────┼──────────────────────────┼─────────────┘
                │                          │
           (SSR Pages)               (Data Fetch / Auth)
                │                          │
                ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                     Supabase BaaS                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────┐  │
│  │  GoTrue Auth │  │ PostgreSQL DB    │  │  Storage │  │
│  │ (Google Auth)│  │ (RLS + Triggers) │  │ (Buckets)│  │
│  └──────────────┘  └──────────────────┘  └──────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Hosting & Deployment**: Vercel (Edge-rendered Route Handlers and Incremental Static Regeneration for property pages).
- **Database**: PostgreSQL hosted on Supabase, leveraging Row Level Security (RLS) to enforce strict privacy policies.
- **Authentication**: Google OAuth managed by Supabase Auth (GoTrue).
- **Object Storage**: Supabase Storage for property images and landlord verification documents.

---

## 2. Folder Structure (Next.js App Router)

The project utilizes a modular, feature-based architecture to isolate code scopes and simplify developer/AI context parsing:

```
nyumbani/
├── src/
│   ├── app/                    # Next.js routing tree
│   │   ├── (auth)/             # Auth callback routes
│   │   ├── (public)/           # Homepage, Search, Property pages, About
│   │   ├── owners/             # Owner landing, onboarding, and dashboard
│   │   ├── admin/              # Moderator/Admin dashboard
│   │   ├── api/                # Edge Route Handlers
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Shared Design System / UI elements (shadcn/ui)
│   │   ├── ui/                 # Atomic design tokens (button, card, input, dialog)
│   │   └── icons.tsx           # Lucide icon wrappers
│   ├── features/               # Modular business logic
│   │   ├── properties/         # Property list/detail actions, hooks, and schemas
│   │   ├── reviews/            # Review wizard state, ratings triggers, and models
│   │   └── owners/             # Landlord claims, dashboard components
│   ├── lib/                    # Configuration and clients
│   │   ├── security/           # Rate limiting and request protection utilities
│   │   │   └── rate-limit.ts   # Upstash Redis abstraction
│   │   ├── supabase/           # server, client, and middleware instances
│   │   ├── utils.ts            # Tailwind merging and generic helper files
│   │   └── validators/         # Zod schemas for runtime request validation
│   └── types/                  # Global database and model declarations
├── public/                     # Static assets (logos, placeholder maps)
├── supabase/                   # Local database migrations and seed files
│   ├── migrations/
│   └── config.toml
├── tailwind.config.js          # Typography and color system design tokens
└── tsconfig.json
```

---

## 3. Database Schema Design (PostgreSQL DDL)

We enforce database-level relational constraints and strict data typing to reduce backend logic complexity.

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Define Enums
create type recommended_status as enum ('Yes', 'Maybe', 'No');
create type claim_status as enum ('Pending', 'Approved', 'Rejected');
create type user_role as enum ('Renter', 'Owner', 'Moderator', 'Admin');

-- 1. Profiles Table (Synced from Supabase Auth Users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    role user_role not null default 'Renter',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Properties Table
create table public.properties (
    id uuid default gen_random_uuid() primary key,
    slug text unique not null,
    name text not null,
    address text,
    neighborhood text not null,
    rent_min integer not null,
    rent_max integer not null,
    house_type text not null,

    -- Quick Facts
    water_source text not null,
    internet_providers text[] not null,
    security_details text not null,
    deposit_conditions text not null,
    parking_spaces text not null,
    road_access text not null,
    public_transport_dist text not null,

    -- Aggregated Score
    health_score numeric(3,2) not null default 5.00,

    -- Verification details
    is_verified boolean not null default false,
    verified_owner_id uuid references public.profiles(id) on delete set null,

    -- Audit trail
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Reviews Table (Fully decoupled from public profile queries)
create table public.reviews (
    id uuid default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    role_tag text not null check (role_tag in ('Current Resident', 'Former Resident', 'Neighbour', 'Community Contributor')),

    -- Ratings (1-5 scale)
    water_rating integer not null check (water_rating between 1 and 5),
    security_rating integer not null check (security_rating between 1 and 5),
    caretaker_rating integer not null check (caretaker_rating between 1 and 5),

    -- Recommendation Status
    recommend recommended_status not null,

    -- Written feedback (Optional, moderated)
    comment text,
    is_moderated boolean not null default false,
    moderated_at timestamp with time zone,

    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

    -- Prevent duplicate reviews for the same property by a single user
    unique(property_id, user_id)
);

-- 4. Landlord Claims Table
create table public.claims (
    id uuid default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    document_url text not null, -- Path to uploaded verification document
    status claim_status not null default 'Pending',
    rejection_reason text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Abuse Reports Table
create table public.reports (
    id uuid default gen_random_uuid() primary key,
    review_id uuid references public.reviews(id) on delete cascade not null,
    reporter_id uuid references public.profiles(id) on delete cascade not null,
    reason text not null,
    is_resolved boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Audit Logs Table (Administrative Tracking)
create table public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    actor_id uuid references public.profiles(id) on delete set null,
    action text not null,
    entity text not null,
    entity_id uuid,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb
);
```

---

## 4. Indexing Strategy

We index columns frequently targeted in search filters, sorting, and join conditions to ensure fast response times as the platform database grows.

```sql
-- Optimize property queries by neighborhood and price bounds
create index idx_properties_neighborhood on public.properties(neighborhood);
create index idx_properties_rent_range on public.properties(rent_min, rent_max);
create index idx_properties_health_score on public.properties(health_score);

-- Optimize slug-based property details lookup
create index idx_properties_slug on public.properties(slug);

-- Optimize review fetching by property correlation
create index idx_reviews_property_id on public.reviews(property_id);
create index idx_reviews_moderation_status on public.reviews(property_id) where is_moderated = false;

-- Optimize active claims processing for admin queues
create index idx_claims_status on public.claims(status);
```

---

## 5. Row Level Security (RLS) Policies

PostgreSQL Row Level Security is enabled on every table to guarantee complete isolation of user profiles and enforce write/read rules at the database engine level.

```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.reviews enable row level security;
alter table public.claims enable row level security;
alter table public.reports enable row level security;
alter table public.audit_logs enable row level security;

-- 1. Profiles Table Policies (NO PUBLIC SELECT)
create policy "Users can read their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

-- 2. Properties Table Policies
create policy "Anyone can read properties" on public.properties
    for select using (true);

create policy "Authenticated users can create properties" on public.properties
    for insert with check (auth.role() = 'authenticated');

create policy "Only admins or claimed owners can update properties" on public.properties
    for update using (
        auth.uid() = verified_owner_id or
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- 3. Reviews Table Policies
create policy "Anyone can read active reviews" on public.reviews
    for select using (is_moderated = false);

create policy "Authenticated users can write reviews" on public.reviews
    for insert with check (
        auth.uid() = user_id and
        auth.role() = 'authenticated'
    );

-- 4. Claims Table Policies
create policy "Users can view their own claims" on public.claims
    for select using (auth.uid() = user_id);

create policy "Users can submit claims" on public.claims
    for insert with check (auth.uid() = user_id and auth.role() = 'authenticated');

create policy "Admins have full access to claims" on public.claims
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- 5. Audit Logs Table Policies
create policy "Admins have full access to audit logs" on public.audit_logs
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );
```

---

## 6. Privacy & Anonymous Review Architecture

To protect tenant privacy, user identities must never be exposed publicly.

- **Database Partitioning**: Public-facing APIs fetch reviews and map them exclusively to the `role_tag` (e.g., `Current Resident`) and the creation date.
- **Profiles Table Shield**: We completely disable public SELECT queries on `public.profiles`. The client application can never execute query joins linking `user_id` to profiles.
- **Security Audit Isolation**: Only server-side Node environments utilizing the Service Role Key can bypass these restrictions to perform administrative moderation, preventing identity leaks through inspection of client-side queries.

---

## 7. Automation: Health Score Calculation Trigger

To avoid expensive calculation queries on every page load, the overall Property Health Score is cached directly on the `properties` table and calculated dynamically using a PostgreSQL trigger function triggered on changes to the `reviews` table.

```sql
create or replace function public.calculate_property_health_score()
returns trigger as $$
declare
    avg_score numeric(3,2);
begin
    -- Compute the average across the three rating vectors for all unmoderated reviews
    select coalesce(
        avg((water_rating + security_rating + caretaker_rating) / 3.0),
        5.00
    )
    into avg_score
    from public.reviews
    where property_id = coalesce(new.property_id, old.property_id)
      and is_moderated = false;

    -- Update the cached health score on the properties table
    update public.properties
    set health_score = avg_score
    where id = coalesce(new.property_id, old.property_id);

    return new;
end;
$$ language plpgsql security definer;

-- Bind trigger to run on review updates
create trigger tr_on_review_change
after insert or update or delete on public.reviews
for each row execute function public.calculate_property_health_score();
```

---

## 8. Authentication Pipeline (Supabase + Google OAuth)

1.  **Initiation**: User clicks _"Sign In with Google"_ on the final wizard screen.
2.  **Redirect**: Next.js redirects user to Supabase Auth (`supabase.auth.signInWithOAuth`).
3.  **Callback**: Google authenticates the user, redirects to Next.js API Route `/api/auth/callback`.
4.  **Session Establishment**: Route handler exchanges code for session token, writes httpOnly cookies, and redirects the user back to `/review/new` to complete submission.
5.  **Profile Sync**: A PostgreSQL database trigger automatically inserts a record into `public.profiles` whenever a new user accounts is created inside `auth.users`.

---

## 9. API Endpoint & Server Actions Design

Next.js Server Actions are preferred for data mutations to benefit from type-safe validation boundaries and automated page revalidation.

| Action Name        | File Path                        | Route Type    | Input Interface                  | Success Response                     |
| :----------------- | :------------------------------- | :------------ | :------------------------------- | :----------------------------------- |
| `createProperty`   | `features/properties/actions.ts` | Server Action | Zod: `PropertyCreateInput`       | `{ success: true, slug: string }`    |
| `submitReview`     | `features/reviews/actions.ts`    | Server Action | Zod: `ReviewSubmissionInput`     | `{ success: true }`                  |
| `submitClaim`      | `features/owners/actions.ts`     | Server Action | Zod: `ClaimSubmissionInput`      | `{ success: true, claimId: string }` |
| `searchProperties` | `app/api/search/route.ts`        | Route Handler | GET params: `q`, `rentMin`, etc. | `JSON Array: Properties`             |

---

## 10. File Storage Architecture & Image Optimization

- **Landlord Documents Bucket**: Private bucket (`claims-bucket`). Accessible only via administrative service keys or verified users checking their own upload file path (via RLS).
- **Property Galleries Bucket**: Public bucket (`properties-bucket`). Anyone can download assets.
- **Image Compression pipeline**:
  - _Next.js Image (`next/image`)_: Acts as an on-the-fly edge image scaler.
  - _Upload compression_: Frontend scales images down to `1200px` width using canvas scaling and converts them to `.webp` before uploading, preserving user data limits.

---

## 11. Search & Caching Strategy

- **Database Search**: Standard queries utilize dynamic `ILIKE` pattern match on indexed `neighborhood` and `name` fields for the MVP.
- **Edge Caching**: Property pages (`/property/:slug`) utilize Next.js **Incremental Static Regeneration (ISR)**.
  - Revalidation interval is controlled via the environment variable `PROPERTY_REVALIDATE_SECONDS` (defaults to `600` seconds / 10 minutes).
  - Upon submission of a new review, the Next.js cache is explicitly cleared via `revalidatePath('/property/[slug]')` inside the Server Action.

---

## 12. Security & Rate Limiting Abstraction

- **Rate Limiting Abstraction**: All rate-limiting logic is encapsulated inside `src/lib/security/rate-limit.ts` utilizing Upstash Redis. Route Handlers and Server Actions make a clean call to `checkRateLimit(ip)` without exposing Upstash SDK details directly.
- **No Personal Data Exposure**: Ensure public endpoints exclude the `profiles` table. Any API fetching user metrics returns only role badges.
- **SQL Injection Protection**: The project maps queries exclusively through PostgreSQL parameterized statements handled internally by the Supabase Client client library.

---

## 13. System Environment Configuration

```env
# Client-accessible environment properties
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only configurations (Never expose to browser bundle)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-value
PROPERTY_REVALIDATE_SECONDS=600
```

---

## 14. Monitoring, Backups & Reliability

- **Database Backups**: Supabase takes daily automated snapshots of the Postgres instance, coupled with point-in-time recovery (PITR).
- **Logging**: Edge routing logs and Next.js server crash notifications are captured and monitored via Vercel Integration logs (e.g., Axiom or Logtail).
- **Database Health Monitoring**: Supabase Dashboard displays active transaction counts, CPU usage, and index hit rates to identify bottleneck queries before they degrade client performance.
