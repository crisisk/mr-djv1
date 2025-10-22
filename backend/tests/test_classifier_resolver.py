from __future__ import annotations

from contextlib import contextmanager
from datetime import date
from types import SimpleNamespace

import pytest
from packages.classifier import resolver
from packages.classifier.rules import RulingCandidate
from packages.classifier.types import ClassificationContext


@contextmanager
def _fake_conn():
    yield SimpleNamespace()


def _default_ctx(**overrides):
    base = dict(
        shipment_id="S1",
        ref_date=date(2024, 1, 15),
        origin_country="NL",
        hs_hint="1234567890",
        text_hint=None,
        weight_kg=100.0,
    )
    base.update(overrides)
    return ClassificationContext(**base)


def test_bti_precedence_overrides_taric(monkeypatch):
    monkeypatch.setattr(resolver.repo, "get_connection", _fake_conn)
    taric_record = SimpleNamespace(
        taric_code="1234567890",
        valid_from=date(2023, 1, 1),
        valid_to=date(2024, 12, 31),
        description="Example TARIC",
    )
    monkeypatch.setattr(
        resolver.repo,
        "pick_most_specific_taric",
        lambda conn, hs, country, ref: taric_record,
    )
    monkeypatch.setattr(
        resolver.repo,
        "get_applicable_rulings",
        lambda conn, hs, taric, country, ref: [
            RulingCandidate(
                id="r1",
                hs_code8="12345678",
                taric_code="1234567890",
                precedence=1,
                valid_from="2023-01-01",
                valid_to="2024-12-31",
                source="BTI sample",
            )
        ],
    )
    monkeypatch.setattr(
        resolver.repo,
        "taric_validity",
        lambda conn, taric: (date(2023, 1, 1), date(2024, 12, 31)),
    )

    ctx = _default_ctx()
    result = resolver.classify(ctx)

    assert result.source == "BTI"
    assert result.taric_code == "1234567890"
    assert result.ruling_id == "r1"


def test_direct_taric_when_no_ruling(monkeypatch):
    monkeypatch.setattr(resolver.repo, "get_connection", _fake_conn)
    taric_record = SimpleNamespace(
        taric_code="1234567890",
        valid_from=date(2023, 1, 1),
        valid_to=date(2024, 12, 31),
        description="Example TARIC",
    )
    monkeypatch.setattr(
        resolver.repo,
        "pick_most_specific_taric",
        lambda conn, hs, country, ref: taric_record,
    )
    monkeypatch.setattr(
        resolver.repo,
        "get_applicable_rulings",
        lambda conn, hs, taric, country, ref: [],
    )

    ctx = _default_ctx()
    result = resolver.classify(ctx)

    assert result.source == "DIRECT_TARIC"
    assert result.taric_code == "1234567890"


def test_ambiguous_when_taric_candidates_without_measure(monkeypatch):
    monkeypatch.setattr(resolver.repo, "get_connection", _fake_conn)
    monkeypatch.setattr(
        resolver.repo,
        "pick_most_specific_taric",
        lambda conn, hs, country, ref: None,
    )
    monkeypatch.setattr(
        resolver.repo,
        "get_applicable_rulings",
        lambda conn, hs, taric, country, ref: [],
    )
    candidate = SimpleNamespace(
        taric_code="1234567800",
        hs_code8="12345678",
        valid_from=date(2023, 1, 1),
        valid_to=None,
        description="Parent TARIC",
    )
    monkeypatch.setattr(
        resolver.repo,
        "taric_candidates",
        lambda conn, hs, ref: [candidate],
    )

    ctx = _default_ctx()
    result = resolver.classify(ctx)

    assert result.source == "AMBIGUOUS"
    assert result.taric_code is None
    assert "Ambiguous" in (result.notes or "")


def test_missing_hs_hint_raises(monkeypatch):
    monkeypatch.setattr(resolver.repo, "get_connection", _fake_conn)
    monkeypatch.setattr(resolver.repo, "derive_hs_from_text", lambda conn, text, ref: None)

    with pytest.raises(ValueError):
        resolver.classify(
            _default_ctx(hs_hint=None, text_hint=None),
        )
