-- =====================================================================
-- KOMISI PER PRODUK (persentase ATAU nominal tetap)
-- Jalankan di Supabase -> SQL Editor SETELAH 20261006000100_commission_rate_setting.sql
-- Aman dijalankan berulang.
--
-- commission_type  : 'default' = ikut tarif umum (app_settings.commission_rate)
--                    'percent' = commission_value adalah persen (mis. 25 = 25%)
--                    'fixed'   = commission_value adalah rupiah per penjualan
-- =====================================================================

-- 1) Kolom di produk ------------------------------------------------------
alter table public.products add column if not exists commission_type  text    not null default 'default';
alter table public.products add column if not exists commission_value numeric not null default 0;

alter table public.products drop constraint if exists products_commission_chk;
alter table public.products add constraint products_commission_chk check (
  commission_type in ('default','percent','fixed')
  and commission_value >= 0
  and (commission_type <> 'percent' or commission_value <= 100)
);

-- 2) Catat jenis komisi di tiap baris komisi (untuk tampilan) ---------------
alter table public.commissions add column if not exists commission_type text not null default 'percent';
alter table public.commissions add column if not exists price_verified boolean not null default true;

-- 3) Hitung komisi dari aturan produk (dijalankan di server) ---------------
--    Produk tidak ditemukan -> memakai tarif umum.
create or replace function public.calc_commission(p_product_id text, p_base numeric)
returns table (c_type text, c_rate numeric, c_amount numeric)
language plpgsql stable security definer set search_path = public as $$
declare
  pr public.products%rowtype;
begin
  if p_base is null or p_base <= 0 then
    return query select 'percent'::text, 0::numeric, 0::numeric;
    return;
  end if;

  select * into pr from public.products where id = p_product_id;

  if found and pr.commission_type = 'fixed' then
    -- nominal tetap, tidak boleh melebihi harga paket
    return query select 'fixed'::text,
                        least(floor(pr.commission_value), p_base) / p_base,
                        least(floor(pr.commission_value), p_base);
  elsif found and pr.commission_type = 'percent' then
    return query select 'percent'::text,
                        pr.commission_value / 100,
                        floor(p_base * pr.commission_value / 100);
  else
    return query select 'percent'::text,
                        public.get_commission_rate(),
                        floor(p_base * public.get_commission_rate());
  end if;
end $$;

revoke all on function public.calc_commission(text, numeric) from public;

-- 4) Trigger komisi memakai aturan produk -----------------------------------
create or replace function public.orders_sync_commission()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_price    numeric;
  v_base     numeric;
  v_verified boolean;
  v_type     text;
  v_rate     numeric;
  v_amount   numeric;
begin
  if new.referred_by is null then return new; end if;

  if new.payment_status = 'Lunas' and old.payment_status is distinct from 'Lunas' then
    select price into v_price from public.products where id = new.product_id;

    if v_price is not null and v_price > 0 then
      v_base := v_price;                          -- harga resmi dari database
      v_verified := true;
      select c_type, c_rate, c_amount into v_type, v_rate, v_amount
        from public.calc_commission(new.product_id, v_base);
    else
      v_base := coalesce(new.product_price, 0);   -- dari browser: TIDAK dipercaya
      v_verified := false;                        -- admin akan melihat peringatan
      v_type := 'percent';
      v_rate := public.get_commission_rate();     -- aturan produk tidak dipakai
      v_amount := floor(v_base * v_rate);
    end if;

    if v_base > 0 then
      insert into public.commissions (referrer_id, order_id, base_amount, rate, amount, price_verified, commission_type)
      values (new.referred_by, new.id, v_base, v_rate, v_amount, v_verified, v_type)
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
