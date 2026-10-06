-- =====================================================================
-- PENCAIRAN KOMISI AFILIASI
-- Jalankan di Supabase -> SQL Editor SETELAH 20261006000200_product_commission.sql
-- Aman dijalankan berulang.
--
-- Alur:
--   user ajukan pencairan  -> semua komisi 'approved' miliknya TERKUNCI ke satu payout
--   admin transfer manual  -> admin_mark_payout_paid(...) mencatat referensi transfer,
--                             semua komisi di payout itu menjadi 'paid'
--   atau admin menolak     -> admin_reject_payout(...) melepas kunci komisinya
--
-- Asumsi skema dasar (dari migrasi referral awal): tabel profiles(id),
-- commissions(id, referrer_id, order_id, amount, status, paid_at),
-- fungsi public.is_admin(). Sesuaikan bila nama kolom Anda berbeda.
-- =====================================================================

-- 1) Rekening tujuan disimpan di profil (terisi otomatis di pengajuan berikutnya)
alter table public.profiles add column if not exists payout_bank_name      text;
alter table public.profiles add column if not exists payout_account_number text;
alter table public.profiles add column if not exists payout_account_name   text;

-- 2) Catatan pencairan / transfer -------------------------------------------
create table if not exists public.commission_payouts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id),
  amount         numeric not null check (amount > 0),
  status         text not null default 'requested'
                 check (status in ('requested','paid','rejected')),
  -- rekening disalin saat pengajuan, jadi riwayat tidak berubah bila profil diganti
  bank_name      text not null,
  account_number text not null,
  account_name   text not null,
  -- diisi admin
  transfer_ref   text,
  transferred_at timestamptz,
  note           text,
  created_at     timestamptz not null default now(),
  processed_at   timestamptz,
  processed_by   uuid
);

create index if not exists commission_payouts_user_idx   on public.commission_payouts (user_id, created_at desc);
create index if not exists commission_payouts_status_idx on public.commission_payouts (status);

-- Satu pengajuan aktif per user (dijaga juga di database, bukan hanya di fungsi)
create unique index if not exists commission_payouts_one_open
  on public.commission_payouts (user_id) where status = 'requested';

alter table public.commission_payouts enable row level security;

-- User membaca miliknya, admin membaca semua. Tidak ada policy tulis:
-- semua perubahan lewat fungsi di bawah.
drop policy if exists "commission_payouts_select" on public.commission_payouts;
create policy "commission_payouts_select" on public.commission_payouts
  for select using (user_id = auth.uid() or public.is_admin());

-- 3) Kunci komisi ke payout -----------------------------------------------------
alter table public.commissions
  add column if not exists payout_id uuid references public.commission_payouts(id);
create index if not exists commissions_payout_idx on public.commissions (payout_id);

-- 4) Pengaman: aturan yang tidak boleh dilanggar lewat update langsung ------------
--    Fungsi pencairan menyalakan app.payout_op (berlaku hanya dalam transaksinya).
create or replace function public.commissions_guard()
returns trigger language plpgsql as $$
declare
  v_op boolean := coalesce(current_setting('app.payout_op', true), '') = '1';
begin
  if v_op then return new; end if;

  -- komisi yang sudah masuk pengajuan tidak boleh dibatalkan / diubah statusnya
  if old.payout_id is not null and old.status = 'approved'
     and new.status is distinct from 'approved' then
    raise exception 'Komisi % sedang dalam pencairan. Tolak pencairannya dulu sebelum mengubah status.', old.order_id;
  end if;

  -- "dibayar" harus punya catatan transfer
  if new.status = 'paid' and old.status is distinct from 'paid' then
    raise exception 'Komisi hanya bisa ditandai dibayar lewat pencairan (catat transfernya).';
  end if;

  if new.payout_id is distinct from old.payout_id then
    raise exception 'Kaitan komisi ke pencairan hanya diubah lewat fungsi pencairan.';
  end if;

  return new;
end $$;

drop trigger if exists trg_commissions_guard on public.commissions;
create trigger trg_commissions_guard before update on public.commissions
  for each row execute function public.commissions_guard();

-- 5) Batas minimum pencairan (bisa diubah admin di app_settings, key 'min_payout') -
insert into public.app_settings (key, value) values ('min_payout', 50000)
on conflict (key) do nothing;

create or replace function public.get_min_payout()
returns numeric language sql stable security definer set search_path = public as $$
  select coalesce((select value from public.app_settings where key = 'min_payout'), 50000);
$$;
grant execute on function public.get_min_payout() to anon, authenticated;

