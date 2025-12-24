#!/bin/sh
set -eu

node - <<'NODE'
const net = require('net');
const host = process.env.DB_HOST || 'postgres';
const port = Number(process.env.DB_PORT || 5432);
const deadline = Date.now() + 60_000;

function probe() {
  return new Promise((resolve, reject) => {
    const s = net.createConnection({ host, port });
    s.on('connect', () => { s.end(); resolve(); });
    s.on('error', reject);
  });
}

(async () => {
  while (true) {
    try { await probe(); process.exit(0); }
    catch {
      if (Date.now() > deadline) {
        console.error(`DB not reachable at ${host}:${port} within 60s`);
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
})();
NODE

npx prisma migrate deploy
exec npm run start

