# PROGRESS — الحجز المباشر + لوحات المالك (المرحلة 7) — نقطة استئناف

آخر تحديث: 31 أكتوبر 2026 (بعد إنشاء `Jawlat360-Before-Booking.zip`). **لم يُنشر شيء، ولم تُمسّ أي خدمة خارجية (Supabase/Vercel/SMS).** لا توجد كلمات مرور أو مفاتيح سرية في الملفات.

## الحالة بالمراحل
| المرحلة | الحالة |
|---|---|
| A — نسخة احتياطية + مراجعة + مصادقة | **مكتملة** |
| B — الحجز، التسعير، OTP، التأكيد | **مكتملة** |
| C — طلبات الحجز للمالك، «حجوزاتي»، واتساب، إعدادات كل منشأة | **مكتملة** |
| D — الاختبارات، الإصلاحات، المعاينة، الوثائق، ZIP | **مكتملة** (ZIP جاهز) |

## الملفات المعدّلة فعليًا (المسار: `scratchpad/`)
- `Jawlat360-Before-Booking.zip` — نسخة احتياطية (تم التحقق من استعادتها).
- `pkg/jawlat360/backend/supabase.sql` — owner-only، جداول `profiles/reservations/phone_otps`، دوال `otp_request/otp_verify/create_booking/cancel_booking/admin_set_booking_status/booked_days/claim_owner/is_admin`. جدول `kv` وبياناته كما هي.
- `pkg/jawlat360/site/assets/backend.js` — دخول بكلمة مرور/إنشاء حساب/استعادة، `claim_owner`، خروج يمنع الرجوع، `JW_BOOK` (RPC).
- `pkg/jawlat360/api/page.js` — إضافة مسار `bookings` (معروف + خاص noindex). **تم الآن.**
- `pkg/jawlat360/tests/mock-supabase.js` — أُعيدت كتابته: محاكي GoTrue+PostgREST فوق PostgreSQL محلي حقيقي. **تم الآن.**
- `pkg/jawlat360/tests/e2e.js` — أُعيدت كتابته لتدفق الدخول/الحجز المستضاف. **تم الآن (قيد التصحيح).**
- `pkg/jawlat360/tests/pg/{stub.sql,up.sh,sql-test.sh}` — اختبار SQL محلي.
- المصدر: `jawlat/book.js`, `jawlat/app.js` (مُدمج)، `jawlat/head.html`، `jawlat/index.html` (المعاينة)، `jawlat/t7.js`، `build-artifact.sh`، `build-site.sh`.

## الاختبارات
**محلية على PostgreSQL 16 حقيقي (ليست Supabase الحقيقي):** `tests/pg/sql-test.sh` → 90 فحصًا ALL PASSED (RLS، المالك الوحيد، OTP، التسعير، التعارض، العزل). اختبار `migrate-kv-bookings.sql` (يعمل ويمكن إعادته).
**بخدمات محاكاة:** `jawlat/t7.js` (المعاينة بقاعدة محاكاة) ALL PASSED. `tests/e2e.js` (متصفح + محاكي GoTrue/PostgREST فوق PG المحلي): 48 فحصًا ALL PASSED — تسجيل/تأكيد بريد، رفض كلمة مرور خاطئة وغير المالك، claim_owner، إعدادات الحجز، حجز بـ OTP خاطئ ثم صحيح، السعر 900، تأكيد المالك، «حجوزاتي»، عزل العملاء، الخروج. `tests/mobile.js` (لا تمرير أفقي) و`tests/crawl.js` (118 صفحة، 0 مكسورة، 0 أخطاء JS).
**لم تُختبر (خارجية):** Supabase الحقيقي، Vercel، مزوّد SMS، إرسال بريد التأكيد الفعلي.

## ما فُعل في هذه الجولة
- تصحيح تعبئة نموذج الحجز من الملف الشخصي بعد تحميله (`app.js` سطر الملف الشخصي).
- `api/page.js` يعرف مسار `bookings` (noindex). `backend/migrate-kv-bookings.sql` جديد. README محدّث. المعاينة (Artifact) نُشرت بالإصدار 7.

## المهمة التالية
لا شيء إلزامي. بإذنك: إنشاء مشروع Supabase وتشغيل `supabase.sql` ثم النشر وفق README، وتجربة الدخول/الحجز الحقيقي.

## عوائق/ملاحظات
- تثبيت `pg` عبر npm غير متاح (لا شبكة) فالمحاكي يستخدم `psql`.
- تغييرات سلوك موثّقة: الكتابة على المنشورات/الإعدادات للمالك فقط؛ الحجز يُفعَّل لكل منشأة؛ جدول `reservations` للمستضاف؛ الدخول الأول للمالك يتطلب Confirm email.
- لا تعِد أي مرحلة أو اختبار ناجح.

## الاستئناف
اقرأ هذا الملف؛ العمل مكتمل بانتظار قرارك بالنشر.
