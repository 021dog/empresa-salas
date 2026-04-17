-- SQL for Supabase Editor

-- 1. Profiles Table (Auth integration)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- 2. Rooms Table
create table rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  capacity integer not null,
  price_per_hour decimal,
  description text,
  image_url text,
  features text[],
  status text default 'available' check (status in ('available', 'busy', 'maintenance')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table rooms enable row level security;

-- 3. Companies Table
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo_url text,
  sector text,
  employee_count integer,
  resident_since date,
  contact_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table companies enable row level security;

-- 4. Bookings Table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bookings enable row level security;

-- 5. Waitlist Table
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_email text not null,
  interest_type text,
  priority integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table waitlist enable row level security;

-- RLS POLICIES (Simplest version: public read, auth write for demo)
-- Profiles: Users can read all, edit own
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Rooms: Public read, Admin write
create policy "Rooms are viewable by everyone" on rooms for select using (true);
create policy "Admins can manage rooms" on rooms for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Companies: Public read, Admin write
create policy "Companies are viewable by everyone" on companies for select using (true);

-- Bookings: Auth read own, Auth create, Admin manage all
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
