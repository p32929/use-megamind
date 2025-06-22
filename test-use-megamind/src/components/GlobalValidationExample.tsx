import React, { useState, useEffect } from 'react';
import useMegamind, { setGlobalValidateOnSuccess, setGlobalValidateOnError } from 'use-megamind';
import CodeModal from './CodeModal';

function testValidationFunction(shouldSucceed: boolean, value: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(value);
      } else {
        reject(value);
      }
    }, 500);
  });
}

const GlobalValidationExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [globalValidation, setGlobalValidation] = useState(true);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (globalValidation) {
      // Set global validations
      setGlobalValidateOnSuccess((data) => {
        addLog(`Global success validation: ${data} - ${data !== 'INVALID'}`);
        return data !== 'INVALID';
      });
      
      setGlobalValidateOnError((error) => {
        addLog(`Global error validation: ${error} - ${error !== 'IGNORE'}`);
        return error !== 'IGNORE';
      });
    } else {
      // Clear global validations
      setGlobalValidateOnSuccess(() => true);
      setGlobalValidateOnError(() => true);
    }
  }, [globalValidation]);

  const { data, error, isLoading, call } = useMegamind(testValidationFunction, {
    options: {
      callRightAway: false,
    },
    events: {
      onSuccess: (data) => addLog(`Local success callback triggered: ${data}`),
      onError: (error) => addLog(`Local error callback triggered: ${error}`),
    },
  });

  const codeExample = `// 1. Set up global validation functions
import { setGlobalValidateOnSuccess, setGlobalValidateOnError } from 'use-megamind';

// Global validation for success
setGlobalValidateOnSuccess((data) => {
  console.log('Global success validation:', data);
  return data !== 'INVALID'; // Don't trigger onSuccess if data is 'INVALID'
});

// Global validation for error
setGlobalValidateOnError((error) => {
  console.log('Global error validation:', error);
  return error !== 'IGNORE'; // Don't trigger onError if error is 'IGNORE'
});

// 2. Define your async function
function testValidationFunction(shouldSucceed: boolean, value: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(value);
      } else {
        reject(value);
      }
    }, 500);
  });
}

// 3. Use hook with local event callbacks
const { data, error, isLoading, call } = useMegamind(testValidationFunction, {
  options: { callRightAway: false },
  events: {
    onSuccess: (data) => console.log('Local success:', data),
    onError: (error) => console.log('Local error:', error),
  },
});

// 4. Test different scenarios
<button onClick={() => call(true, 'VALID')}>Success (Valid)</button>
<button onClick={() => call(true, 'INVALID')}>Success (Invalid)</button>
<button onClick={() => call(false, 'ERROR')}>Error (Normal)</button>
<button onClick={() => call(false, 'IGNORE')}>Error (Ignore)</button>`;

  return (
    <>
      <div className="example-section">
        <h2>🌍 Global Validation</h2>
        <p>Tests global validation functions that control when local callbacks are triggered.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={globalValidation}
              onChange={(e) => setGlobalValidation(e.target.checked)}
            />
            Enable Global Validation
          </label>
        </div>

        <div className="example-controls">
          <h4>🧪 Test Scenarios:</h4>
          <button 
            onClick={() => call(true, 'VALID')} 
            disabled={isLoading}
            className="test-button"
          >
            Success (Valid)
          </button>
          <button 
            onClick={() => call(true, 'INVALID')} 
            disabled={isLoading}
            className="test-button"
          >
            Success (Invalid)
          </button>
          <button 
            onClick={() => call(false, 'ERROR')} 
            disabled={isLoading}
            className="test-button"
          >
            Error (Normal)
          </button>
          <button 
            onClick={() => call(false, 'IGNORE')} 
            disabled={isLoading}
            className="test-button"
          >
            Error (Ignore)
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
          <div>
            <strong>Global Validation:</strong> {globalValidation ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <div className="logs-section">
          <h4>📋 Validation Logs:</h4>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p><em>No validation events logged yet. Try the test scenarios!</em></p>
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
        title="Global Validation Implementation"
        code={codeExample}
      />
    </>
  );
};

export default GlobalValidationExample; 