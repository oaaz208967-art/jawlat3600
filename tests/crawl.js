/* زحف داخلي: يفتح الصفحات ويتبع الروابط الداخلية (وضع المسارات) ويبلّغ عن 404 أو أخطاء JS أو عناوين مكررة. node tests/crawl.js */
const { chromium } = require('playwright'); const L = require('./local-server');
(async () => {
  const web = await L.start(54330, {}); const b = await chromium.launch(); const pg = await b.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(pg.url() + ' ' + e.message));
  const base = 'http://localhost:54330', seen = new Map(), q = ['/']; let bad = 0;
  while (q.length && seen.size < 120) {
    const p = q.shift(); if (seen.has(p)) continue;
    const r = await pg.goto(base + p); await pg.waitForTimeout(350);
    const info = await pg.evaluate(() => ({ t: document.title, h1: document.querySelectorAll('h1').length, nf: /غير موجودة/.test(document.querySelector('h1,h2')?.textContent || ''), links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))] }));
    seen.set(p, info);
    if (r.status() >= 400 || info.nf) { bad++; console.log('BROKEN', p, r.status()); }
    if (info.h1 !== 1) console.log('h1 count', info.h1, p);
    info.links.filter(h => h && h[0] === '/' && !/^\/(assets|api|icons)|\.(png|svg|xml|txt|webmanifest)$/.test(h)).forEach(h => { const k = h.split('#')[0]; if (!seen.has(k)) q.push(k); });
    info.links.filter(h => h && h[0] === '#' && h !== '#main').forEach(h => console.log('hash-link left:', p, h));
  }
  const titles = {}; seen.forEach((v, k) => (titles[v.t] = titles[v.t] || []).push(k));
  Object.entries(titles).filter(([, v]) => v.length > 1).slice(0, 5).forEach(([t, v]) => console.log('dup title:', t, v.slice(0, 3).join(' ')));
  console.log('crawled', seen.size, 'broken', bad, 'js errors', errs.length); errs.slice(0, 3).forEach(e => console.log(e));
  await b.close(); web.close();
})();
