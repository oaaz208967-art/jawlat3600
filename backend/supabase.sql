-- جولات 360 — إعداد قاعدة البيانات على Supabase
-- شغّل هذا الملف كاملًا مرة واحدة من: Supabase → SQL Editor → New query → Run
-- يُنشئ جدولًا واحدًا (kv) يخزّن المستندات على شكل مسارات، مع سياسات أمان (RLS)
-- تطابق قواعد الوصول التي اختُبرت في نسخة المعاينة.

create table if not exists public.kv (
  path       text primary key,
  coll       text not null,
  id         text not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  -- المسار: أجزاء مفصولة بـ "/" وعدد أجزائه زوجي (مجموعة/مستند/مجموعة/مستند …)
  constraint kv_path_format check (
    path ~ '^[A-Za-z0-9_.~:@+-]{1,200}(/[A-Za-z0-9_.~:@+-]{1,200}){1,15}$'
    and (length(path) - length(replace(path, '/', ''))) % 2 = 1
    and length(path) <= 1000
  ),
  constraint kv_coll_matches check (coll = regexp_replace(path, '/[^/]*$', '') and id = regexp_replace(path, '^.*/', '')),
  constraint kv_size check (pg_column_size(data) < 262144)
);
create index if not exists kv_coll_idx on public.kv (coll);
create index if not exists kv_updated_idx on public.kv (updated_at desc);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.kv enable row level security;
alter table public.admins enable row level security;

-- المالك الوحيد: هذا هو البريد الوحيد الذي يملك صلاحية الإدارة (لوحة المالك + إدارة الجولات + إدارة الحجوزات).
-- لتغييره مستقبلًا عدّل هذه الدالة فقط. كلمة المرور لا تُخزَّن هنا أبدًا: تُنشأ من تسجيل الحساب في الموقع (أو من Supabase → Authentication).
create or replace function public.owner_email() returns text
language sql immutable as $$ select 'o.a.a.z.900@gmail.com'::text $$;

-- الإدارة = صف في admins + بريد الحساب هو بريد المالك + البريد مؤكَّد (يتطلب تفعيل Confirm email في Supabase).
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from public.admins a join auth.users u on u.id = a.user_id
    where a.user_id = auth.uid() and lower(u.email) = public.owner_email() and u.email_confirmed_at is not null)
$$;

-- لا يمكن إضافة أي حساب غير حساب المالك إلى admins حتى بالخطأ.
create or replace function public.admins_only_owner() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if not exists (select 1 from auth.users where id = new.user_id and lower(email) = public.owner_email()) then
    raise exception 'ONLY_OWNER_CAN_BE_ADMIN';
  end if;
  return new;
end $$;
drop trigger if exists admins_only_owner on public.admins;
create trigger admins_only_owner before insert or update on public.admins for each row execute function public.admins_only_owner();
delete from public.admins where user_id not in (select id from auth.users where lower(email) = public.owner_email());

-- يستدعيها الموقع بعد تسجيل الدخول: تمنح الصلاحية تلقائيًا لحساب المالك المؤكَّد فقط، وتتجاهل أي حساب آخر.
create or replace function public.claim_owner() returns boolean
language plpgsql security definer set search_path = public, auth as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  if not exists (select 1 from auth.users where id = uid and lower(email) = public.owner_email() and email_confirmed_at is not null) then return false; end if;
  insert into public.admins(user_id) values (uid) on conflict do nothing;
  return true;
end $$;

-- من يقرأ ماذا:
--  • عام (حتى للزائر غير المسجّل): tours, verify, listings, stats, settings, directory, reviews, offers, availability
--  • للمدير + صاحب المسار فقط: submissions, bookings, complaints, partners, ambassadors, events (الجزء الثاني من المسار = معرّف المستخدم)
--  • للمدير فقط: campaigns وأي مجموعة غير مذكورة
create or replace function public.kv_can_read(p text) returns boolean
language sql stable as $$
  select case
    when split_part(p, '/', 1) in ('tours','verify','listings','stats','settings','directory','reviews','offers','availability') then true
    when split_part(p, '/', 1) in ('submissions','bookings','complaints','partners','ambassadors','events')
      then public.is_admin() or (auth.uid() is not null and split_part(p, '/', 2) = auth.uid()::text)
    else public.is_admin()
  end
$$;

