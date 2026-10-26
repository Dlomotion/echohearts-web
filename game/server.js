'use strict';

const http = require('node:http');
const path = require('node:path');
const { readFile } = require('node:fs');

const root = path.resolve(__dirname, '..');
const routes = new Map([
  ['/explorer/', ['explorer/index.html', 'text/html; charset=utf-8']],
  ['/explorer/index.html', ['explorer/index.html', 'text/html; charset=utf-8']],
  ['/explorer/exploration-core.js', ['explorer/exploration-core.js', 'text/javascript; charset=utf-8']],
  ['/explorer/explorer-flight.js', ['explorer/explorer-flight.js', 'text/javascript; charset=utf-8']],
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/game/', ['game/index.html', 'text/html; charset=utf-8']],
  ['/game/index.html', ['game/index.html', 'text/html; charset=utf-8']],
  ['/game/style.css', ['game/style.css', 'text/css; charset=utf-8']],
  ['/game/main.js', ['game/main.js', 'text/javascript; charset=utf-8']],
  ['/game/logic.js', ['game/logic.js', 'text/javascript; charset=utf-8']]
]);

const port = Number(process.env.PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError('PORT must be an integer between 1 and 65535.');
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, 'http://localhost').pathname;
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  if (pathname === '/game' || pathname === '/explorer') {
    response.writeHead(308, { Location: pathname + '/' });
    response.end();
    return;
  }

  const route = routes.get(pathname);
  if (!route) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  readFile(path.join(root, route[0]), (error, contents) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Unable to read requested page');
      return;
    }
    response.writeHead(200, {
      'Content-Type': route[1],
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Length': contents.length
    });
    response.end(request.method === 'HEAD' ? undefined : contents);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Echohearts web prototype available at http://127.0.0.1:${port}/game/`);
});
