// WebWorker for claim detection using an ONNX model
let sessionPromise = null;

async function loadSession() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const ort = await import('onnxruntime-web');
      const resp = await fetch(chrome.runtime.getURL('model.onnx'));
      const buffer = await resp.arrayBuffer();
      return await ort.InferenceSession.create(buffer);
    })();
  }
  return sessionPromise;
}

self.onmessage = async (e) => {
  const text = e.data.text || '';
  try {
    const session = await loadSession();
    // TODO: tokenize text and run session.run(inputs) to detect claims
    // For now, return first sentence as dummy claim
    const claim = text.split('. ')[0] || text;
    self.postMessage({ claims: [{ text: claim, confidence: 1 }] });
  } catch (err) {
    // Fallback to dummy claim on error
    const claim = text.split('. ')[0] || text;
    self.postMessage({ claims: [{ text: claim, confidence: 1 }] });
  }
};