-- 6) User mengajukan pencairan --------------------------------------------------
create or replace function public.request_payout(
  p_bank_name text, p_account_number text, p_account_name text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_bank  text := btrim(coalesce(p_bank_name, ''));
  v_num   text := regexp_replace(coalesce(p_account_number, ''), '[\s-]', '', 'g');
  v_name  text := btrim(coalesce(p_account_name, ''));
  v_total numeric;
  v_min   numeric := public.get_min_payout();
  v_id    uuid;
begin
  if v_uid is null then raise exception 'Silakan login dulu.'; end if;
  if v_bank = '' or v_name = '' then raise exception 'Nama bank dan nama pemilik rekening wajib diisi.'; end if;
  if v_num !~ '^[0-9]{5,20}$' then raise exception 'Nomor rekening harus berupa angka (5-20 digit).'; end if;

  -- cegah dua pengajuan bersamaan dari user yang sama
  perform pg_advisory_xact_lock(hashtext('payout:' || v_uid::text));

  if exists (select 1 from public.commission_payouts where user_id = v_uid and status = 'requested') then
    raise exception 'Masih ada pengajuan pencairan yang sedang diproses.';
  end if;

  select coalesce(sum(amount), 0) into v_total
    from public.commissions
   where referrer_id = v_uid and status = 'approved' and payout_id is null;

  if v_total < v_min then
    raise exception 'Komisi yang bisa dicairkan Rp % belum mencapai minimum Rp %.',
      to_char(v_total, 'FM999G999G999'), to_char(v_min, 'FM999G999G999');
  end if;

  insert into public.commission_payouts (user_id, amount, bank_name, account_number, account_name)
  values (v_uid, v_total, v_bank, v_num, v_name)
  returning id into v_id;

  perform set_config('app.payout_op', '1', true);
  update public.commissions set payout_id = v_id
   where referrer_id = v_uid and status = 'approved' and payout_id is null;

  update public.profiles
     set payout_bank_name = v_bank, payout_account_number = v_num, payout_account_name = v_name
   where id = v_uid;

  return v_id;
end $$;

revoke all on function public.request_payout(text, text, text) from public, anon;
grant execute on function public.request_payout(text, text, text) to authenticated;

-- 7) Admin: tandai sudah ditransfer ----------------------------------------------
create or replace function public.admin_mark_payout_paid(
  p_payout_id uuid, p_transfer_ref text, p_transferred_at timestamptz default null, p_note text default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  po public.commission_payouts%rowtype;
  v_when timestamptz := coalesce(p_transferred_at, now());
begin
  if not public.is_admin() then raise exception 'Hanya admin.'; end if;

  select * into po from public.commission_payouts where id = p_payout_id for update;
  if not found then raise exception 'Pencairan tidak ditemukan.'; end if;
  if po.status <> 'requested' then raise exception 'Pencairan ini sudah diproses.'; end if;

  perform set_config('app.payout_op', '1', true);
  update public.commissions set status = 'paid', paid_at = v_when
   where payout_id = p_payout_id and status = 'approved';

  update public.commission_payouts
     set status = 'paid',
         transfer_ref = nullif(btrim(coalesce(p_transfer_ref, '')), ''),
         transferred_at = v_when,
         note = nullif(btrim(coalesce(p_note, '')), ''),
         processed_at = now(),
         processed_by = auth.uid()
   where id = p_payout_id;
end $$;

revoke all on function public.admin_mark_payout_paid(uuid, text, timestamptz, text) from public, anon;
grant execute on function public.admin_mark_payout_paid(uuid, text, timestamptz, text) to authenticated;

-- 8) Admin: tolak pencairan (komisi kembali bisa diajukan) -------------------------
create or replace function public.admin_reject_payout(p_payout_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  po public.commission_payouts%rowtype;
begin
  if not public.is_admin() then raise exception 'Hanya admin.'; end if;
  if btrim(coalesce(p_note, '')) = '' then raise exception 'Isi alasan penolakan.'; end if;

  select * into po from public.commission_payouts where id = p_payout_id for update;
  if not found then raise exception 'Pencairan tidak ditemukan.'; end if;
  if po.status <> 'requested' then raise exception 'Pencairan ini sudah diproses.'; end if;

  perform set_config('app.payout_op', '1', true);
  update public.commissions set payout_id = null where payout_id = p_payout_id;

  update public.commission_payouts
     set status = 'rejected', note = btrim(p_note), processed_at = now(), processed_by = auth.uid()
   where id = p_payout_id;
end $$;

revoke all on function public.admin_reject_payout(uuid, text) from public, anon;
grant execute on function public.admin_reject_payout(uuid, text) to authenticated;
