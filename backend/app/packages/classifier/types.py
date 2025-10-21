from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class ClassificationContext(BaseModel):
    shipment_id: str = Field(..., description="Unique shipment identifier")
    ref_date: date = Field(..., description="Reference date for TARIC validity")
    origin_country: str = Field(..., min_length=2, max_length=2)
    hs_hint: Optional[str] = Field(
        default=None, description="Existing HS code to start from"
    )
    text_hint: Optional[str] = Field(
        default=None, description="Optional textual description"
    )
    weight_kg: float = Field(..., ge=0, description="Weight in kilograms")


class ClassificationResult(BaseModel):
    hs_code8: str
    taric_code: Optional[str] = None
    source: str
    ruling_id: Optional[str] = None
    validity_from: Optional[date] = None
    validity_to: Optional[date] = None
    notes: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "hs_code8": "72071200",
                    "taric_code": "7207120010",
                    "source": "BTI",
                    "ruling_id": "ef5a7b8a-1c40-4b1b-8d60-8cf832436123",
                    "validity_from": "2024-01-01",
                    "validity_to": "2025-01-01",
                    "notes": "Exact TARIC match via BTI"
                }
            ]
        }
    }
