-- ============================================================
-- BINAUSAHA SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Comprehensive PostgreSQL Relational Schema with Row Level Security (RLS)
-- ============================================================

-- 1. Create custom helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (
      role = 'admin'
      OR email IN ('databasemanb@gmail.com', 'admin@binausaha.id')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- 2. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  whatsapp TEXT,
  business_name TEXT,
  provider TEXT NOT NULL DEFAULT 'form',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on email & role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile or admins update any"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('website', 'pos', 'legalitas', 'bundling')),
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_pct NUMERIC,
  price_unit TEXT NOT NULL DEFAULT '/ paket',
  description TEXT NOT NULL,
  badge TEXT,
  badge_type TEXT,
  bonus TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'Package',
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public read, Admin write
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 4. ARTICLES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('legalitas', 'digital', 'keuangan', 'pemasaran', 'operasional', 'skala-usaha')),
  category_label TEXT NOT NULL DEFAULT 'Informasi',
  date TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '3 Min baca',
  image TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Tim BinaUsaha',
  author_role TEXT DEFAULT 'Redaksi & Edukasi Bisnis',
  featured BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Articles Policies: Public read, Admin write
CREATE POLICY "Articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert articles"
  ON public.articles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update articles"
  ON public.articles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 5. ORDERS TABLE (Linked to auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product TEXT NOT NULL,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  wa TEXT NOT NULL,
  email TEXT,
  total TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Verifikasi' CHECK (status IN ('Verifikasi', 'Pengerjaan', 'QC & Training', 'Selesai')),
  addons TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  tracking_number TEXT,
  document_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_wa ON public.orders(wa);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users can view their own orders or admins view all"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR auth.role() = 'anon' -- Allows public order tracking lookup
  );

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin() OR auth.uid() = user_id)
  WITH CHECK (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 6. RFQS (REQUEST FOR QUOTATION) TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rfqs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nama TEXT NOT NULL,
  perusahaan TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT,
  kategori TEXT NOT NULL,
  lokasi TEXT,
  detail TEXT NOT NULL,
  jumlah TEXT,
  waktu TEXT,
  status TEXT NOT NULL DEFAULT 'Baru' CHECK (status IN ('Baru', 'Diproses', 'Penawaran Terkirim', 'Deal', 'Batal')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfqs_user_id ON public.rfqs(user_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON public.rfqs(status);

-- Enable RLS on rfqs
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;

-- RFQ Policies
CREATE POLICY "Anyone can submit RFQ"
  ON public.rfqs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users view their own RFQs or admins view all"
  ON public.rfqs FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update RFQs"
  ON public.rfqs FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete RFQs"
  ON public.rfqs FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 7. AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_role TEXT := 'customer';
BEGIN
  v_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  IF new.email IN ('databasemanb@gmail.com', 'admin@binausaha.id') THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    role,
    whatsapp,
    business_name,
    provider
  )
  VALUES (
    new.id,
    v_name,
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    v_role,
    new.raw_user_meta_data->>'whatsapp',
    new.raw_user_meta_data->>'business_name',
    COALESCE(new.raw_app_meta_data->>'provider', 'form')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 8. SUPABASE STORAGE BUCKETS CONFIGURATION
-- ------------------------------------------------------------
-- Insert storage buckets if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('articles', 'articles', true),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Avatars (Public Read, Owner Upload)
CREATE POLICY "Public avatar read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated user upload avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Storage Policies for Articles (Public Read, Admin Write)
CREATE POLICY "Public article image read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'articles');

CREATE POLICY "Admin upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'articles' AND public.is_admin());

-- Storage Policies for Documents (Private, Owner or Admin Access)
CREATE POLICY "Owner or Admin can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

CREATE POLICY "Authenticated users or admin upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
