-- Supabase Database Setup for Tirelo App

-- 1. Profiles Table (Shared by Users and Salon Managers)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client', -- 'client' or 'provider'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Salons Table
CREATE TABLE salons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_live BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open', -- 'open' or 'closed'
  rating DECIMAL DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Services Table
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  category TEXT,
  duration_mins INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Stylists Table
CREATE TABLE stylists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT, -- e.g. 'Senior Barber'
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  total_price DECIMAL NOT NULL,
  deposit_amount DECIMAL DEFAULT 0.0,
  status TEXT DEFAULT 'pending', -- 'pending', 'upcoming', 'completed', 'canceled'
  type TEXT DEFAULT 'free', -- 'free' or 'deposit'
  payment_proof_url TEXT, -- Screenshot for deposits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Payout Settings
CREATE TABLE payout_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  method_1 TEXT, -- e.g. 'Orange Money'
  number_1 TEXT,
  method_2 TEXT,
  number_2 TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  type TEXT, -- 'booking', 'payment', 'system', 'review'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Suggestions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Sample Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Salons are viewable by everyone" ON salons FOR SELECT USING (true);
CREATE POLICY "Owners can manage their salons" ON salons FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Bookings are viewable by owner and client" ON bookings FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() IN (SELECT owner_id FROM salons WHERE id = salon_id));

-- 9. Storage Buckets (Manual setup in Supabase Dashboard usually required)
-- But here are the policies for 'tirelo-assets' bucket
-- Bucket should be public for easy viewing or private with signed URLs.
-- Assuming 'tirelo-assets' is the bucket name.

/*
INSERT INTO storage.buckets (id, name, public) VALUES ('tirelo-assets', 'tirelo-assets', true);

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tirelo-assets');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tirelo-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Deletion" ON storage.objects FOR DELETE USING (bucket_id = 'tirelo-assets' AND auth.uid() = owner);
*/
