#!/bin/bash
set -euo pipefail

CHROME_BINARY="${CHROME_BINARY:-$HOME/.cache/ms-playwright/chromium-1194/chrome-linux/chrome}"

if [[ ! -x "$CHROME_BINARY" ]]; then
  echo "Chrome binary not found at $CHROME_BINARY" >&2
  exit 1
fi

exec "$CHROME_BINARY" "$@" --no-sandbox --disable-dev-shm-usage --headless
