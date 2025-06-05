// Content script for FactCheck AI
console.log('FactCheck AI content script loaded');
import { getCachedVerdict, storeVerdict } from './cache.js';

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
    if (claims.length > 0) {
      chrome.windows.create({
        url: chrome.runtime.getURL('sidepanel.html'),
        type: 'popup', width: 600, height: 400
      });
    }
    const { scrapeGoogle } = await import(chrome.runtime.getURL('searchLayer.js'));
    const { evaluateClaim } = await import(chrome.runtime.getURL('chatgpt-evaluator.js'));
    for (const claim of claims) {
      console.log('Claim detected:', claim.text);
      const hashBuf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(claim.text));
      const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
      const cached = await getCachedVerdict(hash);
      let result;
      if (cached) {
        result = cached;
      } else {
        const evidence = await scrapeGoogle(claim.text);
        result = await evaluateClaim(claim.text, evidence);
        if (!result.error) {
          await storeVerdict(hash, result);
        }
      }
      chrome.runtime.sendMessage({ command: 'display-verdict', data: { claim: claim.text, verdict: result.verdict, explanation: result.explanation } });
    }
  };
}

// Example trigger: run when popup sends message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'start-check') {
    runFactCheck();
  }
});
