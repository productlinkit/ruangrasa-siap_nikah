import fs from 'fs';
import path from 'path';

// Load TanStack SSR handler
let serverHandler = null;
try {
  const mod = await import('./dist/server/index.js');
  serverHandler = mod.default || mod;
} catch (e) {
  console.log("Could not load SSR handler. Make sure the app is built.", e.message);
}

const roots = [
  path.resolve('dist/client'),
  path.resolve('dist'),
  path.resolve('public')
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
  let p = urlPath.split('/').map(decodeURIComponent).join('/');
  if (p.startsWith('/')) p = p.slice(1);
  if (!p) return null; // Let SSR handle the root path '/'
  for (const root of roots) {
    const candidate = path.join(root, p);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return mime[ext] || 'application/octet-stream';
}

console.log('Starting Bun SSR + static server on port 5173');

Bun.serve({
  port: 5173,
  async fetch(req) {
    try {
      const url = new URL(req.url);
      const pathname = url.pathname;

      // 1. Try to serve static file
      const file = findFile(pathname);
      if (file) {
        return new Response(Bun.file(file), {
          headers: { 
            'Content-Type': contentType(file),
            'Cache-Control': 'public, max-age=31536000, immutable'
          },
        });
      }

      // 2. If no static file found, pass to SSR handler (TanStack Start)
      if (serverHandler && serverHandler.fetch) {
        return serverHandler.fetch(req);
      }

      // 3. Fallback
      return new Response('Not found', { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});
