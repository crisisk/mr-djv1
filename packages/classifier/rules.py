"""Business rules and precedence helpers for HS/TARIC classification."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Optional

from .types import ClassificationResult


@dataclass(frozen=True)
class RulingCandidate:
    """Represents a candidate BTI ruling coming from the repository."""

    id: str
    hs_code8: str
    taric_code: Optional[str]
    precedence: int
    valid_from: Optional[str]
    valid_to: Optional[str]
    source: Optional[str]


def choose_ruling(candidates: Iterable[RulingCandidate]) -> Optional[RulingCandidate]:
    """Return the highest precedence ruling (lowest precedence value).

    Candidates are expected to be pre-filtered on validity and country scope.
    """

    return min(candidates, key=lambda c: (c.precedence, c.valid_from or ""), default=None)


def ambiguous_result(hs_code8: str) -> ClassificationResult:
    """Helper to build a result when TARIC selection is ambiguous."""

    return ClassificationResult(
        hs_code8=hs_code8,
        taric_code=None,
        source="AMBIGUOUS",
        ruling_id=None,
        validity_from=None,
        validity_to=None,
        notes="Ambiguous TARIC; additional code may be required",
    )
