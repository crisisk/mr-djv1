#!/usr/bin/env bash
set -euo pipefail

# Mister DJ – Postgres backup script
# Usage: ./postgres-dump.sh [output-directory]
# Requires environment variables:
#   PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

OUTPUT_DIR=${1:-"$(pwd)/backups"}
TIMESTAMP=$(date +%Y%m%d%H%M)
FILENAME="mrdj-${TIMESTAMP}.dump"

mkdir -p "${OUTPUT_DIR}"

pg_dump \
  --format=custom \
  --file="${OUTPUT_DIR}/${FILENAME}" \
  --no-owner \
  --no-privileges

echo "[backup] Dump opgeslagen naar ${OUTPUT_DIR}/${FILENAME}" >&2
