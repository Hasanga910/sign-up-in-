-- A failed profiles insert (e.g. duplicate email from a retried/partial
-- signup) previously rolled back the entire auth.users insert, causing
-- GoTrue to return an opaque 500 on signup. Make the trigger resilient
-- instead of letting a profiles-side conflict block account creation.
create or replace function public.handle_new_user()
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
