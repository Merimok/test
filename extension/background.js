import {handleClaimDetection} from './scripts/searchLayer.js';
import {ensureChatGPTSession, evaluatePrompt} from './scripts/chatgptEvaluator.js';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'factcheck') {
    const text = message.text;
    // TODO: segmentation and claim detection via worker
    const claims = [text]; // placeholder
    const results = [];
    for (const claim of claims) {
      const evidence = await handleClaimDetection(claim);
      const prompt = `SYSTEM: Ты факт-чекер, отвечай коротко.\nUSER: Утверждение: "${claim}"\nДоказательства:\n${evidence.map((e, i) => `${i+1}) \"${e.snippet}\" (${e.url})`).join('\n')}\nДай ответ JSON {verdict: support|refute|notenough, explanation_ru: "..."}.`;
      if (await ensureChatGPTSession()) {
        const verdict = await evaluatePrompt(prompt);
        results.push({claim, verdict});
      } else {
        results.push({claim, error: 'no_session'});
      }
    }
    sendResponse({results});
  }
  return true;
});
