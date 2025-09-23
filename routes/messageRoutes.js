// routes/messageRoutes.js
import express from 'express';
import {
  getConversation,
  sendMessage,
  markMessagesRead
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// get conversation history
router.get('/:userId', protect, getConversation);

// send a message (REST version)
router.post('/', protect, sendMessage);

// mark all messages from a user as read
router.post('/:fromUserId/read', protect, markMessagesRead);

export default router;
