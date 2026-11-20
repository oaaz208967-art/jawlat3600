#!/bin/bash
# اختبار SQL على PostgreSQL محلي حقيقي (RLS + دوال الحجز). ليس Supabase الحقيقي؛ مخطط Auth مُحاكى (stub.sql).
# التشغيل:  tests/pg/up.sh reset && tests/pg/sql-test.sh
DIR=${JW_PG_DIR:-/tmp/jw-pg}; PORT=${JW_PG_PORT:-5546}
BIN=$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | tail -1); [ -z "$BIN" ] && BIN=$(dirname "$(which psql)")
PS="$BIN/psql -h $DIR -p $PORT -U postgres -d jw -t -A -q"
psqlx() { if [ "$(id -u)" = 0 ]; then su postgres -s /bin/bash -c "$PS" ; else $PS; fi; }
OWNER=aaaaaaaa-0000-0000-0000-000000000001; IMP=aaaaaaaa-0000-0000-0000-000000000002
C1=bbbbbbbb-0000-0000-0000-000000000001; C2=bbbbbbbb-0000-0000-0000-000000000002; UNC=aaaaaaaa-0000-0000-0000-000000000003
FAIL=0
# run <role> <uid> <email> <sql>  → آخر سطر من الخرج (أو رسالة الخطأ)
run() { printf "set role %s; select set_config('request.jwt.claim.sub','%s',false), set_config('request.jwt.claim.email','%s',false) \\\\g /dev/null\n%s\n" "$1" "$2" "$3" "$4" | psqlx 2>&1 | grep -v '^$' | errfirst; }
errfirst() { local o; o=$(cat); if echo "$o" | grep -q 'ERROR:'; then echo "$o" | grep -m1 'ERROR:'; else echo "$o" | tail -1; fi; }
adm() { printf "%s\n" "$1" | psqlx 2>&1 | grep -v '^$' | errfirst; }
chk() { if echo "$3" | grep -qE -- "$2"; then echo "PASS  $1"; else echo "FAIL  $1 -> $3"; FAIL=$((FAIL+1)); fi; }
O="authenticated $OWNER o.a.a.z.900@gmail.com"; A1="authenticated $C1 c1@test.sa"; A2="authenticated $C2 c2@test.sa"; AI="authenticated $IMP imp@test.sa"
ins() { echo "insert into public.kv(path,coll,id,data) values ('$1',regexp_replace('$1','/[^/]*\$',''),regexp_replace('$1','^.*/',''),'$2'::jsonb) on conflict (path) do update set data=excluded.data returning 'OK';"; }
TOMORROW="(now() at time zone 'Asia/Riyadh')::date"

adm "truncate public.reservations, public.phone_otps, public.admins, public.kv, public.profiles cascade; delete from auth.users;
insert into auth.users values ('$OWNER','O.A.A.Z.900@gmail.com',now()),('$IMP','imp@test.sa',now()),('$C1','c1@test.sa',now()),('$C2','c2@test.sa',now()),('$UNC','o.a.a.z.900@gmail.com',null);" >/dev/null

echo "== 1) المالك الوحيد"
chk "impostor claim_owner = false"        '^f$' "$(run $AI "select public.claim_owner()")"
chk "customer claim_owner = false"        '^f$' "$(run $A1 "select public.claim_owner()")"
chk "unconfirmed owner-email: claim false" '^f$' "$(run authenticated $UNC o.a.a.z.900@gmail.com "select public.claim_owner()")"
chk "cannot insert impostor into admins"  'ONLY_OWNER_CAN_BE_ADMIN' "$(adm "insert into public.admins values ('$IMP')")"
adm "insert into public.admins values ('$UNC')" >/dev/null
chk "admins row for unconfirmed owner-email: is_admin false" '^f$' "$(run authenticated $UNC o.a.a.z.900@gmail.com "select public.is_admin()")"
adm "delete from public.admins" >/dev/null
chk "owner claim_owner = true"            '^t$' "$(run $O "select public.claim_owner()")"
chk "owner is_admin"                      '^t$' "$(run $O "select public.is_admin()")"
chk "impostor is_admin false"             '^f$' "$(run $AI "select public.is_admin()")"
chk "customer cannot self-insert admins"  'denied|row-level' "$(run $A1 "insert into public.admins values ('$C1')")"

