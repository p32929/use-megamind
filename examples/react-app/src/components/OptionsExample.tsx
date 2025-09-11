import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction4() {
  return new Promise((resolve, reject) => {
    const random = Math.random();
    setTimeout(() => {
      if (random > 0.7) {
        resolve(`Success! Random: ${random.toFixed(2)}`);
      } else {
        reject(new Error(`Failed! Random: ${random.toFixed(2)}`));
      }
    }, 1000);
  });
}

const OptionsExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading, call } = useMegamind(testAsyncFunction4, {
    options: {
      callRightAway: false,
      maxCalls: 5,
      minimumDelayBetweenCalls: 1000,
      debug: true,
      cache: false,
    },
  });

  const codeExample = `// 1. Define function that sometimes fails
function testAsyncFunction4() {
  return new Promise((resolve, reject) => {
    const random = Math.random();
    setTimeout(() => {
      if (random > 0.7) {
        resolve(\`Success! Random: \${random.toFixed(2)}\`);
      } else {
        reject(new Error(\`Failed! Random: \${random.toFixed(2)}\`));
      }
    }, 1000);
  });
}

// 2. Use hook with advanced options
const { data, error, isLoading, call } = useMegamind(testAsyncFunction4, {
  options: {
    callRightAway: false,
    maxCalls: 5,                    // Limit to 5 calls total
    minimumDelayBetweenCalls: 1000, // Wait 1 second between calls
    debug: true,                    // Enable console logging
    cache: false,                   // Don't cache results
  },
});

// 3. Call manually and check console for debug logs
<button onClick={() => call()}>Try (check console)</button>`;

  return (
    <>
      <div className="example-section">
        <h2>⚙️ Advanced Options</h2>
        <p>Tests maxCalls: 5, minimumDelayBetweenCalls: 1000ms, debug: true. Check console for logs!</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => call()} 
            disabled={isLoading}
            className="test-button"
          >
            Try (check console)
          </button>
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong> {JSON.stringify(data)}
          </div>
          <div>
            <strong>Error:</strong> {JSON.stringify(error)}
          </div>
        </div>
        <p><em>Note: After 5 calls, further calls will be blocked. Check browser console for debug logs.</em></p>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Advanced Options Implementation"
        code={codeExample}
      />
    </>
  );
};

export default OptionsExample; 