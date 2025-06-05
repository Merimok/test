"""Stub claim detector service using OpenAI function calling."""

from typing import List


def extract_atomic_claims(text: str) -> List[str]:
    """Return a list of claims from the text.

    TODO: call OpenAI API.
    """
    # Placeholder implementation splitting by sentences.
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    return sentences
