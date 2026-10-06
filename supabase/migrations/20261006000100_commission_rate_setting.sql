-- =====================================================================
-- TARIF KOMISI DIATUR ADMIN
-- Jalankan di Supabase -> SQL Editor SETELAH migrasi referral sebelumnya.
-- Aman dijalankan berulang.
-- =====================================================================

-- 1) Tabel pengaturan umum (key-value) -----------------------------------
create table if not exists public.app_settings (
  key        text primary key,
  value      numeric not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

-- Semua orang boleh MEMBACA (tarif ditampilkan di tombol "Bagikan & dapat ...")
drop policy if exists "app_settings_select" on public.app_settings;
create policy "app_settings_select" on public.app_settings for select using (true);

-- Hanya admin yang boleh mengubah
drop policy if exists "app_settings_insert" on public.app_settings;
create policy "app_settings_insert" on public.app_settings
  for insert with check (public.is_admin());

drop policy if exists "app_settings_update" on public.app_settings;
create policy "app_settings_update" on public.app_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- Nilai awal: 30% (tidak menimpa kalau sudah ada)
insert into public.app_settings (key, value) values ('commission_rate', 0.30)
on conflict (key) do nothing;

-- Batasi nilai wajar: 0% - 100%
alter table public.app_settings drop constraint if exists app_settings_commission_range;
alter table public.app_settings add constraint app_settings_commission_range
  check (key <> 'commission_rate' or (value >= 0 and value <= 1));

create or replace function public.app_settings_stamp()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_app_settings_stamp on public.app_settings;
create trigger trg_app_settings_stamp before update on public.app_settings
  for each row execute function public.app_settings_stamp();

-- 2) Fungsi pembaca tarif (cadangan 30% bila baris belum ada) -----------
create or replace function public.get_commission_rate()
returns numeric language sql stable security definer set search_path = public as $$
  select coalesce((select value from public.app_settings where key = 'commission_rate'), 0.30);
$$;
grant execute on function public.get_commission_rate() to anon, authenticated;

-- 3) Trigger komisi sekarang memakai tarif dari pengaturan ---------------
--    Tarif dicatat di kolom `rate` setiap komisi, jadi komisi lama TIDAK
--    berubah ketika tarif diganti; hanya pesanan yang Lunas sesudahnya.
create or replace function public.orders_sync_commission()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rate     numeric := public.get_commission_rate();
  v_price    numeric;
  v_base     numeric;
  v_verified boolean;
begin
  if new.referred_by is null then return new; end if;

  if new.payment_status = 'Lunas' and old.payment_status is distinct from 'Lunas' then
    select price into v_price from public.products where id = new.product_id;

    if v_price is not null and v_price > 0 then
      v_base := v_price;
      v_verified := true;
    else
      v_base := coalesce(new.product_price, 0);
      v_verified := false;
    end if;

    if v_base > 0 then
      insert into public.commissions (referrer_id, order_id, base_amount, rate, amount, price_verified)
      values (new.referred_by, new.id, v_base, v_rate, floor(v_base * v_rate), v_verified)
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

-- price_verified dipakai fungsi di atas; pastikan kolomnya ada
alter table public.commissions add column if not exists price_verified boolean not null default true;
