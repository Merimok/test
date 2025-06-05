// WebWorker placeholder for ONNX claim detection
self.onmessage = async (e) => {
  const text = e.data.text || '';
  // TODO: load ONNX model and perform claim detection
  // For now, return dummy claim
  const claims = [{ text: text.split('. ')[0] || text, confidence: 1 }];
  self.postMessage({ claims });
};
