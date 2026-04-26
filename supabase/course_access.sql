-- Create table for one-course access
create table if not exists public.course_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  stripe_session_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug),
  unique (stripe_session_id)
);

alter table public.course_access enable row level security;

-- Allow users to read only their own access rows from the client (optional but useful)
drop policy if exists "Users can read own course access" on public.course_access;
create policy "Users can read own course access"
  on public.course_access
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Inserts/updates are handled by server API using service role key.
