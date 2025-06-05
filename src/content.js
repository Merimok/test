// Content script for FactCheck AI
console.log('FactCheck AI content script loaded');

// Extract visible text from the page (simplified)
function extractText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement || !node.parentElement.offsetParent) return NodeFilter.FILTER_REJECT;
      if (/script|style/i.test(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const parts = [];
  while (walker.nextNode()) {
    parts.push(walker.currentNode.nodeValue.trim());
  }
  return parts.join(' ').slice(0, 10000);
}

async function runFactCheck() {
  const text = extractText();
  const worker = new Worker(chrome.runtime.getURL('worker-detect.js'));
  worker.postMessage({ text });
  worker.onmessage = async (e) => {
    const claims = e.data.claims || [];
    const { searchDuckDuckGo, fetchWikiSummary, scrapeGoogle } = await import(chrome.runtime.getURL('searchLayer.js'));
    const { evaluateClaim } = await import(chrome.runtime.getURL('chatgpt-evaluator.js'));
    const { openDB, getCached, setCached } = await import(chrome.runtime.getURL('cache.js'));
    const db = await openDB();
    for (const claim of claims) {
      const id = await crypto.subtle.digest('MD5', new TextEncoder().encode(claim.text)).then(buf => Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''));
      const cached = await getCached(db, id);
      let verdict;
      if (cached) {
        verdict = cached;
      } else {
        const ddg = await searchDuckDuckGo(claim.text);
        const google = await scrapeGoogle(claim.text);
        const wiki = ddg.RelatedTopics?.[0]?.Text ? await fetchWikiSummary(ddg.RelatedTopics[0].Text) : null;
        const evidence = [];
        google.forEach(r => evidence.push({ text: r.snippet, url: '' }));
        if (wiki) evidence.push({ text: wiki.extract, url: wiki.content_urls?.desktop?.page });
        verdict = await evaluateClaim(claim.text, evidence);
        await setCached(db, id, verdict);
      }
      chrome.runtime.sendMessage({ command: 'display-verdict', data: { claim: claim.text, ...verdict } });
      console.log('Claim detected:', claim.text, verdict.verdict);
    }
  };
}

// Example trigger: run when popup sends message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'start-check') {
    runFactCheck();
  }
});
