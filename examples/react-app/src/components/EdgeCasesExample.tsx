import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

// Function that throws immediately (returns rejected Promise)
async function throwsImmediately() {
  throw new Error('Synchronous error before Promise!');
}

// Function that returns null
async function returnsNull() {
  return null;
}

// Function that returns undefined
async function returnsUndefined() {
  return undefined;
}

// Function that never resolves
async function neverResolves() {
  return new Promise(() => {
    // Never resolves or rejects
  });
}

// Function with invalid JSON
async function returnsCircularObject() {
  const obj: any = { name: 'test' };
  obj.circular = obj; // Circular reference
  return obj;
}

const EdgeCasesExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Hook 1: Synchronous error
  const hookSyncError = useMegamind(throwsImmediately, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data: any) => addResult('Sync Error - Success: ' + JSON.stringify(data)),
      onError: (error: any) => addResult('Sync Error - Error: ' + error.message)
    }
  });

  // Hook 2: Returns null
  const hookNull = useMegamind(returnsNull, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data: any) => addResult('Null Return - Success: ' + JSON.stringify(data)),
      onError: (error: any) => addResult('Null Return - Error: ' + error.message)
    }
  });

  // Hook 3: Returns undefined
  const hookUndefined = useMegamind(returnsUndefined, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data: any) => addResult('Undefined Return - Success: ' + JSON.stringify(data)),
      onError: (error: any) => addResult('Undefined Return - Error: ' + error.message)
    }
  });

  // Hook 4: Never resolves (test timeout behavior)
  const hookNeverResolves = useMegamind(neverResolves, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data: any) => addResult('Never Resolves - Success: ' + JSON.stringify(data)),
      onError: (error: any) => addResult('Never Resolves - Error: ' + error.message)
    }
  });

  // Hook 5: Circular object
  const hookCircular = useMegamind(returnsCircularObject, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data: any) => addResult('Circular Object - Success: [Object with circular reference]'),
      onError: (error: any) => addResult('Circular Object - Error: ' + error.message)
    }
  });

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSyncError = () => {
    try {
      hookSyncError.call();
    } catch (error: any) {
      addResult('Sync Error - Caught in component: ' + error.message);
    }
  };

  const codeExample = `// Test various edge cases and error scenarios

// 1. Function that throws synchronously (before Promise)
function throwsImmediately() {
  throw new Error('Synchronous error before Promise!');
}

// 2. Function that returns null
function returnsNull() {
  return Promise.resolve(null);
}

// 3. Function that returns undefined  
function returnsUndefined() {
  return Promise.resolve(undefined);
}

// 4. Function that never resolves (test hanging behavior)
function neverResolves() {
  return new Promise(() => {
    // Never resolves or rejects - tests timeout behavior
  });
}

// 5. Function that returns circular object (test JSON.stringify issues)
function returnsCircularObject() {
  return new Promise((resolve) => {
    const obj = { name: 'test' };
    obj.circular = obj; // Circular reference
    resolve(obj);
  });
}

// Test each edge case
const { call: callSyncError } = useMegamind(throwsImmediately, {
  options: { callRightAway: false },
  events: {
    onError: (error) => console.log('Handled:', error.message)
  }
});

// These should all be handled gracefully by the hook
try {
  callSyncError(); // Should catch sync errors
} catch (error) {
  console.log('Component caught:', error.message);
}`;

  return (
    <>
      <div className="example-section">
        <h2>🚨 Edge Cases & Error Handling</h2>
        <p>Tests unusual scenarios: sync errors, null/undefined returns, hanging promises, circular objects.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={testSyncError}
            className="test-button"
          >
            💥 Sync Error
          </button>
          <button 
            onClick={() => hookNull.call()}
            disabled={hookNull.isLoading}
            className="test-button"
          >
            ❌ Returns Null
          </button>
          <button 
            onClick={() => hookUndefined.call()}
            disabled={hookUndefined.isLoading}
            className="test-button"
          >
            ❓ Returns Undefined
          </button>
          <button 
            onClick={() => hookNeverResolves.call()}
            disabled={hookNeverResolves.isLoading}
            className="test-button"
          >
            ⏳ Never Resolves
          </button>
          <button 
            onClick={() => hookCircular.call()}
            disabled={hookCircular.isLoading}
            className="test-button"
          >
            🔄 Circular Object
          </button>
        </div>

        <div className="example-controls">
          <button 
            onClick={() => setTestResults([])}
            className="test-button"
          >
            Clear Results
          </button>
        </div>
        
        <div className="result-grid">
          <div className="result-box">
            <h4>Loading States:</h4>
            <div>Sync Error: {hookSyncError.isLoading ? '⏳' : '✅'}</div>
            <div>Null Return: {hookNull.isLoading ? '⏳' : '✅'}</div>
            <div>Undefined: {hookUndefined.isLoading ? '⏳' : '✅'}</div>
            <div>Never Resolves: {hookNeverResolves.isLoading ? '⏳' : '✅'}</div>
            <div>Circular: {hookCircular.isLoading ? '⏳' : '✅'}</div>
          </div>
          
          <div className="result-box">
            <h4>Latest Data:</h4>
            <div>Sync Error: {JSON.stringify(hookSyncError.data)}</div>
            <div>Null Return: {JSON.stringify(hookNull.data)}</div>
            <div>Undefined: {JSON.stringify(hookUndefined.data)}</div>
            <div>Never Resolves: {JSON.stringify(hookNeverResolves.data)}</div>
            <div>Circular: {hookCircular.data ? '[Circular Object]' : 'null'}</div>
          </div>

          <div className="result-box">
            <h4>Errors:</h4>
            <div>Sync Error: {hookSyncError.error?.message || 'None'}</div>
            <div>Null Return: {hookNull.error?.message || 'None'}</div>
            <div>Undefined: {hookUndefined.error?.message || 'None'}</div>
            <div>Never Resolves: {hookNeverResolves.error?.message || 'None'}</div>
            <div>Circular: {hookCircular.error?.message || 'None'}</div>
          </div>
        </div>

        <div className="logs-section">
          <h4>📋 Test Results:</h4>
          <div className="logs-container">
            {testResults.length === 0 ? (
              <p><em>No tests run yet. Try the edge case buttons!</em></p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="log-entry">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Edge Cases & Error Handling Tests"
        code={codeExample}
      />
    </>
  );
};

export default EdgeCasesExample;