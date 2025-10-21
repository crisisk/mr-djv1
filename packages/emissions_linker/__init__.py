"""Interfaces for enriching shipments with CBAM emissions data."""

from .linker import EmissionLinkResult, classify_and_link

__all__ = ["EmissionLinkResult", "classify_and_link"]
