// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const jobRoutes = require('./jobRoutes');
const connectionRoutes = require('./connectionRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', jobRoutes);
router.use('/connections', connectionRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
