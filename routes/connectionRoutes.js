import express from 'express';
import {
  connectUser,
  listIncomingRequests,
  updateConnectionStatus
} from '../controllers/connectionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, connectUser);

router.get('/', protect, listIncomingRequests);

router.put('/:id/status', protect, updateConnectionStatus);

export default router;
