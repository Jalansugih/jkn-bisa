-- =====================================================================
-- Refresh cache schema PostgREST
-- Jalankan setelah migration apa pun yang mengubah kolom/tabel, atau kapan
-- saja muncul error PGRST204 ("Could not find the '...' column ... in the
-- schema cache"). Aman dijalankan berulang kali.
-- =====================================================================

-- Pastikan kolom nomor WhatsApp di orders bernama `whatsapp` (bukan `wa`).
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='orders' and column_name='wa')
     and not exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='orders' and column_name='whatsapp') then
    alter table public.orders rename column wa to whatsapp;
  end if;
end $$;

notify pgrst, 'reload schema';