echo "== 2) صلاحيات kv"
chk "owner writes listings"               'OK' "$(run $O "$(ins listings/l1 '{"id":"l1","name":"شاليه الاختبار","cat":"chalets","city":"dammam","ownerUid":"'$OWNER'"}')")"
chk "owner writes settings/booking"       'OK' "$(run $O "$(ins settings/booking '{"items":{
 "l1":{"enabled":true,"type":"stay","pricing":{"unit":"night","price":300},"min":1,"max":6,"instant":false},
 "m1":{"enabled":true,"type":"ticket","pricing":{"unit":"ticket","price":50},"slots":["صباحي","مسائي"],"min":1,"max":10},
 "c1":{"enabled":true,"type":"appointment","pricing":{"unit":"flat"},"services":[{"n":"كشف عام","p":150},{"n":"أسنان","p":300}],"extra":[{"k":"id","l":"رقم الهوية","req":true}]},
 "q1":{"enabled":true,"type":"service","pricing":{"unit":"inquiry"}},
 "t1":{"enabled":true,"type":"table","pricing":{"unit":"free"},"max":8},
 "i1":{"enabled":true,"type":"stay","pricing":{"unit":"night","price":200},"instant":true},
 "off":{"enabled":false,"type":"stay","pricing":{"unit":"night","price":100}}}}')")"
for l in m1 c1 q1 t1 i1 off; do adm "insert into public.kv(path,coll,id,data) values ('listings/$l','listings','$l','{\"id\":\"$l\",\"name\":\"منشأة $l\",\"cat\":\"x\"}') on conflict do nothing" >/dev/null; done
chk "customer NOT write listings"         'row-level' "$(run $A1 "$(ins listings/l9 '{}')")"
chk "customer NOT write settings"         'row-level' "$(run $A1 "$(ins settings/booking '{}')")"
chk "customer NOT write submissions"      'row-level' "$(run $A1 "$(ins submissions/$C1 '{}')")"
chk "customer NOT write offers/avail"     'row-level' "$(run $A1 "$(ins availability/$C1 '{}')")"
chk "customer NOT write old bookings kv"  'row-level' "$(run $A1 "$(ins bookings/$C1 '{}')")"
chk "customer writes own complaint"       'OK' "$(run $A1 "$(ins complaints/$C1 '{"x":1}')")"
chk "customer writes own review"          'OK' "$(run $A1 "$(ins reviews/$C1 '{"x":1}')")"
chk "customer NOT write others' complaint" 'row-level' "$(run $A1 "$(ins complaints/$C2 '{"x":1}')")"
chk "anon reads settings/booking"         '^1$' "$(run anon '' '' "select count(*) from public.kv where path='settings/booking'")"
chk "anon NOT write"                      'denied' "$(run anon '' '' "$(ins reviews/$C1 '{}')")"

