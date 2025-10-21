from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.packages.classifier import ClassificationContext, classify
from app.repositories import classification as classification_repo

router = APIRouter(tags=["classification"])


@router.post("/internal/classify/{shipment_id}")
def classify_shipment(shipment_id: UUID):
    try:
        shipment = classification_repo.get_shipment(shipment_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    metadata = shipment.get("metadata") or {}
    ctx = ClassificationContext(
        shipment_id=str(shipment_id),
        ref_date=shipment["arrived_at"],
        origin_country=shipment.get("country_code") or metadata.get("origin_country"),
        hs_hint=shipment.get("hs_code"),
        text_hint=metadata.get("desc"),
        weight_kg=shipment.get("net_weight_kg") or shipment.get("gross_weight_kg") or 0.0,
    )

    result = classify(ctx)
    classification_repo.persist_classification_snapshot(shipment_id, result, ctx.ref_date)
    return result
