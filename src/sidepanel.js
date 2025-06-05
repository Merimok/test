// Placeholder side panel script
const filterEl = document.getElementById('filter');
filterEl.addEventListener('change', filterRows);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'display-verdict') {
    appendResult(msg.data);
    filterRows();
  }
});

function appendResult(result) {
  const tbody = document.querySelector('#results tbody');
  const tr = document.createElement('tr');
  tr.className = result.verdict;
  tr.innerHTML = `<td>${result.claim}</td><td>${result.verdict}</td><td>${result.explanation}</td>`;
  tbody.appendChild(tr);
}

function filterRows() {
  const val = filterEl.value;
  document.querySelectorAll('#results tbody tr').forEach(tr => {
    if (val === 'all' || tr.className === val) {
      tr.style.display = '';
    } else {
      tr.style.display = 'none';
    }
  });
}
