const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const chatgptEl = document.getElementById('chatgpt');

document.getElementById('start').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'start-check' });
  });
  statusEl.textContent = 'Running...';
});

document.getElementById('stop').addEventListener('click', () => {
  statusEl.textContent = 'Stopped';
  progressEl.style.display = 'none';
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'fc-start') {
    progressEl.max = msg.total;
    progressEl.value = 0;
    progressEl.style.display = 'block';
  }
  if (msg.command === 'fc-progress') {
    progressEl.value = msg.done;
  }
  if (msg.command === 'fc-done') {
    statusEl.textContent = 'Done';
    progressEl.style.display = 'none';
  }
  if (msg.command === 'chatgpt-login-required') {
    chatgptEl.textContent = 'ChatGPT login required';
  }
});
