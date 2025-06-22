import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function generateData(count: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        value: `Item ${Date.now() + i}`
      }));
      resolve({ items: data });
    }, 500);
  });
}

const AppendExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading, call, callToAppend, clear } = useMegamind(generateData, {
    options: {
      callRightAway: false,
    },
  });

  const codeExample = `// 1. Define function that returns array data
function generateData(count: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        value: \`Item \${Date.now() + i}\`
      }));
      resolve({ items: data });
    }, 500);
  });
}

// 2. Use hook with append functionality
const { data, error, isLoading, call, callToAppend, clear } = useMegamind(generateData, {
  options: {
    callRightAway: false,
  },
});

// 3. Use different call methods
<button onClick={() => call(3)}>Load New (3 items)</button>
<button onClick={() => callToAppend(2)}>Append More (2 items)</button>
<button onClick={clear}>Clear All</button>`;

  return (
    <>
      <div className="example-section">
        <h2>📝 Append Functionality</h2>
        <p>Tests callToAppend to add new data to existing arrays.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => call(3)} 
            disabled={isLoading}
            className="test-button"
          >
            Load New (3 items)
          </button>
          <button 
            onClick={() => callToAppend(2)} 
            disabled={isLoading}
            className="test-button"
          >
            Append More (2 items)
          </button>
          <button 
            onClick={clear}
            className="test-button"
          >
            Clear All
          </button>
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong> {JSON.stringify(data, null, 2)}
          </div>
          <div>
            <strong>Error:</strong> {JSON.stringify(error)}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Append Functionality Implementation"
        code={codeExample}
      />
    </>
  );
};

export default AppendExample; 