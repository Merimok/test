// Functions to query open sources for evidence
export async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchWikidataFacts(query) {
  const sparql = `SELECT ?item ?itemLabel WHERE { ?item ?label "${query}"@en . SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". } } LIMIT 5`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchDbpediaFacts(query) {
  const sparql = `SELECT ?s ?p ?o WHERE { ?s rdfs:label "${query}"@en ; ?p ?o } LIMIT 5`;
  const url = `https://dbpedia.org/sparql?format=application%2Fsparql-results%2Bjson&query=${encodeURIComponent(sparql)}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPolitiFactRss() {
  const res = await fetch('https://www.politifact.com/feeds/latest/');
  const xml = await res.text();
  const dom = new DOMParser().parseFromString(xml, 'text/xml');
  return Array.from(dom.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent
  }));
}

export async function scrapeBing(query, lang = 'en') {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=${lang}`;
  const res = await fetch(url);
  const html = await res.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const results = [];
  dom.querySelectorAll('li.b_algo').forEach(li => {
    const a = li.querySelector('h2 > a');
    const title = a?.textContent?.trim();
    const snippet = li.querySelector('.b_caption p')?.textContent?.trim();
    const url = a?.href;
    if (title && snippet && url) {
      results.push({ title, snippet, url });
    }
  });
  return results;
}

export async function fetchCrossRef(query) {
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchOpenAlex(query) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=5`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchGdelt(query) {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&format=json&maxrecords=5`;
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
  return parseGoogleHtml(html);
}

export function parseGoogleHtml(html) {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const results = [];
  dom.querySelectorAll('div.g').forEach(g => {
    const a = g.querySelector('.yuRUbf > a');
    const title = a?.querySelector('h3')?.textContent?.trim();
    const snippet = g.querySelector('.IsZvec')?.textContent?.trim();
    const url = a?.href;
    if (title && snippet && url) {
      results.push({ title, snippet, url });
    }
  });
  return results;
}
