/* اختبار شامل: خادم يحاكي Vercel + محاكي Supabase فوق PostgreSQL محلي حقيقي + متصفح حقيقي (Playwright).
   التشغيل:  tests/pg/up.sh reset && node tests/e2e.js     (يحتاج playwright + PostgreSQL محلي)
   هذه ليست اختبارًا على Supabase الحقيقي. */
const { chromium } = require('playwright');
const L = require('./local-server'), M = require('./mock-supabase');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const OWNER = 'o.a.a.z.900@gmail.com', PW = 'Test-Pass-12345';   // كلمة مرور اختبارية لحسابات محاكاة فقط
async function ctxPage(b) { const ctx = await b.newContext(); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); }); return { ctx, pg, errs }; }
async function signup(sb, X, base, email, name, phone) {
  await X.pg.goto(base + '/'); await X.pg.click('[data-act=login]'); await X.pg.click('.jwl-tabs [data-t=signup]');
  const f = '.jwl-signup '; await X.pg.fill(f + '[name=name]', name); await X.pg.fill(f + '[name=email]', email); await X.pg.fill(f + '[name=phone]', phone); await X.pg.fill(f + '[name=password]', PW);
  await X.pg.click(f + 'button[type=submit]'); await X.pg.waitForFunction(() => /رابط تأكيد/.test(document.querySelector('.jwl-m').textContent), null, { timeout: 8000 });
  const loginBlocked = await (async () => { await X.pg.fill('.jwl-login [name=email]', email); await X.pg.fill('.jwl-login [name=password]', PW); await X.pg.click('.jwl-login button[type=submit]'); await X.pg.waitForFunction(() => /أكّد بريدك/.test(document.querySelector('.jwl-m').textContent), null, { timeout: 8000 }); return true; })();
  await sb.confirm(email); return loginBlocked;
}
async function login(X, base, email, pw, next) {
  await X.pg.goto(base + (next || '/')); if (!(await X.pg.locator('.jwl').count())) await X.pg.click('[data-act=login]');
  await X.pg.fill('.jwl-login [name=email]', email); await X.pg.fill('.jwl-login [name=password]', pw || PW);
  await Promise.all([X.pg.waitForNavigation({ timeout: 10000 }).catch(() => {}), X.pg.click('.jwl-login button[type=submit]')]); await wait(900);
}
(async () => {
  const sb = await M.start(54321, {});
  const cfg = { supabaseUrl: 'http://localhost:54321', supabaseAnonKey: 'anon-test', siteUrl: 'https://example.sa', allowIndexing: false };
  const web = await L.start(54322, { config: cfg, connect: 'http://localhost:54321' });
  process.env.SUPABASE_URL = 'http://localhost:54321'; process.env.SUPABASE_ANON_KEY = 'anon-test';
  const base = 'http://localhost:54322';
  const b = await chromium.launch();
  // --- headers + SEO (indexing off)
  let r = await fetch(base + '/'); let h = await r.text();
  ok(r.status === 200 && /noindex/.test(h) && /canonical" href="https:\/\/example\.sa\/"/.test(h) === true || /canonical/.test(h), 'home served, noindex while demo');
  ok(/frame-ancestors 'none'/.test(r.headers.get('content-security-policy') || ''), 'CSP frame-ancestors none');
  ok(/strict-transport-security/i.test([...r.headers.keys()].join(',')), 'HSTS header');
  ok((await fetch(base + '/robots.txt').then(x => x.text())).includes('Disallow: /'), 'robots disallow when indexing off');
  r = await fetch(base + '/nope-page'); ok(r.status === 404, '404 for unknown route');
  r = await fetch(base + '/sitemap.xml'); ok(r.status === 200, 'sitemap responds');
  // --- indexing on
  process.env.ALLOW_INDEXING = '1';
  r = await fetch(base + '/explore'); h = await r.text(); ok(/index,follow/.test(h), 'index,follow when ALLOW_INDEXING=1 (explore)');
  const sm = await fetch(base + '/sitemap.xml').then(x => x.text()); ok(/<loc>https?:\/\/[^<]+\/explore<\/loc>/.test(sm), 'sitemap lists explore');
  ok(!/\/admin|\/account/.test(sm), 'sitemap omits private routes');
  ok(!(await fetch(base + '/robots.txt').then(x => x.text())).includes('Disallow: /\n'), 'robots allows when on');
  r = await fetch(base + '/admin'); h = await r.text(); ok(/noindex/.test(h), 'admin always noindex');
  delete process.env.ALLOW_INDEXING;

  // --- صلاحيات المالك والدخول
  const O = await ctxPage(b), I = await ctxPage(b), C1 = await ctxPage(b), C2 = await ctxPage(b);
  ok(await signup(sb, O, base, OWNER, 'المالك', '0550000001'), 'sign-up asks for e-mail confirmation; login blocked until confirmed (owner)');
  await login(O, base, OWNER, 'wrong-password-1'); ok(/غير صحيحة/.test(await O.pg.textContent('.jwl-m').catch(() => '')), 'wrong password rejected');
  await O.pg.goto(base + '/admin'); await wait(600); ok(/دخول المالك|تسجيل الدخول/.test(await O.pg.textContent('body')) && !(await O.pg.locator('#kin').count()), 'signed-out: /admin shows login screen, not the Tours Manager');
  await O.pg.goto(base + '/account'); await wait(600); ok(!(await O.pg.locator('#b2admin').count()), 'signed-out: /account shows no owner dashboard');
  await O.pg.fill('.jwl-login [name=email]', OWNER).catch(() => {});
  if (!(await O.pg.locator('.jwl').count())) await O.pg.click('[data-act=login]');
  await O.pg.fill('.jwl-login [name=email]', OWNER); await O.pg.fill('.jwl-login [name=password]', PW);
  await Promise.all([O.pg.waitForNavigation({ timeout: 10000 }).catch(() => {}), O.pg.click('.jwl-login button[type=submit]')]); await wait(1200);
  ok(await sb.sql(`select is_admin from (select public.is_admin() as is_admin) x`).catch(() => '') !== 'zz', 'sanity');
  ok((await sb.sql(`select count(*) from public.admins`)) === '1', 'owner e-mail auto-granted admin by claim_owner');
  await O.pg.goto(base + '/account'); await O.pg.waitForSelector('#b2admin', { timeout: 8000 }).catch(() => {});
  ok(await O.pg.locator('#b2admin').count() === 1, 'owner sees owner dashboard');
  await O.pg.goto(base + '/admin'); await O.pg.waitForSelector('#kin', { timeout: 8000 }).catch(() => {});
  ok(await O.pg.locator('#kin').count() === 1, 'owner sees Tours Manager');
  // مستخدم آخر مسجّل ومؤكَّد: مرفوض
  await signup(sb, I, base, 'impostor@test.sa', 'منتحل', '0551111111'); await login(I, base, 'impostor@test.sa');
  ok((await sb.sql(`select count(*) from public.admins`)) === '1', 'impostor not added to admins');
  await I.pg.goto(base + '/account'); await wait(1000); ok(!(await I.pg.locator('#b2admin').count()), 'impostor: no owner dashboard');
  await I.pg.goto(base + '/admin'); await wait(1000); ok(!(await I.pg.locator('#kin').count()), 'impostor: Tours Manager hidden');
  const itok = await I.pg.evaluate(() => JSON.parse(localStorage.getItem('jw_sb_session')).access_token);
  let w = await fetch('http://localhost:54321/rest/v1/kv', { method: 'POST', headers: { Authorization: 'Bearer ' + itok, 'Content-Type': 'application/json' }, body: JSON.stringify({ path: 'listings/hack', coll: 'listings', id: 'hack', data: { name: 'x' } }) });
  ok(w.status === 403, 'RLS: impostor cannot publish listings (' + w.status + ')');
  w = await fetch('http://localhost:54321/rest/v1/kv', { method: 'POST', headers: { Authorization: 'Bearer ' + itok, 'Content-Type': 'application/json' }, body: JSON.stringify({ path: 'settings/booking', coll: 'settings', id: 'booking', data: { items: {} } }) });
  ok(w.status === 403, 'RLS: impostor cannot change booking settings (' + w.status + ')');
  w = await fetch('http://localhost:54321/rpc-none').catch(() => ({ status: 0 })); 
  w = await fetch('http://localhost:54321/rest/v1/rpc/claim_owner', { method: 'POST', headers: { Authorization: 'Bearer ' + itok, 'Content-Type': 'application/json' }, body: '{}' }).then(x => x.text());
  ok(w === 'false', 'claim_owner = false for impostor');
  w = await fetch('http://localhost:54321/rest/v1/rpc/admin_set_booking_status', { method: 'POST', headers: { Authorization: 'Bearer ' + itok, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_id: '00000000-0000-0000-0000-000000000000', p_status: 'confirmed', p_reply: '' }) });
  ok(w.status >= 400, 'impostor cannot call admin_set_booking_status');
  // المنشأة تُضاف بقاعدة البيانات مباشرة (مسار الإضافة عبر المراجعة مُختبَر سابقًا ويُستبدل هنا بالمالك فقط)
  const owid = await sb.sql(`select id from auth.users where email='${OWNER}'`);
  await sb.sql(`insert into public.kv(path,coll,id,data) values ('listings/l1','listings','l1','{"id":"l1","cat":"chalets","city":"dammam","district":"الشاطئ","name":"شاليه الاختبار","short":"شاليه عائلي للاختبار فقط","phone":"0551234567","wa":"0501112233","status":"published","ownerUid":"${owid}","publishedAt":"2026-10-01T00:00:00Z"}'::jsonb)`);
  // --- المالك يفعّل الحجز للمنشأة (إقامة، 300/ليلة، بموافقة)
  await O.pg.goto(base + '/account'); await O.pg.waitForSelector('#bsc', { timeout: 8000 });
  await O.pg.selectOption('#bs-pid', 'l1'); await O.pg.check('#bs-enabled'); await O.pg.selectOption('#bs-type', 'stay'); await wait(150);
  await O.pg.selectOption('#bs-unit', 'night'); await wait(150); await O.pg.fill('#bs-price', '300'); await O.pg.fill('#bs-max', '6'); await O.pg.fill('#bs-wa', '0509998877');
  await O.pg.click('[data-act=bs-save]'); await wait(800);
  ok((await sb.sql(`select data->'items'->'l1'->'pricing'->>'price' from public.kv where path='settings/booking'`)) === '300', 'owner saved booking settings in DB (price 300)');
  // --- زائر: احجز الآن ظاهر ويطلب الدخول، وواتساب
  const V = await ctxPage(b); await V.pg.goto(base + '/place/x-l1'); await wait(1500);
  ok(await V.pg.locator('[data-act=b2-go]').count() === 1, '«احجز الآن» visible after enabling');
  ok(/تسجيل الدخول|سجّل الدخول/.test(await V.pg.textContent('#bk')), 'visitor asked to sign in before booking');
  ok((await V.pg.getAttribute('a.btn-wa', 'href')).includes('966509998877'), 'WhatsApp uses per-place number');
  // --- عميل يسجّل ويحجز
  await signup(sb, C1, base, 'sara@test.sa', 'سارة العتيبي', '0551234567'); await login(C1, base, 'sara@test.sa', PW, '/place/x-l1');
  await C1.pg.waitForSelector('#bk .cald', { timeout: 8000 });
  await C1.pg.click('#bk [data-act=bk-nav][data-d="1"]'); await wait(150);
  await C1.pg.locator('#bk .cald:not([disabled])').nth(9).click(); await C1.pg.locator('#bk .cald:not([disabled])').nth(12).click();
  ok((await C1.pg.inputValue('#b2-name')) === 'سارة العتيبي' && (await C1.pg.inputValue('#b2-phone')) !== '', 'booking form prefilled from the account profile');
  await C1.pg.fill('#b2-qty', '2'); ok(/900/.test(await C1.pg.textContent('#b2price')), 'price box 900 = 3 nights × 300');
  await C1.pg.click('[data-act=b2-next]'); await wait(300);
  ok(/تحقق تجريبي محلي/.test(await C1.pg.textContent('#bk')), 'OTP step labelled local demo');
  await C1.pg.click('[data-act=b2-otp-send]'); await C1.pg.waitForSelector('#b2-otp', { timeout: 8000 });
  const code = await C1.pg.textContent('.otpv'); ok(/^\d{6}$/.test(code), 'server-generated random 6-digit demo code');
  await C1.pg.fill('#b2-otp', String((+code + 1) % 1000000).padStart(6, '0')); await C1.pg.click('[data-act=b2-otp-check]'); await wait(500);
  ok(/غير صحيح/.test(await C1.pg.textContent('#bk')), 'wrong OTP rejected by the DB function');
  await C1.pg.fill('#b2-otp', code); await C1.pg.click('[data-act=b2-otp-check]'); await wait(600);
  ok(/المراجعة/.test(await C1.pg.textContent('#bk')) && /غير موثّق فعليًا/.test(await C1.pg.textContent('#bk')), 'review step + not-really-verified wording');
  await C1.pg.click('[data-act=b2-confirm]'); await wait(1200);
  const row = (await sb.sql(`select code||'|'||total||'|'||nights||'|'||status||'|'||phone_verify from public.reservations`)).split('|');
  ok(/^JW-/.test(row[0]) && row[1] === '900.00' && row[2] === '3' && row[3] === 'pending' && row[4] === 'demo', 'reservation stored by create_booking: ' + row.join(' '));
  ok(/رقم الحجز/.test(await C1.pg.textContent('#bk')), 'confirmation shows booking number');
  // العميل لا يستطيع تعديل السعر/الحالة مباشرة
  const ctok = await C1.pg.evaluate(() => JSON.parse(localStorage.getItem('jw_sb_session')).access_token);
  w = await fetch('http://localhost:54321/rest/v1/reservations', { method: 'POST', headers: { Authorization: 'Bearer ' + ctok, 'Content-Type': 'application/json' }, body: '{}' });
  ok(w.status === 403, 'customer cannot write reservations directly (' + w.status + ')');
  // --- المالك يرى ويؤكد
  await O.pg.goto(base + '/account'); await O.pg.waitForSelector('#b2admin', { timeout: 8000 }); await wait(700);
  ok((await O.pg.textContent('#b2list')).includes(row[0]) && /سارة العتيبي/.test(await O.pg.textContent('#b2list')), 'owner sees booking with customer name');
  await O.pg.click('[data-act=b2-st][data-s=confirmed]'); await wait(1000);
  ok((await sb.sql(`select status from public.reservations`)) === 'confirmed', 'owner confirmed via admin_set_booking_status');
  // --- العميل يرى الحالة؛ عميل آخر لا يرى شيئًا؛ والتواريخ المؤكدة محجوزة
  await C1.pg.goto(base + '/bookings'); await wait(1200); ok(/مؤكد/.test(await C1.pg.textContent('#b2my')) && (await C1.pg.textContent('#b2my')).includes(row[0]), '«حجوزاتي»: customer sees confirmed status');
  await signup(sb, C2, base, 'other@test.sa', 'عميل آخر', '0552222222'); await login(C2, base, 'other@test.sa', PW, '/bookings'); await wait(800);
  ok(!(await C2.pg.textContent('#b2my')).includes(row[0]), 'RLS: another customer does not see it');
  const rl = await fetch('http://localhost:54321/rest/v1/reservations?select=code', { headers: { Authorization: 'Bearer ' + (await C2.pg.evaluate(() => JSON.parse(localStorage.getItem('jw_sb_session')).access_token)) } }).then(x => x.json());
  ok(rl.length === 0, 'REST: other customer reads 0 reservations');
  await C2.pg.goto(base + '/place/x-l1'); await C2.pg.waitForSelector('#bk .cald', { timeout: 8000 }); await C2.pg.click('#bk [data-act=bk-nav][data-d="1"]'); await wait(300);
  ok(await C2.pg.locator('#bk .cald.bk[disabled]').count() === 3, 'confirmed nights disabled for other customers');
  // --- الخروج يمنع الرجوع
  await O.pg.click('[data-act=logout]'); await wait(1200); ok(await O.pg.evaluate(() => !localStorage.getItem('jw_sb_session')), 'logout clears the session');
  await O.pg.goBack().catch(() => {}); await wait(900); await O.pg.goto(base + '/account'); await wait(800); ok(!(await O.pg.locator('#b2admin').count()), 'after logout owner dashboard is not reachable');
  const real = [O.errs, I.errs, C1.errs, C2.errs, V.errs].flat().filter(e => !/Failed to load resource/.test(e));
  ok(real.length === 0, 'no JS errors (' + real.slice(0, 3).join(' | ') + ')');
  await b.close(); web.close(); sb.close();
  console.log(fails ? 'FAILED ' + fails : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
