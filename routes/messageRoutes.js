import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { sendMessage } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.fields([{ name: 'attachments', maxCount: 1 }]), sendMessage);

export default router;
