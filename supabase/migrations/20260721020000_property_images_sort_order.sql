-- Add explicit ordering to property_images so galleries render a stable,
-- deterministic sequence (cover first, then interiors/context) instead of
-- relying on insertion/return order. Existing rows default to 0.
alter table public.property_images
    add column if not exists sort_order integer not null default 0;

create index if not exists idx_property_images_sort_order
    on public.property_images(property_id, sort_order);
