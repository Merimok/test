diff --git a//dev/null b/README.md
index 0000000000000000000000000000000000000000..11d9e9e9b0acce9b325bd3005d5b9058003716c8 100644
--- a//dev/null
+++ b/README.md
@@ -0,0 +1,16 @@
+# FactCheck AI — Free Online
+
+This repository contains a minimal prototype of the FactCheck AI browser extension as described in the technical specification. The extension performs client-side fact–checking using open data sources and interacts with the user’s ChatGPT session to evaluate claims.
+
+## Structure
+
+- `src/manifest.json` – Extension manifest (MV3)
+- `src/background.js` – Background service worker
+- `src/content.js` – Content script to extract page text and detect claims
+- `src/worker-detect.js` – WebWorker placeholder for ONNX claim detector
+- `src/searchLayer.js` – Functions to query DuckDuckGo, Google and Wikipedia
+- `src/chatgpt-evaluator.js` – Automation for ChatGPT DOM interactions
+- `src/popup.html` + `src/popup.js` – Popup UI to start/stop checking
+- `src/sidepanel.html` + `src/sidepanel.js` – Side panel to display results
+
+This code is incomplete and provided as a starting point for further development.
