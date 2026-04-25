const http = require('http');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const port = Number(process.env.PORT || 3030);
const host = '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function safePath(urlPath) {
  const parsedPath = new URL(urlPath, `http://${host}:${port}`).pathname;
  const cleanPath = parsedPath === '/' ? '/apps/web/index.html' : parsedPath;
  const resolved = path.normalize(path.join(projectRoot, cleanPath));
  if (!resolved.startsWith(projectRoot)) {
    return null;
  }
  return resolved;
}

const server = http.createServer((req, res) => {
  const requested = safePath(req.url || '/');
  if (!requested) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(requested, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(requested);
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'text/plain; charset=utf-8'
    });
    res.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`EvoMate demo running at http://${host}:${port}`);
});
