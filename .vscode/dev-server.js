const http = require('http');
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const port = 8080;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function resolveFile(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(safePath).replace(/^([.][.][/\\])+/, '');
  let filePath = path.join(workspaceRoot, normalized);

  if (safePath === '/' || safePath === '') {
    filePath = path.join(workspaceRoot, 'index.html');
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url || '/');

  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Arquivo não encontrado');
      return;
    }

    const targetPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    const ext = path.extname(targetPath).toLowerCase();
    const type = contentTypes[ext] || 'application/octet-stream';

    fs.readFile(targetPath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - Erro ao ler arquivo');
        return;
      }

      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Servidor pronto em http://localhost:${port}`);
});
