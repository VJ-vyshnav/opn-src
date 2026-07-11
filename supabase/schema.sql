-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

-- 1. events -----------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  hash text,                 -- short display id, e.g. 'a3f9c1' (cosmetic)
  title text not null,
  event_date date not null,
  location text,
  created_at timestamptz default now()
);

alter table events enable row level security;

create policy "Public can read events"
  on events for select
  using (true);

-- 2. projects -----------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  language text,
  stars int default 0,
  url text,
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Public can read projects"
  on projects for select
  using (true);

-- 3. members (core team) -------------------------------------------------
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  github text,
  is_core boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table members enable row level security;

create policy "Public can read members"
  on members for select
  using (true);

-- 4. membership_requests (write-only from the public site) --------------
create table if not exists membership_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  year text,
  github text,
  why text,
  created_at timestamptz default now()
);

alter table membership_requests enable row level security;

-- Anyone (anon key) can submit a request, but cannot read requests back.
-- Read access should be restricted to authenticated club admins.
create policy "Public can insert membership requests"
  on membership_requests for insert
  with check (true);

create policy "Only authenticated users can read membership requests"
  on membership_requests for select
  using (auth.role() = 'authenticated');

-- Seed data (optional, remove if you'd rather add real data via the dashboard)
insert into events (hash, title, event_date, location) values
  ('b7a91f', 'Kickoff hacknight', '2026-08-14', 'CS Lab 2'),
  ('e21b04', 'Intro to git & your first PR', '2026-08-28', 'Room 104'),
  ('a3f9c1', 'Maintainer talk: scaling a solo project', '2026-09-11', 'Online');

insert into projects (name, description, language, stars, url) values
  ('campus-cli', 'A command-line tool for checking mess menus, bus timings, and wifi status.', 'Go', 42, '#'),
  ('attendance-bot', 'Self-hosted attendance tracker with a Slack bot front-end.', 'TypeScript', 18, '#'),
  ('clubsite', 'This website. Static React front-end, Supabase backend.', 'JavaScript', 9, '#');

insert into members (name, role, github, is_core, sort_order) values
  ('Aditi Rao', 'President', 'aditirao', true, 1),
  ('Kevin Thomas', 'Vice President', 'kevinthomas', true, 2),
  ('Meera Nair', 'Projects Lead', 'meeranair', true, 3),
  ('Sam George', 'Events Lead', 'samgeorge', true, 4);
