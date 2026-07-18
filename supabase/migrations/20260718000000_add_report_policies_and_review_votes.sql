-- Migration: Report policies + review_votes table
-- Slice 3 (Reviews). Completes the moderation feedstock (reports were RLS-enabled
-- in the init migration but had NO policies, silently blocking inserts) and adds a
-- real, per-user helpful-vote table so the "Helpful" signal is honest and scalable.

-- ============================================================================
-- 1. Reports Table Policies
--    Reports are PRIVATE: anyone authenticated may file one, only admins may read
--    or manage them, and reporters cannot see other users' reports.
-- ============================================================================

create policy "Authenticated users can file reports" on public.reports
    for insert with check (
        auth.uid() = reporter_id and
        auth.role() = 'authenticated'
    );

create policy "Reporters can view their own reports" on public.reports
    for select using (auth.uid() = reporter_id);

create policy "Admins have full access to reports" on public.reports
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
    );

-- Prevent a user from filing multiple reports on the same review.
create unique index if not exists uq_reports_review_reporter
    on public.reports(review_id, reporter_id);

create index if not exists idx_reports_unresolved
    on public.reports(review_id) where is_resolved = false;

-- ============================================================================
-- 2. Review Votes Table ("Helpful")
--    One row per (review_id, user_id). A user may toggle their vote on/off.
--    The aggregate count is a simple COUNT(*) grouped by review_id.
-- ============================================================================

create table if not exists public.review_votes (
    id uuid default gen_random_uuid() primary key,
    review_id uuid references public.reviews(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- A user can vote at most once per review.
    unique(review_id, user_id)
);

create index if not exists idx_review_votes_review_id on public.review_votes(review_id);
create index if not exists idx_review_votes_user_id on public.review_votes(user_id);

alter table public.review_votes enable row level security;

-- Vote counts are a public trust signal — anyone may read them.
create policy "Anyone can read review votes" on public.review_votes
    for select using (true);

-- Users manage only their own vote.
create policy "Users can cast their own vote" on public.review_votes
    for insert with check (
        auth.uid() = user_id and
        auth.role() = 'authenticated'
    );

create policy "Users can remove their own vote" on public.review_votes
    for delete using (auth.uid() = user_id);
