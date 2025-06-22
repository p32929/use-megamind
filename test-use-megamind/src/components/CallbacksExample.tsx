import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function testAsyncFunction5(shouldSucceed: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve('Success! 🎉');
      } else {
        reject(new Error('Something went wrong! 😞'));
      }
    }, 1000);
  });
}

const CallbacksExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const { data, error, isLoading, call } = useMegamind(testAsyncFunction5, {
    options: {
      callRightAway: false,
    },
    events: {
      onLoadingStart: () => addLog('Loading started'),
      onLoadingFinished: () => addLog('Loading finished'),
      onSuccess: (data) => addLog(`Success callback: ${data}`),
      onError: (error) => addLog(`Error callback: ${error.message}`),
      onLoadingChange: (isLoading) => addLog(`Loading changed: ${isLoading}`),
    },
  });

  const codeExample = `// 1. Define your async function
function testAsyncFunction5(shouldSucceed: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve('Success! 🎉');
      } else {
        reject(new Error('Something went wrong! 😞'));
      }
    }, 1000);
  });
}

// 2. Use hook with event callbacks
const { data, error, isLoading, call } = useMegamind(testAsyncFunction5, {
  options: {
    callRightAway: false,
  },
  events: {
    onLoadingStart: () => addLog('Loading started'),
    onLoadingFinished: () => addLog('Loading finished'),
    onSuccess: (data) => addLog(\`Success callback: \${data}\`),
    onError: (error) => addLog(\`Error callback: \${error.message}\`),
    onLoadingChange: (isLoading) => addLog(\`Loading changed: \${isLoading}\`),
  },
});

// 3. Call with different parameters to trigger different callbacks
<button onClick={() => call(true)}>Call (Success)</button>
<button onClick={() => call(false)}>Call (Error)</button>`;

  return (
    <>
      <div className="example-section">
        <h2>📞 Event Callbacks</h2>
        <p>Tests onLoadingStart, onLoadingFinished, onSuccess, onError, and onLoadingChange callbacks.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => call(true)} 
            disabled={isLoading}
            className="test-button"
          >
            Call (Success)
          </button>
          <button 
            onClick={() => call(false)} 
            disabled={isLoading}
            className="test-button"
          >
            Call (Error)
          </button>
          <button 
            onClick={() => setLogs([])}
            className="test-button"
          >
            Clear Logs
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

        <div className="logs-section">
          <h4>📋 Event Logs:</h4>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p><em>No events logged yet. Try calling the function!</em></p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Event Callbacks Implementation"
        code={codeExample}
      />
    </>
  );
};

export default CallbacksExample; 