echo "== 3) الجوال OTP"
PH=0551234567
chk "booking without OTP rejected"        'PHONE_NOT_VERIFIED' "$(run $A1 "select public.create_booking('l1', jsonb_build_object('name','سارة','phone','$PH','from',($TOMORROW+10)::text,'to',($TOMORROW+13)::text,'qty',2))")"
chk "anon cannot request OTP"             'denied' "$(run anon '' '' "select public.otp_request('$PH')")"
chk "bad phone rejected"                  'BAD_PHONE' "$(run $A1 "select public.otp_request('123')")"
OTP=$(run $A1 "select public.otp_request('$PH')->>'code'"); chk "otp_request returns 6-digit demo code" '^[0-9]{6}$' "$OTP"
chk "otp mode is demo"                    'demo' "$(run $A1 "select (public.otp_request('0559999999'))->>'mode'")"
WRONG=$(( (10#$OTP + 1) % 1000000 )); WRONG=$(printf %06d $WRONG)
chk "wrong code rejected"                 '^f$' "$(run $A1 "select public.otp_verify('$PH','$WRONG')")"
chk "cannot create booking after wrong code" 'PHONE_NOT_VERIFIED' "$(run $A1 "select public.create_booking('l1', jsonb_build_object('name','سارة','phone','$PH','from',($TOMORROW+10)::text,'to',($TOMORROW+13)::text,'qty',2))")"
chk "other user cannot verify my code"    '^f$' "$(run $A2 "select public.otp_verify('$PH','$OTP')")"
chk "correct code accepted"               '^t$' "$(run $A1 "select public.otp_verify('$PH','$OTP')")"
chk "phone_otps not readable by customer" 'denied' "$(run $A1 "select * from public.phone_otps")"

echo "== 4) إنشاء حجز والتحقق من السعر في الخادم"
B1=$(run $A1 "select public.create_booking('l1', jsonb_build_object('name','سارة','phone','$PH','from',($TOMORROW+10)::text,'to',($TOMORROW+13)::text,'qty',2,'total',1,'price',1,'unit_price',1,'status','confirmed','user_id','$C2','nights',99))")
chk "booking created"                     '"code": "JW-' "$B1"
chk "server total = 300 x 3 nights (client total ignored)" '"total": 900' "$B1"
chk "status forced to pending (client status ignored)" '"status": "pending"' "$B1"
chk "owner of booking = caller (user_id ignored)" '^1$' "$(run $A1 "select count(*) from public.reservations where user_id='$C1'")"
chk "stored nights=3 total=900 verify=demo" '^3\|900.00\|demo$' "$(run $A1 "select nights||'|'||total||'|'||phone_verify from public.reservations limit 1")"
chk "OTP is single-use"                   'PHONE_NOT_VERIFIED' "$(run $A1 "select public.create_booking('l1', jsonb_build_object('name','سارة','phone','$PH','from',($TOMORROW+20)::text,'to',($TOMORROW+22)::text,'qty',2))")"
age(){ adm "update public.phone_otps set created_at=created_at-interval '2 hours'" >/dev/null; }
newotp(){ local u="$1" ph="$2"; age; local c=$(run $u "select public.otp_request('$ph')->>'code'"); run $u "select public.otp_verify('$ph','$c')" >/dev/null; }
bk(){ newotp "$A1" $PH; run $A1 "select public.create_booking('$1', $2)"; }
D=$TOMORROW
chk "disabled place rejected"             'BOOKING_DISABLED' "$(bk off "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'to',($D+6)::text,'qty',1)")"
chk "unknown place rejected"              'PLACE_NOT_FOUND' "$(bk nope "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'to',($D+6)::text,'qty',1)")"
chk "missing name rejected"               'NAME_REQUIRED' "$(bk l1 "jsonb_build_object('name','','phone','$PH','from',($D+5)::text,'to',($D+6)::text,'qty',1)")"
chk "missing date rejected"               'DATE_REQUIRED' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','qty',1)")"
chk "past date rejected"                  'DATE_IN_PAST' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','from',($D-5)::text,'to',($D-3)::text,'qty',1)")"
chk "reversed range rejected"             'BAD_DATE_RANGE' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+9)::text,'to',($D+5)::text,'qty',1)")"
chk "qty=0 rejected"                      'QTY_OUT_OF_RANGE' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'to',($D+6)::text,'qty',0)")"
chk "qty above max rejected"              'QTY_OUT_OF_RANGE' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'to',($D+6)::text,'qty',7)")"
chk "ticket: slot required"               'SLOT_REQUIRED' "$(bk m1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'qty',2)")"
chk "ticket: slot must be from list"      'SLOT_REQUIRED' "$(bk m1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'qty',2,'slot','ليلي')")"
chk "ticket total = 50 x 3"               '"total": 150' "$(bk m1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'qty',3,'slot','صباحي')")"
chk "clinic: service required"            'SERVICE_REQUIRED' "$(bk c1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'slot','10:30')")"
chk "clinic: extra required"              'EXTRA_REQUIRED' "$(bk c1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'slot','10:30','service','أسنان')")"
chk "clinic: bad time rejected"           'SLOT_REQUIRED' "$(bk c1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'slot','25:99','service','أسنان','extra',jsonb_build_object('id','1'))")"
chk "clinic: service price from config (300)" '"total": 300' "$(bk c1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'slot','10:30','service','أسنان','extra',jsonb_build_object('id','1234'),'total',1)")"
chk "inquiry: no price, status new"       '"status": "new"' "$(bk q1 "jsonb_build_object('name','سارة','phone','$PH')")"
chk "table: free total 0, pending"        '"total": 0' "$(bk t1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+5)::text,'qty',4,'slot','20:30')")"
chk "bad phone in booking rejected"       'BAD_PHONE' "$(bk l1 "jsonb_build_object('name','سارة','phone','12','from',($D+5)::text,'to',($D+6)::text,'qty',1)")"

