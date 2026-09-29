-- =====================================================================
-- REFERRAL & KOMISI
-- Komisi = harga jual produk (sudah setelah diskon) x 30%
-- Dibuat otomatis saat admin mengubah payment_status order jadi 'Lunas'.
-- Jalankan di Supabase -> SQL Editor.
-- =====================================================================

-- 1) Kode referral unik per user -----------------------------------------
alter table public.profiles add column if not exists referral_code text;
create unique index if not exists profiles_referral_code_key on public.profiles (referral_code);

create or replace function public.gen_referral_code()
returns text language plpgsql as $$
declare c text;
begin
  loop
    c := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (select 1 from public.profiles where referral_code = c);
  end loop;
  return c;
end $$;

-- user lama
update public.profiles set referral_code = public.gen_referral_code() where referral_code is null;

-- user baru dapat kode otomatis; user biasa TIDAK bisa mengubah kodenya
create or replace function public.profiles_guard_referral_code()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.referral_code := public.gen_referral_code();
  elsif new.referral_code is distinct from old.referral_code and not public.is_admin() then
    new.referral_code := old.referral_code;
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_referral_code on public.profiles;
create trigger trg_profiles_referral_code
  before insert or update on public.profiles
  for each row execute function public.profiles_guard_referral_code();

-- 2) Kolom referral di orders ---------------------------------------------
alter table public.orders add column if not exists referred_by_code text;
alter table public.orders add column if not exists referred_by uuid references public.profiles(id) on delete set null;

-- Frontend hanya mengirim KODE. Server yang menentukan siapa pemiliknya,
-- dan menolak referral ke diri sendiri (uid / email / WhatsApp sama).
create or replace function public.orders_resolve_referrer()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r public.profiles%rowtype;
  o_wa text := right(regexp_replace(coalesce(new.whatsapp, ''), '\D', '', 'g'), 9);
  r_wa text;
begin
  new.referred_by := null;
  if coalesce(trim(new.referred_by_code), '') = '' then
    return new;
  end if;

  select * into r from public.profiles where referral_code = upper(trim(new.referred_by_code));
  if not found then return new; end if;

  r_wa := right(regexp_replace(coalesce(r.whatsapp, ''), '\D', '', 'g'), 9);

  if r.id is not distinct from new.uid then return new; end if;
  if r.email is not null and new.email is not null and lower(r.email) = lower(new.email) then return new; end if;
  if length(r_wa) >= 9 and r_wa = o_wa then return new; end if;

  new.referred_by := r.id;
  return new;
end $$;

drop trigger if exists trg_orders_resolve_referrer on public.orders;
create trigger trg_orders_resolve_referrer
  before insert on public.orders
  for each row execute function public.orders_resolve_referrer();

-- 3) Tabel komisi ----------------------------------------------------------
create table if not exists public.commissions (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  uuid not null references public.profiles(id) on delete cascade,
  order_id     text not null unique references public.orders(id) on delete cascade,
  base_amount  numeric not null,          -- harga jual (setelah diskon)
  rate         numeric not null,          -- 0.30
  amount       numeric not null,          -- nilai komisi
  status       text not null default 'pending'
                 check (status in ('pending','approved','paid','cancelled')),
  created_at   timestamptz not null default now(),
  approved_at  timestamptz,
  paid_at      timestamptz
);
create index if not exists commissions_referrer_idx on public.commissions (referrer_id);

alter table public.commissions enable row level security;

drop policy if exists "commissions_select" on public.commissions;
create policy "commissions_select" on public.commissions
  for select using (public.is_admin() or referrer_id = auth.uid());

-- Tidak ada policy INSERT: komisi hanya dibuat oleh trigger di bawah.
drop policy if exists "commissions_update" on public.commissions;
create policy "commissions_update" on public.commissions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "commissions_delete" on public.commissions;
create policy "commissions_delete" on public.commissions
  for delete using (public.is_admin());

create or replace function public.commissions_stamp()
returns trigger language plpgsql as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then new.approved_at := now(); end if;
  if new.status = 'paid'     and old.status is distinct from 'paid'     then new.paid_at := now(); end if;
  return new;
end $$;

drop trigger if exists trg_commissions_stamp on public.commissions;
create trigger trg_commissions_stamp
  before update on public.commissions
  for each row execute function public.commissions_stamp();

-- 4) Buat komisi saat order Lunas -------------------------------------------
create or replace function public.orders_sync_commission()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rate constant numeric := 0.30;   -- UBAH DI SINI kalau persentase berubah
  v_base numeric;
begin
  if new.referred_by is null then return new; end if;

  if new.payment_status = 'Lunas' and old.payment_status is distinct from 'Lunas' then
    -- harga diambil dari tabel products (bukan dari data kiriman browser);
    -- cadangan: product_price di order.
    v_base := coalesce((select price from public.products where id = new.product_id),
                       new.product_price, 0);
    if v_base > 0 then
      insert into public.commissions (referrer_id, order_id, base_amount, rate, amount)
      values (new.referred_by, new.id, v_base, v_rate, floor(v_base * v_rate))
      on conflict (order_id) do update
        set status = 'pending'
        where public.commissions.status = 'cancelled';
    end if;

  elsif old.payment_status = 'Lunas' and new.payment_status is distinct from 'Lunas' then
    update public.commissions set status = 'cancelled'
    where order_id = new.id and status in ('pending','approved');
  end if;

  return new;
end $$;

drop trigger if exists trg_orders_sync_commission on public.orders;
create trigger trg_orders_sync_commission
  after update of payment_status on public.orders
  for each row execute function public.orders_sync_commission();

-- Contoh: setujui otomatis komisi yang sudah lewat 14 hari (masa refund)
-- update public.commissions set status = 'approved'
--   where status = 'pending' and created_at < now() - interval '14 days';
