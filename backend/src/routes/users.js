const express = require('express');
const auth = require('../middleware/auth');
const { 
  getProfile, 
  updateProfile, 
  searchUsers, 
  getAllUsers, 
  getOnlineUsers, 
  getUserActivity, 
  getUserStats 
} = require('../controllers/userController');

const router = express.Router();

// Admin/Management Routes (specific routes first)
router.get('/online', getOnlineUsers);  // Get only online users
router.get('/activity', getUserActivity);  // Get user activity logs
router.get('/stats', getUserStats);  // Get user statistics
router.get('/search', auth, searchUsers);

// General Routes
router.get('/', getAllUsers);  // Get all users with optional filters
router.get('/:id', getProfile);
router.put('/:id', auth, updateProfile);

module.exports = router;
