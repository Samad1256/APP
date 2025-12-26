const Message = require('../models/Message');
const Match = require('../models/Match');

// Create conversation ID from two user IDs
const createConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user._id;

    if (from.toString() === to) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    // Check if users are matched
    const match = await Match.findOne({
      $or: [
        { from: from, to: to, status: 'matched' },
        { from: to, to: from, status: 'matched' }
      ]
    });

    if (!match) {
      return res.status(403).json({
        success: false,
        message: 'Can only message matched users'
      });
    }

    const conversationId = createConversationId(from.toString(), to);

    const message = new Message({
      conversationId,
      from,
      to,
      text
    });

    await message.save();
    await message.populate('from', 'name photos');

    // Emit to socket if connected
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${to}`).emit('newMessage', {
        message,
        conversationId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this conversation
    const userIds = conversationId.split('_');
    if (!userIds.includes(userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    const messages = await Message.find({ conversationId })
      .populate('from', 'name photos')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId, 
        to: userId, 
        read: false 
      },
      { 
        read: true, 
        readAt: new Date() 
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        conversationId
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

// Get user's conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversation IDs for the user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $last: '$text' },
          lastMessageAt: { $last: '$createdAt' },
          from: { $last: '$from' },
          to: { $last: '$to' }
        }
      },
      {
        $sort: { lastMessageAt: -1 }
      }
    ]);

    // Populate user details and get unread count
    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId = conv.from.toString() === userId.toString() 
          ? conv.to 
          : conv.from;

        const otherUser = await require('../models/User').findById(otherUserId)
          .select('name photos');

        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          to: userId,
          read: false
        });

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations
};
