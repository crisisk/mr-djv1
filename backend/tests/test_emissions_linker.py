from __future__ import annotations

from contextlib import contextmanager
from datetime import date

import pytest

from app.packages.classifier.types import ClassificationResult
from app.packages.emissions_linker import linker


class StubEmissionSource:
    def __init__(self):
        self.defaults = {}
        self.calls = []

    def get_default_emission(self, hs_code8, origin_country):
        key = (hs_code8, origin_country)
        value = self.defaults.get(key)
        if value is None:
            value = {"intensity": 1.0, "source": "default"}
        return value

    def resolve_intensity(self, shipment, classification, default):
        self.calls.append((shipment, classification, default))
        return default


@contextmanager
def fake_session_scope(_dsn=None):
    yield object()


@pytest.fixture(autouse=True)
def patch_session_scope(monkeypatch):
    monkeypatch.setattr(linker, "session_scope", lambda dsn=None: fake_session_scope())


def test_linker_persists_classification(monkeypatch):
    classification = ClassificationResult(
        hs_code8="72071200",
        taric_code="7207120010",
        source="BTI",
        ruling_id="abc",
        validity_from=date(2023, 1, 1),
        validity_to=None,
        notes=None,
    )

    shipment = {
        "id": "1",
        "arrived_at": date(2024, 1, 1),
        "origin_country": "NL",
        "hs_code": "72071200",
        "net_weight_kg": 100,
    }

    emission_source = StubEmissionSource()
    emission_source.defaults[(classification.hs_code8, "NL")] = {
        "intensity": 2.5,
        "source": "default",
    }

    monkeypatch.setattr(linker, "classify", lambda ctx: classification)
    called = {}

    def fake_persist(connection, shipment_id, result_hs, result_taric, result_source, ruling_id, ref_date):
        called.update(
            dict(
                shipment_id=shipment_id,
                result_hs=result_hs,
                result_taric=result_taric,
                result_source=result_source,
                ruling_id=ruling_id,
                ref_date=ref_date,
            )
        )

    monkeypatch.setattr(linker._classification_repo, "persist_classification_snapshot", fake_persist)

    payload = linker.link_emissions(shipment, emission_source)

    assert payload["classification"] == classification
    assert payload["emission_intensity"] == payload["default_emission"]
    assert called["shipment_id"] == shipment["id"]
    assert called["result_hs"] == classification.hs_code8
    assert called["result_taric"] == classification.taric_code
    assert called["result_source"] == classification.source
    assert called["ruling_id"] == classification.ruling_id
    assert called["ref_date"] == shipment["arrived_at"]
