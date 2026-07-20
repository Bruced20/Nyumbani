-- Add last_login_at and provider columns to profiles table
alter table public.profiles 
add column last_login_at timestamp with time zone default timezone('utc'::text, now()),
add column provider text default 'google';

-- Update handle_new_user trigger function to log the initial signup details
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, last_login_at, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'Renter',
    timezone('utc'::text, now()),
    new.raw_app_meta_data->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;
