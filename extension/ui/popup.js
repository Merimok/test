document.getElementById('check-page')?.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'FACTCHECK_PAGE' });
    }
  });
});
