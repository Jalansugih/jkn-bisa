-- =====================================================================
-- Foto produk (kolom image_url + Storage bucket `products`)
-- Jalankan sekali di Supabase → SQL Editor. Aman dijalankan ulang.
-- =====================================================================

-- 1) Kolom URL foto produk (opsional; kosong = kartu tampil dengan ikon seperti biasa).
alter table public.products add column if not exists image_url text;

-- 2) Bucket publik untuk foto produk (maks 2 MB per file, hanya gambar).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 2097152,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

-- 3) Policy: siapa saja boleh melihat, hanya admin yang boleh mengubah.
drop policy if exists "products_storage_read"   on storage.objects;
drop policy if exists "products_storage_insert" on storage.objects;
drop policy if exists "products_storage_update" on storage.objects;
drop policy if exists "products_storage_delete" on storage.objects;

create policy "products_storage_read" on storage.objects
  for select using (bucket_id = 'products');

create policy "products_storage_insert" on storage.objects
  for insert with check (bucket_id = 'products' and public.is_admin());

create policy "products_storage_update" on storage.objects
  for update using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

create policy "products_storage_delete" on storage.objects
  for delete using (bucket_id = 'products' and public.is_admin());
