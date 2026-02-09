-- Run this in your Supabase SQL Editor to fix the role assignment

-- 1. Create or Replace the Handler Function
-- This function checks the metadata for a role. If 'manager' is passed, it uses it.
-- Otherwise, it defaults to 'client'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    role = excluded.role,
    full_name = excluded.full_name;
  return new;
end;
$$;

-- 2. Ensure the Trigger Exists
-- This ensures that every time a user signs up via Auth, this function runs.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. (Optional) Fix specific existing users
-- Replace 'your_email@example.com' with the email of the account you want to make a manager.
-- update public.profiles
-- set role = 'manager'
-- from auth.users
-- where profiles.id = auth.users.id
-- and auth.users.email = 'provider@example.com'; 
