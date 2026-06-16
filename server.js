// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Define the port, defaulting to 5000 if not specified in environment
const PORT = process.env.PORT || 5000;

// Apply Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files from the root directory
// This allows access to login.html, register.html, index.html, and CSS files directly
app.use(express.static(path.join(__dirname)));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Fallback Welcome / Health Check route for API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce API is running'
  });
});

// Custom Error Handling Middlewares

// 404 Not Found Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
