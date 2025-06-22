import React from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';

const API_BASE = 'http://localhost:3001';

// API function that fetches hello message
const fetchHello = async () => {
  const response = await axios.get(`${API_BASE}/api/hello`);
  return response.data;
};

const ApiBasicExample: React.FC = () => {
  const { data, error, isLoading } = useMegamind(fetchHello);

  return (
    <div className="example-section">
      <h2>🌐 API Example 1: Basic API Call</h2>
      <p>Tests real HTTP request to <code>/api/hello</code> endpoint with 500ms server delay.</p>
      
      <div className="result-box">
        <div className={isLoading ? 'loading-indicator' : ''}>
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

export default ApiBasicExample; 