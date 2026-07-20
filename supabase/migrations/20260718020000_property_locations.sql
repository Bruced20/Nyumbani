-- Migration: Real property locations
-- Properties previously had NO coordinate columns; the app derived fake lat/lng
-- from string lengths, which piled every marker onto two points. This adds real
-- coordinates plus a structured address hierarchy. Coordinates come from the
-- upload map-pin picker and are never regenerated from text.

alter table public.properties
    add column if not exists latitude double precision,
    add column if not exists longitude double precision,
    add column if not exists county text,
    add column if not exists estate text,
    add column if not exists street text,
    add column if not exists building_name text;

-- Map queries filter by location constantly; index the coordinate pair.
create index if not exists idx_properties_lat_lng
    on public.properties(latitude, longitude);