-- من يكتب: المالك (المدير) في كل مكان فقط؛ والمستخدم المسجّل في مساحته هو ضمن هذه المجموعات (شكاوى، طلبات شراكة/سفراء، أحداث، تقييمات).
-- ملاحظة: إضافة المنشآت والعروض والتقويم وإعدادات الحجز صارت للمالك فقط. والحجوزات الجديدة في جدول reservations وتُنشأ عبر دوال الخادم فقط.
create or replace function public.kv_can_write(p text) returns boolean
language sql stable as $$
  select public.is_admin() or (
    auth.uid() is not null
    and split_part(p, '/', 1) in ('complaints','partners','ambassadors','events','reviews')
    and split_part(p, '/', 2) = auth.uid()::text
  )
$$;

drop policy if exists kv_select on public.kv;
drop policy if exists kv_insert on public.kv;
drop policy if exists kv_update on public.kv;
drop policy if exists kv_delete on public.kv;
create policy kv_select on public.kv for select using (public.kv_can_read(path));
create policy kv_insert on public.kv for insert to authenticated with check (public.kv_can_write(path));
create policy kv_update on public.kv for update to authenticated using (public.kv_can_write(path)) with check (public.kv_can_write(path));
create policy kv_delete on public.kv for delete to authenticated using (public.kv_can_write(path));

drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid());

grant select on public.kv to anon, authenticated;
grant insert, update, delete on public.kv to authenticated;
grant select on public.admins to authenticated;
revoke insert, update, delete on public.admins from anon, authenticated;


-- =====================================================================
-- الحجز المباشر: ملفات العملاء، الحجوزات، التحقق من الجوال، ودوال الخادم
-- كل ما يخص السعر والحالة يُحسب ويُتحقق منه هنا، لا في المتصفح.
-- =====================================================================

-- تطبيع رقم الجوال السعودي: 05xxxxxxxx / 5xxxxxxxx / +9665xxxxxxxx / 009665xxxxxxxx → 9665xxxxxxxx (وأرقام دولية 10-15 خانة تُقبل كما هي)
create or replace function public.norm_phone(p text) returns text
language plpgsql immutable as $$
declare d text := regexp_replace(coalesce(p, ''), '[^0-9]', '', 'g');
begin
  if d like '00%' then d := substr(d, 3); end if;
  if d ~ '^05[0-9]{8}$' then d := '966' || substr(d, 2);
  elsif d ~ '^5[0-9]{8}$' then d := '966' || d; end if;
  if d !~ '^[0-9]{10,15}$' then return null; end if;
  return d;
end $$;

-- ملفات العملاء (الاسم والجوال). العميل يقرأ ويعدّل ملفه فقط، والمالك يقرأ الكل.
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '' check (char_length(full_name) <= 80),
  phone      text not null default '' check (char_length(phone) <= 20),
  email      text not null default '' check (char_length(email) <= 200),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists profiles_sel on public.profiles;
drop policy if exists profiles_ins on public.profiles;
drop policy if exists profiles_upd on public.profiles;
create policy profiles_sel on public.profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy profiles_ins on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy profiles_upd on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

-- الحجوزات. لا سياسات insert/update/delete: الكتابة فقط عبر الدوال أدناه.
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  place_name text not null default '',
  cat text not null default '',
  btype text not null check (btype in ('stay','ticket','table','appointment','service')),
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  date_from date, date_to date,
  nights int not null default 0,
  qty int not null default 1,
  slot text not null default '',
  service text not null default '',
  extra jsonb not null default '{}'::jsonb,
  note text not null default '',
  price_unit text not null check (price_unit in ('ticket','night','flat','free','inquiry')),
  unit_price numeric(12,2),
  total numeric(12,2),
  instant boolean not null default false,
  phone_verify text not null check (phone_verify in ('demo','sms')),
  status text not null check (status in ('new','pending','confirmed','rejected','cancelled','completed')),
  cancel_requested boolean not null default false,
  admin_reply text not null default '',
  src text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  decided_at timestamptz
);
create index if not exists reservations_user_idx on public.reservations (user_id, created_at desc);
create index if not exists reservations_place_idx on public.reservations (place_id, status);
alter table public.reservations enable row level security;
drop policy if exists reservations_sel on public.reservations;
create policy reservations_sel on public.reservations for select to authenticated using (user_id = auth.uid() or public.is_admin());
revoke all on public.reservations from anon, authenticated;
grant select on public.reservations to authenticated;

-- رموز التحقق من الجوال: لا وصول مباشر إطلاقًا (دوال فقط).
create table if not exists public.phone_otps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone text not null,
  code_hash text not null,
  mode text not null check (mode in ('demo','sms')),
  expires_at timestamptz not null,
  attempts int not null default 0,
  verified_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.phone_otps enable row level security;
revoke all on public.phone_otps from anon, authenticated;