echo "== 5) إدارة الحالات والتعارض"
ID1=$(run $A1 "select id from public.reservations where place_id='l1' order by created_at limit 1")
chk "customer cannot set status"          'FORBIDDEN' "$(run $A1 "select public.admin_set_booking_status('$ID1','confirmed','')")"
chk "customer cannot update table"        'denied' "$(run $A1 "update public.reservations set status='confirmed', total=1 where id='$ID1'")"
chk "customer cannot insert table"        'denied' "$(run $A1 "insert into public.reservations(code,user_id,place_id,btype,customer_name,customer_phone,price_unit,phone_verify,status) values ('X','$C1','l1','stay','a','b','free','demo','confirmed')")"
chk "customer cannot delete"              'denied' "$(run $A1 "delete from public.reservations where id='$ID1'")"
chk "impostor cannot set status"          'FORBIDDEN' "$(run $AI "select public.admin_set_booking_status('$ID1','confirmed','')")"
chk "reject needs reply"                  'REPLY_REQUIRED' "$(run $O "select public.admin_set_booking_status('$ID1','rejected','')")"
chk "bad status rejected"                 'BAD_STATUS' "$(run $O "select public.admin_set_booking_status('$ID1','hacked','')")"
chk "owner confirms"                      '"status": "confirmed"' "$(run $O "select public.admin_set_booking_status('$ID1','confirmed','مرحبًا')")"
chk "booked_days (anon) lists nights"     '\+10|-[0-9]{2}' "$(run anon '' '' "select public.booked_days('l1')")"
chk "booked_days has exactly 3 nights"    '^3$' "$(run anon '' '' "select jsonb_array_length(public.booked_days('l1'))")"
chk "overlapping booking rejected"        'DATES_UNAVAILABLE' "$(newotp "$A2" 0561112222; run $A2 "select public.create_booking('l1', jsonb_build_object('name','خالد','phone','0561112222','from',($D+11)::text,'to',($D+14)::text,'qty',1))")"
chk "adjacent booking allowed (checkout day)" '"status": "pending"' "$(newotp "$A2" 0561112222; run $A2 "select public.create_booking('l1', jsonb_build_object('name','خالد','phone','0561112222','from',($D+13)::text,'to',($D+15)::text,'qty',1))")"
ID2=$(run $A2 "select id from public.reservations where user_id='$C2' and place_id='l1'")
chk "customer2 cannot see customer1 booking" '^0$' "$(run $A2 "select count(*) from public.reservations where id='$ID1'")"
chk "customer1 sees only own"             '^t$' "$(run $A1 "select count(*)>0 and count(*)=count(*) filter (where user_id='$C1') from public.reservations")"
chk "customer1 cannot see customer2"      '^0$' "$(run $A1 "select count(*) from public.reservations where id='$ID2'")"
chk "owner sees all"                      '^[0-9]+$' "$(run $O "select count(*) from public.reservations")"
chk "owner sees more than one customer"   '^2$' "$(run $O "select count(distinct user_id) from public.reservations")"
chk "anon sees none"                      'denied' "$(run anon '' '' "select count(*) from public.reservations")"
chk "customer2 cannot cancel others'"     'NOT_FOUND' "$(run $A2 "select public.cancel_booking('$ID1')")"
chk "confirmed: cancel -> request flag"   '"cancel_requested": true' "$(run $A1 "select public.cancel_booking('$ID1')")"
chk "pending: direct cancel"              '"status": "cancelled"' "$(run $A2 "select public.cancel_booking('$ID2')")"
chk "cancelled can't be cancelled again"  'NOT_CANCELLABLE' "$(run $A2 "select public.cancel_booking('$ID2')")"
chk "owner completes booking"             '"status": "completed"' "$(run $O "select public.admin_set_booking_status('$ID1','completed','')")"
chk "completed stay frees nights"         '^0$' "$(run anon '' '' "select jsonb_array_length(public.booked_days('l1'))")"

