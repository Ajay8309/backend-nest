// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { createProfileHandler } = require('../controllers/profileController');

// create or update profile (multipart to allow resume/cover)
router.post('/', auth, upload.fields([{ name: 'resume' }, { name: 'coverLetter' }]), createProfileHandler);

module.exports = router;
