"""Link shipments with CBAM emission defaults using the classifier."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Mapping, Optional

from packages.classifier import ClassificationContext, ClassificationResult, classify
from packages.classifier import repo as classifier_repo


@dataclass
class EmissionLinkResult:
    shipment_id: str
    classification: ClassificationResult
    emission_intensity: Optional[float]
    emission_source: Optional[str]


def _get_attr(record: Any, name: str) -> Any:
    if isinstance(record, Mapping):
        return record.get(name)
    return getattr(record, name, None)


def _shipment_weight(record: Any) -> float:
    weight = _get_attr(record, "net_weight_kg") or 0.0
    if not weight:
        weight = _get_attr(record, "gross_weight_kg") or 0.0
    return float(weight or 0.0)


def _build_context(record: Any) -> ClassificationContext:
    return ClassificationContext(
        shipment_id=str(_get_attr(record, "id")),
        ref_date=_get_attr(record, "arrived_at") or date.today(),
        origin_country=str(_get_attr(record, "country_code")),
        hs_hint=_get_attr(record, "hs_code"),
        text_hint=_get_attr(record, "description"),
        weight_kg=_shipment_weight(record),
    )


def _classification_from_snapshot(snapshot: Mapping[str, Any]) -> ClassificationResult:
    return ClassificationResult(
        hs_code8=snapshot["hs_code8"],
        taric_code=snapshot.get("taric_code"),
        source=snapshot.get("classification_source", "DIRECT_TARIC"),
        ruling_id=snapshot.get("ruling_id"),
        validity_from=None,
        validity_to=None,
        notes=None,
    )


def _should_reclassify(
    record: Any, snapshot: Optional[Mapping[str, Any]], force: bool
) -> bool:
    if force or not snapshot:
        return True
    arrival = _get_attr(record, "arrived_at")
    if snapshot.get("ref_date") != arrival:
        return True
    hs_hint = _get_attr(record, "hs_code")
    if hs_hint and snapshot.get("hs_code8") != str(hs_hint)[:8]:
        return True
    return False


def classify_and_link(record: Any, *, force: bool = False) -> EmissionLinkResult:
    """Classify a shipment and persist the resulting emission defaults."""

    ctx = _build_context(record)
    with classifier_repo.get_connection() as conn:
        snapshot = classifier_repo.latest_snapshot(conn, ctx.shipment_id)
        if _should_reclassify(record, snapshot, force):
            classification = classify(ctx)
            classifier_repo.persist_classification_snapshot(
                conn,
                ctx.shipment_id,
                classification.hs_code8,
                classification.taric_code,
                classification.ruling_id,
                classification.source,
                ctx.ref_date,
            )
        else:
            classification = _classification_from_snapshot(snapshot)

        default = classifier_repo.get_cbam_default(
            conn, classification.hs_code8, ctx.origin_country, ctx.ref_date
        )
        emission_intensity = default.emission_intensity if default else None
        emission_source = default.source if default else None
        classifier_repo.upsert_cbam_report_draft(
            conn,
            ctx.shipment_id,
            classification,
            emission_intensity,
            emission_source,
        )

    return EmissionLinkResult(
        shipment_id=ctx.shipment_id,
        classification=classification,
        emission_intensity=emission_intensity,
        emission_source=emission_source,
    )
