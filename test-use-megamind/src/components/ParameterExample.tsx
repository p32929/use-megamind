import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction2(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Waited ${ms} ms`), ms);
  });
}

const ParameterExample: React.FC = () => {
  const { data, error, isLoading } = useMegamind(testAsyncFunction2, {
    functionParams: [1500],
  });

  return (
    <div className="example-section">
      <h2>⚙️ Example 2: Function with Parameters</h2>
      <p>Tests async function with parameters (1500ms delay).</p>
      
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

export default ParameterExample; 