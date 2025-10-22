from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException
from packages.classifier import repo as classifier_repo
from packages.emissions_linker import classify_and_link
from sqlalchemy import text

router = APIRouter()


def _get_shipment(shipment_id: UUID) -> dict:
    with classifier_repo.get_connection() as conn:
        row = (
            conn.execute(
                text(
                    """
                SELECT id::text AS id,
                       arrived_at,
                       country_code,
                       hs_code,
                       description,
                       net_weight_kg,
                       gross_weight_kg
                FROM shipments
                WHERE id = :shipment_id
                """
                ),
                {"shipment_id": str(shipment_id)},
            )
            .mappings()
            .first()
        )
        if not row:
            raise HTTPException(status_code=404, detail="Shipment not found")
        return dict(row)


@router.post("/classify")
def classify_shipment(shipment_id: UUID, force: bool = False):
    shipment = _get_shipment(shipment_id)
    result = classify_and_link(shipment, force=force)
    return {
        "shipment_id": result.shipment_id,
        "hs_code8": result.classification.hs_code8,
        "taric_code": result.classification.taric_code,
        "ruling_id": result.classification.ruling_id,
        "source": result.classification.source,
        "emission_intensity": result.emission_intensity,
        "emission_source": result.emission_source,
    }
