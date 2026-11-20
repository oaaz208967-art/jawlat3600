/* محاكاة صغيرة لواجهتَي Supabase (GoTrue + PostgREST) فوق PostgreSQL محلي حقيقي (tests/pg/up.sh).
   كل طلب REST/RPC يُنفَّذ بدور authenticated/anon وبـ claims المستخدم، فتعمل سياسات RLS ودوال backend/supabase.sql فعليًا.
   ما يُحاكى هنا: المصادقة (كلمة مرور، تأكيد بريد، رموز JWT وهمية) وطبقة HTTP فقط. ليس Supabase الحقيقي.
   للاختبار المحلي فقط. */
const http = require('http'), crypto = require('crypto'), cp = require('child_process'), fs = require('fs');
const PGDIR = process.env.JW_PG_DIR || '/tmp/jw-pg', PGPORT = process.env.JW_PG_PORT || '5546';
const BIN = (() => { try { return fs.readdirSync('/usr/lib/postgresql').sort().map(v => '/usr/lib/postgresql/' + v + '/bin').pop(); } catch (e) { return ''; } })();
const PSQL = (BIN ? BIN + '/' : '') + 'psql';
const uidOf = email => { const h = crypto.createHash('md5').update(email.toLowerCase()).digest('hex'); return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`; };
const lit = s => "'" + String(s).replace(/'/g, "''") + "'";
function psql(sql, vars) {
  return new Promise(res => {
    const args = ['-h', PGDIR, '-p', PGPORT, '-U', 'postgres', '-d', 'jw', '-t', '-A', '-q', '-v', 'ON_ERROR_STOP=1'];
    Object.keys(vars || {}).forEach(k => args.push('-v', k + '=' + vars[k]));
    args.push('-f', '-');
    const p = cp.spawn(PSQL, args); let o = '', e = '';
    p.stdout.on('data', d => o += d); p.stderr.on('data', d => e += d);
    p.on('close', c => res({ code: c, out: o.trim(), err: e }));
    p.stdin.end(sql);
  });
}
/* ينفّذ استعلامًا بهوية المستخدم؛ الاستعلام يُرجع نصًا واحدًا (JSON) في آخر سطر */
async function asUser(u, sql, vars) {
  const role = u ? 'authenticated' : 'anon';
  const pre = `set role ${role};\nselect set_config('request.jwt.claim.sub',${lit(u ? u.id : '')},false), set_config('request.jwt.claim.email',${lit(u ? u.email : '')},false) \\g /dev/null\n`;
  const r = await psql(pre + sql + ';\n', vars);
  if (r.code !== 0) { const m = (r.err.match(/ERROR:\s+([^\n]*)/) || [, r.err])[1]; const rls = /row-level security|permission denied/i.test(m); return { ok: false, status: rls ? (u ? 403 : 401) : 400, body: { code: rls ? '42501' : 'P0001', message: m } }; }
  return { ok: true, out: r.out.split('\n').pop() };
}
const COLS = { kv: ['path', 'coll', 'id', 'data', 'updated_at'], profiles: ['user_id', 'full_name', 'phone', 'email', 'updated_at'] };
const safeCol = c => /^[a-z_]+$/.test(c);
function start(port, opts) {
  opts = opts || {};
  const users = new Map(); // email -> {id,email,password,confirmed,meta}
  const log = [];
  const send = (res, code, body, extra) => { res.writeHead(code, Object.assign({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Expose-Headers': 'content-range' }, extra || {})); res.end(body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body))); };
  const tok = u => 'jwt.' + u.id + '.' + Buffer.from(u.email).toString('hex');
  const me = req => { const a = (req.headers.authorization || '').replace('Bearer ', ''); const m = /^jwt\.([0-9a-f-]{36})\.([0-9a-f]+)$/.exec(a); return m ? { id: m[1], email: Buffer.from(m[2], 'hex').toString() } : null; };
  const sess = u => ({ access_token: tok(u), refresh_token: 'r.' + u.id + '.' + Buffer.from(u.email).toString('hex'), expires_in: 3600, token_type: 'bearer', user: { id: u.id, email: u.email, user_metadata: u.meta || {} } });
  const syncUser = u => psql(`insert into auth.users(id,email,email_confirmed_at) values (${lit(u.id)},${lit(u.email)},${u.confirmed ? 'now()' : 'null'}) on conflict (id) do update set email_confirmed_at=excluded.email_confirmed_at`);
  const where = q => { const w = []; q.forEach((v, k) => { if (['select', 'order', 'limit'].includes(k)) return; if (!safeCol(k) || !/^eq\./.test(v)) return; w.push(`${k} = ${lit(v.slice(3))}`); }); return w.length ? ' where ' + w.join(' and ') : ''; };
  const order = q => { const o = q.get('order'); if (!o) return ''; const m = /^([a-z_]+)\.(asc|desc)$/.exec(o); return m && safeCol(m[1]) ? ` order by ${m[1]} ${m[2]}` : ''; };
  const RPC = { otp_request: { p_phone: 'text' }, otp_verify: { p_phone: 'text', p_code: 'text' }, create_booking: { p_place: 'text', p: 'jsonb' }, cancel_booking: { p_id: 'uuid' }, admin_set_booking_status: { p_id: 'uuid', p_status: 'text', p_reply: 'text' }, booked_days: { p_place: 'text' }, claim_owner: {}, is_admin: {} };
  const srv = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') return send(res, 204);
    let body = ''; req.on('data', d => body += d); req.on('end', async () => {
      try {
        const u = new URL(req.url, 'http://x'), q = u.searchParams, j = body ? JSON.parse(body) : {}, path = u.pathname;
        log.push(req.method + ' ' + path);
        // ---- GoTrue
        if (path === '/auth/v1/signup') {
          const em = String(j.email || '').toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(em)) return send(res, 422, { msg: 'Unable to validate email address: invalid format' });
          if (!j.password || j.password.length < 8) return send(res, 422, { msg: 'Password should be at least 8 characters', error_code: 'weak_password' });
          if (users.has(em)) return send(res, 200, { id: users.get(em).id, email: em });  // كما يفعل Supabase (لا يكشف الوجود)
          const usr = { id: uidOf(em), email: em, password: j.password, confirmed: opts.confirmEmail === false, meta: j.data || {} }; users.set(em, usr); await syncUser(usr);
          return send(res, 200, usr.confirmed ? sess(usr) : { id: usr.id, email: em });
        }
        if (path === '/auth/v1/token') {
          if (q.get('grant_type') === 'password') { const usr = users.get(String(j.email || '').toLowerCase()); if (!usr || usr.password !== j.password) return send(res, 400, { error_description: 'Invalid login credentials', msg: 'Invalid login credentials' }); if (!usr.confirmed) return send(res, 400, { msg: 'Email not confirmed' }); return send(res, 200, sess(usr)); }
          const m = /^r\.([0-9a-f-]{36})\.([0-9a-f]+)$/.exec(j.refresh_token || ''); if (!m) return send(res, 400, { msg: 'invalid refresh' });
          const usr = [...users.values()].find(x => x.id === m[1]); return usr ? send(res, 200, sess(usr)) : send(res, 400, { msg: 'invalid refresh' });
        }
        if (path === '/auth/v1/recover') return send(res, 200, {});
        if (path === '/auth/v1/logout') return send(res, 204);
        // ---- REST
        const user = me(req);
        if (path === '/rest/v1/admins') { const id = q.get('user_id'); const r = await asUser(user, `select coalesce(json_agg(a),'[]') from (select user_id from public.admins${where(q)}) a`); return r.ok ? send(res, 200, r.out) : send(res, r.status, r.body); }
        let m = /^\/rest\/v1\/rpc\/([a-z_]+)$/.exec(path);
        if (m) {
          const sig = RPC[m[1]]; if (!sig) return send(res, 404, { message: 'no function' });
          const args = Object.keys(sig).map(k => `${k} => (:'a_${k}'::text)::${sig[k]}`).join(', ');
          const vars = {}; Object.keys(sig).forEach(k => vars['a_' + k] = sig[k] === 'jsonb' ? JSON.stringify(j[k] == null ? {} : j[k]) : String(j[k] == null ? '' : j[k]));
          const r = await asUser(user, `select to_jsonb(public.${m[1]}(${args}))::text`, vars);
          return r.ok ? send(res, 200, r.out || 'null') : send(res, r.status, r.body);
        }
        m = /^\/rest\/v1\/(kv|profiles|reservations)$/.exec(path);
        if (!m) return send(res, 404, {});
        const t = m[1];
        if (req.method === 'GET') {
          const sel = (q.get('select') || '*').split(',').filter(c => c === '*' || safeCol(c)).join(',') || '*';
          const lim = Math.min(+q.get('limit') || 1000, 1000);
          const cnt = await asUser(user, `select count(*) from public.${t}${where(q)}`);
          const r = await asUser(user, `select coalesce(json_agg(x),'[]') from (select ${sel} from public.${t}${where(q)}${order(q)} limit ${lim}) x`);
          if (!r.ok) return send(res, r.status, r.body);
          const total = cnt.ok ? +cnt.out : 0; return send(res, 200, r.out, { 'Content-Range': `0-${Math.max(0, total - 1)}/${total}` });
        }
        if (req.method === 'POST') {
          if (!user) return send(res, 401, { code: '42501', message: 'permission denied for table ' + t });
          let sql;
          if (t === 'kv') sql = `insert into public.kv(path,coll,id,data,updated_at) values (:'p',:'c',:'i',:'d'::jsonb,now()) on conflict (path) do update set data=excluded.data, updated_at=now()`;
          else if (t === 'profiles') sql = `insert into public.profiles(user_id,full_name,phone,email,updated_at) values (:'u'::uuid,:'n',:'ph',:'e',now()) on conflict (user_id) do update set full_name=excluded.full_name, phone=excluded.phone, email=excluded.email, updated_at=now()`;
          else return send(res, 403, { code: '42501', message: 'permission denied for table reservations' });
          const vars = t === 'kv' ? { p: j.path, c: j.coll, i: j.id, d: JSON.stringify(j.data == null ? null : j.data) } : { u: j.user_id, n: j.full_name, ph: j.phone, e: j.email };
          const r = await asUser(user, sql + ';select 1', vars); return r.ok ? send(res, 201) : send(res, r.status, r.body);
        }
        if (req.method === 'DELETE' && t === 'kv') {
          if (!user) return send(res, 401, { code: '42501', message: 'denied' });
          const r = await asUser(user, `delete from public.kv${where(q)};select 1`); return r.ok ? send(res, 204) : send(res, r.status, r.body);
        }
        send(res, 405, {});
      } catch (e) { send(res, 500, { message: String(e) }); }
    });
  });
  return new Promise(r => srv.listen(port, () => r({
    srv, log, uidOf, users, close: () => srv.close(),
    confirm: async em => { const usr = users.get(em.toLowerCase()); usr.confirmed = true; await syncUser(usr); },
    sql: s => psql(s).then(x => x.out)   // للتحقق المباشر كمشرف قاعدة البيانات (ليس مسار المتصفح)
  })));
}
module.exports = { start, uidOf };
