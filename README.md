# FactCheck AI — Free Online

- `src/worker-detect.js` – WebWorker that lazily loads an ONNX model
- `src/chatgpt-evaluator.js` – Automates ChatGPT DOM interactions and parses JSON replies
- `model.onnx` – Placeholder ONNX model loaded by the worker
## Structure

- `src/manifest.json` – Extension manifest (MV3)
- `src/background.js` – Background service worker
- `src/content.js` – Content script to extract page text and detect claims
- `src/worker-detect.js` – WebWorker with ONNX runtime placeholder
- `src/cache.js` – IndexedDB storage for verdicts and bookmarks
- `src/searchLayer.js` – Functions to query DuckDuckGo, Google/Bing, Wikipedia and other open sources
- `src/chatgpt-evaluator.js` – Automation for ChatGPT DOM interactions
- `src/popup.html` + `src/popup.js` – Popup UI with progress bar and ChatGPT status
- `src/sidepanel.html` + `src/sidepanel.js` – Side panel with filterable results table and bookmark/re-check buttons

This code is incomplete and provided as a starting point for further development.

## Development

Install the dependencies:

```bash
npm install