echo "== 6) حجز فوري + أيام مغلقة"
chk "instant stay confirms immediately"   '"status": "confirmed"' "$(newotp "$A1" $PH; run $A1 "select public.create_booking('i1', jsonb_build_object('name','سارة','phone','$PH','from',($D+30)::text,'to',($D+32)::text,'qty',2))")"
chk "instant stay blocks the dates"       'DATES_UNAVAILABLE' "$(newotp "$A2" 0561112222; run $A2 "select public.create_booking('i1', jsonb_build_object('name','خالد','phone','0561112222','from',($D+31)::text,'to',($D+33)::text,'qty',1))")"
adm "insert into public.kv(path,coll,id,data) values ('availability/$OWNER','availability','$OWNER', jsonb_build_object('items', jsonb_build_object('l1', jsonb_build_object('blocked', jsonb_build_array(($D+40)::text)))))" >/dev/null
chk "owner-blocked day rejected"          'DATES_UNAVAILABLE' "$(bk l1 "jsonb_build_object('name','سارة','phone','$PH','from',($D+39)::text,'to',($D+42)::text,'qty',1)")"

echo "== 7) محاولات تخمين الرمز"
newotp_raw(){ age; run $A1 "select public.otp_request('0570000000')->>'code'"; }
C=$(newotp_raw); W=$(printf %06d $(( (10#${C:-0} + 7) % 1000000 )))
for i in 1 2 3 4 5; do run $A1 "select public.otp_verify('0570000000','$W')" >/dev/null; done
chk "after 5 wrong attempts correct code fails" '^f$' "$(run $A1 "select public.otp_verify('0570000000','$C')")"

age; for i in 1 2 3 4 5 6; do run $A2 "select public.otp_request('0580000000')" >/dev/null; done
chk "OTP request rate limit (7th in an hour)" 'RATE_LIMIT' "$(run $A2 "select public.otp_request('0580000000')")"
age
echo "== 8) ملفات العملاء"
chk "customer writes own profile"         'INSERT 0 1|^$' "$(run $A1 "insert into public.profiles(user_id,full_name,phone,email) values ('$C1','سارة','0551234567','c1@test.sa')")"
chk "customer NOT write another profile"  'row-level' "$(run $A1 "insert into public.profiles(user_id,full_name) values ('$C2','x')")"
chk "customer2 cannot read profile 1"     '^0$' "$(run $A2 "select count(*) from public.profiles where user_id='$C1'")"
chk "owner reads profiles"                '^1$' "$(run $O "select count(*) from public.profiles")"
chk "customer updates own profile"        '^1$' "$(run $A1 "with u as (update public.profiles set full_name='سارة م' where user_id='$C1' returning 1) select count(*) from u")"
chk "customer2 cannot update profile 1"   '^0$' "$(run $A2 "with u as (update public.profiles set full_name='x' where user_id='$C1' returning 1) select count(*) from u")"

echo; [ $FAIL -eq 0 ] && echo "ALL SQL TESTS PASSED" || echo "SQL TESTS FAILED: $FAIL"; exit $FAIL
