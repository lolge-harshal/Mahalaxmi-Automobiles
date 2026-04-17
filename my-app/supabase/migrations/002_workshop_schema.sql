-- ============================================================
-- Mahalaxmi Automobiles — Workshop Schema
-- Migration: 002_workshop_schema.sql
-- Depends on: 001_profiles.sql (public.profiles must exist)
-- ============================================================

-- ── Helper: is the calling user an admin? ────────────────────────────────────
-- Used in RLS policies to avoid repeating the sub-query everywhere.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ============================================================
-- 1. PRODUCTS
-- ============================================================

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  price       numeric(12, 2) not null check (price >= 0),
  image_url   text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- RLS
alter table public.products enable row level security;

-- Anyone (including anonymous visitors) can read active products
create policy "Public read active products"
  on public.products for select
  using (is_active = true);

-- Admins can read all products (including inactive)
create policy "Admins read all products"
  on public.products for select
  using (public.is_admin());

-- Admins can insert products
create policy "Admins insert products"
  on public.products for insert
  with check (public.is_admin());

-- Admins can update products
create policy "Admins update products"
  on public.products for update
  using (public.is_admin());

-- Admins can delete products
create policy "Admins delete products"
  on public.products for delete
  using (public.is_admin());


-- ============================================================
-- 2. SERVICES
-- ============================================================

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  description text,
  price       numeric(12, 2) check (price >= 0),   -- nullable: price on request
  is_active   boolean     not null default true,
  sort_order  integer     not null default 0,       -- controls display order
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists services_is_active_idx  on public.services (is_active);
create index if not exists services_sort_order_idx on public.services (sort_order);

-- RLS
alter table public.services enable row level security;

-- Public read for active services
create policy "Public read active services"
  on public.services for select
  using (is_active = true);

-- Admins read all
create policy "Admins read all services"
  on public.services for select
  using (public.is_admin());

-- Admins full write access
create policy "Admins insert services"
  on public.services for insert
  with check (public.is_admin());

create policy "Admins update services"
  on public.services for update
  using (public.is_admin());

create policy "Admins delete services"
  on public.services for delete
  using (public.is_admin());


-- ============================================================
-- 3. ENQUIRIES
-- ============================================================

create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  product_id  uuid        references public.products (id) on delete set null,
  message     text        not null,
  status      text        not null default 'pending'
                check (status in ('pending', 'in_progress', 'resolved', 'closed')),
  admin_notes text,                                -- internal notes visible only to admins
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists enquiries_user_id_idx    on public.enquiries (user_id);
create index if not exists enquiries_product_id_idx on public.enquiries (product_id);
create index if not exists enquiries_status_idx     on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- RLS
alter table public.enquiries enable row level security;

-- Users can view their own enquiries
create policy "Users view own enquiries"
  on public.enquiries for select
  using (auth.uid() = user_id);

-- Users can create enquiries for themselves
create policy "Users create own enquiries"
  on public.enquiries for insert
  with check (auth.uid() = user_id);

-- Users can update only the message on their own pending enquiries
create policy "Users update own pending enquiries"
  on public.enquiries for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);

-- Admins can view all enquiries
create policy "Admins view all enquiries"
  on public.enquiries for select
  using (public.is_admin());

-- Admins can update any enquiry (status, notes, etc.)
create policy "Admins update any enquiry"
  on public.enquiries for update
  using (public.is_admin());

-- Admins can delete enquiries
create policy "Admins delete enquiries"
  on public.enquiries for delete
  using (public.is_admin());


-- ============================================================
-- 4. WEBSITE CONTENT
-- ============================================================

create table if not exists public.website_content (
  id         uuid primary key default gen_random_uuid(),
  page       text        not null,                 -- e.g. 'home', 'about', 'services'
  section    text        not null,                 -- e.g. 'hero', 'features', 'cta'
  content    jsonb       not null default '{}',    -- flexible JSON payload
  is_active  boolean     not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid        references auth.users (id) on delete set null,

  -- One active record per page+section combination
  constraint website_content_page_section_key unique (page, section)
);

-- Indexes
create index if not exists website_content_page_idx on public.website_content (page);

-- RLS
alter table public.website_content enable row level security;

-- Public read for active content
create policy "Public read active website content"
  on public.website_content for select
  using (is_active = true);

-- Admins read all (including inactive drafts)
create policy "Admins read all website content"
  on public.website_content for select
  using (public.is_admin());

-- Admins full write access
create policy "Admins insert website content"
  on public.website_content for insert
  with check (public.is_admin());

create policy "Admins update website content"
  on public.website_content for update
  using (public.is_admin());

create policy "Admins delete website content"
  on public.website_content for delete
  using (public.is_admin());


-- ============================================================
-- 5. CONTACT MESSAGES
-- ============================================================

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone      text,
  message    text        not null,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists contact_messages_is_read_idx    on public.contact_messages (is_read);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- RLS
alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) can submit a contact message
create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  with check (true);

-- Admins can read all messages
create policy "Admins read contact messages"
  on public.contact_messages for select
  using (public.is_admin());

-- Admins can update messages (e.g. mark as read)
create policy "Admins update contact messages"
  on public.contact_messages for update
  using (public.is_admin());

-- Admins can delete messages
create policy "Admins delete contact messages"
  on public.contact_messages for delete
  using (public.is_admin());


-- ============================================================
-- 6. UPDATED_AT TRIGGER (shared utility)
-- ============================================================

-- Generic function to keep updated_at current on any table
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach to every table that has an updated_at column
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger trg_enquiries_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

create trigger trg_website_content_updated_at
  before update on public.website_content
  for each row execute function public.set_updated_at();


-- ============================================================
-- 7. STORAGE — product-images bucket
-- ============================================================

-- Create the bucket (idempotent via DO block)
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'product-images',
    'product-images',
    true,                          -- publicly readable URLs
    5242880,                       -- 5 MB per file
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  on conflict (id) do nothing;
end;
$$;

-- Anyone can read files in the bucket (public CDN-style access)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only admins can upload product images
create policy "Admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- Only admins can update (replace) product images
create policy "Admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- Only admins can delete product images
create policy "Admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );


-- ============================================================
-- 8. SEED — default website content rows
-- ============================================================

insert into public.website_content (page, section, content) values
  ('home', 'hero', '{
    "heading": "Welcome to Mahalaxmi Automobiles",
    "subheading": "Your trusted destination for quality vehicles, genuine spare parts, and professional automotive services.",
    "cta_primary": "Our Services",
    "cta_secondary": "Contact Us"
  }'),
  ('home', 'features', '{
    "items": [
      { "title": "Wide Vehicle Selection",  "description": "Explore an extensive range of new and pre-owned vehicles." },
      { "title": "Certified Service Centre","description": "Trained technicians for reliable maintenance and repairs." },
      { "title": "Genuine Spare Parts",     "description": "Authentic parts to ensure longevity and performance." },
      { "title": "Easy Financing",          "description": "Flexible EMI options to make ownership affordable." }
    ]
  }'),
  ('about', 'intro', '{
    "heading": "About Us",
    "body": "Mahalaxmi Automobiles is a trusted name in the automotive sector, committed to providing quality vehicles and professional services."
  }'),
  ('contact', 'info', '{
    "address": "123 Main Road, City, State - 000000",
    "phone": "+91 00000 00000",
    "email": "info@mahalaxmiautomobiles.com",
    "hours": "Mon – Sat: 9:00 AM – 7:00 PM"
  }')
on conflict (page, section) do nothing;
