-- ترحيل اختياري: طلبات الحجز القديمة (المرحلة 4) المخزّنة في kv بالمسار bookings/<uid>/items/<id> إلى جدول reservations.
-- لا يحذف شيئًا من kv (تبقى النسخة الأصلية). آمن لإعادة التشغيل (لا يكرّر ما رُحِّل). نفّذه مرة واحدة في SQL Editor بعد supabase.sql.
-- الحقول غير المتوفرة تُملأ بقيم محايدة: السعر غير محدد (inquiry)، والتحقق من الجوال demo.
insert into public.reservations (code, user_id, place_id, place_name, btype, customer_name, customer_phone, date_from, date_to,
                                 nights, qty, price_unit, phone_verify, status, src, created_at)
select 'MIG-' || upper(right(replace(k.id, '-', ''), 8)),
       split_part(k.path, '/', 2)::uuid,
       left(coalesce(k.data->>'pid', ''), 200),
       left(coalesce(k.data->>'pname', ''), 200),
       case when k.data->>'mode' = 'booking' then 'stay' else 'service' end,
       left(coalesce(nullif(k.data->>'name', ''), '—'), 80),
       left(coalesce(nullif(k.data->>'phone', ''), '—'), 20),
       nullif(k.data->>'from', '')::date, nullif(k.data->>'to', '')::date,
       coalesce(nullif(k.data->>'nights', '')::int, 0),
       greatest(1, coalesce(nullif(k.data->>'guests', '')::int, 1)),
       'inquiry', 'demo',
       case k.data->>'status' when 'requested' then 'pending' when 'declined' then 'rejected'
            when 'confirmed' then 'confirmed' when 'cancelled' then 'cancelled' when 'completed' then 'completed' else 'pending' end,
       'migrated',
       coalesce(nullif(k.data->>'createdAt', '')::timestamptz, now())
from public.kv k
where k.coll like 'bookings/%/items'
  and k.data->>'pid' is not null and k.data->>'pid' <> ''
  and split_part(k.path, '/', 2) ~ '^[0-9a-f-]{36}$'
  and exists (select 1 from auth.users u where u.id = split_part(k.path, '/', 2)::uuid)
  and not exists (select 1 from public.reservations r where r.code = 'MIG-' || upper(right(replace(k.id, '-', ''), 8)));
