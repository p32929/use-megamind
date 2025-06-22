import React from 'react';
import useMegamind from 'use-megamind';

function testAsyncFunction1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello world from basic example!");
    }, 1000);
  });
}

const BasicExample: React.FC = () => {
  const { data, error, isLoading } = useMegamind(testAsyncFunction1);

  return (
    <div className="example-section">
      <h2>📝 Example 1: Basic Async Function</h2>
      <p>Tests async function without parameters, called automatically on mount.</p>
      
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
    </div>
  );
};

export default BasicExample; 