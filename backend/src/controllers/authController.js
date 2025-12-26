const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
};

// Register user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, email, password, dateOfBirth, gender,
      phone, location, religion, caste, motherTongue,
      education, occupation, company, bio, interests
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user with ALL form data - let the pre-save hook handle password hashing
    const user = new User({
      name,
      email,
      password, // Don't hash here - let the pre-save hook do it
      dateOfBirth,
      gender,
      phone,
      location,
      religion,
      caste,
      motherTongue,
      education,
      occupation,
      company,
      bio,
      interests: interests || [],
      preferences: {
        ageRange: {
          min: 18,
          max: 50
        },
        gender: gender === 'male' ? 'female' : 'male', // Set opposite gender preference
        maxDistance: 50
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Login failed - User not found: ${email} at ${new Date().toISOString()}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password using User model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`❌ Login failed - Wrong password: ${email} at ${new Date().toISOString()}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update user to online status
    await User.findByIdAndUpdate(user._id, { 
      isActive: true,
      lastActive: new Date() 
    });

    // Generate token
    const token = generateToken(user._id);

    console.log(`✅ User logged in: ${email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          photos: user.photos
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          photos: user.photos,
          bio: user.bio,
          interests: user.interests,
          isActive: user.isActive,
          lastActive: user.lastActive
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { 
      isActive: false,
      lastActive: new Date() 
    });

    console.log(`✅ User logged out: ${req.user._id} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
