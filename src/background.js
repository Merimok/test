// Background service worker for FactCheck AI
chrome.runtime.onInstalled.addListener(() => {
  console.log('FactCheck AI installed');
});

// Placeholder for interactions with ChatGPT tab
async function ensureChatGPTTab() {
  const tabs = await chrome.tabs.query({ url: 'https://chat.openai.com/*' });
  if (tabs.length > 0) {
    return tabs[0].id;
  }
  const tab = await chrome.tabs.create({ url: 'https://chat.openai.com/', active: false });
  return tab.id;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'open-chatgpt') {
    ensureChatGPTTab().then(id => sendResponse({ tabId: id }));
    return true;
  }
});
