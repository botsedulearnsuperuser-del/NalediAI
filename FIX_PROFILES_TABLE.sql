-- RUN THIS IN SUPABASE SQL EDITOR TO FIX MISSING COLUMNS
-- This fixes the issue where the user profile was missing email and name fields.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Make email unique if possible (might fail if duplicates exist, so we keep it simple first)
-- If you want to enforce uniqueness later: ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
