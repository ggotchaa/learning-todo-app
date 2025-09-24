import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distFolder = path.join(__dirname, 'dist', 'bidding-tool-angular');
const indexHtmlPath = path.join(distFolder, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function ensureBuildOutput() {
  if (process.env.SKIP_BUILD === 'true') {
    if (!existsSync(indexHtmlPath)) {
      console.error('Build output not found. Remove SKIP_BUILD or run "npm run build" manually.');
      return false;
    }
    return true;
  }

  console.log('Building Angular application...');
  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, CI: process.env.CI ?? '1' }
  });

  if (buildResult.status !== 0) {
    console.error('Angular build failed. Please check the build errors above.');
    return false;
  }

  if (!existsSync(indexHtmlPath)) {
    console.error('Angular build completed but index.html was not found.');
    return false;
  }

  return true;
}

function resolveFileFromRequest(urlPath) {
  const requestUrl = new URL(urlPath, 'http://localhost');
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === '/') {
    pathname = 'index.html';
  } else {
    pathname = pathname.replace(/^\//, '');
  }

  const safePath = path.normalize(path.join(distFolder, pathname));

  if (!safePath.startsWith(distFolder)) {
    return null;
  }

  if (existsSync(safePath) && statSync(safePath).isFile()) {
    return safePath;
  }

  const htmlFallbackPath = `${safePath}.html`;
  if (existsSync(htmlFallbackPath) && statSync(htmlFallbackPath).isFile()) {
    return htmlFallbackPath;
  }

  return null;
}

function sendFile(res, filePath, method) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[extension] ?? 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', mimeType);

  if (method === 'HEAD') {
    const { size } = statSync(filePath);
    res.setHeader('Content-Length', size);
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
  stream.pipe(res);
}

async function handleRequest(req, res) {
  if (!req.url) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  const method = req.method ?? 'GET';
  if (!['GET', 'HEAD'].includes(method)) {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end('Method Not Allowed');
    return;
  }

  const filePath = resolveFileFromRequest(req.url);
  if (filePath) {
    sendFile(res, filePath, method);
    return;
  }

  sendFile(res, indexHtmlPath, method);
}

if (!ensureBuildOutput()) {
  process.exit(1);
}

const port = Number(process.env.PORT) || 4200;
const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(error => {
    console.error('Unexpected error while serving request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

server.listen(port, () => {
  console.log(`Angular application is available at http://localhost:${port}`);
});
