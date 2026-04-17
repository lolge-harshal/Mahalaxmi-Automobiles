-- ============================================================
-- Fix: Infinite recursion in profiles RLS policies
-- Migration: 003_fix_profiles_rls.sql
-- ============================================================
-- Root cause: policies on public.profiles were doing sub-selects
-- back into public.profiles, causing infinite recursion.
-- Fix: use a SECURITY DEFINER function that bypasses RLS, and
-- add a missing INSERT policy so upsert after signup works.
-- ============================================================

-- ── 1. Helper function (bypasses RLS via security definer) ───────────────────
-- This queries profiles WITHOUT triggering RLS, breaking the recursion.
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ── 2. Drop all existing profiles policies ───────────────────────────────────
drop policy if exists "Users can view own profile"       on public.profiles;
drop policy if exists "Users can update own profile"     on public.profiles;
drop policy if exists "Admins can view all profiles"     on public.profiles;
drop policy if exists "Admins can update any profile"    on public.profiles;

-- ── 3. Recreate policies using the safe helper ───────────────────────────────

-- Anyone can insert their own profile row (needed for upsert after signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles (uses helper — no recursion)
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

-- Users can update their own profile, but cannot self-promote role
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      -- role unchanged, OR the caller is already an admin
      role = public.get_my_role()
      or public.get_my_role() = 'admin'
    )
  );

-- Admins can update any profile (uses helper — no recursion)
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.get_my_role() = 'admin');
