export async function ensureChatGPTSession() {
  return new Promise(resolve => {
    chrome.cookies.get({url: 'https://chat.openai.com', name: '__Secure-next-auth.session-token'}, cookie => {
      resolve(!!cookie);
    });
  });
}

export async function evaluatePrompt(prompt) {
  // Placeholder: open hidden tab and interact with DOM
  console.warn('ChatGPT evaluation is not implemented');
  return {verdict: 'notenough', explanation_ru: 'Не реализовано'};
}
