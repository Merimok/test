import React from 'react';
import {createRoot} from 'react-dom/client';

function App() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(msg => {
      if (msg.type === 'factcheck-result') {
        setData(msg.results);
      }
    });
  }, []);

  return (
    <div>
      <h1>FactCheck AI</h1>
      <ul>
        {data.map((r, i) => (
          <li key={i}>{r.claim}: {r.verdict?.verdict || r.error}</li>
        ))}
      </ul>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
