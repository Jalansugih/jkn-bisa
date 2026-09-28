-- =====================================================================
-- BinaUsaha: perbaikan tabel `orders` (order gagal tersimpan) + metode pembayaran
-- Aman dijalankan berulang (idempotent). Data lama TIDAK hilang.
-- Jalankan SEKALI di Supabase Dashboard -> SQL Editor.
-- =====================================================================

-- 1. Samakan nama kolom dengan yang dipakai kode (orderService.ts)
do $$
begin
  -- wa -> whatsapp
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='wa')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='whatsapp') then
    alter table public.orders rename column wa to whatsapp;
  end if;
  -- user_id -> uid
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='user_id')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='uid') then
    alter table public.orders rename column user_id to uid;
  end if;
  -- date -> order_date
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='date')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='orders' and column_name='order_date') then
    alter table public.orders rename column "date" to order_date;
  end if;
end $$;

-- 2. Kolom yang mungkin belum ada + kolom pembayaran baru
alter table public.orders add column if not exists product_id      text;
alter table public.orders add column if not exists product_price   numeric;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists document_link   text;
alter table public.orders add column if not exists payment_method  text;
alter table public.orders add column if not exists payment_status  text not null default 'Belum Dibayar';

alter table public.orders alter column order_date drop not null;

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in ('Belum Dibayar','Menunggu Verifikasi','Lunas'));

create index if not exists idx_orders_whatsapp on public.orders(whatsapp);

-- 3. RLS: checkout boleh dilakukan tamu maupun user login
alter table public.orders enable row level security;

drop policy if exists "orders_insert" on public.orders;
drop policy if exists "Users can create orders" on public.orders;
create policy "orders_insert" on public.orders
  for insert to anon, authenticated
  with check (uid is null or (auth.uid() is not null and uid = auth.uid()));

grant insert on public.orders to anon, authenticated;

-- 4. RPC pelacakan pesanan untuk tamu (pakai kolom whatsapp)
drop function if exists public.track_order(text);
create function public.track_order(search_term text)
returns table (
  id text, product text, brand text, status text, notes text,
  order_date text, payment_method text, payment_status text, total text
)
language plpgsql security definer set search_path = public as $$
declare normalized_id text;
begin
  if search_term is null or trim(search_term) = '' then return; end if;
  normalized_id := upper(trim(search_term));
  if normalized_id not like 'BU-%' then normalized_id := 'BU-' || normalized_id; end if;

  return query
    select o.id, o.product, o.brand, o.status, o.notes, o.order_date,
           o.payment_method, o.payment_status, o.total
    from public.orders o
    where o.id = normalized_id
       or o.id = upper(trim(search_term))
       or o.whatsapp = trim(search_term)
    order by o.created_at desc
    limit 1;
end $$;

grant execute on function public.track_order(text) to anon, authenticated;
