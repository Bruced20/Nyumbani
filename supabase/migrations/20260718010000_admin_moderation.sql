-- Migration: Admin moderation
-- Slice 4. Completes the moderation pillar. Reviews had NO admin RLS (only
-- "insert own" + "select where not moderated"), so admins literally could not
-- hide/restore or even see hidden reviews. Adds admin policies, accountability
-- columns, and a dedicated moderation_logs audit trail.

-- ============================================================================
-- 1. Review accountability columns (who moderated + why). Keeps the existing
--    is_moderated boolean as the visibility flag (health-score trigger and all
--    read filters depend on it) and layers accountability on top.
-- ============================================================================

alter table public.reviews
    add column if not exists moderated_by uuid references public.profiles(id),
    add column if not exists moderation_reason text;

-- ============================================================================
-- 2. Reviews admin RLS — admins can see ALL reviews (including hidden) and
--    update moderation state. Mirrors the claims/reports admin policy idiom.
-- ============================================================================

create policy "Admins can view all reviews" on public.reviews
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

create policy "Admins can moderate reviews" on public.reviews
    for update using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- ============================================================================
-- 3. Moderation Logs — an accountable, append-only trail of every moderation
--    action (hide/restore review, approve/reject claim). Distinct from the
--    generic audit_logs: this is the moderation-specific history admins review
--    for disputes and analytics. Nothing is ever hard-deleted through the UI,
--    so this log is the source of truth for "what happened to this review".
-- ============================================================================

create table if not exists public.moderation_logs (
    id uuid default gen_random_uuid() primary key,
    actor_id uuid references public.profiles(id) on delete set null,
    action text not null,          -- e.g. 'review.hide', 'review.restore', 'claim.approve'
    entity text not null,          -- 'review' | 'claim'
    entity_id uuid not null,
    reason text,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_moderation_logs_entity on public.moderation_logs(entity, entity_id);
create index if not exists idx_moderation_logs_created_at on public.moderation_logs(created_at desc);

alter table public.moderation_logs enable row level security;

-- Only admins may read or write moderation logs.
create policy "Admins have full access to moderation logs" on public.moderation_logs
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );
