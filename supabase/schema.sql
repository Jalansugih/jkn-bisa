-- =====================================================================
-- BinaUsaha — Skema Supabase (pengganti Firestore + firestore.rules)
-- =====================================================================
-- Cara pakai: buka Supabase Dashboard -> SQL Editor -> paste semua isi
-- file ini -> Run. Aman dijalankan sekali di project baru yang kosong.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Daftar email admin resmi (satu-satunya sumber kebenaran)
--    Harus SELALU sinkron dengan ADMIN_EMAILS di src/lib/authService.ts
-- ---------------------------------------------------------------------
create or replace function public.is_admin_email(check_email text)
returns boolean
language sql
immutable
as $$
  select lower(trim(check_email)) in (
    'databasemanb@gmail.com',
    'admin@binausaha.id'
  );
$$;

-- ---------------------------------------------------------------------
-- 1. PROFILES  (pengganti collection Firestore `users`)
--    Baris ini otomatis dibuat saat user baru mendaftar (lihat trigger
--    di bagian bawah), id = auth.users.id (uuid dari Supabase Auth).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text not null default 'Mitra UMKM',
  email          text,
  whatsapp       text,
  business_name  text,
  avatar         text,
  provider       text not null default 'form' check (provider in ('google','whatsapp','form')),
  role           text not null default 'customer' check (role in ('admin','customer')),
  joined_at      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Helper: apakah user yang sedang login adalah admin?
