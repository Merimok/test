const btn = document.getElementById('checkBtn');
const status = document.getElementById('status');

btn.addEventListener('click', () => {
  status.textContent = 'Проверка...';
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, {type: 'getPageText'}, async response => {
      const text = response.text;
      chrome.runtime.sendMessage({type: 'factcheck', text}, res => {
        status.textContent = JSON.stringify(res.results, null, 2);
      });
    });
  });
});
