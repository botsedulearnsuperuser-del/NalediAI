-- FIX: Row-Level Security Policies for Salon Data Management

-- Enable RLS (already enabled, but ensuring)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;

-- 1. SALONS POLICIES
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Owners can manage their salons" ON public.salons;
DROP POLICY IF EXISTS "Salons are viewable by everyone" ON public.salons;

CREATE POLICY "Salons are viewable by everyone" ON public.salons FOR SELECT USING (true);
CREATE POLICY "Owners can manage their salons" ON public.salons FOR ALL TO authenticated 
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 2. SERVICES POLICIES
DROP POLICY IF EXISTS "Manager manage services" ON public.services;
DROP POLICY IF EXISTS "Public view services" ON public.services;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;

CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Managers can manage their own services" ON public.services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.salons WHERE id = services.salon_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.salons WHERE id = services.salon_id AND owner_id = auth.uid()));

-- 3. STYLISTS POLICIES
DROP POLICY IF EXISTS "Manager manage stylists" ON public.stylists;
DROP POLICY IF EXISTS "Public view stylists" ON public.stylists;
DROP POLICY IF EXISTS "Stylists are viewable by everyone" ON public.stylists;

CREATE POLICY "Stylists are viewable by everyone" ON public.stylists FOR SELECT USING (true);
CREATE POLICY "Managers can manage their own stylists" ON public.stylists FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.salons WHERE id = stylists.salon_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.salons WHERE id = stylists.salon_id AND owner_id = auth.uid()));

-- 4. SALON GALLERY POLICIES
DROP POLICY IF EXISTS "Manager manage gallery" ON public.salon_gallery;
DROP POLICY IF EXISTS "Public view gallery" ON public.salon_gallery;

CREATE POLICY "Gallery viewable by everyone" ON public.salon_gallery FOR SELECT USING (true);
CREATE POLICY "Managers can manage their own gallery" ON public.salon_gallery FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.salons WHERE id = salon_gallery.salon_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.salons WHERE id = salon_gallery.salon_id AND owner_id = auth.uid()));
