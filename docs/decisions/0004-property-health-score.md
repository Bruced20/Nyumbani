# ADR 0004: Property Health Score Calculation

## Context and Problem Statement

Renters need an immediate, trustworthy indicator of a property's overall condition without parsing dozens of reviews.

## Decision

We implemented a **Database-level Health Score calculation trigger** (`calculate_property_health_score`).

- Every time a review is inserted, updated, or deleted, a database trigger automatically computes the average score of all unmoderated reviews.
- The overall score is cached directly on the `properties` table.

## Consequences

- **Performance:** Querying properties does not require computing sums or averages at runtime.
- **Consistency:** The health score updates automatically and remains transactionally consistent.
