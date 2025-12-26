const User = require('../models/User');

// Get user profile by ID
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('photos');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is updating their own profile
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    delete updates.email; // Don't allow email updates here

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { gender, minAge, maxAge, city, page = 1, limit = 20 } = req.query;
    const currentUserId = req.user._id;

    let query = { 
      _id: { $ne: currentUserId },
      isActive: true 
    };

    // Add filters
    if (gender) {
      query.gender = gender;
    }

    if (minAge || maxAge) {
      const now = new Date();
      if (maxAge) {
        const minBirthDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
        query.dateOfBirth = { $gte: minBirthDate };
      }
      if (minAge) {
        const maxBirthDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        query.dateOfBirth = { ...query.dateOfBirth, $lte: maxBirthDate };
      }
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
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

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let filter = {};
    if (status === 'online') {
      filter.isActive = true;
    } else if (status === 'offline') {
      filter.isActive = false;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ lastActive: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get online users only
const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find({ isActive: true })
      .select('-password')
      .sort({ lastActive: -1 });

    res.json({
      success: true,
      message: 'Online users retrieved successfully',
      data: onlineUsers,
      count: onlineUsers.length
    });

  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user activity logs
const getUserActivity = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));

    const users = await User.find({
      lastActive: { $gte: dateLimit }
    })
    .select('name email isActive lastActive createdAt')
    .sort({ lastActive: -1 });

    res.json({
      success: true,
      message: `User activity for last ${days} days`,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const onlineUsers = await User.countDocuments({ isActive: true });
    const todayUsers = await User.countDocuments({
      lastActive: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    const newUsersToday = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: {
        totalUsers,
        onlineUsers,
        offlineUsers: totalUsers - onlineUsers,
        todayActiveUsers: todayUsers,
        newUsersToday,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  searchUsers,
  getAllUsers,
  getOnlineUsers,
  getUserActivity,
  getUserStats
};
