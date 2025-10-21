from __future__ import annotations

from datetime import date
from typing import Any, Dict

from app.db import session_scope
from app.packages.classifier import ClassificationContext, classify
from app.packages.classifier.repo import get_repository

_classification_repo = get_repository()


def _shipment_weight(shipment: Dict[str, Any]) -> float:
    for key in ("net_weight_kg", "gross_weight_kg", "weight_kg"):
        value = shipment.get(key)
        if value:
            return float(value)
    return 0.0


def _shipment_ref_date(shipment: Dict[str, Any]) -> date:
    ref_date = shipment.get("arrived_at") or shipment.get("reference_date")
    if isinstance(ref_date, date):
        return ref_date
    raise ValueError("Shipment requires an arrival/reference date")


def link_emissions(
    shipment: Dict[str, Any],
    emission_source,
) -> Dict[str, Any]:
    """Classify a shipment and enrich it with emission intensity."""

    ctx = ClassificationContext(
        shipment_id=str(shipment["id"]),
        ref_date=_shipment_ref_date(shipment),
        origin_country=_resolve_origin_country(shipment),
        hs_hint=shipment.get("hs_code"),
        text_hint=(shipment.get("description") or shipment.get("metadata", {}).get("desc")),
        weight_kg=_shipment_weight(shipment),
    )

    classification = classify(ctx)

    with session_scope() as connection:
        _classification_repo.persist_classification_snapshot(
            connection,
            shipment_id=ctx.shipment_id,
            result_hs=classification.hs_code8,
            result_taric=classification.taric_code,
            result_source=classification.source,
            ruling_id=classification.ruling_id,
            ref_date=ctx.ref_date,
        )

    default_emission = emission_source.get_default_emission(
        classification.hs_code8, ctx.origin_country
    )
    intensity = emission_source.resolve_intensity(
        shipment, classification, default_emission
    )

    payload = {
        "shipment_id": ctx.shipment_id,
        "classification": classification,
        "emission_intensity": intensity,
        "default_emission": default_emission,
    }

    return payload


def _resolve_origin_country(shipment: Dict[str, Any]) -> str:
    origin = shipment.get("origin_country") or shipment.get("country_code")
    if not origin:
        raise ValueError("Shipment requires an origin country")
    return origin
