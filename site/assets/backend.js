/* جولات 360 — طبقة الربط بقاعدة بيانات Supabase
   تُفعَّل فقط إذا ملأتَ assets/config.js بمفاتيح Supabase. تنفّذ الجزء الذي يستخدمه التطبيق من واجهة
   claude.use("db" | "user" | "downloads") فوق REST + تسجيل دخول بالبريد (رمز OTP).
   لا تحتوي أي سر: مفتاح anon عام بطبيعته، والحماية الفعلية في سياسات RLS داخل backend/supabase.sql. */
(function () {
  'use strict';
  var C = window.JW_CONFIG || {};
  if (window.claude || !C.supabaseUrl || !C.supabaseAnonKey) return;
  var BASE = String(C.supabaseUrl).replace(/\/+$/, ''), KEY = C.supabaseAnonKey, SK = 'jw_sb_session';
  var S = null;
  try { S = JSON.parse(localStorage.getItem(SK) || 'null'); } catch (e) {}
  function save(s) { S = s; try { if (s) localStorage.setItem(SK, JSON.stringify(s)); else localStorage.removeItem(SK); } catch (e) {} adminCache = null; }
  var enc = encodeURIComponent;

  /* ---------- auth ---------- */
  function authReq(path, body) {
    return fetch(BASE + '/auth/v1' + path, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.msg || j.error_description || j.message || 'auth'); e.status = r.status; throw e; } return j; }); });
  }
  function toSession(j) { return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: { id: j.user && j.user.id, email: j.user && j.user.email, meta: (j.user && j.user.user_metadata) || {} } }; }
  var refreshing = null;
  function token() {
    if (S && S.refresh_token && S.expires_at - 60 < Date.now() / 1000) {
      if (!refreshing) refreshing = authReq('/token?grant_type=refresh_token', { refresh_token: S.refresh_token }).then(function (j) { save(toSession(j)); }, function () { save(null); }).then(function () { refreshing = null; });
      return refreshing.then(function () { return S ? S.access_token : KEY; });
    }
    return Promise.resolve(S ? S.access_token : KEY);
  }

  /* ---------- REST ---------- */
  function rest(method, path, body, prefer) {
    return token().then(function (t) {
      var h = { apikey: KEY, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' };
      if (prefer) h.Prefer = prefer;
      return fetch(BASE + '/rest/v1' + path, { method: method, headers: h, body: body == null ? undefined : JSON.stringify(body) });
    }).then(function (r) {
      if (r.ok) return r;
      return r.json().catch(function () { return {}; }).then(function (j) {
        var denied = r.status === 401 || r.status === 403 || (j && j.code === '42501');
        throw { code: denied ? 'invalid_argument' : 'unavailable', message: (j && j.message) || ('HTTP ' + r.status), status: r.status };
      });
    });
  }
  function rpc(name, args) {
    return token().then(function (t) {
      return fetch(BASE + '/rest/v1/rpc/' + name, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) });
    }).then(function (r) {
      return r.text().then(function (txt) {
        var j; try { j = JSON.parse(txt); } catch (e) { j = txt; }
        if (!r.ok) { var e = new Error((j && j.message) || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  var idOf = function (p) { return p.replace(/^.*\//, ''); };
  var dirOf = function (p) { return p.replace(/\/[^/]*$/, ''); };
  function checkPath(p, doc) {
    if (typeof p !== 'string' || !/^[A-Za-z0-9_.~:@+-]{1,200}(\/[A-Za-z0-9_.~:@+-]{1,200})*$/.test(p)) throw new TypeError('bad path: ' + p);
    var odd = p.split('/').length % 2 === 1;
    if (doc && odd) throw new TypeError('document path needs an even number of segments');
    if (!doc && !odd) throw new TypeError('collection path needs an odd number of segments');
  }
  function getDoc(p) { return rest('GET', '/kv?select=data&path=eq.' + enc(p)).then(function (r) { return r.json(); }).then(function (a) { return a[0] ? a[0].data : undefined; }); }
  function getColl(c) { return rest('GET', '/kv?select=path,data&coll=eq.' + enc(c) + '&order=path.asc&limit=1000').then(function (r) { return r.json(); }).then(function (a) { return a.map(function (x) { return { id: idOf(x.path), data: x.data }; }); }); }
  var META = { fromCache: false, hasPendingWrites: false };
  function docSnap(id, d) { return Object.freeze({ id: id, exists: d !== undefined, data: function () { return d; }, metadata: META }); }
  function collSnap(rows) { var docs = rows.map(function (r) { return docSnap(r.id, r.data); }); return { docs: docs, size: docs.length, empty: !docs.length, docChanges: function () { return []; }, metadata: META }; }
  function merge(a, b) {
    var o = {}, k;
    for (k in a) o[k] = a[k];
    for (k in b) { var v = b[k]; o[k] = v && typeof v === 'object' && !Array.isArray(v) && a && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k]) ? merge(a[k], v) : v; }
    return o;
  }

  /* ---------- live updates: one cheap version poll, refetch only when something changed ---------- */
  var subs = [], ver = null, timer = 0;
  function refreshSub(s) {
    var q = s.kind === 'doc' ? getDoc(s.p) : getColl(s.p);
    return q.then(function (v) {
      var j = JSON.stringify(v === undefined ? null : v);
      if (j === s.last || s.dead) return; s.last = j;
      s.next(s.kind === 'doc' ? docSnap(idOf(s.p), v) : collSnap(v));
    }, function (e) { if (s.err && !s.dead && e && e.code === 'invalid_argument') s.err(e); });
  }
  function refreshAll() { subs.slice().forEach(refreshSub); }
  function poll() {
    if (document.hidden || !subs.length) return;
    rest('GET', '/kv?select=updated_at&order=updated_at.desc&limit=1', null, 'count=exact').then(function (r) {
      var total = (r.headers.get('content-range') || '').split('/')[1] || '';
      return r.json().then(function (a) { var v = (a[0] ? a[0].updated_at : '') + '|' + total; if (ver !== null && v !== ver) refreshAll(); ver = v; });
    }).catch(function () {});
  }
  function subscribe(kind, p, next, err) {
    var s = { kind: kind, p: p, next: next, err: err, last: null, dead: false };
    subs.push(s); refreshSub(s);
    if (!timer) { timer = setInterval(poll, 8000); document.addEventListener('visibilitychange', function () { if (!document.hidden) poll(); }); }
    return function () { s.dead = true; subs = subs.filter(function (x) { return x !== s; }); };
  }
  function bump() { setTimeout(refreshAll, 50); }

  /* ---------- db namespace ---------- */
  function docRef(p) {
    checkPath(p, true);
    var ref = {
      id: idOf(p), path: p,
      get: function () { return getDoc(p).then(function (d) { return docSnap(idOf(p), d); }); },
      set: function (data) { return rest('POST', '/kv', { path: p, coll: dirOf(p), id: idOf(p), data: data, updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal').then(function () { bump(); }); },
      update: function (data) { return getDoc(p).then(function (cur) { if (cur === undefined) throw { code: 'invalid_argument', message: 'document does not exist' }; return ref.set(merge(cur, data)); }); },
      delete: function () { return rest('DELETE', '/kv?path=eq.' + enc(p), null, 'return=minimal').then(function () { bump(); }); },
      onSnapshot: function (next, err) { return subscribe('doc', p, next, err); },
      collection: function (c) { return collRef(p + '/' + c); }
    };
    return ref;
  }
  function collRef(p) {
    checkPath(p, false);
    return {
      path: p,
      get: function () { return getColl(p).then(collSnap); },
      onSnapshot: function (next, err) { return subscribe('coll', p, next, err); },
      doc: function (id) { return docRef(p + '/' + (id || Math.random().toString(36).slice(2, 12))); }
    };
  }
  var db = { doc: docRef, collection: collRef };

  /* ---------- user namespace ---------- */
  var adminCache = null;
  function isAdmin() {
    if (!S) return Promise.resolve(false);
    if (!adminCache) adminCache = rpc('is_admin', {}).then(function (v) { return v === true; }, function () { return false; });
    return adminCache;
  }
  var user = {
    isOwner: isAdmin, canEdit: isAdmin,
    can: function (n) { return n === 'data.write' ? Promise.resolve(!!S) : n === 'files.write' ? isAdmin() : Promise.resolve(false); },
    id: function () { return Promise.resolve(S && S.user.id ? S.user.id : null); },
    me: function () { return Promise.all([isAdmin()]).then(function (r) { return { id: S && S.user.id || null, name: '', avatarUrl: '', color: '#1d5c4a', email: S ? S.user.email : null, isOwner: r[0], canEdit: r[0] }; }); }
  };

  /* ---------- downloads (plain browser download) ---------- */
  var downloads = {
    save: function (req) {
      return new Promise(function (res, rej) {
        try {
          var blob = req.data instanceof Blob ? req.data : new Blob([req.data], { type: /\.svg$/i.test(req.filename) ? 'image/svg+xml' : /\.csv$/i.test(req.filename) ? 'text/csv;charset=utf-8' : 'application/octet-stream' });
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = req.filename; document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); res({ status: 'saved' });
        } catch (e) { rej({ code: 'unavailable', message: String(e) }); }
      });
    }
  };

  /* ---------- claude.use shim ---------- */
  var ready = token();
  window.claude = { use: function (name) { return ready.then(function () { return name === 'db' ? db : name === 'user' ? user : name === 'downloads' ? downloads : null; }); } };

  /* ---------- bookings API (server-side price/status via RPC; see backend/supabase.sql) ---------- */
  function mapRes(r) {
    return { v: 2, id: r.id, code: r.code, uid: r.user_id, pid: r.place_id, pname: r.place_name, cat: r.cat, btype: r.btype, name: r.customer_name, email: r.customer_email, phone: r.customer_phone,
      from: r.date_from || '', to: r.date_to || '', nights: r.nights, qty: r.qty, slot: r.slot, service: r.service, extra: r.extra || {}, note: r.note, unit: r.price_unit,
      price: r.unit_price == null ? null : Number(r.unit_price), total: r.total == null ? null : Number(r.total), instant: r.instant, pv: r.phone_verify, status: r.status,
      cancelReq: r.cancel_requested, reply: r.admin_reply, createdAt: r.created_at, src: r.src };
  }
  function profileFromMeta() { var m = (S && S.user && S.user.meta) || {}; return { name: m.full_name || '', phone: m.phone || '', email: S ? S.user.email : '' }; }
  window.JW_BOOK = {
    profile: function () {
      if (!S) return Promise.resolve({ name: '', phone: '', email: '' });
      return rest('GET', '/profiles?select=full_name,phone,email&user_id=eq.' + enc(S.user.id)).then(function (r) { return r.json(); }).then(function (a) {
        if (a[0]) return { name: a[0].full_name, phone: a[0].phone, email: a[0].email };
        var m = profileFromMeta(); if (m.name || m.phone) window.JW_BOOK.saveProfile(m).catch(function () {}); return m;
      });
    },
    saveProfile: function (p) {
      return rest('POST', '/profiles', { user_id: S.user.id, full_name: String(p.name || '').slice(0, 80), phone: String(p.phone || '').slice(0, 20), email: S.user.email || '', updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal');
    },
    otpRequest: function (phone) { return rpc('otp_request', { p_phone: phone }); },
    otpVerify: function (phone, code) { return rpc('otp_verify', { p_phone: phone, p_code: code }).then(function (v) { return v === true; }); },
    create: function (pid, payload) { return rpc('create_booking', { p_place: pid, p: payload }); },
    list: function () { return rest('GET', '/reservations?select=*&order=created_at.desc&limit=500').then(function (r) { return r.json(); }).then(function (a) { return a.map(mapRes); }); },
    cancel: function (id) { return rpc('cancel_booking', { p_id: id }); },
    setStatus: function (id, status, reply) { return rpc('admin_set_booking_status', { p_id: id, p_status: status, p_reply: reply || '' }); },
    booked: function (pid) { return rpc('booked_days', { p_place: pid }); }
  };

  /* ---------- sign-in UI: e-mail + password (Supabase Auth) ---------- */
  var AUTHERR = [
    [/invalid login|invalid_credentials|invalid grant/i, 'البريد أو كلمة المرور غير صحيحة.'],
    [/not confirmed|email_not_confirmed/i, 'أكّد بريدك الإلكتروني أولًا من الرسالة المرسلة إليك ثم سجّل الدخول.'],
    [/already registered|already been registered|user_already_exists/i, 'هذا البريد مسجّل مسبقًا. سجّل الدخول أو استعد كلمة المرور.'],
    [/password.*(short|weak|least|characters)|weak_password/i, 'كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل.'],
    [/rate limit|too many|over_email_send_rate_limit/i, 'محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.'],
    [/valid email|email_address_invalid|unable to validate email/i, 'البريد الإلكتروني غير صالح.']
  ];
  function authMsg(e, fallback) { var m = String((e && e.message) || ''); for (var i = 0; i < AUTHERR.length; i++) if (AUTHERR[i][0].test(m)) return AUTHERR[i][1]; return fallback; }
  function safeNext(n) { return typeof n === 'string' && n.charAt(0) === '/' && n.charAt(1) !== '/' && n.length < 300 ? n : ''; }
  function finishLogin(j, next) {
    save(toSession(j));
    rpc('claim_owner', {}).then(function (owner) { return owner === true; }, function () { return false; }).then(function (owner) {
      var to = safeNext(next) || (owner ? '/account' : location.pathname + location.search);
      location.assign(to);
    });
  }
  function openLogin(opts) {
    opts = opts || {};
    if (document.querySelector('.jwl')) return;
    var next = safeNext(opts.next) || '';
    var el = document.createElement('div'); el.className = 'jwl'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'تسجيل الدخول');
    el.innerHTML = '<div class="jwl-box"><button class="jwl-x" type="button" aria-label="إغلاق">×</button>' +
      '<h2 class="jwl-t">جولات 360</h2><p class="jwl-p"></p>' +
      (opts.owner ? '' : '<div class="jwl-tabs" role="tablist"><button type="button" role="tab" data-t="login">تسجيل الدخول</button><button type="button" role="tab" data-t="signup">إنشاء حساب</button></div>') +
      '<form class="jwl-login" novalidate><input type="email" name="email" required dir="ltr" autocomplete="username" placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني">' +
      '<input type="password" name="password" required dir="ltr" autocomplete="current-password" placeholder="كلمة المرور" aria-label="كلمة المرور"><button class="btn btn-brand" type="submit">تسجيل الدخول</button>' +
      '<button class="jwl-link" type="button" data-a="forgot">نسيت كلمة المرور؟</button></form>' +
      '<form class="jwl-signup" novalidate hidden><input type="text" name="name" required autocomplete="name" placeholder="الاسم الكامل" aria-label="الاسم الكامل">' +
      '<input type="email" name="email" required dir="ltr" autocomplete="email" placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني">' +
      '<input type="tel" name="phone" required dir="ltr" autocomplete="tel" placeholder="رقم الجوال 05XXXXXXXX" aria-label="رقم الجوال">' +
      '<input type="password" name="password" required dir="ltr" autocomplete="new-password" minlength="8" placeholder="كلمة المرور (8 أحرف على الأقل)" aria-label="كلمة المرور"><button class="btn btn-brand" type="submit">إنشاء الحساب</button></form>' +
      '<p class="jwl-m" role="status"></p></div>';
    document.body.appendChild(el);
    var box = el, msg = el.querySelector('.jwl-m'), fl = el.querySelector('.jwl-login'), fs = el.querySelector('.jwl-signup'), ttl = el.querySelector('.jwl-t'), pp = el.querySelector('.jwl-p');
    function mode(m) {
      var su = m === 'signup'; fl.hidden = su; fs.hidden = !su; msg.textContent = '';
      ttl.textContent = opts.owner ? 'دخول المالك' : (su ? 'إنشاء حساب جديد' : 'تسجيل الدخول');
      pp.textContent = opts.owner ? 'هذه اللوحة مقصورة على مالك المنصة.' : (su ? 'أنشئ حسابًا لإتمام الحجز ومتابعة طلباتك.' : 'أدخل بريدك وكلمة المرور.');
      Array.prototype.forEach.call(el.querySelectorAll('.jwl-tabs button'), function (b) { b.setAttribute('aria-selected', String(b.dataset.t === m)); });
      var f = su ? fs : fl; f.querySelector('input').focus();
    }
    function close() { el.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', esc);
    el.querySelector('.jwl-x').onclick = close;
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    Array.prototype.forEach.call(el.querySelectorAll('.jwl-tabs button'), function (b) { b.onclick = function () { mode(b.dataset.t); }; });
    mode(opts.mode === 'signup' && !opts.owner ? 'signup' : 'login');
    var busy = false;
    function lock(on) { busy = on; Array.prototype.forEach.call(box.querySelectorAll('button[type=submit]'), function (b) { b.disabled = on; }); }
    fl.onsubmit = function (e) {
      e.preventDefault(); if (busy) return;
      var em = fl.email.value.trim(), pw = fl.password.value;
      if (!/^\S+@\S+\.\S+$/.test(em) || !pw) { msg.textContent = 'اكتب البريد وكلمة المرور.'; return; }
      msg.textContent = 'جارٍ التحقق…'; lock(true);
      authReq('/token?grant_type=password', { email: em, password: pw }).then(function (j) { finishLogin(j, next); },
        function (er) { lock(false); msg.textContent = authMsg(er, 'تعذّر تسجيل الدخول. حاول مرة أخرى.'); });
    };
    fl.querySelector('[data-a=forgot]').onclick = function () {
      var em = fl.email.value.trim(); if (!/^\S+@\S+\.\S+$/.test(em)) { msg.textContent = 'اكتب بريدك أولًا ثم اضغط «نسيت كلمة المرور».'; return; }
      authReq('/recover', { email: em }).then(function () { msg.textContent = 'إن كان البريد مسجّلًا فسيصلك رابط لإعادة تعيين كلمة المرور.'; }, function (er) { msg.textContent = authMsg(er, 'تعذّر الإرسال. حاول لاحقًا.'); });
    };
    fs.onsubmit = function (e) {
      e.preventDefault(); if (busy) return;
      var nm = fs.name.value.trim(), em = fs.email.value.trim(), ph = fs.phone.value.trim().replace(/[^0-9+]/g, ''), pw = fs.password.value;
      if (nm.length < 2) { msg.textContent = 'اكتب الاسم الكامل.'; return; }
      if (!/^\S+@\S+\.\S+$/.test(em)) { msg.textContent = 'البريد الإلكتروني غير صالح.'; return; }
      if (!/^(\+|00)?[0-9]{9,15}$/.test(ph)) { msg.textContent = 'رقم الجوال غير صالح.'; return; }
      if (pw.length < 8) { msg.textContent = 'كلمة المرور 8 أحرف على الأقل.'; return; }
      msg.textContent = 'جارٍ إنشاء الحساب…'; lock(true);
      authReq('/signup', { email: em, password: pw, data: { full_name: nm.slice(0, 80), phone: ph.slice(0, 20) } }).then(function (j) {
        if (j && j.access_token) { finishLogin(j, next); return; }
        lock(false); fs.hidden = true; fl.hidden = false; fl.email.value = em; msg.textContent = 'أرسلنا رابط تأكيد إلى بريدك. أكّد حسابك ثم سجّل الدخول.';
      }, function (er) { lock(false); msg.textContent = authMsg(er, 'تعذّر إنشاء الحساب. حاول مرة أخرى.'); });
    };
  }
  function logout() {
    var done = function () { save(null); try { sessionStorage.clear(); } catch (e) {} location.replace('/'); };
    if (!S) return done();
    fetch(BASE + '/auth/v1/logout', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + S.access_token } }).then(done, done);
  }
  /* بعد الخروج: منع الرجوع إلى صفحة محمية من ذاكرة المتصفح (bfcache) */
  window.addEventListener('pageshow', function (e) { if (e.persisted) location.reload(); });
  window.JW_AUTH = { signedIn: function () { return !!S; }, email: function () { return S ? S.user.email : ''; }, open: openLogin, logout: logout };
})();
