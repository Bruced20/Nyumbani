# Nyumbani System Architecture

This document explains the software architecture, design patterns, and structural modules of the Nyumbani codebase.

---

## Architecture Flow

Nyumbani utilizes a **Clean Architecture** model with decoupled layers to enforce separation of concerns and database independence:

```text
  [ Presentation Layer ] (Next.js Server Components / Client Views)
           │
           ▼
     [ Service Layer ] (SearchService / PropertyService / config.ts)
           │
           ▼
    [ Repository Layer ] (PropertyRepository / ReviewRepository / ...)
           │
           ▼
  [ Database Data Layer ] (Supabase API / Upstash Redis client)
```

---

## 1. Presentation Layer

- **Next.js Server Components:** Fetches data on the server and passes serialized objects as props. No client-side database connections exist.
- **Next.js Client Components:** Handles animations, lightbox visual states, search filter updates, and user transitions.

## 2. Service Layer

- Belongs under `src/lib/services/`.
- Encapsulates all **business logic, rules, and cache strategies**.
- Validates URL inputs using Zod.
- _Constraint:_ Services must never query Supabase directly; they call Repositories.

## 3. Repository Layer

- Belongs under `src/lib/repositories/`.
- Acts as the data access gateway.
- _Constraint:_ Repositories must never contain business logic. They are responsible only for reading, writing, query building, and mapping database rows.

## 4. Mapper Layer

- Belongs under `src/lib/mappers/index.ts`.
- Transforms raw database rows (`Database['public']['Tables'][...]['Row']`) into domain models (`Property`, `Review`).
- Ensures that database schemas are never exposed directly to the presentation components.

## 5. Caching Strategy

- **Next.js unstable_cache:** Read methods are cached on the server.
- **Tag-based Invalidation:** The `CacheManager` (`src/lib/cache/index.ts`) invalidates tags like `'properties'`, `'featured'`, and `'search-pool'` when reviews or updates occur.
- **Static Clients:** Bypasses cookie headers inside cache scopes using `createStaticClient()` to support static site compilation.
