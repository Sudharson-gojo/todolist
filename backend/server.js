const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Todo App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me',
      tasks: '/api/tasks',
      createTask: 'POST /api/tasks (with category: daily/weekly/monthly)',
      getTasks: 'GET /api/tasks (with optional ?category=daily/weekly/monthly)',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
