// routes/connectionRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { connectHandler, respondHandler } = require('../controllers/connectionController');

router.post('/', auth, connectHandler); // create connection request
router.post('/:id/respond', auth, respondHandler); // accept/decline

module.exports = router;
