const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage for testing
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
];

let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 },
  { id: 3, title: 'Third Post', content: 'This is the third post', userId: 1 },
  { id: 4, title: 'Fourth Post', content: 'This is the fourth post', userId: 3 },
  { id: 5, title: 'Fifth Post', content: 'This is the fifth post', userId: 2 },
];

// Utility function to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🧠 Use-Megamind Test Server',
    version: '1.0.0',
    endpoints: {
      'GET /api/hello': 'Simple hello endpoint',
      'GET /api/delayed/:ms': 'Delayed response endpoint',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user',
      'GET /api/posts': 'Get paginated posts',
      'GET /api/posts/:id': 'Get post by ID',
      'POST /api/posts': 'Create new post',
      'GET /api/random-error': 'Random error endpoint',
      'POST /api/validate': 'Validation endpoint',
      'GET /api/cache-test/:id': 'Cache testing endpoint',
    }
  });
});

// 1. Simple hello endpoint
app.get('/api/hello', async (req, res) => {
  await delay(500);
  res.json({
    message: 'Hello from the test server!',
    timestamp: new Date().toISOString(),
    server: 'use-megamind-test-server'
  });
});

// 2. Delayed response endpoint
app.get('/api/delayed/:ms', async (req, res) => {
  const delayMs = parseInt(req.params.ms) || 1000;
  const maxDelay = 10000; // 10 seconds max
  
  if (delayMs > maxDelay) {
    return res.status(400).json({ error: `Delay cannot exceed ${maxDelay}ms` });
  }
  
  await delay(delayMs);
  res.json({
    message: `Response after ${delayMs}ms delay`,
    timestamp: new Date().toISOString(),
    requestedDelay: delayMs
  });
});

// 3. Users endpoints
app.get('/api/users', async (req, res) => {
  await delay(300);
  const { role, limit } = req.query;
  
  let filteredUsers = users;
  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }
  
  if (limit) {
    filteredUsers = filteredUsers.slice(0, parseInt(limit));
  }
  
  res.json({
    users: filteredUsers,
    total: filteredUsers.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users/:id', async (req, res) => {
  await delay(200);
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    user,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/users', async (req, res) => {
  await delay(400);
  const { name, email, role = 'user' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: Math.max(...users.map(u => u.id)) + 1,
    name,
    email,
    role
  };
  
  users.push(newUser);
  
  res.status(201).json({
    user: newUser,
    message: 'User created successfully',
    timestamp: new Date().toISOString()
  });
});

app.put('/api/users/:id', async (req, res) => {
  await delay(350);
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email, role } = req.body;
  users[userIndex] = { ...users[userIndex], name, email, role };
  
  res.json({
    user: users[userIndex],
    message: 'User updated successfully',
    timestamp: new Date().toISOString()
  });
});

app.delete('/api/users/:id', async (req, res) => {
  await delay(250);
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    user: deletedUser,
    message: 'User deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// 4. Posts endpoints (with pagination)
app.get('/api/posts', async (req, res) => {
  await delay(400);
  const { page = 1, limit = 3, userId } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  let filteredPosts = posts;
  if (userId) {
    filteredPosts = posts.filter(post => post.userId === parseInt(userId));
  }
  
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    posts: paginatedPosts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limitNum),
      hasMore: endIndex < filteredPosts.length
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/posts/:id', async (req, res) => {
  await delay(200);
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json({
    post,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/posts', async (req, res) => {
  await delay(500);
  const { title, content, userId } = req.body;
  
  if (!title || !content || !userId) {
    return res.status(400).json({ error: 'Title, content, and userId are required' });
  }
  
  const newPost = {
    id: Math.max(...posts.map(p => p.id)) + 1,
    title,
    content,
    userId: parseInt(userId)
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    post: newPost,
    message: 'Post created successfully',
    timestamp: new Date().toISOString()
  });
});

// 5. Random error endpoint for testing error handling
app.get('/api/random-error', async (req, res) => {
  await delay(300);
  const random = Math.random();
  
  if (random < 0.3) {
    return res.status(500).json({ error: 'Internal server error occurred' });
  } else if (random < 0.5) {
    return res.status(404).json({ error: 'Resource not found' });
  } else if (random < 0.7) {
    return res.status(400).json({ error: 'Bad request error' });
  } else {
    res.json({
      message: 'Success! No error this time.',
      random,
      timestamp: new Date().toISOString()
    });
  }
});

// 6. Validation endpoint
app.post('/api/validate', async (req, res) => {
  await delay(200);
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Data is required for validation' });
  }
  
  const isValid = data.includes('VALID');
  
  if (isValid) {
    res.json({
      valid: true,
      message: 'Data is valid',
      data,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(422).json({
      valid: false,
      error: 'Data validation failed',
      data,
      timestamp: new Date().toISOString()
    });
  }
});

// 7. Cache testing endpoint
app.get('/api/cache-test/:id', async (req, res) => {
  await delay(800);
  const { id } = req.params;
  
  res.json({
    id,
    data: `Cached data for ID: ${id}`,
    timestamp: new Date().toISOString(),
    serverTime: Date.now()
  });
});

// 8. Long running task endpoint
app.post('/api/long-task', async (req, res) => {
  const { duration = 3000 } = req.body;
  const taskDuration = Math.min(duration, 10000); // Max 10 seconds
  
  await delay(taskDuration);
  
  res.json({
    message: 'Long task completed',
    duration: taskDuration,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Use-Megamind Test Server running on http://localhost:${PORT}`);
  console.log(`📋 API Documentation available at http://localhost:${PORT}`);
  console.log(`🧠 Ready to test your use-megamind hook!`);
}); 