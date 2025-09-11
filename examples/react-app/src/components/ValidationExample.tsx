import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function fetchUserData(userId: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error('Invalid user ID'));
        return;
      }
      
      const users = [
        { id: 1, name: 'John Doe', role: 'admin', active: true },
        { id: 2, name: 'Jane Smith', role: 'user', active: false },
        { id: 3, name: 'Bob Wilson', role: 'user', active: true },
        { id: 4, name: 'Alice Brown', role: 'admin', active: true },
        { id: 5, name: 'Charlie Davis', role: 'user', active: false },
      ];
      
      const user = users.find(u => u.id === userId);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }, 800);
  });
}

const ValidationExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const { data, error, isLoading, call } = useMegamind(fetchUserData, {
    options: {
      callRightAway: false,
      debug: true,
    },
    events: {
      // Local validation - only allow active admin users to trigger onSuccess
      validateOnSuccess: (userData: any) => {
        const isValid = userData && userData.role === 'admin' && userData.active === true;
        addLog(`Local Success Validation: ${isValid ? 'PASSED' : 'FAILED'} for ${userData?.name || 'unknown'} (${userData?.role}, active: ${userData?.active})`);
        return isValid;
      },
      onSuccess: (userData: any) => {
        addLog(`SUCCESS CALLBACK: ${userData.name} is an active admin!`);
      },
      
      // Local validation - only allow specific error messages to trigger onError
      validateOnError: (error: any) => {
        const isImportantError = error.message.includes('not found') || error.message.includes('Invalid');
        addLog(`Local Error Validation: ${isImportantError ? 'PASSED' : 'FAILED'} for "${error.message}"`);
        return isImportantError;
      },
      onError: (error: any) => {
        addLog(`ERROR CALLBACK: ${error.message}`);
      },
      
      onLoadingStart: () => addLog('Loading started...'),
      onLoadingFinished: () => addLog('Loading finished.'),
    }
  });

  const testUsers = [
    { id: 1, description: 'John Doe (admin, active) - Should trigger success' },
    { id: 2, description: 'Jane Smith (user, inactive) - Success validation fails' },
    { id: 3, description: 'Bob Wilson (user, active) - Success validation fails' },
    { id: 4, description: 'Alice Brown (admin, active) - Should trigger success' },
    { id: 5, description: 'Charlie Davis (user, inactive) - Success validation fails' },
    { id: 999, description: 'Non-existent user - Should trigger error' },
    { id: -1, description: 'Invalid ID - Should trigger error' },
  ];

  const codeExample = `// Test comprehensive validation scenarios
function fetchUserData(userId: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error('Invalid user ID'));
        return;
      }
      
      const users = [
        { id: 1, name: 'John Doe', role: 'admin', active: true },
        { id: 2, name: 'Jane Smith', role: 'user', active: false },
        // ... more users
      ];
      
      const user = users.find(u => u.id === userId);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }, 800);
  });
}

const { data, error, call } = useMegamind(fetchUserData, {
  options: { callRightAway: false },
  events: {
    // Only allow active admin users to trigger success callback
    validateOnSuccess: (userData) => {
      return userData && userData.role === 'admin' && userData.active === true;
    },
    onSuccess: (userData) => {
      console.log('SUCCESS:', userData.name, 'is an active admin!');
    },
    
    // Only allow important errors to trigger error callback
    validateOnError: (error) => {
      return error.message.includes('not found') || error.message.includes('Invalid');
    },
    onError: (error) => {
      console.log('IMPORTANT ERROR:', error.message);
    }
  }
});

// Test different scenarios:
call(1);   // Admin + active = success callback fires
call(2);   // User + inactive = success callback blocked
call(999); // Not found = error callback fires`;

  return (
    <>
      <div className="example-section">
        <h2>✅ Advanced Validation Logic</h2>
        <p>Tests complex validation scenarios with local validateOnSuccess and validateOnError.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={() => setLogs([])}
            className="test-button"
          >
            Clear Logs
          </button>
        </div>

        <div className="test-grid">
          {testUsers.map((testUser) => (
            <button
              key={testUser.id}
              onClick={() => call(testUser.id)}
              disabled={isLoading}
              className="test-button user-test-button"
              title={testUser.description}
            >
              User {testUser.id}
            </button>
          ))}
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong> {data ? `${(data as any).name} (${(data as any).role}, active: ${(data as any).active})` : 'None'}
          </div>
          <div>
            <strong>Error:</strong> {error?.message || 'None'}
          </div>
        </div>

        <div className="user-legend">
          <h4>🎯 Test Legend:</h4>
          <div className="legend-grid">
            <div>✅ <strong>Success Callback Triggered:</strong> Active Admin users (ID 1, 4)</div>
            <div>❌ <strong>Success Callback Blocked:</strong> Non-admin or inactive users (ID 2, 3, 5)</div>
            <div>🚨 <strong>Error Callback Triggered:</strong> Invalid or not found (ID -1, 999)</div>
          </div>
        </div>

        <div className="logs-section">
          <h4>📋 Validation Logs:</h4>
          <div className="logs-container validation-logs">
            {logs.length === 0 ? (
              <p><em>No validation tests run yet. Try fetching different users!</em></p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry ${
                  log.includes('PASSED') ? 'validation-pass' : 
                  log.includes('FAILED') ? 'validation-fail' :
                  log.includes('SUCCESS CALLBACK') ? 'success-callback' :
                  log.includes('ERROR CALLBACK') ? 'error-callback' : ''
                }`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Advanced Validation Logic Tests"
        code={codeExample}
      />
    </>
  );
};

export default ValidationExample;