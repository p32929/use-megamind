import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction3(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Hello after ${ms} ms!`), ms);
  });
}

const ButtonClickExample: React.FC = () => {
  const { data, error, isLoading, call } = useMegamind(testAsyncFunction3, {
    options: {
      callRightAway: false,
    },
  });

  return (
    <div className="example-section">
      <h2>🔘 Example 3: Manual Function Call</h2>
      <p>Tests manual function calls with callRightAway: false.</p>
      
      <div className="controls">
        <button 
          onClick={() => call(500)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (500ms)
        </button>
        <button 
          onClick={() => call(1000)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (1000ms)
        </button>
        <button 
          onClick={() => call(2000)} 
          disabled={isLoading}
          className="test-button"
        >
          Call (2000ms)
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
      </div>
    </div>
  );
};

export default ButtonClickExample; 