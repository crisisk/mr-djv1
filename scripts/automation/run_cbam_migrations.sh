#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL must be set" >&2
  exit 1
fi

echo "Applying CBAM migrations..."
for file in ops/migrations/*.sql; do
  echo "Running ${file}"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$file"
done

echo "Refreshing mv_hs_taric_today"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f ops/jobs/refresh_mv_hs_taric_today.sql
