from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import List, Optional, Sequence, Tuple
from uuid import uuid4

from psycopg2.extras import RealDictCursor


@dataclass
class BtiRuling:
    id: str
    ruling_ref: str
    hs_code8: str
    taric_code: Optional[str]
    country_scope: Optional[str]
    valid_from: date
    valid_to: Optional[date]
    precedence: int
    status: str


class ClassificationRepository:
    """Database access layer for the classifier service."""

    def _fetchall(self, connection, query: str, params: Sequence) -> List[dict]:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return list(cursor.fetchall())

    def get_applicable_rulings(
        self,
        connection,
        hs_code8: str,
        taric_code: Optional[str],
        country: Optional[str],
        ref_date: date,
    ) -> List[BtiRuling]:
        rows: List[dict] = []

        if taric_code:
            rows = self._fetchall(
                connection,
                """
                SELECT * FROM bti_rulings
                WHERE status = 'ACTIVE'
                  AND taric_code = %s
                  AND (country_scope IS NULL OR country_scope = %s)
                  AND is_valid_on(valid_from, valid_to, %s)
                ORDER BY precedence ASC, valid_from DESC
                LIMIT 5
                """,
                (taric_code, country, ref_date),
            )

        if not rows:
            rows = self._fetchall(
                connection,
                """
                SELECT * FROM bti_rulings
                WHERE status = 'ACTIVE'
                  AND hs_code8 = %s
                  AND (country_scope IS NULL OR country_scope = %s)
                  AND is_valid_on(valid_from, valid_to, %s)
                ORDER BY precedence ASC, valid_from DESC
                LIMIT 5
                """,
                (hs_code8, country, ref_date),
            )

        return [
            BtiRuling(
                id=str(row["id"]),
                ruling_ref=row["ruling_ref"],
                hs_code8=row["hs_code8"],
                taric_code=row.get("taric_code"),
                country_scope=row.get("country_scope"),
                valid_from=row["valid_from"],
                valid_to=row.get("valid_to"),
                precedence=row["precedence"],
                status=row["status"],
            )
            for row in rows
        ]

    def pick_most_specific_taric(
        self, connection, hs_code8: str, country: Optional[str], ref_date: date
    ) -> Optional[Tuple[str, date, Optional[date]]]:
        rows = self._fetchall(
            connection,
            """
            SELECT t.taric_code,
                   t.valid_from,
                   t.valid_to,
                   LENGTH(t.taric_code) AS specificity,
                   EXISTS (
                     SELECT 1 FROM v_taric_measures m
                     WHERE m.taric_code = t.taric_code
                       AND (m.country_code IS NULL OR m.country_code = %s)
                       AND is_valid_on(m.valid_from, m.valid_to, %s)
                   ) AS has_measure
            FROM v_taric_nomenclature t
            WHERE t.hs_code8 = %s
              AND is_valid_on(t.valid_from, t.valid_to, %s)
            ORDER BY specificity DESC, t.taric_code ASC
            LIMIT 5
            """,
            (country, ref_date, hs_code8, ref_date),
        )

        for row in rows:
            if row["has_measure"] or country is None:
                return (row["taric_code"], row["valid_from"], row["valid_to"])

        if rows:
            # Fall back to most specific TARIC even without explicit measure.
            row = rows[0]
            return (row["taric_code"], row["valid_from"], row["valid_to"])

        return None

    def taric_validity(
        self, connection, taric_code: str
    ) -> Optional[Tuple[date, Optional[date]]]:
        rows = self._fetchall(
            connection,
            """
            SELECT valid_from, valid_to
            FROM v_taric_nomenclature
            WHERE taric_code = %s
            ORDER BY valid_from DESC
            LIMIT 1
            """,
            (taric_code,),
        )
        if not rows:
            return None
        row = rows[0]
        return (row["valid_from"], row.get("valid_to"))

    def derive_hs_from_text(self, text_hint: Optional[str]) -> Optional[str]:
        if not text_hint:
            return None
        digits = [c for c in text_hint if c.isdigit()]
        if len(digits) >= 6:
            return "".join(digits[:8]).ljust(8, "0")
        return None

    def persist_classification_snapshot(
        self,
        connection,
        shipment_id: str,
        result_hs: str,
        result_taric: Optional[str],
        result_source: str,
        ruling_id: Optional[str],
        ref_date: date,
    ) -> bool:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT hs_code8, taric_code, ruling_id, classification_source
                FROM shipment_classifications
                WHERE shipment_id = %s
                ORDER BY decided_at DESC
                LIMIT 1
                """,
                (shipment_id,),
            )
            previous = cursor.fetchone()

            prev_ruling = None
            if previous:
                prev_ruling = previous.get("ruling_id")
                if prev_ruling is not None:
                    prev_ruling = str(prev_ruling)

            if previous and (
                previous["hs_code8"] == result_hs
                and previous["taric_code"] == result_taric
                and (prev_ruling or None) == ruling_id
                and previous["classification_source"] == result_source
            ):
                return False

            cursor.execute(
                """
                INSERT INTO shipment_classifications (
                  id, shipment_id, hs_code8, taric_code, ruling_id,
                  classification_source, ref_date
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    str(uuid4()),
                    shipment_id,
                    result_hs,
                    result_taric,
                    ruling_id,
                    result_source,
                    ref_date,
                ),
            )

            cursor.execute(
                """
                UPDATE cbam_report_drafts
                SET hs_code8 = %s,
                    taric_code = %s,
                    ruling_id = %s,
                    classification_source = %s
                WHERE shipment_id = %s
                """,
                (
                    result_hs,
                    result_taric,
                    ruling_id,
                    result_source,
                    shipment_id,
                ),
            )

        return True


def get_repository() -> ClassificationRepository:
    return ClassificationRepository()
