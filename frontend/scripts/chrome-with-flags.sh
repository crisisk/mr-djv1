#!/bin/bash
set -euo pipefail

CHROME_BINARY="${CHROME_BINARY:-}"

find_first_executable() {
  local glob="$1"

  if [[ -z "$glob" ]]; then
    return 1
  fi

  # compgen returns a non-zero exit code when no matches exist, so ignore failures.
  while IFS= read -r candidate; do
    if [[ -x "$candidate" ]]; then
      printf '%s' "$candidate"
      return 0
    fi
  done < <(compgen -G "$glob" 2>/dev/null || true)

  return 1
}

if [[ -z "$CHROME_BINARY" ]]; then
  uname_s=$(uname -s)
  case "$uname_s" in
    Linux*)
      CHROME_BINARY=$(find_first_executable "$HOME/.cache/ms-playwright/chromium-*/chrome-linux/chrome") || true
      ;;
    Darwin*)
      CHROME_BINARY=$(find_first_executable "$HOME/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium") || true
      if [[ -z "$CHROME_BINARY" ]]; then
        CHROME_BINARY=$(find_first_executable "$HOME/Library/Caches/ms-playwright/chromium-*/chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing") || true
      fi
      ;;
    CYGWIN*|MINGW*|MSYS*)
      CHROME_BINARY=$(find_first_executable "$HOME/AppData/Local/ms-playwright/chromium-*/chrome-win/chrome.exe") || true
      ;;
  esac
fi

if [[ -z "$CHROME_BINARY" ]]; then
  for cmd in google-chrome-stable google-chrome chromium chromium-browser chrome \
    "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if [[ "$cmd" == /* ]]; then
      if [[ -x "$cmd" ]]; then
        CHROME_BINARY="$cmd"
        break
      fi
    elif command -v "$cmd" >/dev/null 2>&1; then
      CHROME_BINARY="$(command -v "$cmd")"
      break
    fi
  done
fi

if [[ -z "$CHROME_BINARY" || ! -e "$CHROME_BINARY" ]]; then
  echo "Chrome binary not found. Set CHROME_BINARY to a valid executable." >&2
  exit 1
fi

exec "$CHROME_BINARY" "$@" --no-sandbox --disable-dev-shm-usage --headless
