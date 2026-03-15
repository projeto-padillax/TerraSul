#!/bin/bash
set -e

NEON_URL="postgresql://neondb_owner:npg_XtHEnQFNR71M@ep-long-truth-acn1h0kr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
VPS_URL="postgresql://terrasul:Terr@Sul2024!@postgres:5432/terrasul"

echo "==> Fazendo dump dos dados admin do Neon..."
pg_dump "$NEON_URL" \
  --data-only \
  --exclude-table=imoveis \
  --exclude-table=fotos \
  --exclude-table=videos \
  --exclude-table=caracteristicas \
  --exclude-table=infraestrutura \
  --exclude-table='"CorretorExterno"' \
  -f admin_data.sql

echo "==> Restaurando dados na VPS..."
psql "$VPS_URL" -f admin_data.sql

echo "==> Migração concluída!"
