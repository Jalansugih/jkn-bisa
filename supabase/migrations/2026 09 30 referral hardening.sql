-- =====================================================================
-- PENGERASAN ANTI-CURANG untuk referral & komisi
-- Jalankan SETELAH 2026-09-30_referral_commission.sql
-- =====================================================================

-- 1) Tamu/user biasa tidak boleh menentukan status order & pembayaran sendiri.
--    (Policy orders_insert mengizinkan insert semua kolom, jadi tanpa ini seseorang
--     bisa mengirim order dengan payment_status = 'Lunas' lewat API Supabase langsung.)
create or replace function public.orders_lock_client_fields()
returns trigger language plpgsql as $$
begin
  if not public.is_admin() then
    new.payment_status  := 'Belum Dibayar';
    new.status          := 'Verifikasi';
    new.tracking_number := null;
    new.document_link   := null;
  end if;
  return new;
end $$;

drop trigger if exists trg_orders_lock_client_fields on public.orders;
create trigger trg_orders_lock_client_fields
  before insert on public.orders
  for each row execute function public.orders_lock_client_fields();

-- 2) Komisi ditandai kalau harganya tidak bisa diverifikasi dari tabel products.
alter table public.commissions add column if not exists price_verified boolean not null default true;

create or replace function public.orders_sync_commission()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rate     constant numeric := 0.30;   -- UBAH DI SINI kalau persentase berubah
  v_price    numeric;
  v_base     numeric;
  v_verified boolean;
begin
  if new.referred_by is null then return new; end if;

  if new.payment_status = 'Lunas' and old.payment_status is distinct from 'Lunas' then
    select price into v_price from public.products where id = new.product_id;

    if v_price is not null and v_price > 0 then
      v_base := v_price;                      -- harga resmi dari database
      v_verified := true;
    else
      v_base := coalesce(new.product_price, 0); -- dari browser: TIDAK dipercaya
      v_verified := false;                    -- admin akan melihat peringatan
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