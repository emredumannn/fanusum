-- Fanusum · bildirim sunucusu tabloları
-- Supabase > SQL Editor > New query > yapıştır > Run
-- (Tablolara sadece "fanus" Edge Function erişir; RLS açık, herkese açık izin yok.)

create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.fanus_config (
  id int primary key default 1 check (id = 1),
  vapid_public text not null,
  vapid_private text not null,
  vapid_subject text not null,
  admin_secret text not null,
  cron_secret text not null,
  site_url text not null,
  sender_name text not null default 'Emre'
);

create table if not exists public.fanus_devices (
  id uuid primary key default gen_random_uuid(),
  device_key text unique not null,
  approved boolean not null default false,
  endpoint text, p256dh text, auth text,
  prefs jsonb not null default '{}'::jsonb,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fanus_messages (
  id bigint generated always as identity primary key,
  text text not null check (char_length(text) between 1 and 300),
  created_at timestamptz not null default now()
);

create table if not exists public.fanus_sent (
  device_id uuid not null references public.fanus_devices(id) on delete cascade,
  day text not null,
  kind text not null,
  sent_at timestamptz not null default now(),
  primary key (device_id, day, kind)
);

alter table public.fanus_config   enable row level security;
alter table public.fanus_devices  enable row level security;
alter table public.fanus_messages enable row level security;
alter table public.fanus_sent     enable row level security;
