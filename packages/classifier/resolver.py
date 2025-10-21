"""Resolve HS/TARIC codes for shipments based on rulings and measures."""

from __future__ import annotations

from typing import Optional

from . import repo
from .rules import ambiguous_result, choose_ruling
from .types import ClassificationContext, ClassificationResult


def _normalise_hs_code(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    digits = "".join(ch for ch in value if ch.isalnum())
    if len(digits) >= 8:
        return digits[:8]
    return None


def _resolve_hs(conn, ctx: ClassificationContext) -> str:
    hs_hint = _normalise_hs_code(ctx.hs_hint)
    if hs_hint:
        return hs_hint

    derived = repo.derive_hs_from_text(conn, ctx.text_hint, ctx.ref_date)
    if derived:
        return derived

    raise ValueError("Unable to derive HS code from provided context")


def classify(ctx: ClassificationContext) -> ClassificationResult:
    """Classify a shipment and return the chosen HS/TARIC combination."""

    with repo.get_connection() as conn:
        hs_code8 = _resolve_hs(conn, ctx)
        taric_record = repo.pick_most_specific_taric(
            conn, hs_code8, ctx.origin_country, ctx.ref_date
        )

        ruling_candidates = repo.get_applicable_rulings(
            conn, hs_code8, taric_record.taric_code if taric_record else None, ctx.origin_country, ctx.ref_date
        )
        selected_ruling = choose_ruling(ruling_candidates)
        if selected_ruling:
            validity = repo.taric_validity(
                conn,
                selected_ruling.taric_code or (taric_record.taric_code if taric_record else hs_code8),
            )
            return ClassificationResult(
                hs_code8=selected_ruling.hs_code8,
                taric_code=selected_ruling.taric_code
                or (taric_record.taric_code if taric_record else None),
                source="BTI",
                ruling_id=selected_ruling.id,
                validity_from=validity[0],
                validity_to=validity[1],
                notes=selected_ruling.source,
            )

        if taric_record:
            return ClassificationResult(
                hs_code8=hs_code8,
                taric_code=taric_record.taric_code,
                source="DIRECT_TARIC",
                ruling_id=None,
                validity_from=taric_record.valid_from,
                validity_to=taric_record.valid_to,
                notes=taric_record.description,
            )

        candidates = repo.taric_candidates(conn, hs_code8, ctx.ref_date)
        if candidates:
            return ambiguous_result(hs_code8)

        return ClassificationResult(
            hs_code8=hs_code8,
            taric_code=None,
            source="HS_DERIVED",
            ruling_id=None,
            validity_from=None,
            validity_to=None,
            notes="No TARIC mapping available on reference date",
        )