-- security definer supaya bisa membaca profiles tanpa terjebak RLS-nya sendiri.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and (
      public.is_admin_email(coalesce(auth.jwt() ->> 'email', ''))
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (
    auth.uid() = id
    and (
      role = 'customer'
      or (role = 'admin' and public.is_admin_email(coalesce(auth.jwt() ->> 'email', '')))
    )
  );

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (public.is_admin() or auth.uid() = id)
  with check (public.is_admin() or auth.uid() = id);

drop policy if exists "profiles_delete" on public.profiles;
create policy "profiles_delete" on public.profiles
  for delete using (public.is_admin());

-- Auto-buat profil saat user baru sign up (email/password ATAU Google OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar, provider, role, joined_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Mitra UMKM'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    case when new.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'form' end,
    case when public.is_admin_email(coalesce(new.email, '')) then 'admin' else 'customer' end,
    to_char(new.created_at, 'DD Month YYYY')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. ORDERS  (pengganti collection Firestore `orders`)
--    id tetap dibuat di client dengan format BU-XXXXXXXXX (lihat
--    generateOrderId() di orderService.ts), bukan uuid.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id                text primary key,
  uid               uuid references auth.users(id) on delete set null,
  product           text not null,
  product_id        text,
  product_price     numeric,
  brand             text not null,
  name              text not null,
  wa                text not null,
  email             text,
  total             text not null,
  date              text,
  status            text not null default 'Verifikasi'
                       check (status in ('Verifikasi','Pengerjaan','QC & Training','Selesai')),
  addons            text[] default '{}',
  notes             text,
  tracking_number   text,
  document_link     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Checkout publik: boleh dibuat siapa saja (guest maupun user login),
-- setara `allow create` di firestore.rules. uid wajib null ATAU cocok
-- dengan user yang sedang login.
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders
  for insert with check (
    uid is null or (auth.uid() is not null and uid = auth.uid())
  );

drop policy if exists "orders_select" on public.orders;
create policy "orders_select" on public.orders
  for select using (public.is_admin() or (auth.uid() is not null and uid = auth.uid()));

drop policy if exists "orders_update" on public.orders;
create policy "orders_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders_delete" on public.orders;
create policy "orders_delete" on public.orders
  for delete using (public.is_admin());

-- Lacak pesanan publik (tamu, tanpa login) TANPA membuka semua data
-- order lewat SELECT langsung — setara Cloud Function `trackOrder`.
-- SECURITY DEFINER = fungsi ini boleh baca tabel orders walau RLS
-- menolak akses langsung untuk guest; hanya kolom aman yang dikembalikan.
create or replace function public.track_order(search_term text)
returns table (
  id text,
  product text,
  brand text,
  status text,
  notes text,
  date text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_id text;
begin
  if search_term is null or trim(search_term) = '' then
    return;
  end if;

  normalized_id := upper(trim(search_term));
  if normalized_id not like 'BU-%' then
    normalized_id := 'BU-' || normalized_id;
  end if;

  return query
    select o.id, o.product, o.brand, o.status, o.notes, o.date
    from public.orders o
    where o.id = normalized_id
       or o.id = upper(trim(search_term))
       or o.wa = trim(search_term)
    limit 1;
end;
$$;

grant execute on function public.track_order(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. RFQS  (pengganti collection Firestore `rfqs`)
-- ---------------------------------------------------------------------
create table if not exists public.rfqs (
  id           text primary key,
  nama         text not null,
  perusahaan   text,
  whatsapp     text not null,
  email        text,
  kategori     text not null,
  lokasi       text,
  detail       text not null,
  jumlah       text,
  waktu        text,
  status       text not null default 'Baru'
                 check (status in ('Baru','Diproses','Penawaran Terkirim','Deal','Batal')),
  admin_notes  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.rfqs enable row level security;

drop policy if exists "rfqs_insert" on public.rfqs;
create policy "rfqs_insert" on public.rfqs for insert with check (true);

drop policy if exists "rfqs_select" on public.rfqs;
create policy "rfqs_select" on public.rfqs for select using (public.is_admin());

drop policy if exists "rfqs_update" on public.rfqs;
create policy "rfqs_update" on public.rfqs for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rfqs_delete" on public.rfqs;
create policy "rfqs_delete" on public.rfqs for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. PRODUCTS  (pengganti collection Firestore `products`)
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id             text primary key,
  name           text not null,
  category       text not null check (category in ('website','pos','legalitas','bundling')),
  price          numeric not null default 0,
  original_price numeric,
  discount_pct   numeric,
  price_unit     text default '/ paket',
  description    text default '',
  badge          text,
  badge_type     text check (badge_type in ('primary','popular','super','bonus','hardware','best')),
  bonus          text,
  features       text[] default '{}',
  icon_name      text default 'Package',
  popular        boolean default false,
  active         boolean default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_select" on public.products;
create policy "products_select" on public.products for select using (true);

drop policy if exists "products_insert" on public.products;
create policy "products_insert" on public.products for insert with check (public.is_admin());

drop policy if exists "products_update" on public.products;
create policy "products_update" on public.products for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_delete" on public.products;
create policy "products_delete" on public.products for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. ARTICLES  (pengganti collection Firestore `articles`)
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id             text primary key,
  title          text not null,
  slug           text,
  status         text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED')),
  category       text not null default 'legalitas',
  category_label text default 'Informasi',
  date           text,
  read_time      text default '3 Min baca',
  image          text,
  excerpt        text default '',
  content_html   text default '',
  author         text default 'Tim BinaUsaha',
  author_role    text default 'Redaksi & Edukasi Bisnis',
  featured       boolean default false,
  views          integer default 0,
  tags           text[] default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "articles_select" on public.articles;
create policy "articles_select" on public.articles for select using (true);

drop policy if exists "articles_insert" on public.articles;
create policy "articles_insert" on public.articles for insert with check (public.is_admin());

drop policy if exists "articles_update" on public.articles;
create policy "articles_update" on public.articles for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "articles_delete" on public.articles;
create policy "articles_delete" on public.articles for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- 6. Realtime (setara onSnapshot Firestore) — aktifkan replication
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.rfqs;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.articles;
alter publication supabase_realtime add table public.profiles;

-- ---------------------------------------------------------------------
-- 7. updated_at otomatis
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_rfqs_updated_at on public.rfqs;
create trigger trg_rfqs_updated_at before update on public.rfqs
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
