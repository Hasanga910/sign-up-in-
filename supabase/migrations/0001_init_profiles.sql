create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
-- Swallows unique_violation so a retried/duplicate insert can never roll
-- back the auth.users insert itself and surface as a 500 from signup.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
exception
  when unique_violation then
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
