"""Business rules and precedence helpers for HS/TARIC classification."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass

from .types import ClassificationResult


@dataclass(frozen=True)
class RulingCandidate:
    """Represents a candidate BTI ruling coming from the repository."""

    id: str
    hs_code8: str
    taric_code: str | None
    precedence: int
    valid_from: str | None
    valid_to: str | None
    source: str | None


def choose_ruling(candidates: Iterable[RulingCandidate]) -> RulingCandidate | None:
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
