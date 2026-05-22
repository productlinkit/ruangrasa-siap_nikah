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
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = findFile(pathname);
      if (file) {
        return new Response(Bun.file(file), {
          headers: { 'Content-Type': contentType(file) },
        });
      }
      // fallback to index.html
      const fallback = findFile('/index.html');
      if (fallback) return new Response(Bun.file(fallback), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return new Response('Not found', { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});
