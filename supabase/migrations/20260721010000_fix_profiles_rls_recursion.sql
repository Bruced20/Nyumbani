-- Migration: Fix recursive RLS policy on profiles
--
-- The "Admins can view all profiles" policy (from 20260702000000_init.sql) checks
-- admin status with `exists (select 1 from public.profiles where id = auth.uid()
-- and role = 'Admin')`. Because that subquery reads profiles from inside a profiles
-- policy, Postgres re-evaluates the policy recursively and raises
-- 42P17 "infinite recursion detected in policy for relation profiles" on ANY
-- profiles read. This broke every server read path (and would break production).
--
-- Fix: move the admin check into a SECURITY DEFINER function that bypasses RLS, so
-- the profiles policy no longer queries profiles under its own policy context.

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  );
$$ language sql security definer stable set search_path = public;

-- Repoint the recursive profiles policy at the helper.
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
    for select using (public.is_admin());
