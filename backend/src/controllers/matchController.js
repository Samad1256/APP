const Match = require('../models/Match');
const User = require('../models/User');

// Like a user
const likeUser = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot like yourself'
      });
    }

    // Check if user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already liked/passed
    const existingMatch = await Match.findOne({
      from: fromUserId,
      to: toUserId
    });

    if (existingMatch) {
      return res.status(400).json({
        success: false,
        message: 'Already interacted with this user'
      });
    }

    // Create like
    const like = new Match({
      from: fromUserId,
      to: toUserId,
      status: 'liked'
    });

    await like.save();

    // Check if it's a match (other user also liked)
    const reverseMatch = await Match.findOne({
      from: toUserId,
      to: fromUserId,
      status: 'liked'
    });

    let isMatch = false;
    if (reverseMatch) {
      // Update both matches to 'matched'
      await Match.updateMany(
        { 
          $or: [
            { from: fromUserId, to: toUserId },
            { from: toUserId, to: fromUserId }
          ]
        },
        { 
          status: 'matched',
          matchedAt: new Date()
        }
      );
      isMatch = true;
    }

    res.json({
      success: true,
      message: isMatch ? 'It\'s a match!' : 'User liked successfully',
      data: {
        isMatch,
        match: isMatch ? { user: toUser.name } : null
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

// Pass a user
const passUser = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot pass yourself'
      });
    }

    // Check if already interacted
    const existingMatch = await Match.findOne({
      from: fromUserId,
      to: toUserId
    });

    if (existingMatch) {
      return res.status(400).json({
        success: false,
        message: 'Already interacted with this user'
      });
    }

    // Create pass
    const pass = new Match({
      from: fromUserId,
      to: toUserId,
      status: 'passed'
    });

    await pass.save();

    res.json({
      success: true,
      message: 'User passed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's matches
const getMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const matches = await Match.find({
      $or: [
        { from: userId, status: 'matched' },
        { to: userId, status: 'matched' }
      ]
    })
    .populate('from', 'name photos')
    .populate('to', 'name photos')
    .sort({ matchedAt: -1 });

    // Format matches to show the other user
    const formattedMatches = matches.map(match => {
      const otherUser = match.from._id.toString() === userId.toString() 
        ? match.to 
        : match.from;
      
      return {
        id: match._id,
        user: otherUser,
        matchedAt: match.matchedAt
      };
    });

    res.json({
      success: true,
      data: formattedMatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user suggestions (opposite gender users they haven't interacted with)
const getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get users the current user has already interacted with (liked or passed)
    const existingMatches = await Match.find({
      $or: [
        { from: userId },
        { to: userId }
      ]
    });
    
    const interactedUserIds = new Set();
    existingMatches.forEach(match => {
      if (match.from.toString() !== userId.toString()) {
        interactedUserIds.add(match.from.toString());
      }
      if (match.to.toString() !== userId.toString()) {
        interactedUserIds.add(match.to.toString());
      }
    });
    
    // Use the user's preferred gender from their preferences
    const preferredGender = currentUser.preferences?.gender || (currentUser.gender === 'male' ? 'female' : 'male');
    
    // Basic query for gender and not already interacted
    const baseQuery = {
      _id: { $ne: userId, $nin: Array.from(interactedUserIds) },
      gender: preferredGender,
      'preferences.gender': currentUser.gender, // Make sure the other user is also interested in this user's gender
      isActive: true
    };
    
    // Add age preference if available
    if (currentUser.preferences && currentUser.preferences.ageRange) {
      const currentYear = new Date().getFullYear();
      const minBirthYear = currentYear - currentUser.preferences.ageRange.max;
      const maxBirthYear = currentYear - currentUser.preferences.ageRange.min;
      
      baseQuery.dateOfBirth = {
        $gte: new Date(minBirthYear, 0, 1),
        $lte: new Date(maxBirthYear, 11, 31)
      };
    }

    // Add location matching
    if (currentUser.location) {
      baseQuery['location.city'] = currentUser.location.city;
      baseQuery['location.state'] = currentUser.location.state;
      baseQuery['location.country'] = currentUser.location.country;
    }
    
    // Find users with location and preference matches first
    let suggestions = await User.find(baseQuery)
      .select('name dateOfBirth gender location interests photos bio')
      .sort({ createdAt: -1 }) // Show newest profiles first
      .limit(20);
    
    // Process suggestions with age calculation and interest matching
    const suggestionsWithScore = suggestions.map(user => {
      const userObj = user.toObject();
      
      // Calculate age
      if (userObj.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(userObj.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        userObj.age = age;
      }

      // Calculate interest match score
      const commonInterests = currentUser.interests?.filter(interest => 
        userObj.interests?.includes(interest)
      ) || [];
      userObj.matchScore = (commonInterests.length / Math.max(currentUser.interests?.length || 1, userObj.interests?.length || 1)) * 100;
      userObj.commonInterests = commonInterests;

      return userObj;
    });

    // Sort by match score (common interests) and then by most recently active
    const sortedSuggestions = suggestionsWithScore.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return new Date(b.lastActive || b.createdAt) - new Date(a.lastActive || a.createdAt);
    });
    
    res.json({
      success: true,
      data: sortedSuggestions.map(suggestion => ({
        ...suggestion,
        matchScore: Math.round(suggestion.matchScore),
        commonInterests: suggestion.commonInterests
      }))
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  likeUser,
  passUser,
  getMatches,
  getSuggestions
};
