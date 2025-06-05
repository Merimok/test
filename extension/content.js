function getPageText() {
  const body = document.body;
  let text = body.innerText || '';
  if (text.length > 10000) {
    text = text.slice(0, 10000);
  }
  return text;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getPageText') {
    sendResponse({text: getPageText()});
  }
});
