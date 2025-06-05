from __future__ import annotations

import os
from typing import List, Dict

import requests


class SearchService:
    def __init__(self, brave_api_key: str | None = None):
        self.brave_api_key = brave_api_key or os.getenv("BRAVE_SEARCH_API_KEY")

    def brave_search(self, query: str, limit: int = 5) -> List[Dict[str, str]]:
        """Query the Brave Search API."""
        if not self.brave_api_key:
            raise ValueError("Brave Search API key required")
        url = "https://api.search.brave.com/res/v1/web/search"
        headers = {"Accept": "application/json", "X-Subscription-Token": self.brave_api_key}
        params = {"q": query, "source": "web", "count": limit}
        resp = requests.get(url, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in data.get("web", {}).get("results", []):
            results.append({
                "title": item.get("title"),
                "url": item.get("url"),
                "snippet": item.get("description"),
            })
        return results

    def wikipedia_search(self, query: str, limit: int = 5) -> List[Dict[str, str]]:
        """Query Wikipedia's CirrusSearch."""
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json",
            "srlimit": limit,
        }
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in data.get("query", {}).get("search", []):
            results.append({
                "title": item.get("title"),
                "url": f"https://en.wikipedia.org/wiki/{item.get('title').replace(' ', '_')}",
                "snippet": item.get("snippet"),
            })
        return results

    def search(self, query: str, limit: int = 5) -> List[Dict[str, str]]:
        """Search using both Brave and Wikipedia."""
        results = []
        try:
            results.extend(self.brave_search(query, limit))
        except Exception:
            # If Brave search fails, continue with Wikipedia results
            pass
        results.extend(self.wikipedia_search(query, limit))
        return results
