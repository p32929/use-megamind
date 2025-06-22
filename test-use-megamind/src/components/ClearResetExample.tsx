import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data loaded at ${new Date().toLocaleTimeString()}`);
    }, 1000);
  });
}

const ClearResetExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading, call, clear, reset } = useMegamind(testAsyncFunction, {
    options: {
      callRightAway: false,
      maxCalls: 3,
    },
  });

  const codeExample = `// 1. Define your async function
function testAsyncFunction() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(\`Data loaded at \${new Date().toLocaleTimeString()}\`);
    }, 1000);
  });
}

// 2. Use hook with maxCalls limit
const { data, error, isLoading, call, clear, reset } = useMegamind(testAsyncFunction, {
  options: {
    callRightAway: false,
    maxCalls: 3, // Limit to 3 calls
  },
});

// 3. Use clear and reset methods
<button onClick={() => call()}>Load Data</button>
<button onClick={clear}>Clear State</button>
<button onClick={reset}>Reset Everything</button>`;

  return (
    <>
      <div className="example-section">
        <h2>🔄 Clear & Reset</h2>
        <p>Tests clear() and reset() methods. MaxCalls: 3 (reset to call again).</p>
        
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
            Load Data
          </button>
          <button 
            onClick={clear}
            className="test-button"
          >
            Clear State
          </button>
          <button 
            onClick={reset}
            className="test-button"
          >
            Reset Everything
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
        title="Clear & Reset Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ClearResetExample; 