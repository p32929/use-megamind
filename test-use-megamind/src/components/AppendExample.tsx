import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction5(page: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [`Item ${page}-1`, `Item ${page}-2`, `Item ${page}-3`],
        page: page,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 800);
  });
}

const AppendExample: React.FC = () => {
  const { data, error, isLoading, call, callToAppend } = useMegamind(testAsyncFunction5, {
    options: {
      callRightAway: false,
    },
  });

  return (
    <div className="example-section">
      <h2>📋 Example 5: Append Data</h2>
      <p>Tests callToAppend functionality to append new data to existing state.</p>
      
      <div className="controls">
        <button 
          onClick={() => call(1)} 
          disabled={isLoading}
          className="test-button"
        >
          Load Page 1 (Replace)
        </button>
        <button 
          onClick={() => callToAppend(2)} 
          disabled={isLoading}
          className="test-button"
        >
          Load Page 2 (Append)
        </button>
        <button 
          onClick={() => callToAppend(3)} 
          disabled={isLoading}
          className="test-button"
        >
          Load Page 3 (Append)
        </button>
      </div>
      
      <div className="result-box">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Data:</strong> {JSON.stringify(data, null, 2)}
        </div>
        <div>
          <strong>Error:</strong> {JSON.stringify(error)}
        </div>
      </div>
    </div>
  );
};

export default AppendExample; 