import React, { useState } from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction6(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms < 500) {
        reject("Error: Too fast!");
      } else {
        resolve(`Success after ${ms} ms`);
      }
    }, ms);
  });
}

const CallbacksExample: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const { data, error, isLoading, call } = useMegamind(testAsyncFunction6, {
    options: {
      callRightAway: false,
    },
    events: {
      onLoadingStart: () => addLog("Loading started"),
      onLoadingFinished: () => addLog("Loading finished"),
      validateOnSuccess: (data) => {
        addLog(`Validating success: ${data}`);
        return typeof data === 'string' && data.includes("Success");
      },
      onSuccess: (data) => addLog(`Success callback: ${data}`),
      validateOnError: (error) => {
        addLog(`Validating error: ${error}`);
        return typeof error === 'string' && error.includes("Error");
      },
      onError: (error) => addLog(`Error callback: ${error}`),
      onLoadingChange: (isLoading) => addLog(`Loading changed: ${isLoading}`),
    },
  });

  return (
    <div className="example-section">
      <h2>🔔 Example 6: Event Callbacks & Validation</h2>
      <p>Tests event callbacks and validation functions.</p>
      
      <div className="controls">
        <button 
          onClick={() => call(300)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (300ms) - Should Error
        </button>
        <button 
          onClick={() => call(600)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (600ms) - Should Success
        </button>
        <button 
          onClick={() => setLogs([])} 
          className="test-button"
        >
          Clear Logs
        </button>
      </div>
      
      <div className="result-box">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Data:</strong> {JSON.stringify(data)}
        </div>
        <div>
          <strong>Error:</strong> {JSON.stringify(error)}
        </div>
        <div>
          <strong>Event Logs:</strong>
          <div className="logs">
            {logs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallbacksExample; 