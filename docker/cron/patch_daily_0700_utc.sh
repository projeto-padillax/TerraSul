#!/bin/sh
set -eu

while true; do
  now=$(date -u +%s)

  # Calculate next 07:00 UTC using pure arithmetic (BusyBox-compatible, no date -d)
  secs_since_midnight=$((now % 86400))
  target=$((now - secs_since_midnight + 25200))  # 07:00 UTC = 7*3600 = 25200s

  if [ "$target" -le "$now" ]; then
    target=$((target + 86400))
  fi

  sleep $((target - now))

  echo "[cron][UTC] PATCH daily 07:00 /api/imoveis $(date -u)"
  if curl -fsS -X PATCH \
    -H "Content-Type: application/json" \
    http://next:3000/api/vista/imoveis; then
    echo "[cron][UTC] PATCH daily OK $(date -u)"
  else
    echo "[cron][UTC] PATCH daily FAILED (exit=$?) $(date -u)" >&2
  fi
done
