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

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.reviews enable row level security;
alter table public.claims enable row level security;
alter table public.reports enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles Table Policies (NO PUBLIC SELECT)
create policy "Users can read their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

-- Properties Table Policies
create policy "Anyone can read properties" on public.properties
    for select using (true);

create policy "Authenticated users can create properties" on public.properties
    for insert with check (auth.role() = 'authenticated');

create policy "Only admins or claimed owners can update properties" on public.properties
    for update using (
        auth.uid() = verified_owner_id or 
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- Reviews Table Policies
create policy "Anyone can read active reviews" on public.reviews
    for select using (is_moderated = false);

create policy "Authenticated users can write reviews" on public.reviews
    for insert with check (
        auth.uid() = user_id and 
        auth.role() = 'authenticated'
    );

-- Claims Table Policies
create policy "Users can view their own claims" on public.claims
    for select using (auth.uid() = user_id);

create policy "Users can submit claims" on public.claims
    for insert with check (auth.uid() = user_id and auth.role() = 'authenticated');

create policy "Admins have full access to claims" on public.claims
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- Audit Logs Table Policies
create policy "Admins have full access to audit logs" on public.audit_logs
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- Sync profiles table on auth user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'Renter'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: Health Score Calculation
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
