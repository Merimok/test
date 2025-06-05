"""Verdict classification service using OpenAI."""

from typing import List


def classify_evidence(claim: str, evidence: List[str]) -> str:
    """Return support/refute/not_enough."""
    # TODO: call OpenAI for real classification
    return "not_enough"
