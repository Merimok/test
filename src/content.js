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
    for (const claim of claims) {
      // TODO: search and evaluate claim via ChatGPT DOM
      console.log('Claim detected:', claim.text);
    }
  };
}

// Example trigger: run when popup sends message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'start-check') {
    runFactCheck();
  }
});
