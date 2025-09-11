import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction2(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Waited ${ms} ms`), ms);
  });
}

const ParameterExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading } = useMegamind(testAsyncFunction2, {
    functionParams: [1500],
  });

  const codeExample = `// 1. Define function that accepts parameters
function testAsyncFunction2(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(\`Waited \${ms} ms\`), ms);
  });
}

// 2. Use hook with functionParams option
const { data, error, isLoading } = useMegamind(testAsyncFunction2, {
  functionParams: [1500], // Pass parameters as array
});

// 3. The hook will call: testAsyncFunction2(1500)`;

  return (
    <>
      <div className="example-section">
        <h2>⚙️ Function with Parameters</h2>
        <p>Tests async function with parameters (1500ms delay).</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
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
        title="Function with Parameters Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ParameterExample; 