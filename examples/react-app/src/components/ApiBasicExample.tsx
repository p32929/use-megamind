import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

const API_BASE = 'http://localhost:3001';

// API function that fetches hello message
const fetchHello = async () => {
  const response = await axios.get(`${API_BASE}/api/hello`);
  return response.data;
};

const fetchData = async () => {
  const response = await axios.get(`${API_BASE}/api/data`);
  return response.data;
};

const ApiBasicExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { data, error, isLoading, call } = useMegamind(fetchData, {
    options: {
      callRightAway: false,
    },
  });

  const codeExample = `// 1. Define your API function
const fetchData = async () => {
  const response = await axios.get('/api/data');
  return response.data;
};

// 2. Use hook with manual calls for API
const { data, error, isLoading, call } = useMegamind(fetchData, {
  options: {
    callRightAway: false, // Don't auto-call on mount
  },
});

// 3. Call manually when needed
<button onClick={() => call()}>Fetch Data`;

  return (
    <>
      <div className="example-section">
        <h2>🌐 Basic API Call</h2>
        <p>Tests basic HTTP GET request to /api/data endpoint.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => call()} 
            disabled={isLoading}
            className="test-button"
          >
            Fetch Data
          </button>
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong> {JSON.stringify(data, null, 2)}
          </div>
          <div>
            <strong>Error:</strong> {error ? JSON.stringify(error.response?.data || error.message) : 'null'}
          </div>
        </div>
        
        <div className="api-info">
          <p><strong>📋 Requirements:</strong></p>
          <ul>
            <li>Start the test server: <code>node server.js</code></li>
            <li>Server should be running on http://localhost:3001</li>
            <li>Endpoint: GET /api/data</li>
          </ul>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Basic API Call Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ApiBasicExample; 