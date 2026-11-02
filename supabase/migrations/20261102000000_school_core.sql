-- SifoSchool dedicated database baseline.
-- Apply only to the SifoSchool Supabase project after review; never to SifoBooks.
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_type text not null default 'private',
  registration_no text,
  tpin text,
  currency text not null default 'ZMW',
  owner_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check(role in ('owner','admin','head_teacher','bursar','teacher','registrar','parent','viewer')),
  created_at timestamptz not null default now(),
  primary key(organization_id,user_id)
);

create or replace function public.is_school_member(target_org uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=auth.uid()); $$;

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique(organization_id,name),
  check(ends_on>=starts_on)
);

create table if not exists public.academic_terms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  unique(organization_id,academic_year_id,name),
  check(ends_on>=starts_on)
);

create table if not exists public.school_classes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id),
  name text not null,
  grade_level text,
  class_teacher_id uuid references auth.users(id),
  capacity integer not null default 40 check(capacity>0),
  created_at timestamptz not null default now(),
  unique(organization_id,academic_year_id,name)
);

create table if not exists public.school_subjects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subject_code text not null,
  name text not null,
  is_active boolean not null default true,
  unique(organization_id,subject_code)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_no text not null,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  gender text,
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  address text,
  enrolment_date date not null default current_date,
  status text not null default 'active' check(status in ('applicant','active','transferred','graduated','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,student_no)
);

create table if not exists public.student_enrolments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_id uuid not null references public.students(id),
  academic_year_id uuid not null references public.academic_years(id),
  class_id uuid not null references public.school_classes(id),
  enrolment_status text not null default 'enrolled' check(enrolment_status in ('enrolled','promoted','repeated','withdrawn')),
  created_at timestamptz not null default now(),
  unique(organization_id,student_id,academic_year_id)
);

create table if not exists public.school_attendance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_id uuid not null references public.students(id),
  class_id uuid not null references public.school_classes(id),
  attendance_date date not null default current_date,
  status text not null check(status in ('present','absent','late','excused')),
  remarks text,
  recorded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(organization_id,student_id,attendance_date)
);

create table if not exists public.fee_structures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id),
  class_id uuid references public.school_classes(id),
  fee_code text not null,
  description text not null,
  amount numeric(14,2) not null check(amount>=0),
  due_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(organization_id,academic_year_id,fee_code,class_id)
);

create table if not exists public.student_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_id uuid not null references public.students(id),
  invoice_no text not null,
  issue_date date not null default current_date,
  due_date date,
  currency text not null default 'ZMW',
  total numeric(14,2) not null check(total>=0),
  status text not null default 'unpaid' check(status in ('draft','unpaid','part_paid','paid','void')),
  created_at timestamptz not null default now(),
  unique(organization_id,invoice_no)
);

create table if not exists public.student_invoice_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.student_invoices(id) on delete cascade,
  fee_structure_id uuid references public.fee_structures(id),
  description text not null,
  quantity numeric(12,3) not null default 1 check(quantity>0),
  unit_amount numeric(14,2) not null check(unit_amount>=0),
  line_total numeric(14,2) not null check(line_total>=0)
);

create table if not exists public.fee_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_id uuid not null references public.students(id),
  invoice_id uuid references public.student_invoices(id),
  receipt_no text not null,
  amount numeric(14,2) not null check(amount>0),
  currency text not null default 'ZMW',
  method text not null check(method in ('cash','bank','mobile_money','card','other')),
  payment_reference text,
  payment_date timestamptz not null default now(),
  recorded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(organization_id,receipt_no)
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  staff_no text not null,
  full_name text not null,
  phone text,
  email text,
  job_title text,
  employment_status text not null default 'active' check(employment_status in ('active','on_leave','terminated')),
  created_at timestamptz not null default now(),
  unique(organization_id,staff_no)
);

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  student_id uuid not null references public.students(id),
  subject_id uuid not null references public.school_subjects(id),
  academic_term_id uuid not null references public.academic_terms(id),
  assessment_name text not null,
  marks_obtained numeric(8,2) not null check(marks_obtained>=0),
  maximum_marks numeric(8,2) not null check(maximum_marks>0),
  grade text,
  remarks text,
  created_at timestamptz not null default now(),
  unique(organization_id,student_id,subject_id,academic_term_id,assessment_name),
  check(marks_obtained<=maximum_marks)
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
create policy "school org members read own org" on public.organizations for select using(public.is_school_member(id));
create policy "school owner creates org" on public.organizations for insert with check(owner_user_id=auth.uid());
create policy "school owner updates org" on public.organizations for update using(owner_user_id=auth.uid()) with check(owner_user_id=auth.uid());
create policy "school members read membership" on public.organization_members for select using(public.is_school_member(organization_id));
create policy "school owner adds first members" on public.organization_members for insert with check(
  user_id=auth.uid() and role='owner' and exists(select 1 from public.organizations o where o.id=organization_id and o.owner_user_id=auth.uid())
);

do $$ declare t text; begin
  foreach t in array array['academic_years','academic_terms','school_classes','school_subjects','students','student_enrolments','school_attendance','fee_structures','student_invoices','student_invoice_lines','fee_payments','staff_members','exam_results'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('create policy "school members manage %1$I" on public.%1$I for all using(public.is_school_member(organization_id)) with check(public.is_school_member(organization_id))',t);
  end loop;
end $$;

create index if not exists students_status_idx on public.students(organization_id,status,last_name);
create index if not exists attendance_date_idx on public.school_attendance(organization_id,attendance_date,class_id);
create index if not exists invoices_due_idx on public.student_invoices(organization_id,due_date,status);
create index if not exists payments_date_idx on public.fee_payments(organization_id,payment_date desc);
create index if not exists exam_results_term_idx on public.exam_results(organization_id,academic_term_id,class_id);
