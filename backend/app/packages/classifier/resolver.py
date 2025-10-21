from __future__ import annotations

from typing import Optional

from app.db import session_scope

from .repo import ClassificationRepository, get_repository
from .rules import choose_ruling, is_valid_for_country
from .types import ClassificationContext, ClassificationResult

_repository: ClassificationRepository = get_repository()


def _normalize_hs_code(hs_code: Optional[str]) -> Optional[str]:
    if not hs_code:
        return None
    digits = [char for char in hs_code if char.isdigit()]
    if len(digits) < 6:
        return None
    normalized = "".join(digits[:8]).ljust(8, "0")
    return normalized


def classify(ctx: ClassificationContext) -> ClassificationResult:
    hs_code8 = _normalize_hs_code(ctx.hs_hint)
    if not hs_code8:
        derived = _repository.derive_hs_from_text(ctx.text_hint)
        hs_code8 = derived

    if not hs_code8:
        raise ValueError("Unable to determine HS code from context")

    with session_scope() as connection:
        taric_tuple = _repository.pick_most_specific_taric(
            connection, hs_code8, ctx.origin_country, ctx.ref_date
        )
        taric_code: Optional[str] = None
        validity_from = None
        validity_to = None

        if taric_tuple:
            taric_code, validity_from, validity_to = taric_tuple

        rulings = _repository.get_applicable_rulings(
            connection, hs_code8, taric_code, ctx.origin_country, ctx.ref_date
        )
        ruling = choose_ruling(rulings)
        if ruling and is_valid_for_country(ruling, ctx.origin_country):
            return ClassificationResult(
                hs_code8=ruling.hs_code8,
                taric_code=ruling.taric_code or taric_code,
                source="BTI",
                ruling_id=ruling.id,
                validity_from=ruling.valid_from,
                validity_to=ruling.valid_to,
                notes=None,
            )

        if taric_code:
            return ClassificationResult(
                hs_code8=hs_code8,
                taric_code=taric_code,
                source="DIRECT_TARIC",
                ruling_id=None,
                validity_from=validity_from,
                validity_to=validity_to,
                notes=None,
            )

        return ClassificationResult(
            hs_code8=hs_code8,
            taric_code=None,
            source="HS_DERIVED",
            ruling_id=None,
            validity_from=None,
            validity_to=None,
            notes="Ambiguous TARIC; additional code may be required",
        )
