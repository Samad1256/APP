const express = require('express');
const auth = require('../middleware/auth');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');

const router = express.Router();

// Routes
router.post('/', auth, sendMessage);
router.get('/conversations', auth, getConversations);
router.get('/:conversationId', auth, getMessages);

module.exports = router;
