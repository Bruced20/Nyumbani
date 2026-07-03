# ADR 0002: Service Layer

## Context and Problem Statement

To keep repositories strictly focused on query building, we need an abstraction layer that handles validations, caching, fallback states, and business domain transitions.

## Decision

We adopted the **Service Layer** inside `src/lib/services/`.
Services process incoming parameters (validated via Zod), orchestrate repository inputs, and coordinate server-side caching.

## Consequences

- **Encapsulation:** Repository layers remain thin and logic-free.
- **Caching:** Dynamic server-side caching (`unstable_cache`) is managed inside Services.
- **Failsafe Resilience:** Services implement static mock fallbacks if the database is offline, ensuring Next.js builds always succeed.
