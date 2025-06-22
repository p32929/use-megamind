import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

const API_BASE = 'http://localhost:3001';

// API functions for different error scenarios
const triggerError = async (errorType: string) => {
  const response = await axios.get(`${API_BASE}/api/error/${errorType}`);
  return response.data;
};

const triggerTimeout = async (seconds: number) => {
  const response = await axios.get(`${API_BASE}/api/timeout/${seconds}`, {
    timeout: 2000 // 2 second timeout
  });
  return response.data;
};

const triggerServerError = async () => {
  const response = await axios.get(`${API_BASE}/api/server-error`);
  return response.data;
};

const ApiErrorExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [errorType, setErrorType] = useState<string>('404');
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(3);

  // Hook for testing different error types
  const { 
    data: errorData, 
    error: errorError, 
    isLoading: errorLoading, 
    call: triggerErrorCall 
  } = useMegamind(triggerError, {
    options: { 
      callRightAway: false
    },
    events: {
      onError: (error) => {
        console.log('Error caught by hook:', error);
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
      onError: (error) => {
        console.log('Timeout error caught:', error);
      }
    }
  });

  // Hook for testing server errors
  const { 
    data: serverData, 
    error: serverError, 
    isLoading: serverLoading, 
    call: triggerServerCall 
  } = useMegamind(triggerServerError, {
    options: { 
      callRightAway: false
    },
    events: {
      onError: (error) => {
        console.log('Server error caught:', error);
      }
    }
  });

  const codeExample = `// 1. Define API functions for different error scenarios
const triggerError = async (errorType: string) => {
  const response = await axios.get(\`/api/error/\${errorType}\`);
  return response.data;
};

const triggerTimeout = async (seconds: number) => {
  const response = await axios.get(\`/api/timeout/\${seconds}\`, {
    timeout: 2000 // 2 second timeout
  });
  return response.data;
};

const triggerServerError = async () => {
  const response = await axios.get('/api/server-error');
  return response.data;
};

// 2. Use hooks with error handling
const { data, error, isLoading, call } = useMegamind(triggerError, {
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
<button onClick={() => call('404')}>Test 404 Error</button>
<button onClick={() => call('500')}>Test 500 Error</button>
<button onClick={() => timeoutCall(5)}>Test Timeout</button>`;

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
          <h4>🔍 HTTP Error Types:</h4>
          <select 
            value={errorType} 
            onChange={(e) => setErrorType(e.target.value)}
          >
            <option value="404">404 - Not Found</option>
            <option value="500">500 - Server Error</option>
            <option value="401">401 - Unauthorized</option>
            <option value="403">403 - Forbidden</option>
          </select>
          <button 
            onClick={() => triggerErrorCall(errorType)}
            disabled={errorLoading}
            className="test-button"
          >
            {errorLoading ? 'Testing...' : `Test ${errorType} Error`}
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
          <h4>🔥 Server Error Test:</h4>
          <button 
            onClick={() => triggerServerCall()}
            disabled={serverLoading}
            className="test-button"
          >
            {serverLoading ? 'Testing...' : 'Test Server Error'}
          </button>
        </div>
        
        <div className="result-box">
          <div>
            <strong>HTTP Error - Loading:</strong> {errorLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>HTTP Error - Data:</strong> {JSON.stringify(errorData, null, 2)}
          </div>
          <div>
            <strong>HTTP Error - Error:</strong> {errorError ? JSON.stringify({
              status: errorError.response?.status,
              message: errorError.response?.data?.message || errorError.message,
              type: errorError.code
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
            <strong>Server Error - Loading:</strong> {serverLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Server Error - Data:</strong> {JSON.stringify(serverData, null, 2)}
          </div>
          <div>
            <strong>Server Error - Error:</strong> {serverError ? JSON.stringify({
              status: serverError.response?.status,
              message: serverError.response?.data?.message || serverError.message
            }, null, 2) : 'null'}
          </div>
        </div>
        
        <div className="api-info">
          <p><strong>📋 Requirements:</strong></p>
          <ul>
            <li>Start the test server: <code>node server.js</code></li>
            <li>Server should be running on http://localhost:3001</li>
            <li>Endpoints: GET /api/error/:type, GET /api/timeout/:seconds, GET /api/server-error</li>
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