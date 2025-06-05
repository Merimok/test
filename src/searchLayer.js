// Functions to query open sources for evidence
export async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchWikiSummary(title, lang = 'en') {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url);
  return res.json();
}

export async function scrapeGoogle(query, lang = 'en') {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=${lang}&num=10`;
  const res = await fetch(url);
  const html = await res.text();
  // TODO: parse DOM in sandbox, extract snippet text
  r