-- وضع التحقق: 'demo' = تجريبي محلي (الرمز يُعرض على الشاشة، ولا يثبت ملكية الرقم).
-- للربط بمزود SMS حقيقي لاحقًا: غيّر هذه الدالة إلى 'sms' وأرسل الرمز من otp_request عبر Edge Function، ولا تُرجعه للمتصفح.
create or replace function public.otp_mode() returns text language sql immutable as $$ select 'demo'::text $$;

create or replace function public.otp_request(p_phone text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); ph text := public.norm_phone(p_phone); code text; n int;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if ph is null then raise exception 'BAD_PHONE'; end if;
  delete from public.phone_otps where created_at < now() - interval '1 day';
  select count(*) into n from public.phone_otps where user_id = uid and created_at > now() - interval '1 hour';
  if n >= 6 then raise exception 'RATE_LIMIT'; end if;
  code := lpad((('x' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))::bit(32)::bigint % 1000000)::text, 6, '0');
  insert into public.phone_otps(user_id, phone, code_hash, mode, expires_at)
    values (uid, ph, encode(sha256(convert_to(code || ':' || uid::text || ':' || ph, 'UTF8')), 'hex'), public.otp_mode(), now() + interval '5 minutes');
  if public.otp_mode() = 'demo' then
    return jsonb_build_object('mode', 'demo', 'code', code, 'expires_in', 300);
  end if;
  raise exception 'SMS_NOT_CONFIGURED';
end $$;

create or replace function public.otp_verify(p_phone text, p_code text) returns boolean
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); ph text := public.norm_phone(p_phone); r public.phone_otps;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if ph is null or coalesce(p_code, '') !~ '^[0-9]{6}$' then return false; end if;
  select * into r from public.phone_otps
   where user_id = uid and phone = ph and verified_at is null and used_at is null and expires_at > now()
   order by created_at desc limit 1 for update;
  if not found or r.attempts >= 5 then return false; end if;
  update public.phone_otps set attempts = attempts + 1 where id = r.id;
  if r.code_hash = encode(sha256(convert_to(p_code || ':' || uid::text || ':' || ph, 'UTF8')), 'hex') then
    update public.phone_otps set verified_at = now() where id = r.id;
    return true;
  end if;
  return false;
end $$;

-- أيام محجوزة (مؤكدة) لمنشأة: عامة للجميع ولا تحتوي بيانات شخصية.
create or replace function public.booked_days(p_place text) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(distinct to_char(d, 'YYYY-MM-DD') order by to_char(d, 'YYYY-MM-DD')), '[]'::jsonb)
  from public.reservations r, lateral generate_series(r.date_from::timestamp, (r.date_to - 1)::timestamp, interval '1 day') d
  where r.place_id = p_place and r.status = 'confirmed' and r.btype = 'stay' and r.date_to >= current_date
$$;

