// Placeholder side panel script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'display-verdict') {
    appendResult(msg.data);
  }
});

function appendResult(result) {
  const tbody = document.querySelector('#results tbody');
  const tr = document.createElement('tr');
  tr.className = result.verdict;
  tr.innerHTML = `<td>${result.claim}</td><td>${result.verdict}</td><td>${result.explanation}</td>`;
  tbody.appendChild(tr);
}
