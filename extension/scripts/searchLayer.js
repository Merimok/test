export async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('DuckDuckGo request failed');
  return res.json();
}

export async function searchGoogleHTML(query, lang = 'ru') {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=${lang}&num=10&sourceid=chrome`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Google request failed');
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const snippets = [...doc.querySelectorAll('div[data-sncf=1]')].map(el => el.textContent.trim());
  return snippets;
}

export async function fetchWikipediaSummary(lang, title) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Wiki request failed');
  return res.json();
}

export async function handleClaimDetection(claim) {
  // Very naive search implementation
  const ddg = await searchDuckDuckGo(claim);
  const google = await searchGoogleHTML(claim);
  const wiki = await fetchWikipediaSummary('en', claim);
  const evidence = [];
  if (ddg.AbstractText) evidence.push({snippet: ddg.AbstractText, url: ddg.AbstractURL, title: ddg.Heading});
  google.slice(0, 3).forEach(snippet => evidence.push({snippet, url: 'https://www.google.com', title: 'Google'}));
  if (wiki.extract) evidence.push({snippet: wiki.extract, url: wiki.content_urls.desktop.page, title: wiki.title});
  return evidence;
}
