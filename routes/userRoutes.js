const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public route to register user
router.post('/', registerUser);

// Public route to login user
router.post('/login', loginUser);

// Private route to get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
