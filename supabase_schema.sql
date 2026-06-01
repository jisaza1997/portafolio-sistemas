-- SQL Schema for Supabase certifications table
-- Copy and paste this into the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

create table public.certifications (
  id text primary key,
  title_es text not null,
  title_en text not null,
  issuer text not null,
  date text not null,
  category text not null,
  skills text[] not null, -- Postgres text array for skills list
  filename text
);

-- Enable Row Level Security (RLS) for compliance and secure access control
alter table public.certifications enable row level security;

-- Create policy to allow public select (read-only) access
create policy "Allow public read access"
  on public.certifications
  for select
  to public
  using (true);

-- Create policy to allow authenticated service role write/upsert access
create policy "Allow service_role write access"
  on public.certifications
  for all
  to service_role
  using (true)
  with check (true);
