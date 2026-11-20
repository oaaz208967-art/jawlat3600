const { siteUrl, indexing } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (!indexing()) {
    res.statusCode = 200;
    return res.end('User-agent: *\nDisallow: /\n');
  }
  const base = siteUrl(req);
  res.statusCode = 200;
  res.end([
    'User-agent: *',
    'Allow: /',
    'Disallow: /account',
    'Disallow: /admin',
    'Disallow: /insights',
    'Disallow: /go/',
    'Disallow: /api/',
    base ? 'Sitemap: ' + base + '/sitemap.xml' : '',
    ''
  ].filter((x, i, a) => x !== '' || i === a.length - 1).join('\n'));
};
