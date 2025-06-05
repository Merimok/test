document.getElementById('start').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'start-check' });
  });
  document.getElementById('status').textContent = 'Running...';
});

document.getElementById('stop').addEventListener('click', () => {
  document.getElementById('status').textContent = 'Stopped';
});
