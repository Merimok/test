import { addBookmark } from './cache.js';

let pageUrl = '';
const resultsData = [];

const filterEl = document.getElementById('filter');
const bookmarkBtn = document.getElementById('bookmark');
const recheckBtn = document.getElementById('recheck');

filterEl.addEventListener('change', filterRows);

if (bookmarkBtn) {
  bookmarkBtn.addEventListener('click', () => {
    if (pageUrl) {
      addBookmark(pageUrl, resultsData);
    }
  });
}

if (recheckBtn) {
  recheckBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'trigger-recheck' });
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'fc-start') {
    pageUrl = msg.pageUrl;
  }
  if (msg.command === 'display-verdict') {
    appendResult(msg.data);
    filterRows();
  }
});

function appendResult(result) {
  resultsData.push(result);
  const tbody = document.querySelector('#results tbody');
  const tr = document.createElement('tr');
  tr.className = result.verdict;
  tr.innerHTML = `<td>${result.claim}</td><td>${result.verdict}</td><td>${result.explanation}</td>`;
  tbody.appendChild(tr);
}

function filterRows() {
  const val = filterEl.value;
  document.querySelectorAll('#results tbody tr').forEach(tr => {
    tr.style.display = (val === 'all' || tr.className === val) ? '' : 'none';
  });
}