-- إنشاء حجز: يتحقق من كل شيء ويحسب السعر من إعدادات المنشأة المحفوظة (settings/booking) وليس مما يرسله المتصفح.
create or replace function public.create_booking(p_place text, p jsonb) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  uid uuid := auth.uid(); today date := (now() at time zone 'Asia/Riyadh')::date;
  listing jsonb; cfg jsonb; bt text; unit text; kind text;
  d1 date; d2 date; nts int := 0; q int := 1; mn int; mx int;
  slot text := ''; service text := ''; svc jsonb; price numeric; total numeric;
  nm text; ph text; em text; note text; extra jsonb := '{}'::jsonb; fld jsonb; v text;
  blocked jsonb; otp_id uuid; st text; inst boolean; v_code text; rid uuid; src text;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_place !~ '^[A-Za-z0-9_.~:@+-]{1,200}$' then raise exception 'PLACE_NOT_FOUND'; end if;
  select data into listing from public.kv where path = 'listings/' || p_place;
  if listing is null then raise exception 'PLACE_NOT_FOUND'; end if;
  select data -> 'items' -> p_place into cfg from public.kv where path = 'settings/booking';
  if cfg is null or coalesce(cfg ->> 'enabled', 'false') <> 'true' then raise exception 'BOOKING_DISABLED'; end if;

  bt := cfg ->> 'type';
  if bt not in ('stay','ticket','table','appointment','service') then raise exception 'BAD_CONFIG'; end if;
  unit := coalesce(cfg -> 'pricing' ->> 'unit', 'inquiry');
  if unit not in ('ticket','night','flat','free','inquiry') then raise exception 'BAD_CONFIG'; end if;
  kind := case bt when 'stay' then 'range' when 'service' then 'none' else 'one' end;

  -- العميل والجوال
  nm := left(trim(coalesce(p ->> 'name', '')), 80);
  if char_length(nm) < 2 then raise exception 'NAME_REQUIRED'; end if;
  ph := public.norm_phone(p ->> 'phone');
  if ph is null then raise exception 'BAD_PHONE'; end if;
  em := lower(coalesce(auth.jwt() ->> 'email', (select email from auth.users where id = uid), ''));
  note := left(trim(coalesce(p ->> 'note', '')), 500);
  src := left(coalesce(p ->> 'src', ''), 80);

  -- التواريخ
  if kind <> 'none' then
    if coalesce(p ->> 'from', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'DATE_REQUIRED'; end if;
    begin d1 := (p ->> 'from')::date; exception when others then raise exception 'DATE_REQUIRED'; end;
    if d1 < today then raise exception 'DATE_IN_PAST'; end if;
    if d1 > today + 540 then raise exception 'DATE_TOO_FAR'; end if;
    if kind = 'range' then
      if coalesce(p ->> 'to', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'DATE_REQUIRED'; end if;
      begin d2 := (p ->> 'to')::date; exception when others then raise exception 'DATE_REQUIRED'; end;
      if d2 <= d1 then raise exception 'BAD_DATE_RANGE'; end if;
      nts := d2 - d1;
      if nts > 60 then raise exception 'BAD_DATE_RANGE'; end if;
    else d2 := d1; end if;
  end if;

  -- العدد
  mn := greatest(1, coalesce(nullif(cfg ->> 'min', '')::int, 1));
  mx := least(500, coalesce(nullif(cfg ->> 'max', '')::int, case bt when 'appointment' then 1 when 'service' then 1 else 20 end));
  if bt in ('stay','ticket','table') then
    if coalesce(p ->> 'qty', '') !~ '^\d{1,4}$' then raise exception 'QTY_REQUIRED'; end if;
    q := (p ->> 'qty')::int;
    if q < mn or q > mx then raise exception 'QTY_OUT_OF_RANGE'; end if;
  end if;

  -- الفترة/الوقت
  if jsonb_array_length(coalesce(cfg -> 'slots', '[]'::jsonb)) > 0 then
    slot := left(trim(coalesce(p ->> 'slot', '')), 40);
    if not (cfg -> 'slots') @> to_jsonb(slot) then raise exception 'SLOT_REQUIRED'; end if;
  elsif bt in ('table','appointment') then
    slot := left(trim(coalesce(p ->> 'slot', '')), 40);
    if slot !~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' then raise exception 'SLOT_REQUIRED'; end if;
  end if;

  -- الخدمة (عيادات وغيرها) وسعرها
  price := nullif(cfg -> 'pricing' ->> 'price', '')::numeric;
  if jsonb_array_length(coalesce(cfg -> 'services', '[]'::jsonb)) > 0 then
    service := left(trim(coalesce(p ->> 'service', '')), 80);
    select s into svc from jsonb_array_elements(cfg -> 'services') s where s ->> 'n' = service limit 1;
    if svc is null then raise exception 'SERVICE_REQUIRED'; end if;
    if unit in ('flat','ticket','night') and nullif(svc ->> 'p', '') is not null then price := (svc ->> 'p')::numeric; end if;
  end if;

  -- حقول إضافية مطلوبة
  for fld in select * from jsonb_array_elements(coalesce(cfg -> 'extra', '[]'::jsonb)) loop
    v := left(trim(coalesce(p -> 'extra' ->> (fld ->> 'k'), '')), 200);
    if coalesce(fld ->> 'req', 'false') = 'true' and v = '' then raise exception 'EXTRA_REQUIRED'; end if;
    if v <> '' then extra := extra || jsonb_build_object(fld ->> 'k', v); end if;
  end loop;

  -- السعر (من الإعدادات فقط)
  if unit in ('ticket','night','flat') and (price is null or price < 0) then raise exception 'PRICE_NOT_SET'; end if;
  total := case unit when 'ticket' then price * q when 'night' then price * nts when 'flat' then price when 'free' then 0 else null end;
  if unit = 'free' then price := 0; end if;
  if unit = 'inquiry' then price := null; end if;

  -- التوافر
  if bt = 'stay' then
    if exists (select 1 from public.reservations r where r.place_id = p_place and r.status = 'confirmed' and r.btype = 'stay' and r.date_from < d2 and r.date_to > d1) then
      raise exception 'DATES_UNAVAILABLE'; end if;
  end if;
  if kind <> 'none' and coalesce(listing ->> 'ownerUid', '') <> '' then
    select data -> 'items' -> p_place -> 'blocked' into blocked from public.kv where path = 'availability/' || (listing ->> 'ownerUid');
    if blocked is not null and jsonb_typeof(blocked) = 'array' and exists (
      select 1 from jsonb_array_elements_text(blocked) b where b ~ '^\d{4}-\d{2}-\d{2}$' and b::date >= d1 and b::date < greatest(d2, d1 + 1)) then
      raise exception 'DATES_UNAVAILABLE'; end if;
  end if;

  -- التحقق من الجوال (يلزم رمز ناجح خلال آخر 30 دقيقة ولم يُستخدم)
  select id into otp_id from public.phone_otps
   where user_id = uid and phone = ph and verified_at is not null and used_at is null and verified_at > now() - interval '30 minutes'
   order by verified_at desc limit 1 for update;
  if otp_id is null then raise exception 'PHONE_NOT_VERIFIED'; end if;

  if (select count(*) from public.reservations where user_id = uid and created_at > now() - interval '1 hour') >= 10 then raise exception 'RATE_LIMIT'; end if;

  inst := (bt = 'stay' and coalesce(cfg ->> 'instant', 'false') = 'true');
  st := case when inst then 'confirmed' when unit = 'inquiry' then 'new' else 'pending' end;

  loop
    v_code := 'JW-' || to_char(now() at time zone 'Asia/Riyadh', 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.reservations r0 where r0.code = v_code);
  end loop;

  insert into public.reservations(code, user_id, place_id, place_name, cat, btype, customer_name, customer_email, customer_phone,
      date_from, date_to, nights, qty, slot, service, extra, note, price_unit, unit_price, total, instant, phone_verify, status, src,
      decided_at)
    values (v_code, uid, p_place, left(coalesce(listing ->> 'name', ''), 120), coalesce(listing ->> 'cat', ''), bt, nm, em, ph,
      d1, d2, nts, q, slot, service, extra, note, unit, price, total, inst, public.otp_mode(), st, src,
      case when inst then now() end)
    returning id into rid;
  update public.phone_otps set used_at = now() where id = otp_id;
  return jsonb_build_object('id', rid, 'code', v_code, 'status', st, 'total', total, 'nights', nts, 'unit_price', price);
end $$;

-- العميل: إلغاء مباشر قبل المراجعة، أو طلب إلغاء للحجز المؤكد.
create or replace function public.cancel_booking(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r public.reservations;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into r from public.reservations where id = p_id and user_id = uid for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if r.status in ('new','pending') then
    update public.reservations set status = 'cancelled', decided_at = now(), updated_at = now() where id = p_id;
    return jsonb_build_object('status', 'cancelled');
  elsif r.status = 'confirmed' then
    update public.reservations set cancel_requested = true, updated_at = now() where id = p_id;
    return jsonb_build_object('status', 'confirmed', 'cancel_requested', true);
  end if;
  raise exception 'NOT_CANCELLABLE';
end $$;

-- المالك فقط: تغيير حالة حجز.
create or replace function public.admin_set_booking_status(p_id uuid, p_status text, p_reply text default '') returns jsonb
language plpgsql security definer set search_path = public as $$
declare r public.reservations; rep text := left(trim(coalesce(p_reply, '')), 500);
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  if p_status not in ('new','pending','confirmed','rejected','cancelled','completed') then raise exception 'BAD_STATUS'; end if;
  select * into r from public.reservations where id = p_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if p_status = 'rejected' and rep = '' then raise exception 'REPLY_REQUIRED'; end if;
  if p_status = 'confirmed' and r.btype = 'stay' and exists (
      select 1 from public.reservations o where o.place_id = r.place_id and o.id <> r.id and o.status = 'confirmed' and o.btype = 'stay' and o.date_from < r.date_to and o.date_to > r.date_from) then
    raise exception 'DATES_UNAVAILABLE'; end if;
  update public.reservations set status = p_status, admin_reply = case when rep <> '' then rep else admin_reply end,
    cancel_requested = case when p_status in ('cancelled','rejected','completed') then false else cancel_requested end,
    decided_at = now(), updated_at = now() where id = p_id;
  return jsonb_build_object('id', p_id, 'status', p_status);
end $$;

-- صلاحيات التنفيذ: الدوال الحساسة للمسجّلين فقط.
revoke execute on function public.otp_request(text), public.otp_verify(text, text), public.create_booking(text, jsonb),
  public.cancel_booking(uuid), public.admin_set_booking_status(uuid, text, text), public.claim_owner() from public, anon;
grant execute on function public.otp_request(text), public.otp_verify(text, text), public.create_booking(text, jsonb),
  public.cancel_booking(uuid), public.admin_set_booking_status(uuid, text, text), public.claim_owner() to authenticated;
grant execute on function public.booked_days(text) to anon, authenticated;
