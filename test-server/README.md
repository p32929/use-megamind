# 🚀 Use-Megamind Test Server

A comprehensive Node.js Express server designed to test the **use-megamind** React hook with real HTTP requests. This server provides various API endpoints that simulate common scenarios like data fetching, error handling, pagination, and more.

## 🎯 Purpose

This server is specifically built to test all features of the `use-megamind` hook:
- ✅ Basic API calls
- ✅ Error handling
- ✅ Loading states
- ✅ Caching
- ✅ Pagination
- ✅ Validation
- ✅ Long-running tasks

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Server will be running at:**
   ```
   http://localhost:3001
   ```

## 📋 API Endpoints

### **Root Endpoint**
- **GET** `/` - Server info and endpoint list

### **Basic Endpoints**
- **GET** `/api/hello` - Simple hello message (500ms delay)
- **GET** `/api/delayed/:ms` - Configurable delay response (max 10s)

### **Users CRUD**
- **GET** `/api/users` - Get all users with optional filtering
  - Query params: `role`, `limit`
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### **Posts with Pagination**
- **GET** `/api/posts` - Get paginated posts
  - Query params: `page`, `limit`, `userId`
- **GET** `/api/posts/:id` - Get post by ID
- **POST** `/api/posts` - Create new post

### **Testing Endpoints**
- **GET** `/api/random-error` - Random error responses (30% error rate)
- **POST** `/api/validate` - Data validation endpoint
- **GET** `/api/cache-test/:id` - Cache testing endpoint
- **POST** `/api/long-task` - Long-running task simulation

## 🔧 API Examples

### Basic Hello Request
```javascript
// GET /api/hello
{
  "message": "Hello from the test server!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "server": "use-megamind-test-server"
}
```

### Users List
```javascript
// GET /api/users?role=admin&limit=2
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ],
  "total": 1,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Paginated Posts
```javascript
// GET /api/posts?page=1&limit=2
{
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "content": "This is the first post",
      "userId": 1
    },
    {
      "id": 2,
      "title": "Second Post",
      "content": "This is the second post",
      "userId": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 5,
    "totalPages": 3,
    "hasMore": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Create User
```javascript
// POST /api/users
// Body: { "name": "Alice", "email": "alice@example.com", "role": "user" }
{
  "user": {
    "id": 4,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user"
  },
  "message": "User created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```javascript
// GET /api/users/999 (non-existent user)
{
  "error": "User not found"
}
```

## 📊 Response Times

All endpoints include realistic delays to simulate real-world scenarios:

| Endpoint | Delay |
|----------|-------|
| `/api/hello` | 500ms |
| `/api/users` | 300ms |
| `/api/users/:id` | 200ms |
| `/api/posts` | 400ms |
| `/api/random-error` | 300ms |
| `/api/cache-test/:id` | 800ms |

## 🎯 Testing Scenarios

### 1. **Basic Data Fetching**
```javascript
const fetchHello = () => fetch('http://localhost:3001/api/hello').then(r => r.json());
const { data, isLoading, error } = useMegamind(fetchHello);
```

### 2. **Error Handling**
```javascript
const fetchRandomError = () => fetch('http://localhost:3001/api/random-error').then(r => {
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
});
const { data, error } = useMegamind(fetchRandomError);
```

### 3. **Pagination**
```javascript
const fetchPosts = (page) => 
  fetch(`http://localhost:3001/api/posts?page=${page}&limit=3`).then(r => r.json());
const { data, callToAppend } = useMegamind(fetchPosts, { 
  options: { callRightAway: false } 
});
```

### 4. **CRUD Operations**
```javascript
const createUser = (userData) => 
  fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(r => r.json());

const { call } = useMegamind(createUser, { 
  options: { callRightAway: false } 
});
```

## 🛠️ Development

### Adding New Endpoints

1. Add your endpoint in `server.js`
2. Include appropriate delays with `await delay(ms)`
3. Return consistent JSON responses with timestamps
4. Update this README with the new endpoint

### Data Storage

The server uses in-memory storage for simplicity:
- `users` array - User data
- `posts` array - Post data

Data persists only during server runtime and resets on restart.

## 🌐 CORS Configuration

The server is configured with CORS to allow requests from your React development server (`http://localhost:3000`).

## 🔍 Debugging

- All responses include timestamps
- Server logs requests to console
- Error responses include detailed error information
- Use browser DevTools Network tab to inspect requests/responses

## 📝 Notes

- Maximum delay endpoint: 10 seconds
- Random error endpoint: ~30% error rate
- All endpoints return JSON responses
- Server runs on port 3001 by default
- Uses Express.js with minimal middleware

---

**Ready to test your use-megamind hook with real APIs!** 🧠 