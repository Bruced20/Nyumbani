# ADR 0001: Repository Pattern

## Context and Problem Statement

To connect Supabase while maintaining codebase modularity, we need a clean pattern to isolate database query building from presentation routers and business rules.

## Decision

We adopted the **Repository Pattern** inside `src/lib/repositories/`.
Repositories are responsible only for direct query executions, database mapping, and low-level data fetch chains.

## Consequences

- **Decoupling:** Pages and UI components never reference Supabase directly.
- **Mockability:** We can mock query calls inside unit tests without spinning up a live PostgreSQL server.
- **Visual Preservation:** Changes occur beneath the UI, preserving visually identical pages.
