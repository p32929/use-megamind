import React, { useState } from 'react';
import axios from 'axios';
import useMegamind from 'use-megamind';

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

  return (
    <div className="example-section">
      <h2>👥 API Example 2: Users CRUD</h2>
      <p>Tests real CRUD operations with <code>/api/users</code> endpoints.</p>
      
      <div className="controls">
        <h4>Filter Users:</h4>
        <button 
          onClick={() => handleRoleFilter('')}
          className="test-button"
          disabled={usersLoading}
        >
          All Users
        </button>
        <button 
          onClick={() => handleRoleFilter('admin')}
          className="test-button"
          disabled={usersLoading}
        >
          Admins Only
        </button>
        <button 
          onClick={() => handleRoleFilter('user')}
          className="test-button"
          disabled={usersLoading}
        >
          Users Only
        </button>
      </div>

      <div className="controls">
        <h4>Create New User:</h4>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
          style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
          style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
          style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
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
          <strong>Errors:</strong> {JSON.stringify({ usersError, createError })}
        </div>
      </div>
    </div>
  );
};

export default ApiUsersExample; 