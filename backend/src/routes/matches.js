const express = require('express');
const auth = require('../middleware/auth');
const { likeUser, passUser, getMatches, getSuggestions } = require('../controllers/matchController');

const router = express.Router();

// Routes
router.post('/like', auth, likeUser);
router.post('/pass', auth, passUser);
router.get('/', auth, getMatches);
router.get('/suggestions', auth, getSuggestions);

module.exports = router;
