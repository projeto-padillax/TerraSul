#!/bin/sh
set -eu

while true; do
  # align to the top of the hour (UTC)
  sleep $((3600 - ($(date -u +%s) % 3600)))

  echo "[cron][UTC] PUT hourly /api/imoveis $(date -u)"
  if curl -fsS -X PUT \
    -H "Content-Type: application/json" \
    http://next:3000/api/vista/imoveis; then
    echo "[cron][UTC] PUT hourly OK $(date -u)"
  else
    echo "[cron][UTC] PUT hourly FAILED (exit=$?) $(date -u)" >&2
  fi
done
