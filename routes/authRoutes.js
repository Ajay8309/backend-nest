// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

router.post('/signup', signup); // /api/v1/auth/signup
router.post('/login', signin); // /api/v1/auth/login

module.exports = router;
