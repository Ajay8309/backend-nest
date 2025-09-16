// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { sendMessage } = require('../controllers/messageController');

router.post('/', auth, upload.fields([{ name: 'attachments' }]), sendMessage);

module.exports = router;
