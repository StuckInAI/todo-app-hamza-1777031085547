-- Create todos table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.todos enable row level security;

-- Allow anyone (anon) to read all todos
create policy "Allow public read"
  on public.todos
  for select
  to anon
  using (true);

-- Allow anyone (anon) to insert todos
create policy "Allow public insert"
  on public.todos
  for insert
  to anon
  with check (true);

-- Allow anyone (anon) to update todos
create policy "Allow public update"
  on public.todos
  for update
  to anon
  using (true)
  with check (true);

-- Allow anyone (anon) to delete todos
create policy "Allow public delete"
  on public.todos
  for delete
  to anon
  using (true);
