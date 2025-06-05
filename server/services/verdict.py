from __future__ import annotations

from typing import Literal

import openai


Verdict = Literal["support", "refute", "not_enough"]


def classify_evidence(claim: str, evidence: str, *, model: str = "gpt-3.5-turbo") -> Verdict:
    """Use OpenAI to classify whether the evidence supports or refutes the claim."""
    messages = [
        {
            "role": "system",
            "content": (
                "Given a claim and evidence, classify the relationship as support, refute, or not_enough."
            ),
        },
        {"role": "user", "content": f"Claim: {claim}\nEvidence: {evidence}"},
    ]

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
    )
    content = response["choices"][0]["message"]["content"].lower()
    if "support" in content:
        return "support"
    if "refute" in content:
        return "refute"
    return "not_enough"
