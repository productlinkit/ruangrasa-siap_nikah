import fs from 'fs';
import path from 'path';

const roots = [
  path.resolve('dist/client'),
  path.resolve('dist'),
  path.resolve('public'),
  path.resolve('.'),
];

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function findFile(urlPath) {
  // normalize
  let p = urlPath.split('/').map(decodeURIComponent).join('/');
  if (p.startsWith('/')) p = p.slice(1);
  for (const root of roots) {
    const candidate = path.join(root, p || 'index.html');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
    // try index.html for directories
    const idx = path.join(root, p, 'index.html');
    if (fs.existsSync(idx) && fs.statSync(idx).isFile()) return idx;
  }
  return null;
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return mime[ext] || 'application/octet-stream';
}

console.log('Starting static server on port 5173, serving from:', roots.join(', '));

Bun.serve({
  port: 5173,
  fetch(req) {
    try {
      const url = new URL(req.url);
      let pathname = url.pathname;
        if (pathname === '/') pathname = '/index.html';

        // Special-case favicon: try .ico then fallback to any png
        if (pathname === '/favicon.ico') {
          const ico = findFile('/favicon.ico');
          if (ico) return new Response(Bun.file(ico), { headers: { 'Content-Type': contentType(ico) } });
          const png = findFile('/favicon.png') || findFile('/public/favicon.png') || findFile('/dist/client/favicon.png') || findFile('/favicon.png');
          if (png) return new Response(Bun.file(png), { headers: { 'Content-Type': 'image/png' } });
        }

        const file = findFile(pathname);
        if (file) {
          return new Response(Bun.file(file), {
            headers: { 'Content-Type': contentType(file) },
          });
        }

        // If index.html missing, try to generate a minimal index.html that references
        // the main JS/CSS from the first assets folder we find.
        if (pathname.endsWith('index.html')) {
          for (const root of roots) {
            const assetsDir = path.join(root, 'assets');
            if (!fs.existsSync(assetsDir)) continue;
            const files = fs.readdirSync(assetsDir);
            // find main JS (prefer files starting with index)
            let js = files.find(f => /^index.*\.js$/.test(f));
            if (!js) js = files.find(f => f.endsWith('.js'));
            const css = files.find(f => f.endsWith('.css'));
            const favicon = fs.existsSync(path.join(root, 'favicon.png')) ? '/favicon.png' : '/favicon.ico';

            if (js) {
              const jsPath = path.posix.join('/assets', js);
              const cssPath = css ? path.posix.join('/assets', css) : null;
              const html = `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>RuangRasa</title>\n${cssPath ? `<link rel="stylesheet" href="${cssPath}">` : ''}\n<link rel="icon" href="${favicon}">\n</head>\n<body>\n<div id="root"></div>\n<script type="module" src="${jsPath}"></script>\n</body>\n</html>`;
              return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }
          }
          // no assets found
          return new Response('Not found', { status: 404 });
        }

        return new Response('Not found', { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});
