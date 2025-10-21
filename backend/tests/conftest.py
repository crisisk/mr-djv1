from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
APP_PATH = PROJECT_ROOT / "app"

for path in (PROJECT_ROOT, APP_PATH):
    str_path = str(path)
    if str_path not in sys.path:
        sys.path.insert(0, str_path)
