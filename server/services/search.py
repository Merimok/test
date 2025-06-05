"""Search service interacting with Brave Search API and Wikipedia."""

from typing import List


async def search_web(query: str) -> List[str]:
    """Placeholder web search."""
    # TODO: implement actual Brave Search
    return [f"Result for {query}"]
