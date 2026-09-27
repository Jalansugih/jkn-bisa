-- Migration: rename kolom `orders.date` -> `orders.order_date`
-- Kenapa: `date` adalah nama tipe bawaan Postgres, memakainya sebagai nama
-- kolom valid tapi ambigu/rawan salah baca di RPC & raw SQL. Diseragamkan
-- jadi `order_date` (schema.sql versi baru juga sudah pakai nama ini).
--
-- AMAN dijalankan di database production yang sudah berjalan: ini murni
-- RENAME COLUMN, data yang sudah ada tidak hilang / tidak berubah.
-- Jalankan SEKALI lewat Supabase SQL Editor, lalu redeploy frontend yang
-- sudah memakai `order_date` (lihat orderService.ts & adminService.ts).

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'date'
  ) then
    alter table public.orders rename column "date" to order_date;
  end if;
end $$;

-- Perbarui juga RPC track_order supaya kolom yang dikembalikan bernama
-- order_date. PENTING: Postgres TIDAK MENGIZINKAN `create or replace
-- function` mengubah nama kolom RETURNS TABLE (akan gagal dengan error
-- "cannot change name of output parameter") — jadi function ini harus
-- di-drop dulu, baru dibuat ulang. Grant juga ikut hilang saat drop,
-- makanya di-grant ulang di baris paling bawah.
drop function if exists public.track_order(text);

create function public.track_order(search_term text)
returns table (
  id text,
  product text,
  brand text,
  status text,
  notes text,
  order_date text
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
    select o.id, o.product, o.brand, o.status, o.notes, o.order_date
    from public.orders o
    where o.id = normalized_id
       or o.id = upper(trim(search_term))
       or o.wa = trim(search_term)
    limit 1;
end;
$$;

grant execute on function public.track_order(text) to anon, authenticated;
