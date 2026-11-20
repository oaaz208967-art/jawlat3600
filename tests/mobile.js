/* فحص الجوال (375px): تمرير أفقي وأهداف لمس صغيرة. التشغيل: node tests/mobile.js */
const { chromium } = require('playwright'); const L = require('./local-server');
(async () => {
  const web = await L.start(54323, {}); const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage(); let bad = 0;
  const routes = ['/', '/explore', '/cities', '/city/dammam', '/categories', '/category/chalets', '/tours', '/map', '/offers', '/partners', '/account', '/place/chalet-1'];
  const ids = await (async () => { await pg.goto('http://localhost:54323/explore'); await pg.waitForTimeout(800); return pg.evaluate(() => [...document.querySelectorAll('a[href^="/place/"]')].slice(0, 2).map(a => a.getAttribute('href'))); })();
  for (const r of routes.slice(0, -1).concat(ids)) {
    await pg.goto('http://localhost:54323' + r); await pg.waitForTimeout(700);
    const o = await pg.evaluate(() => {
      const W = document.documentElement.clientWidth, over = document.documentElement.scrollWidth - W;
      const wide = [...document.querySelectorAll('body *')].filter(e => { const x = e.getBoundingClientRect(); return x.width > 0 && x.right > W + 1 && !e.closest('[data-hscroll],.rail,.chips,.scroller,.tabs,.map,svg,.leaflet-container'); }).slice(0, 3).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? e.className : '')).join(',');
      const small = [...document.querySelectorAll('a,button,input,select,textarea')].filter(e => { const s = getComputedStyle(e), x = e.getBoundingClientRect(); return x.width > 0 && s.visibility !== 'hidden' && (x.height < 36 || x.width < 36) && !(e.tagName === 'A' && e.closest('p,li,small,.cap,footer') && x.width > 60 && x.height >= 20); }).length;
      return { over, wide, small };
    });
    if (o.over > 1) bad++;
    console.log((o.over > 1 ? 'OVERFLOW ' : 'ok       ') + r + ' over=' + o.over + ' small=' + o.small + (o.wide ? ' wide=' + o.wide : ''));
  }
  await b.close(); web.close(); console.log(bad ? 'overflow pages: ' + bad : 'no horizontal overflow'); process.exit(0);
})();
