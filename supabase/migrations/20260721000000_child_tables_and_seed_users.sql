-- Migration: Property child tables + deterministic seed accounts
--
-- The app (repositories, mappers, generated database.types.ts) and the self-seeder
-- all reference property_images / property_amenities / nearby_places, but no prior
-- migration ever created them. On the cloud DB these inserts failed silently, so
-- properties seeded with real coordinates while every image/amenity/nearby row was
-- dropped.
--
-- Separately, seeded reviews need an author. profiles.id references auth.users, so a
-- synthetic profile UUID cannot exist without a matching auth user. Each mock
-- property carries exactly one review per role, and reviews are unique(property_id,
-- user_id) — so we create one real seed account per review role. This mirrors
-- production (real auth users -> profiles -> reviews) without weakening any FK.

-- 1. Missing child tables -------------------------------------------------------

create table if not exists public.property_images (
    id uuid default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.property_amenities (
    id uuid default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    amenity_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.nearby_places (
    id uuid default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    name text not null,
    type text not null,
    distance text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_property_images_property_id on public.property_images(property_id);
create index if not exists idx_property_amenities_property_id on public.property_amenities(property_id);
create index if not exists idx_nearby_places_property_id on public.nearby_places(property_id);

-- Public read mirrors properties: anyone can view a listing's images/amenities/places.
alter table public.property_images enable row level security;
alter table public.property_amenities enable row level security;
alter table public.nearby_places enable row level security;

create policy "Anyone can read property images" on public.property_images
    for select using (true);
create policy "Anyone can read property amenities" on public.property_amenities
    for select using (true);
create policy "Anyone can read nearby places" on public.nearby_places
    for select using (true);

-- 2. Fix handle_new_user trigger -----------------------------------------------
-- The trigger from 20260703000000 reads new.app_metadata, but auth.users exposes
-- that column as raw_app_meta_data. new.app_metadata does not exist, so the trigger
-- raised "record new has no field app_metadata" on EVERY auth user insert — which
-- broke real sign-ups as well as this seed. Repoint it at the correct column.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, last_login_at, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'Renter',
    timezone('utc'::text, now()),
    new.raw_app_meta_data->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Deterministic seed accounts -----------------------------------------------
-- One account per review role. Fixed UUIDs so the seeder can reference them by
-- role without a lookup. Inserted straight into auth.users; the on_auth_user_created
-- trigger will create the matching profiles row automatically.

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-current-resident@nyumbani.co.ke', '', now(), now(), now(), '{"provider":"seed","providers":["seed"]}', '{"full_name":"Current Resident (seed)"}'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-former-resident@nyumbani.co.ke', '', now(), now(), now(), '{"provider":"seed","providers":["seed"]}', '{"full_name":"Former Resident (seed)"}'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-neighbour@nyumbani.co.ke', '', now(), now(), now(), '{"provider":"seed","providers":["seed"]}', '{"full_name":"Neighbour (seed)"}'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-community-contributor@nyumbani.co.ke', '', now(), now(), now(), '{"provider":"seed","providers":["seed"]}', '{"full_name":"Community Contributor (seed)"}')
on conflict (id) do nothing;
