from __future__ import annotations

from datetime import date
from typing import Optional, Sequence, Tuple

from .repo import BtiRuling


def choose_ruling(rulings: Sequence[BtiRuling]) -> Optional[BtiRuling]:
    if not rulings:
        return None
    return sorted(
        rulings,
        key=lambda ruling: (ruling.precedence, ruling.valid_from or date.min),
    )[0]


def is_valid_for_country(ruling: BtiRuling, country: Optional[str]) -> bool:
    if not ruling.country_scope or not country:
        return True
    return ruling.country_scope == country


def build_ambiguous_result(notes: str | None = None) -> Tuple[str, Optional[str], str, Optional[str]]:
    return ("HS_DERIVED", None, "AMBIGUOUS", notes)
