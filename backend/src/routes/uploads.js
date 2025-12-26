const express = require('express');
const auth = require('../middleware/auth');
const { upload, uploadPhoto } = require('../controllers/uploadController');

const router = express.Router();

// Routes
router.post('/photo', auth, upload, uploadPhoto);

module.exports = router;
