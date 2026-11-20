/* يخدم كل صفحات الموقع: يُدخل في HTML عنوان الصفحة ووصفها ووسم robots ومعاينة المشاركة
   (تعمل مع واتساب وتويتر وغيرها التي لا تشغّل JavaScript)، ثم يكمل المتصفح العرض بالتطبيق.
   أي خطأ هنا يعيد القالب كما هو حتى لا يتعطل الموقع. */
const fs = require('fs'), path = require('path');
const { NAMES, siteUrl, indexing, sbGet, escHtml } = require('./_lib');

const SN = 'جولات 360';
const T = {
  explore: ['اكتشف الأماكن', 'تصفّح الأماكن في الدمام والخبر والظهران والرياض وجدة مع فلاتر وخريطة.'],
  tours: ['جولات 360°', 'جولات 360° للأماكن قبل زيارتها.'],
  map: ['خريطة الأماكن', 'اعرض الأماكن على الخريطة حسب المدينة والتصنيف.'],
  cities: ['المدن', 'المدن المتاحة على جولات 360 وأماكنها.'],
  categories: ['التصنيفات', 'تصنيفات الأماكن: شاليهات وفنادق ومطاعم ومقاهٍ وغيرها.'],
  offers: ['العروض', 'عروض أضافها أصحاب المنشآت وتظهر طوال مدة سريانها.'],
  partners: ['الشركاء', 'قدّم طلب شراكة أو سجّل كسفير في جولات 360.'],
  articles: ['المقالات', 'مقالات ودلائل عن الوجهات والتجارب.']
};
const KNOWN = new Set(['home', 'explore', 'cities', 'city', 'categories', 'category', 'place', 'tours', 'map', 'articles', 'article', 'partners', 'admin', 'go', 'account', 'offers', 'insights', 'bookings']);
const PRIVATE = new Set(['admin', 'go', 'account', 'insights', 'bookings']);

let TPL = null;
function template() {
  if (TPL) return TPL;
  for (const c of [path.join(process.cwd(), 'site/_shell.html'), path.join(__dirname, '../site/_shell.html')]) {
    try { TPL = fs.readFileSync(c, 'utf8'); return TPL; } catch (e) { /* التالي */ }
  }
  return null;
}

function inject(html, o) {
  const e = escHtml;
  let h = html
    .replace(/<title>[\s\S]*?<\/title>/, '<title>' + e(o.title) + '</title>')
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + e(o.desc) + '">')
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="' + o.robots + '">')
    .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="' + e(o.title) + '">')
    .replace(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="' + e(o.desc) + '">')
    .replace(/<meta property="og:type"[^>]*>/, '<meta property="og:type" content="' + (o.type || 'website') + '">')
    .replace(/<meta property="og:image"[^>]*>/, '<meta property="og:image" content="' + e(o.base + '/og.png') + '">');
  let extra = '<link rel="canonical" href="' + e(o.url) + '">\n<meta property="og:url" content="' + e(o.url) + '">\n';
  if (o.ld) extra += '<script type="application/ld+json">' + JSON.stringify(o.ld).replace(/</g, '\\u003c') + '</script>\n';
  return h.replace('</head>', extra + '</head>');
}

module.exports = async (req, res) => {
  const shell = template();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!shell) { res.statusCode = 500; return res.end('shell not found'); }
  try {
    const p = String((req.query && req.query.p) || '').replace(/^\/+|\/+$/g, '').slice(0, 200);
    if (/\./.test(p)) { res.statusCode = 404; res.setHeader('Cache-Control', 'public, s-maxage=60'); return res.end('Not found'); }
    const segs = p ? p.split('/') : ['home'], name = segs[0], arg = segs.slice(1).join('/');
    const base = siteUrl(req), idx = indexing();
    const o = { base, url: base + (p ? '/' + p : '/'), title: SN + ' — اكتشف المكان قبل ما تروح له', desc: 'استكشف الأماكن والتجارب من حولك، وشاهدها بجولة 360° قبل زيارتها.', robots: idx ? 'index,follow' : 'noindex,nofollow', type: 'website' };
    let status = 200, cache = 'public, s-maxage=3600, stale-while-revalidate=86400';
    if (!KNOWN.has(name)) { status = 404; o.robots = 'noindex,nofollow'; o.title = 'الصفحة غير موجودة | ' + SN; cache = 'public, s-maxage=60'; }
    else if (PRIVATE.has(name)) { o.robots = 'noindex,nofollow'; o.title = (name === 'account' ? 'حسابي' : name === 'bookings' ? 'حجوزاتي' : name === 'go' ? SN : 'الإدارة') + ' | ' + SN; cache = 'no-store'; }
    else if (T[name]) { o.title = T[name][0] + ' | ' + SN; o.desc = T[name][1]; }
    else if (name === 'city' && NAMES.cities[arg]) { const c = NAMES.cities[arg]; o.title = `${c.ar} — أماكن وجولات 360° | ${SN}`; o.desc = c.about || `اكتشف أماكن ${c.ar} بجولات 360°.`; if (!c.active) o.robots = 'noindex,follow'; }
    else if (name === 'category' && NAMES.cats[arg]) { const c = NAMES.cats[arg]; o.title = `${c.ar} في السعودية | ${SN}`; o.desc = c.desc; }
    else if (name === 'article') { o.robots = 'noindex,follow'; }
    else if (name === 'place') {
      const m = /^x-([A-Za-z0-9_.~:@+-]{1,200})$/.exec(arg);
      const rows = m && await sbGet('/kv?select=data&path=eq.' + encodeURIComponent('listings/' + m[1]));
      const d = rows && rows[0] && rows[0].data;
      if (d && d.name) {
        const cat = (NAMES.cats[d.cat] || {}).ar || '', city = (NAMES.cities[d.city] || {}).ar || '';
        o.title = `${d.name} — ${cat} في ${city} | ${SN}`; o.desc = String(d.short || '').slice(0, 155) || o.desc; o.type = 'article';
        o.ld = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: d.name, description: o.desc, url: o.url, address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: 'SA' } };
        if (d.phone) o.ld.telephone = d.phone;
        cache = 'public, s-maxage=300, stale-while-revalidate=3600';
      } else { o.robots = 'noindex,follow'; cache = 'public, s-maxage=60'; }
    }
    res.setHeader('Cache-Control', cache);
    res.statusCode = status;
    return res.end(inject(shell, o));
  } catch (e) {
    res.statusCode = 200; res.setHeader('Cache-Control', 'no-store');
    return res.end(shell);
  }
};
