import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

const API_BASE = 'http://localhost:15001';

// API functions for different error scenarios
const triggerRandomError = async () => {
  const response = await axios.get(`${API_BASE}/api/random-error`);
  return response.data;
};

const triggerTimeout = async (seconds: number) => {
  const response = await axios.get(`${API_BASE}/api/delayed/${seconds * 1000}`, {
    timeout: 2000 // 2 second timeout
  });
  return response.data;
};

const triggerNotFoundError = async () => {
  const response = await axios.get(`${API_BASE}/api/nonexistent-endpoint`);
  return response.data;
};

const ApiErrorExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(3);

  // Hook for testing random errors
  const { 
    data: randomErrorData, 
    error: randomError, 
    isLoading: randomErrorLoading, 
    call: triggerRandomErrorCall 
  } = useMegamind(triggerRandomError, {
    options: { 
      callRightAway: false
    },
    events: {
      onError: (error: any) => {
        console.log('Random error caught by hook:', error);
      }
    }
  });

  // Hook for testing timeout scenarios
  const { 
    data: timeoutData, 
    error: timeoutError, 
    isLoading: timeoutLoading, 
    call: triggerTimeoutCall 
  } = useMegamind(triggerTimeout, {
    options: { 
      callRightAway: false
    },
    events: {
      onError: (error: any) => {
        console.log('Timeout error caught:', error);
      }
    }
  });

  // Hook for testing not found errors
  const { 
    data: notFoundData, 
    error: notFoundError, 
    isLoading: notFoundLoading, 
    call: triggerNotFoundCall 
  } = useMegamind(triggerNotFoundError, {
    options: { 
      callRightAway: false
    },
    events: {
      onError: (error: any) => {
        console.log('404 error caught:', error);
      }
    }
  });

  const codeExample = `// 1. Define API functions for different error scenarios
const triggerRandomError = async () => {
  const response = await axios.get('/api/random-error');
  return response.data;
};

const triggerTimeout = async (seconds: number) => {
  const response = await axios.get(\`/api/delayed/\${seconds * 1000}\`, {
    timeout: 2000 // 2 second timeout
  });
  return response.data;
};

const triggerNotFoundError = async () => {
  const response = await axios.get('/api/nonexistent-endpoint');
  return response.data;
};

// 2. Use hooks with error handling
const { data, error, isLoading, call } = useMegamind(triggerRandomError, {
  options: { callRightAway: false },
  events: {
    onError: (error) => {
      console.log('Error caught by hook:', error);
      // Handle different error types
      if (error.response?.status === 404) {
        console.log('Resource not found');
      } else if (error.response?.status === 500) {
        console.log('Server error');
      }
    }
  }
});

// 3. Test different error scenarios
<button onClick={() => call()}>Test Random Error</button>
<button onClick={() => timeoutCall(5)}>Test Timeout</button>
<button onClick={() => notFoundCall()}>Test 404 Error</button>`;

  return (
    <>
      <div className="example-section">
        <h2>❌ Error Handling</h2>
        <p>Tests various API error scenarios: 404, 500, timeouts, and network errors.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
        </div>

        <div className="example-controls">
          <h4>🎲 Random Error Test:</h4>
          <button 
            onClick={() => triggerRandomErrorCall()}
            disabled={randomErrorLoading}
            className="test-button"
          >
            {randomErrorLoading ? 'Testing...' : 'Test Random Error'}
          </button>
        </div>

        <div className="example-controls">
          <h4>⏱️ Timeout Test:</h4>
          <input
            type="number"
            value={timeoutSeconds}
            onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
            min="1"
            max="10"
            placeholder="Seconds"
          />
          <button 
            onClick={() => triggerTimeoutCall(timeoutSeconds)}
            disabled={timeoutLoading}
            className="test-button"
          >
            {timeoutLoading ? 'Testing...' : `Test ${timeoutSeconds}s Timeout`}
          </button>
          <span className="hint">(Timeout set to 2s)</span>
        </div>

        <div className="example-controls">
          <h4>🚫 404 Error Test:</h4>
          <button 
            onClick={() => triggerNotFoundCall()}
            disabled={notFoundLoading}
            className="test-button"
          >
            {notFoundLoading ? 'Testing...' : 'Test 404 Error'}
          </button>
        </div>
        
        <div className="result-box">
          <div>
            <strong>Random Error - Loading:</strong> {randomErrorLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Random Error - Data:</strong> {JSON.stringify(randomErrorData, null, 2)}
          </div>
          <div>
            <strong>Random Error - Error:</strong> {randomError ? JSON.stringify({
              status: randomError.response?.status,
              message: randomError.response?.data?.message || randomError.message,
              type: randomError.code
            }, null, 2) : 'null'}
          </div>
          
          <hr />
          
          <div>
            <strong>Timeout - Loading:</strong> {timeoutLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Timeout - Data:</strong> {JSON.stringify(timeoutData, null, 2)}
          </div>
          <div>
            <strong>Timeout - Error:</strong> {timeoutError ? JSON.stringify({
              code: timeoutError.code,
              message: timeoutError.message,
              timeout: timeoutError.code === 'ECONNABORTED'
            }, null, 2) : 'null'}
          </div>
          
          <hr />
          
          <div>
            <strong>404 Error - Loading:</strong> {notFoundLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>404 Error - Data:</strong> {JSON.stringify(notFoundData, null, 2)}
          </div>
          <div>
            <strong>404 Error - Error:</strong> {notFoundError ? JSON.stringify({
              status: notFoundError.response?.status,
              message: notFoundError.response?.data?.message || notFoundError.message
            }, null, 2) : 'null'}
          </div>
        </div>
        
        <div className="api-info">
          <p><strong>📋 Requirements:</strong></p>
          <ul>
            <li>Start the test server: <code>node server.js</code></li>
            <li>Server should be running on http://localhost:15001</li>
            <li>Endpoints: GET /api/random-error, GET /api/delayed/:ms, GET /api/nonexistent-endpoint</li>
            <li>Check browser console for error handling logs</li>
          </ul>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Error Handling Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ApiErrorExample;