"""Database access helpers for the classifier service."""

from __future__ import annotations

import os
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import date
from functools import lru_cache
from typing import Iterator, List, Optional, Sequence

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection, Engine, Result

from .rules import RulingCandidate
from .types import ClassificationResult


@dataclass
class TaricRecord:
    taric_code: str
    hs_code8: str
    valid_from: Optional[date]
    valid_to: Optional[date]
    description: Optional[str]


@dataclass
class MeasureRecord:
    taric_code: str
    country_code: Optional[str]
    valid_from: Optional[date]
    valid_to: Optional[date]


@dataclass
class RulingRow:
    id: str
    hs_code8: str
    taric_code: Optional[str]
    precedence: int
    valid_from: Optional[date]
    valid_to: Optional[date]
    source: Optional[str]


@dataclass
class EmissionDefault:
    hs_code8: str
    country_code: Optional[str]
    emission_intensity: float
    source: Optional[str]
    valid_from: Optional[date]
    valid_to: Optional[date]


_ENGINE: Engine | None = None


def _create_engine() -> Engine:
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        raise RuntimeError("DATABASE_URL environment variable must be set")
    return create_engine(dsn, pool_pre_ping=True, future=True)


def get_engine() -> Engine:
    global _ENGINE
    if _ENGINE is None:
        _ENGINE = _create_engine()
    return _ENGINE


@contextmanager
def get_connection() -> Iterator[Connection]:
    conn = get_engine().connect()
    try:
        yield conn
    finally:
        conn.close()


def _fetchall(conn: Connection, statement: str, **params) -> Sequence[dict]:
    result: Result = conn.execute(text(statement), params)
    rows = [dict(row._mapping) for row in result]
    result.close()
    return rows


def get_applicable_rulings(
    conn: Connection,
    hs_code8: str,
    taric_code: Optional[str],
    country: str,
    ref_date: date,
) -> List[RulingCandidate]:
    """Fetch applicable rulings sorted by precedence."""

    params = {
        "hs_code8": hs_code8,
        "taric_code": taric_code,
        "country": country,
        "ref_date": ref_date,
    }
    candidates: List[RulingCandidate] = []
    if taric_code:
        rows = _fetchall(
            conn,
            """
            SELECT id::text, hs_code8, taric_code, precedence, valid_from, valid_to, source
            FROM bti_rulings
            WHERE status = 'ACTIVE'
              AND taric_code = :taric_code
              AND (:country IS NULL OR country_scope IS NULL OR country_scope = :country)
              AND is_valid_on(valid_from, valid_to, :ref_date)
            ORDER BY precedence ASC, valid_from DESC
            LIMIT 10
            """,
            **params,
        )
        candidates.extend(
            RulingCandidate(
                id=row["id"],
                hs_code8=row["hs_code8"],
                taric_code=row["taric_code"],
                precedence=row["precedence"],
                valid_from=(row["valid_from"].isoformat() if row["valid_from"] else None),
                valid_to=(row["valid_to"].isoformat() if row["valid_to"] else None),
                source=row.get("source"),
            )
            for row in rows
        )
        if candidates:
            return candidates

    rows = _fetchall(
        conn,
        """
        SELECT id::text, hs_code8, taric_code, precedence, valid_from, valid_to, source
        FROM bti_rulings
        WHERE status = 'ACTIVE'
          AND hs_code8 = :hs_code8
          AND (:country IS NULL OR country_scope IS NULL OR country_scope = :country)
          AND is_valid_on(valid_from, valid_to, :ref_date)
        ORDER BY precedence ASC, valid_from DESC
        LIMIT 10
        """,
        **params,
    )
    candidates.extend(
        RulingCandidate(
            id=row["id"],
            hs_code8=row["hs_code8"],
            taric_code=row.get("taric_code"),
            precedence=row["precedence"],
            valid_from=(row["valid_from"].isoformat() if row["valid_from"] else None),
            valid_to=(row["valid_to"].isoformat() if row["valid_to"] else None),
            source=row.get("source"),
        )
        for row in rows
    )
    return candidates


def taric_validity(conn: Connection, taric_code: str) -> tuple[Optional[date], Optional[date]]:
    rows = _fetchall(
        conn,
        """
        SELECT valid_from, valid_to
        FROM v_taric_nomenclature
        WHERE taric_code = :taric_code
        ORDER BY valid_from DESC
        LIMIT 1
        """,
        taric_code=taric_code,
    )
    if not rows:
        return None, None
    row = rows[0]
    return row.get("valid_from"), row.get("valid_to")


def _taric_candidates(
    conn: Connection, hs_code8: str, ref_date: date
) -> List[TaricRecord]:
    rows = _fetchall(
        conn,
        """
        SELECT taric_code, hs_code8, valid_from, valid_to, description
        FROM v_taric_nomenclature
        WHERE hs_code8 = :hs_code8
          AND is_valid_on(valid_from, valid_to, :ref_date)
        ORDER BY length(taric_code) DESC
        """,
        hs_code8=hs_code8,
        ref_date=ref_date,
    )
    return [
        TaricRecord(
            taric_code=row["taric_code"],
            hs_code8=row["hs_code8"],
            valid_from=row.get("valid_from"),
            valid_to=row.get("valid_to"),
            description=row.get("description"),
        )
        for row in rows
    ]


def taric_candidates(conn: Connection, hs_code8: str, ref_date: date) -> List[TaricRecord]:
    """Public wrapper around the TARIC candidate query."""

    return _taric_candidates(conn, hs_code8, ref_date)


