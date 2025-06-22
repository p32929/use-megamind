import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction4(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Called at ${new Date().toLocaleTimeString()} after ${ms}ms`), ms);
  });
}

const OptionsExample: React.FC = () => {
  const { data, error, isLoading, call } = useMegamind(testAsyncFunction4, {
    options: {
      callRightAway: false,
      debug: true,
      maxCalls: 3,
      minimumDelayBetweenCalls: 1000,
      cache: true,
    },
  });

  return (
    <div className="example-section">
      <h2>⚡ Example 4: Options Testing</h2>
      <p>Tests maxCalls: 3, minimumDelayBetweenCalls: 1000ms, debug: true, cache: true</p>
      
      <div className="controls">
        <button 
          onClick={() => call(500)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (500ms) - Check Console for Debug
        </button>
        <button 
          onClick={() => call(500)} 
          disabled={isLoading}
          className="test-button"
        >
          Call Same Params (Should Use Cache)
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
        <p><em>Note: After 3 calls, further calls will be blocked. Check browser console for debug logs.</em></p>
      </div>
    </div>
  );
};

export default OptionsExample; 