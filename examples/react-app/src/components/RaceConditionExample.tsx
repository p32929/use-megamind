import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function slowAsyncFunction(delay: number, id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Completed task ${id} after ${delay}ms`);
    }, delay);
  });
}

const RaceConditionExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [raceResults, setRaceResults] = useState<string[]>([]);

  const { data, isLoading, call } = useMegamind(slowAsyncFunction, {
    options: {
      callRightAway: false,
      debug: true,
    },
    events: {
      onSuccess: (result: any) => {
        setRaceResults(prev => [...prev, `SUCCESS: ${result}`]);
      },
      onError: (error: any) => {
        setRaceResults(prev => [...prev, `ERROR: ${error.message}`]);
      }
    }
  });

  const triggerRaceCondition = () => {
    setRaceResults([]);
    // Fire multiple calls rapidly to test race condition handling
    call(3000, 'A (slow)');
    call(1000, 'B (fast)');
    call(2000, 'C (medium)');
    call(500, 'D (fastest)');
    call(1500, 'E (medium-fast)');
  };

  const triggerConcurrentSameParams = () => {
    setRaceResults([]);
    // Fire multiple identical calls to test deduplication
    call(1000, 'SAME');
    call(1000, 'SAME');
    call(1000, 'SAME');
    call(1000, 'SAME');
  };

  const codeExample = `// Test race conditions and concurrent calls
function slowAsyncFunction(delay: number, id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(\`Completed task \${id} after \${delay}ms\`);
    }, delay);
  });
}

const { data, isLoading, call } = useMegamind(slowAsyncFunction, {
  options: {
    callRightAway: false,
    debug: true, // Check console for race condition logs
  },
  events: {
    onSuccess: (result) => console.log('SUCCESS:', result),
    onError: (error) => console.log('ERROR:', error)
  }
});

// Test 1: Fire multiple calls with different delays
// Should handle race conditions and prevent concurrent duplicate calls
const triggerRaceCondition = () => {
  call(3000, 'A (slow)');    // This might finish last
  call(1000, 'B (fast)');    // This might finish first
  call(2000, 'C (medium)');
  call(500, 'D (fastest)');  // This will likely finish first
};

// Test 2: Fire identical calls
// Should deduplicate and only run once
const triggerConcurrentSameParams = () => {
  call(1000, 'SAME');  // Only this should run
  call(1000, 'SAME');  // These should be ignored
  call(1000, 'SAME');
};`;

  return (
    <>
      <div className="example-section">
        <h2>⚡ Race Conditions & Concurrency</h2>
        <p>Tests concurrent calls, race conditions, and duplicate call handling.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={triggerRaceCondition} 
            disabled={isLoading}
            className="test-button"
          >
            🏃 Trigger Race (5 calls)
          </button>
          <button 
            onClick={triggerConcurrentSameParams} 
            disabled={isLoading}
            className="test-button"
          >
            🔄 Duplicate Calls (4x same)
          </button>
          <button 
            onClick={() => setRaceResults([])}
            className="test-button"
          >
            Clear Results
          </button>
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Latest Data:</strong> {JSON.stringify(data)}
          </div>
        </div>

        <div className="logs-section">
          <h4>📋 Race Condition Results:</h4>
          <p><em>Check browser console for detailed race condition logs!</em></p>
          <div className="logs-container">
            {raceResults.length === 0 ? (
              <p><em>No results yet. Trigger a race condition test!</em></p>
            ) : (
              raceResults.map((result, index) => (
                <div key={index} className="log-entry">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Race Conditions & Concurrency Test"
        code={codeExample}
      />
    </>
  );
};

export default RaceConditionExample;