def _measure_matches(
    conn: Connection, taric_code: str, country: str, ref_date: date
) -> bool:
    rows = _fetchall(
        conn,
        """
        SELECT 1
        FROM v_taric_measures
        WHERE taric_code = :taric_code
          AND (country_code IS NULL OR country_code = :country)
          AND is_valid_on(valid_from, valid_to, :ref_date)
        LIMIT 1
        """,
        taric_code=taric_code,
        country=country,
        ref_date=ref_date,
    )
    return bool(rows)


def measure_matches(conn: Connection, taric_code: str, country: str, ref_date: date) -> bool:
    """Expose whether a TARIC code has a valid measure for the country/date."""

    return _measure_matches(conn, taric_code, country, ref_date)


def pick_most_specific_taric(
    conn: Connection, hs_code8: str, country: str, ref_date: date
) -> Optional[TaricRecord]:
    candidates = _taric_candidates(conn, hs_code8, ref_date)
    for candidate in candidates:
        if _measure_matches(conn, candidate.taric_code, country, ref_date):
            return candidate
    return candidates[0] if candidates else None


@lru_cache(maxsize=1024)
def cached_taric_lookup(hs_code8: str, country: str, ref_date: date) -> Optional[str]:
    with get_connection() as conn:
        record = pick_most_specific_taric(conn, hs_code8, country, ref_date)
        return record.taric_code if record else None


def derive_hs_from_text(conn: Connection, text_hint: Optional[str], ref_date: date) -> Optional[str]:
    if not text_hint:
        return None
    rows = _fetchall(
        conn,
        """
        SELECT hs_code8
        FROM v_hs_codes
        WHERE description ILIKE :pattern
          AND is_valid_on(valid_from, valid_to, :ref_date)
        ORDER BY valid_from DESC
        LIMIT 1
        """,
        pattern=f"%{text_hint}%",
        ref_date=ref_date,
    )
    if not rows:
        return None
    return rows[0]["hs_code8"]


def persist_classification_snapshot(
    conn: Connection,
    shipment_id: str,
    result_hs: str,
    result_taric: Optional[str],
    ruling_id: Optional[str],
    source: str,
    ref_date: date,
) -> None:
    conn.execute(
        text(
            """
            INSERT INTO shipment_classifications (
                id, shipment_id, hs_code8, taric_code, ruling_id, classification_source, ref_date
            )
            VALUES (
                gen_random_uuid(), :shipment_id, :hs_code8, :taric_code, :ruling_id, :source, :ref_date
            )
            ON CONFLICT (id) DO NOTHING
            """
        ),
        {
            "shipment_id": shipment_id,
            "hs_code8": result_hs,
            "taric_code": result_taric,
            "ruling_id": ruling_id,
            "source": source,
            "ref_date": ref_date,
        },
    )
    conn.commit()


def latest_snapshot(conn: Connection, shipment_id: str) -> Optional[dict]:
    rows = _fetchall(
        conn,
        """
        SELECT hs_code8, taric_code, ruling_id, classification_source, ref_date
        FROM shipment_classifications
        WHERE shipment_id = :shipment_id
        ORDER BY decided_at DESC
        LIMIT 1
        """,
        shipment_id=shipment_id,
    )
    return rows[0] if rows else None


def get_cbam_default(
    conn: Connection, hs_code8: str, country: str, ref_date: date
) -> Optional[EmissionDefault]:
    rows = _fetchall(
        conn,
        """
        SELECT hs_code8, country_code, emission_intensity, source, valid_from, valid_to
        FROM cbam_default_emissions
        WHERE hs_code8 = :hs_code8
          AND (country_code IS NULL OR country_code = :country)
          AND is_valid_on(valid_from, valid_to, :ref_date)
        ORDER BY country_code NULLS LAST, valid_from DESC
        LIMIT 1
        """,
        hs_code8=hs_code8,
        country=country,
        ref_date=ref_date,
    )
    if not rows:
        return None
    row = rows[0]
    return EmissionDefault(
        hs_code8=row["hs_code8"],
        country_code=row.get("country_code"),
        emission_intensity=row["emission_intensity"],
        source=row.get("source"),
        valid_from=row.get("valid_from"),
        valid_to=row.get("valid_to"),
    )


def upsert_cbam_report_draft(
    conn: Connection,
    shipment_id: str,
    result: ClassificationResult,
    emission_intensity: Optional[float],
    emission_source: Optional[str],
) -> None:
    conn.execute(
        text(
            """
            INSERT INTO cbam_report_drafts (
                shipment_id, hs_code8, taric_code, ruling_id, classification_source, emission_intensity, emission_source
            )
            VALUES (
                :shipment_id, :hs_code8, :taric_code, :ruling_id, :source, :emission_intensity, :emission_source
            )
            ON CONFLICT (shipment_id) DO UPDATE SET
                hs_code8 = EXCLUDED.hs_code8,
                taric_code = EXCLUDED.taric_code,
                ruling_id = EXCLUDED.ruling_id,
                classification_source = EXCLUDED.classification_source,
                emission_intensity = EXCLUDED.emission_intensity,
                emission_source = EXCLUDED.emission_source
            """
        ),
        {
            "shipment_id": shipment_id,
            "hs_code8": result.hs_code8,
            "taric_code": result.taric_code,
            "ruling_id": result.ruling_id,
            "source": result.source,
            "emission_intensity": emission_intensity,
            "emission_source": emission_source,
        },
    )
    conn.commit()
