#!/usr/bin/env bash
set -euo pipefail

# Mister DJ – Backup helper for Docker Compose deployments
#
# Usage: scripts/backup.sh [output-directory]
# Environment overrides:
#   PGUSER       (default: mrdj_user)
#   PGDATABASE   (default: mrdj_db)
#   PGPASSWORD   (default: mrdj_secure_password_2025)
#   PG_SERVICE   (default: mr-dj-postgres)
#   COMPOSE_FILE (default: docker-compose.yml)

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
OUTPUT_DIR=${1:-"${PROJECT_ROOT}/backups"}
TIMESTAMP=$(date +%Y%m%d%H%M%S)
FILENAME="mrdj-${TIMESTAMP}.dump"

PGUSER=${PGUSER:-mrdj_user}
PGDATABASE=${PGDATABASE:-mrdj_db}
PGPASSWORD=${PGPASSWORD:-mrdj_secure_password_2025}
PG_SERVICE=${PG_SERVICE:-mr-dj-postgres}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.yml}

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  echo "[backup] Warning: falling back to legacy docker-compose binary." >&2
  DOCKER_COMPOSE=(docker-compose)
else
  echo "[backup] Error: docker compose is not installed." >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

cd "${PROJECT_ROOT}"

TMP_FILE="${OUTPUT_DIR}/${FILENAME}"

# Run pg_dump inside the Postgres service and stream the output to the host
"${DOCKER_COMPOSE[@]}" -f "${COMPOSE_FILE}" exec -T \
  -e PGPASSWORD="${PGPASSWORD}" \
  "${PG_SERVICE}" \
  pg_dump --format=custom --no-owner --no-privileges \
    --username="${PGUSER}" \
    "${PGDATABASE}" > "${TMP_FILE}"

chmod 600 "${TMP_FILE}"

echo "[backup] Backup written to ${TMP_FILE}" >&2
