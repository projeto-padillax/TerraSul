#!/bin/sh
set -eu

while true; do
  now=$(date -u +%s)
  target=$(date -u -d "today 07:00" +%s 2>/dev/null || date -u -v07H -v00M -v00S +%s)
  if [ "$target" -le "$now" ]; then
    target=$(date -u -d "tomorrow 07:00" +%s 2>/dev/null || date -u -v+1d -v07H -v00M -v00S +%s)
  fi

  sleep $((target - now))

  echo "[cron][UTC] PATCH daily 07:00 /api/imoveis $(date -u)"
  curl -fsS -X PATCH -H "Content-Type: application/json" http://next:3000/api/imoveis || true
done
