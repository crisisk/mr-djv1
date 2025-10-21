from __future__ import annotations

from datetime import date
from typing import Any, Dict
from uuid import UUID

from psycopg2.extras import RealDictCursor

from app.db import session_scope
from app.packages.classifier.repo import get_repository
from app.packages.classifier.types import ClassificationResult

_classification_repo = get_repository()


def get_shipment(shipment_id: UUID) -> Dict[str, Any]:
    with session_scope() as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT id, arrived_at, country_code, hs_code, metadata,
                       net_weight_kg, gross_weight_kg
                FROM shipments
                WHERE id = %s
                """,
                (str(shipment_id),),
            )
            row = cursor.fetchone()
            if not row:
                raise ValueError(f"Shipment {shipment_id} not found")
            return dict(row)


def persist_classification_snapshot(
    shipment_id: UUID,
    result: ClassificationResult,
    ref_date: date,
) -> None:
    with session_scope() as connection:
        _classification_repo.persist_classification_snapshot(
            connection,
            shipment_id=str(shipment_id),
            result_hs=result.hs_code8,
            result_taric=result.taric_code,
            result_source=result.source,
            ruling_id=result.ruling_id,
            ref_date=ref_date,
        )
