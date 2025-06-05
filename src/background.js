// Background service worker for FactCheck AI
chrome.runtime.onInstalled.addListener(() => {
  console.log('FactCheck AI installed');
});

// Helper to create or reuse the ChatGPT tab
async function ensureChatGPTTab() {
  const tabs = await chrome.tabs.query({ url: 'https://chat.openai.com/*' });
  if (tabs.length > 0) {
    return tabs[0].id;
  }
  const tab = await chrome.tabs.create({
    url: 'https://chat.openai.com/',
    active: false
  });
  return tab.id;
}

// Ensure ChatGPT tab exists and report whether user is logged in
async function ensureChatGPTSession() {
  const tabId = await ensureChatGPTTab();
  const [{ result: loginRequired }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => !!document.querySelector('input[type="password"]')
  });
  if (!loginRequired) {
    try { await chrome.tabs.hide(tabId); } catch (e) { /* ignore */ }
  }
  return { tabId, loginRequired };
}

let lastScanTabId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'ensure-chatgpt-session') {
    ensureChatGPTSession().then(sendResponse);
    return true; // Keep message channel open for async response
  }

  if (msg.command === 'show-chatgpt') {
    chrome.tabs.update(msg.tabId, { active: true });
  }

  if (msg.command === 'fc-start') {
    lastScanTabId = sender.tab?.id || lastScanTabId;
  }

  if (msg.command === 'trigger-recheck') {
    if (lastScanTabId !== null) {
      chrome.tabs.sendMessage(lastScanTabId, { command: 'recheck-page' });
    }
  }
});

// Auto-add "hl" (language) param for Google queries
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    if (!url.searchParams.has('hl')) {
      url.searchParams.set('hl', chrome.i18n.getUILanguage().split('-')[0]);
      return { redirectUrl: url.toString() };
    }
  },
  { urls: ['https://www.google.com/search*'], types: ['xmlhttprequest'] },
  ['blocking']
);

