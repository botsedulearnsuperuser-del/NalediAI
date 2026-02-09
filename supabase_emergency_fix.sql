-- FIX: Drop the broken artifacts first
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- RE-CREATE the function with CORRECT search_path
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

-- RE-CREATE the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
