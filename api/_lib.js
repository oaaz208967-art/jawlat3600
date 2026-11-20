/* أدوات مشتركة لدوال Vercel. الملفات التي تبدأ بـ _ لا تُنشر كمسارات. */
const NAMES = require('./_names.json');

const env = (k, d = '') => (process.env[k] || d).trim();

function siteUrl(req) {
  const v = env('SITE_URL').replace(/\/+$/, '');
  if (v) return v;
  const host = (req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '';
  return host ? 'https://' + host : '';
}

const indexing = () => env('ALLOW_INDEXING') === '1';

/* قراءة من Supabase REST بمفتاح anon (نفس صلاحيات الزائر؛ لا تُقرأ إلا المجموعات العامة) */
async function sbGet(pathAndQuery) {
  const base = env('SUPABASE_URL').replace(/\/+$/, ''), key = env('SUPABASE_ANON_KEY');
  if (!base || !key) return null;
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 4000);
  try {
    const r = await fetch(base + '/rest/v1' + pathAndQuery, { headers: { apikey: key, Authorization: 'Bearer ' + key }, signal: ctl.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; } finally { clearTimeout(t); }
}

const escHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escXml = escHtml;

module.exports = { NAMES, env, siteUrl, indexing, sbGet, escHtml, escXml };
