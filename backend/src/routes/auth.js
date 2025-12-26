const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);

module.exports = router;
