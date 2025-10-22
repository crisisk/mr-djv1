"""Typed models used by the classifier service."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


class ClassificationContext(BaseModel):
    """Input context required to classify a shipment."""

    shipment_id: str = Field(..., description="Unique shipment identifier")
    ref_date: date = Field(..., description="Reference date for TARIC/HS validity")
    origin_country: str = Field(..., min_length=2, max_length=2)
    hs_hint: str | None = Field(
        default=None,
        min_length=6,
        max_length=10,
        description="Optional pre-classified HS/TARIC hint",
    )
    text_hint: str | None = Field(
        default=None,
        description="Optional textual description for fuzzy lookup",
    )
    weight_kg: float = Field(..., ge=0)


class ClassificationResult(BaseModel):
    """Outcome of the classifier decision tree."""

    hs_code8: str = Field(..., min_length=8, max_length=8)
    taric_code: str | None = Field(default=None, min_length=8, max_length=10)
    source: str = Field(..., description="Source of the classification decision")
    ruling_id: str | None = Field(default=None)
    validity_from: date | None = Field(default=None)
    validity_to: date | None = Field(default=None)
    notes: str | None = Field(default=None)
