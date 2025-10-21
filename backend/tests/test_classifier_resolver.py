from __future__ import annotations

from contextlib import contextmanager
from datetime import date

import pytest

from app.packages.classifier import resolver
from app.packages.classifier.repo import BtiRuling
from app.packages.classifier.types import ClassificationContext


class StubRepository:
    def __init__(self, rulings=None, taric_tuple=None, derived_hs=None):
        self._rulings = rulings or []
        self._taric_tuple = taric_tuple
        self._derived_hs = derived_hs

    def derive_hs_from_text(self, text_hint):
        return self._derived_hs

    def pick_most_specific_taric(self, *_args):
        return self._taric_tuple

    def get_applicable_rulings(self, *_args):
        return self._rulings


@contextmanager
def fake_session_scope(_dsn=None):
    yield object()


@pytest.fixture(autouse=True)
def patch_session_scope(monkeypatch):
    monkeypatch.setattr(resolver, "session_scope", lambda dsn=None: fake_session_scope())


def make_context(**kwargs) -> ClassificationContext:
    defaults = dict(
        shipment_id="123",
        ref_date=date(2024, 1, 1),
        origin_country="NL",
        hs_hint="72071200",
        text_hint=None,
        weight_kg=100.0,
    )
    defaults.update(kwargs)
    return ClassificationContext(**defaults)


def test_bti_ruling_overrides_taric(monkeypatch):
    ruling = BtiRuling(
        id="a", ruling_ref="BTI-1", hs_code8="72071200", taric_code="7207120010",
        country_scope="NL", valid_from=date(2023, 1, 1), valid_to=None,
        precedence=1, status="ACTIVE"
    )
    repo = StubRepository(
        rulings=[ruling],
        taric_tuple=("7207120010", date(2020, 1, 1), None),
    )
    monkeypatch.setattr(resolver, "_repository", repo)

    result = resolver.classify(make_context())

    assert result.source == "BTI"
    assert result.taric_code == "7207120010"
    assert result.hs_code8 == "72071200"
    assert result.ruling_id == "a"


def test_direct_taric_used_when_no_ruling(monkeypatch):
    repo = StubRepository(
        rulings=[],
        taric_tuple=("7207120090", date(2022, 6, 1), date(2025, 6, 1)),
    )
    monkeypatch.setattr(resolver, "_repository", repo)

    result = resolver.classify(make_context())

    assert result.source == "DIRECT_TARIC"
    assert result.taric_code == "7207120090"
    assert result.validity_from == date(2022, 6, 1)
    assert result.validity_to == date(2025, 6, 1)


def test_ambiguous_when_no_taric(monkeypatch):
    repo = StubRepository(rulings=[], taric_tuple=None)
    monkeypatch.setattr(resolver, "_repository", repo)

    result = resolver.classify(make_context())

    assert result.source == "HS_DERIVED"
    assert result.taric_code is None
    assert "Ambiguous" in (result.notes or "")
