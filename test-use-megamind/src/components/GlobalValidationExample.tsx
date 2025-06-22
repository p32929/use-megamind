import React, { useState, useEffect } from 'react';
import useMegamind, { setGlobalValidateOnSuccess, setGlobalValidateOnError } from 'use-megamind';

function testAsyncFunction8(shouldSucceed: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("VALID_SUCCESS");
      } else {
        reject("VALID_ERROR");
      }
    }, 800);
  });
}

function testAsyncFunction9(shouldSucceed: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("INVALID_SUCCESS");
      } else {
        reject("INVALID_ERROR");
      }
    }, 800);
  });
}

const GlobalValidationExample: React.FC = () => {
  const [globalValidationEnabled, setGlobalValidationEnabled] = useState(false);
  const [successLogs, setSuccessLogs] = useState<string[]>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  useEffect(() => {
    if (globalValidationEnabled) {
      setGlobalValidateOnSuccess((data) => {
        const isValid = data?.includes("VALID");
        setSuccessLogs(prev => [...prev.slice(-2), `Global success validation: ${data} -> ${isValid ? 'PROCEED' : 'BLOCK'}`]);
        return isValid;
      });

      setGlobalValidateOnError((error) => {
        const isValid = error?.includes("VALID");
        setErrorLogs(prev => [...prev.slice(-2), `Global error validation: ${error} -> ${isValid ? 'PROCEED' : 'BLOCK'}`]);
        return isValid;
      });
    } else {
      setGlobalValidateOnSuccess(() => true);
      setGlobalValidateOnError(() => true);
    }
  }, [globalValidationEnabled]);

  const { data: data1, error: error1, isLoading: isLoading1, call: call1 } = useMegamind(testAsyncFunction8, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data) => setSuccessLogs(prev => [...prev.slice(-2), `Hook 1 success: ${data}`]),
      onError: (error) => setErrorLogs(prev => [...prev.slice(-2), `Hook 1 error: ${error}`]),
    },
  });

  const { data: data2, error: error2, isLoading: isLoading2, call: call2 } = useMegamind(testAsyncFunction9, {
    options: { callRightAway: false },
    events: {
      onSuccess: (data) => setSuccessLogs(prev => [...prev.slice(-2), `Hook 2 success: ${data}`]),
      onError: (error) => setErrorLogs(prev => [...prev.slice(-2), `Hook 2 error: ${error}`]),
    },
  });

  return (
    <div className="example-section">
      <h2>🌐 Example 8: Global Validation</h2>
      <p>Tests global validation functions that apply to all useMegamind instances.</p>
      
      <div className="controls">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={globalValidationEnabled}
            onChange={(e) => setGlobalValidationEnabled(e.target.checked)}
          />
          Enable Global Validation (only allows "VALID" in data/error)
        </label>
      </div>

      <div className="controls">
        <h4>Hook 1 (Returns VALID data/error):</h4>
        <button 
          onClick={() => call1(true)} 
          disabled={isLoading1}
          className="test-button"
        >
          Call Success (VALID)
        </button>
        <button 
          onClick={() => call1(false)} 
          disabled={isLoading1}
          className="test-button"
        >
          Call Error (VALID)
        </button>
      </div>

      <div className="controls">
        <h4>Hook 2 (Returns INVALID data/error):</h4>
        <button 
          onClick={() => call2(true)} 
          disabled={isLoading2}
          className="test-button"
        >
          Call Success (INVALID)
        </button>
        <button 
          onClick={() => call2(false)} 
          disabled={isLoading2}
          className="test-button"
        >
          Call Error (INVALID)
        </button>
      </div>
      
      <div className="result-box">
        <div>
          <strong>Hook 1 - Loading:</strong> {isLoading1 ? 'Yes' : 'No'}, 
          <strong> Data:</strong> {JSON.stringify(data1)}, 
          <strong> Error:</strong> {JSON.stringify(error1)}
        </div>
        <div>
          <strong>Hook 2 - Loading:</strong> {isLoading2 ? 'Yes' : 'No'}, 
          <strong> Data:</strong> {JSON.stringify(data2)}, 
          <strong> Error:</strong> {JSON.stringify(error2)}
        </div>
        <div>
          <strong>Success Logs:</strong>
          <div className="logs">
            {successLogs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
        <div>
          <strong>Error Logs:</strong>
          <div className="logs">
            {errorLogs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalValidationExample; 