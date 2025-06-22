import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction3(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Hello after ${ms} ms!`), ms);
  });
}

const ButtonClickExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading, call } = useMegamind(testAsyncFunction3, {
    options: {
      callRightAway: false,
    },
  });

  const codeExample = `// 1. Define your async function
function testAsyncFunction3(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(\`Hello after \${ms} ms!\`), ms);
  });
}

// 2. Use hook with callRightAway: false for manual calls
const { data, error, isLoading, call } = useMegamind(testAsyncFunction3, {
  options: {
    callRightAway: false, // Don't call automatically
  },
});

// 3. Call manually with different parameters
<button onClick={() => call(500)}>Call (500ms)</button>
<button onClick={() => call(1000)}>Call (1000ms)</button>`;

  return (
    <>
      <div className="example-section">
        <h2>🔘 Manual Function Call</h2>
        <p>Tests manual function calls with callRightAway: false.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => call(500)} 
            disabled={isLoading}
            className="test-button"
          >
            Call (500ms)
          </button>
          <button 
            onClick={() => call(1000)} 
            disabled={isLoading}
            className="test-button"
          >
            Call (1000ms)
          </button>
          <button 
            onClick={() => call(2000)} 
            disabled={isLoading}
            className="test-button"
          >
            Call (2000ms)
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
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Manual Function Call Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ButtonClickExample; 