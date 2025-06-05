chrome.runtime.onInstalled.addListener(() => {
  console.log('FactCheck AI background service worker installed.');
});

chrome.contextMenus.create({
  id: 'factcheck-selection',
  title: 'Проверить выделенное',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info: any, tab?: any) => {
  if (info.menuItemId === 'factcheck-selection' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'FACTCHECK_SELECTION' });
  }
});
