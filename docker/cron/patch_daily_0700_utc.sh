#!/bin/sh
set -eu

while true; do
  now=$(date -u +%s)

  today_0700=$(date -u +%Y-%m-%d)T07:00:00
  target=$(date -u -d "$today_0700" +%s)

  if [ "$target" -le "$now" ]; then
    tomorrow=$(date -u -d "@$((now + 86400))" +%Y-%m-%d)
    target=$(date -u -d "${tomorrow}T07:00:00" +%s)
  fi

  sleep $((target - now))

  echo "[cron][UTC] PATCH daily 07:00 /api/imoveis $(date -u)"
  curl -fsS -X PATCH \
    -H "Content-Type: application/json" \
    http://next:3000/api/vista/imoveis || true
done
