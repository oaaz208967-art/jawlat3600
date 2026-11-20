/* خادم اختبار محلي يحاكي Vercel: ملفات ثابتة من site/ + rewrites من vercel.json + دوال api/.
   الاستخدام: node tests/local-server.js [port]   (يُستخدم داخل اختبارات e2e) */
const http = require('http'), fs = require('fs'), path = require('path'), url = require('url');
const ROOT = path.join(__dirname, '..'), SITE = path.join(ROOT, 'site');
const vj = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
function headersFor(p) {
  const out = {};
  for (const h of vj.headers) {
    const re = new RegExp('^' + h.source.replace(/\(\.\*\)/g, '.*') + '$');
    if (re.test(p)) h.headers.forEach(x => out[x.key] = x.value);
  }
  return out;
}
function start(port, opts) {
  opts = opts || {};
  return new Promise(resolve => {
    const srv = http.createServer(async (req, res) => {
      const u = url.parse(req.url, true); let p = decodeURIComponent(u.pathname);
      const hdr = headersFor(p);
      if (hdr['Content-Security-Policy'] && opts.connect) hdr['Content-Security-Policy'] = hdr['Content-Security-Policy'].replace('https://*.supabase.co', opts.connect).replace('; upgrade-insecure-requests', '');
      Object.keys(hdr).forEach(k => res.setHeader(k, hdr[k]));
      if (p === '/assets/config.js' && opts.config) { res.setHeader('Content-Type', MIME['.js']); return res.end('window.JW_CONFIG=' + JSON.stringify(opts.config) + ';'); }
      const file = path.join(SITE, p);
      if (p !== '/' && file.startsWith(SITE) && fs.existsSync(file) && fs.statSync(file).isFile() && !path.basename(file).startsWith('_')) {
        res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
        return res.end(fs.readFileSync(file));
      }
      const fn = (name, q) => { delete require.cache[require.resolve('../api/' + name)]; req.query = q; return require('../api/' + name)(req, res); };
      if (p.startsWith('/api/')) return fn(p.slice(5), u.query);
      if (p === '/sitemap.xml') return fn('sitemap', {});
      if (p === '/robots.txt') return fn('robots', {});
      return fn('page', { p: p.replace(/^\/+/, '') });
    });
    srv.listen(port, () => resolve(srv));
  });
}
module.exports = { start };
if (require.main === module) start(+process.argv[2] || 4173).then(() => console.log('http://localhost:' + (+process.argv[2] || 4173)));
