import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello world from basic example!");
    }, 1000);
  });
}

const BasicExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading } = useMegamind(testAsyncFunction1);

  const codeExample = `// 1. Define your async function
function testAsyncFunction1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello world from basic example!");
    }, 1000);
  });
}

// 2. Use the hook (calls automatically on mount)
const { data, error, isLoading } = useMegamind(testAsyncFunction1);

// 3. Use the states in your component
return (
  <div>
    {isLoading && <p>Loading...</p>}
    {data && <p>Result: {data}</p>}
    {error && <p>Error: {error.message}</p>}
  </div>
);`;

  return (
    <>
      <div className="example-section">
        <h2>📝 Basic Async Function</h2>
        <p>Tests async function without parameters, called automatically on mount.</p>
        
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
        title="Basic Async Function Implementation"
        code={codeExample}
      />
    </>
  );
};

export default BasicExample; 