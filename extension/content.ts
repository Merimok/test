chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'FACTCHECK_SELECTION') {
    const selection = window.getSelection()?.toString() || '';
    if (selection) {
      console.log('FactCheck AI selection:', selection);
      // Placeholder: send selection to background or server
    }
  }
});
