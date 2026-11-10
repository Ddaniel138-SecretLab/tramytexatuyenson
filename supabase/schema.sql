-- Trạm Y tế xã Tuyên Sơn - Supabase schema
-- Run once in Supabase SQL Editor on a new project.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('ADMIN', 'STAFF');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.announcement_type as enum (
    'VACCINATION', 'DISEASE_PREVENTION', 'HEALTH_CHECK', 'NUTRITION', 'MEDICAL_NOTICE', 'OTHER'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.announcement_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  address text,
  phone text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- All staff records live in profiles. There is intentionally no separate staff table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'STAFF',
  facility_id uuid references public.facilities(id) on delete set null,
  phone text,
  position text,
  avatar_url text,
  must_change_password boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text not null,
  type public.announcement_type not null default 'OTHER',
  facility_id uuid references public.facilities(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status public.announcement_status not null default 'DRAFT',
  cover_image_url text,
  attachments jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements
  add column if not exists attachments jsonb not null default '[]'::jsonb;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text,
  actor_email text,
  entity_type text not null,
  entity_id uuid,
  target_user_id uuid,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_facility_id on public.profiles(facility_id);
create index if not exists idx_profiles_active_staff on public.profiles(role, is_active, full_name);
create index if not exists idx_announcements_facility_id on public.announcements(facility_id);
create index if not exists idx_announcements_author_id on public.announcements(author_id);
create index if not exists idx_announcements_public on public.announcements(status, published_at desc);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists facilities_updated_at on public.facilities;
create trigger facilities_updated_at before update on public.facilities
for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists announcements_updated_at on public.announcements;
create trigger announcements_updated_at before update on public.announcements
for each row execute function public.set_updated_at();

alter table public.facilities enable row level security;
alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.audit_logs enable row level security;

-- Public visitors can only see active facilities.
grant select on public.facilities to anon, authenticated;
drop policy if exists facilities_public_read on public.facilities;
create policy facilities_public_read on public.facilities
for select to anon, authenticated using (is_active = true);

-- A signed-in account can read its own profile and edit only personal fields.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, position, avatar_url) on public.profiles to authenticated;
drop policy if exists profiles_read_self on public.profiles;
create policy profiles_read_self on public.profiles
for select to authenticated using (id = (select auth.uid()));
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (id = (select auth.uid()) and is_active = true)
with check (id = (select auth.uid()));

-- Public visitors only see published announcements that have not expired.
grant select on public.announcements to anon, authenticated;
drop policy if exists announcements_public_read on public.announcements;
create policy announcements_public_read on public.announcements
for select to anon, authenticated
using (
  status = 'PUBLISHED'
  and (expires_at is null or expires_at > now())
);

-- A staff member can read published notices in their own facility and their own drafts.
drop policy if exists announcements_staff_read on public.announcements;
create policy announcements_staff_read on public.announcements
for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'STAFF'
      and p.is_active = true
      and p.must_change_password = false
      and p.facility_id is not null
      and p.facility_id = announcements.facility_id
      and (announcements.status = 'PUBLISHED' or announcements.author_id = (select auth.uid()))
  )
);

grant insert, update, delete on public.announcements to authenticated;
drop policy if exists announcements_staff_insert on public.announcements;
create policy announcements_staff_insert on public.announcements
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'STAFF'
      and p.is_active = true and p.must_change_password = false
      and p.facility_id is not null and p.facility_id = announcements.facility_id
  )
);
drop policy if exists announcements_staff_update on public.announcements;
create policy announcements_staff_update on public.announcements
for update to authenticated
using (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role = 'STAFF' and p.is_active = true
      and p.must_change_password = false and p.facility_id = announcements.facility_id
  )
)
with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role = 'STAFF' and p.is_active = true
      and p.must_change_password = false and p.facility_id = announcements.facility_id
  )
);
drop policy if exists announcements_staff_delete on public.announcements;
create policy announcements_staff_delete on public.announcements
for delete to authenticated
using (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role = 'STAFF' and p.is_active = true
      and p.must_change_password = false and p.facility_id = announcements.facility_id
  )
);

-- Audit logs are server-written using the secret key; no public/authenticated policies are granted.
revoke all on public.audit_logs from anon, authenticated;


-- Supabase Storage buckets for public health content and staff avatars.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('staff-avatars', 'staff-avatars', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('announcement-images', 'announcement-images', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('announcement-attachments', 'announcement-attachments', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Staff can upload/replace their own avatar only. Objects are public-read because the bucket is public.
drop policy if exists staff_avatar_upload_own on storage.objects;
create policy staff_avatar_upload_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'staff-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'STAFF'
      and p.is_active = true and p.must_change_password = false
  )
);

drop policy if exists staff_avatar_delete_own on storage.objects;
create policy staff_avatar_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'staff-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Announcement media path: {facility_id|admin}/{auth.uid()}/{uuid-file}.
-- Staff can only upload into their assigned facility; admins can upload for any scope.
drop policy if exists announcement_media_upload on storage.objects;
create policy announcement_media_upload on storage.objects
for insert to authenticated
with check (
  bucket_id in ('announcement-images', 'announcement-attachments')
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.is_active = true
      and p.must_change_password = false
      and (
        p.role = 'ADMIN'
        or (
          p.role = 'STAFF' and p.facility_id is not null
          and (storage.foldername(name))[1] = p.facility_id::text
        )
      )
  )
);

drop policy if exists announcement_media_delete_own on storage.objects;
create policy announcement_media_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id in ('announcement-images', 'announcement-attachments')
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.is_active = true
      and (p.role = 'ADMIN' or (p.role = 'STAFF' and p.facility_id::text = (storage.foldername(name))[1]))
  )
);
