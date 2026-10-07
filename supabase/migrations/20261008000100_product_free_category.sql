-- Kategori produk bebas: admin boleh menulis kategori baru secara manual.
-- Database lama membatasi products.category (CHECK 4 nilai atau tipe enum
-- "product_category"), sehingga kategori baru ditolak.
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.

-- 1) Buang CHECK lama yang membatasi kategori (jika ada)
do $$
declare c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.products'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%category%'
      and conname <> 'products_category_len_chk'
  loop
    execute format('alter table public.products drop constraint %I', c.conname);
  end loop;
end $$;

-- 2) Ubah tipe kolom menjadi text bila masih enum (atau tipe lain selain text)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'category'
      and data_type <> 'text'
  ) then
    alter table public.products alter column category drop default;
    alter table public.products alter column category type text using category::text;
  end if;
end $$;

-- 3) Batasi panjang saja: 1 sampai 40 karakter
alter table public.products drop constraint if exists products_category_len_chk;
alter table public.products add constraint products_category_len_chk
  check (char_length(btrim(category)) between 1 and 40);