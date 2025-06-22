import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction7(message: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${message} - ${new Date().toLocaleTimeString()}`);
    }, 1000);
  });
}

const ClearResetExample: React.FC = () => {
  const { data, error, isLoading, call, clear, reset } = useMegamind(testAsyncFunction7, {
    options: {
      callRightAway: false,
      cache: true,
      maxCalls: 3,
    },
  });

  return (
    <div className="example-section">
      <h2>🔄 Example 7: Clear & Reset</h2>
      <p>Tests clear (keeps cache) and reset (clears everything including cache and call counter).</p>
      
      <div className="controls">
        <button 
          onClick={() => call("Test message")} 
          disabled={isLoading}
          className="test-button"
        >
          Call Function
        </button>
        <button 
          onClick={clear} 
          disabled={isLoading}
          className="test-button"
        >
          Clear (Keeps Cache)
        </button>
        <button 
          onClick={reset} 
          disabled={isLoading}
          className="test-button"
        >
          Reset (Clears Everything)
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
        <p><em>Try calling the function multiple times, then clear/reset to see the difference.</em></p>
      </div>
    </div>
  );
};

export default ClearResetExample; 