-- ============================================================
-- Make the first (earliest) user in profiles an admin.
-- Safe to run: only touches one row, changes nothing else.
-- RUN IN: Supabase Dashboard → SQL Editor
-- ============================================================

update public.profiles
set role = 'admin'
where id = (
  select id from public.profiles
  order by created_at asc
  limit 1
);
