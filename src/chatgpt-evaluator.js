// DOM-based interaction with ChatGPT
export async function evaluateClaim(claim, evidence) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ command: 'open-chatgpt' }, async (res) => {
      const tabId = res.tabId;
      const prompt = buildPrompt(claim, evidence);
      await chrome.scripting.executeScript({
        target: { tabId },
        func: injectPrompt,
        args: [prompt]
      });
      // TODO: read response from DOM
      resolve({ verdict: 'notenough', explanation: 'Not implemented' });
    });
  });
}

function buildPrompt(claim, evidence) {
  let text = 'SYSTEM: You are a fact-checker. Respond in JSON only.\n';
  text += `USER: Claim: "${claim}"\nEvidence:\n`;
  evidence.forEach((e, i) => {
    text += `${i + 1}) "${e.text}" (${e.url})\n`;
  });
  text += 'Output JSON { verdict: support|refute|notenough, explanation_ru: "..." }';
  return text;
}

function injectPrompt(prompt) {
  // This function runs in the ChatGPT tab context
  const textarea = document.querySelector('textarea');
  if (textarea) {
    textarea.value = prompt;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    const form = textarea.closest('form');
    form?.dispatchEvent(new Event('submit', { bubbles: true }));
  }
}
