const { NAMES, siteUrl, indexing, sbGet, escXml } = require('./_lib');

const STATIC = ['/', '/explore', '/tours', '/cities', '/categories', '/map', '/offers', '/partners'];

module.exports = async (req, res) => {
  const base = siteUrl(req);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  const urls = [];
  if (indexing() && base) {
    STATIC.forEach(p => urls.push([p, null]));
    Object.keys(NAMES.cities).filter(s=>NAMES.cities[s].active).forEach(s => urls.push(['/city/' + s, null]));
    Object.keys(NAMES.cats).forEach(s => urls.push(['/category/' + s, null]));
    const rows = await sbGet('/kv?select=path,data&coll=eq.listings&order=path.asc&limit=1000');
    (rows || []).forEach(r => {
      const d = r.data || {}, id = String(r.path || '').split('/').pop();
      if (!id || !d.name) return;
      urls.push(['/place/x-' + id, (d.publishedAt || '').slice(0, 10) || null]);
    });
  }
  res.statusCode = 200;
  res.end('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(([p, m]) => '<url><loc>' + escXml(base + p) + '</loc>' + (m ? '<lastmod>' + escXml(m) + '</lastmod>' : '') + '</url>').join('\n') +
    '\n</urlset>\n');
};
