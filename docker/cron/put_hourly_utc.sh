!/bin/sh
set -eu

while true; do
  # align to the top of the hour (UTC)
  sleep $((3600 - ($(date -u +%s) % 3600)))

  echo "[cron][UTC] PUT hourly /api/imoveis $(date -u)"
  curl -fsS -X PUT -H "Content-Type: application/json" http://next:3000/api/imoveis || true
done
