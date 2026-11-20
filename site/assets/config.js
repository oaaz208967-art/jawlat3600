/* إعدادات الموقع — عدّل هذا الملف فقط (لا حاجة لتعديل أي كود آخر).

   supabaseUrl / supabaseAnonKey : من Supabase → Project Settings → API.
        اتركهما فارغين لتشغيل الموقع بدون خلفية (التصفح والبحث والخريطة والجولات التجريبية تعمل،
        أما الحسابات ولوحة الإدارة والحجوزات وغيرها فتحتاج هذه المفاتيح).
        مفتاح anon عام بطبيعته؛ الحماية الفعلية في سياسات RLS داخل backend/supabase.sql.
        لا تضع هنا أبدًا مفتاح service_role.

   siteUrl : عنوان موقعك النهائي بدون شرطة في آخره، مثال: https://jawlat360.com
        يُستخدم في الروابط القانونية (canonical) ورموز QR وخريطة الموقع.

   allowIndexing : false = يطلب من محركات البحث عدم فهرسة الموقع (مناسب أثناء وجود بيانات تجريبية).
        غيّرها إلى true بعد استبدال البيانات التجريبية ببيانات حقيقية، وغيّر متغير ALLOW_INDEXING في Vercel إلى 1. */
window.JW_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  siteUrl: '',
  allowIndexing: false
};
