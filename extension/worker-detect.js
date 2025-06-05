self.onmessage = async e => {
  const text = e.data;
  // TODO: load ONNX model and run claim detection
  self.postMessage([{claim: text, confidence: 1}]);
};
