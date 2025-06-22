import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

const API_BASE = 'http://localhost:3001';

// API functions
const fetchUsers = async (role?: string) => {
  const params = role ? { role } : {};
  const response = await axios.get(`${API_BASE}/api/users`, { params });
  return response.data;
};

const createUser = async (userData: { name: string; email: string; role: string }) => {
  const response = await axios.post(`${API_BASE}/api/users`, userData);
  return response.data;
};

const ApiUsersExample: React.FC = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Hook for fetching users
  const { 
    data: usersData, 
    error: usersError, 
    isLoading: usersLoading, 
    call: refetchUsers 
  } = useMegamind(fetchUsers, {
    functionParams: [selectedRole || undefined],
    options: { callRightAway: true }
  });

  // Hook for creating users
  const { 
    data: createData, 
    error: createError, 
    isLoading: createLoading, 
    call: callCreateUser 
  } = useMegamind(createUser, {
    options: { callRightAway: false },
    events: {
      onSuccess: () => {
        setNewUser({ name: '', email: '', role: 'user' });
        refetchUsers(selectedRole || undefined);
      }
    }
  });

  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      callCreateUser(newUser);
    }
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    refetchUsers(role || undefined);
  };

  const codeExample = `// 1. Define your API functions
const fetchUsers = async (role?: string) => {
  const params = role ? { role } : {};
  const response = await axios.get('/api/users', { params });
  return response.data;
};

const createUser = async (userData: { name: string; email: string; role: string }) => {
  const response = await axios.post('/api/users', userData);
  return response.data;
};

// 2. Use multiple hooks for different operations
// Hook for fetching (auto-calls on mount)
const { 
  data: usersData, 
  error: usersError, 
  isLoading: usersLoading, 
  call: refetchUsers 
} = useMegamind(fetchUsers, {
  functionParams: [selectedRole || undefined],
  options: { callRightAway: true }
});

// Hook for creating (manual calls only)
const { 
  data: createData, 
  error: createError, 
  isLoading: createLoading, 
  call: callCreateUser 
} = useMegamind(createUser, {
  options: { callRightAway: false },
  events: {
    onSuccess: () => {
      // Clear form and refresh list
      setNewUser({ name: '', email: '', role: 'user' });
      refetchUsers(selectedRole || undefined);
    }
  }
});

// 3. Use in your components
<button onClick={() => refetchUsers('admin')}>Get Admins</button>
<button onClick={() => callCreateUser(userData)}>Create User</button>`;

  return (
    <>
      <div className="example-section">
        <h2>👥 CRUD Operations</h2>
        <p>Tests multiple hooks for users CRUD operations with real API calls.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
        </div>

        <div className="example-controls">
          <h4>🔍 Filter Users:</h4>
          <button 
            onClick={() => handleRoleFilter('')}
            disabled={usersLoading}
            className="test-button"
          >
            All Users
          </button>
          <button 
            onClick={() => handleRoleFilter('admin')}
            disabled={usersLoading}
            className="test-button"
          >
            Admins Only
          </button>
          <button 
            onClick={() => handleRoleFilter('user')}
            disabled={usersLoading}
            className="test-button"
          >
            Users Only
          </button>
        </div>

        <div className="example-controls">
          <h4>➕ Create New User:</h4>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              onClick={handleCreateUser}
              disabled={createLoading || !newUser.name || !newUser.email}
              className="test-button"
            >
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
        
        <div className="result-box">
          <div className={usersLoading ? 'loading-indicator' : ''}>
            <strong>Users Loading:</strong> {usersLoading ? 'Yes' : 'No'}
          </div>
          <div className={createLoading ? 'loading-indicator' : ''}>
            <strong>Create Loading:</strong> {createLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Users Data:</strong> {JSON.stringify(usersData, null, 2)}
          </div>
          <div>
            <strong>Create Response:</strong> {JSON.stringify(createData, null, 2)}
          </div>
          <div>
            <strong>Users Error:</strong> {usersError ? JSON.stringify(usersError.response?.data || usersError.message) : 'null'}
          </div>
          <div>
            <strong>Create Error:</strong> {createError ? JSON.stringify(createError.response?.data || createError.message) : 'null'}
          </div>
        </div>
        
        <div className="api-info">
          <p><strong>📋 Requirements:</strong></p>
          <ul>
            <li>Start the test server: <code>node server.js</code></li>
            <li>Server should be running on http://localhost:3001</li>
            <li>Endpoints: GET /api/users, POST /api/users</li>
          </ul>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="CRUD Operations Implementation"
        code={codeExample}
      />
    </>
  );
};

export default ApiUsersExample; 