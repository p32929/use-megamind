import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';

const API_BASE = 'http://localhost:3001';

// API functions that can trigger errors
const triggerError = async (errorType: string) => {
  const response = await axios.get(`${API_BASE}/api/error/${errorType}`);
  return response.data;
};

const triggerTimeout = async (seconds: number) => {
  const response = await axios.get(`${API_BASE}/api/timeout/${seconds}`);
  return response.data;
};

const triggerServerError = async () => {
  const response = await axios.get(`${API_BASE}/api/server-error`);
  return response.data;
};

const ApiErrorExample: React.FC = () => {
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

  return (
    <div className="example-section">
      <h2>⚠️ API Example 3: Error Handling</h2>
      <p>Tests error handling scenarios with various API endpoints.</p>
      
      <div className="controls">
        <h4>Test Error Types:</h4>
        <select
          value={errorType}
          onChange={(e) => setErrorType(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="404">404 Not Found</option>
          <option value="400">400 Bad Request</option>
          <option value="401">401 Unauthorized</option>
          <option value="403">403 Forbidden</option>
        </select>
        <button 
          onClick={() => triggerErrorCall(errorType)}
          disabled={errorLoading}
          className="test-button"
        >
          {errorLoading ? 'Loading...' : 'Trigger Error'}
        </button>
      </div>

      <div className="controls">
        <h4>Test Timeout:</h4>
        <input
          type="number"
          value={timeoutSeconds}
          onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
          min="1"
          max="10"
          style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
        />
        <span style={{ marginRight: '0.5rem' }}>seconds</span>
        <button 
          onClick={() => triggerTimeoutCall(timeoutSeconds)}
          disabled={timeoutLoading}
          className="test-button"
        >
          {timeoutLoading ? 'Loading...' : 'Test Timeout'}
        </button>
      </div>

      <div className="controls">
        <h4>Test Server Error:</h4>
        <button 
          onClick={() => triggerServerCall()}
          disabled={serverLoading}
          className="test-button"
        >
          {serverLoading ? 'Loading...' : 'Trigger Server Error'}
        </button>
      </div>
      
      <div className="result-box">
        <div>
          <strong>Error Test:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <div className={errorLoading ? 'loading-indicator' : ''}>Loading: {errorLoading ? 'Yes' : 'No'}</div>
            <div>Data: {JSON.stringify(errorData)}</div>
            <div>Error: {errorError ? JSON.stringify({
              message: errorError.message,
              status: errorError.response?.status,
              statusText: errorError.response?.statusText
            }) : 'None'}</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Timeout Test:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <div className={timeoutLoading ? 'loading-indicator' : ''}>Loading: {timeoutLoading ? 'Yes' : 'No'}</div>
            <div>Data: {JSON.stringify(timeoutData)}</div>
            <div>Error: {timeoutError ? JSON.stringify({
              message: timeoutError.message,
              code: timeoutError.code
            }) : 'None'}</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Server Error Test:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <div className={serverLoading ? 'loading-indicator' : ''}>Loading: {serverLoading ? 'Yes' : 'No'}</div>
            <div>Data: {JSON.stringify(serverData)}</div>
            <div>Error: {serverError ? JSON.stringify({
              message: serverError.message,
              status: serverError.response?.status
            }) : 'None'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiErrorExample; 