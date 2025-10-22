#!/usr/bin/env bash
set -euo pipefail

MAX_FILES=${MAX_CHANGED_FILES:-25}
MAX_KB=${MAX_DIFF_KB:-250}

changed_files=$(git diff --cached --name-only | wc -l | tr -d ' ')
if [ "$changed_files" -gt "$MAX_FILES" ]; then
  echo "Commit size guard failed: $changed_files files staged (max $MAX_FILES)." >&2
  exit 1
fi

diff_bytes=$(git diff --cached --binary | wc -c | tr -d ' ')
diff_kb=$(( (diff_bytes + 1023) / 1024 ))
if [ "$diff_kb" -gt "$MAX_KB" ]; then
  echo "Commit size guard failed: diff is ${diff_kb}KB (max $MAX_KB KB)." >&2
  exit 1
fi

echo "Commit size guard passed: $changed_files files, ${diff_kb}KB."
