-- ============================================================
-- RUN THIS IN: Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: Create a security definer helper that reads role
-- WITHOUT triggering RLS (breaks the recursion)
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Step 2: Drop all broken policies
drop policy if exists "Users can view own profile"       on public.profiles;
drop policy if exists "Users can update own profile"     on public.profiles;
drop policy if exists "Admins can view all profiles"     on public.profiles;
drop policy if exists "Admins can update any profile"    on public.profiles;

-- Step 3: Add missing INSERT policy (fixes the 500 on signup upsert)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Step 4: Recreate SELECT policies (no recursion)
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

-- Step 5: Recreate UPDATE policies (no recursion)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      role = public.get_my_role()
      or public.get_my_role() = 'admin'
    )
  );

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.get_my_role() = 'admin');
