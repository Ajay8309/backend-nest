// routes/connectionRoutes.js
import express from 'express';
import {
  sendConnectionRequest,
  getPendingRequests,
  getConnections,
  respondToConnectionRequest
} from '../controllers/connectionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// send request
router.post('/', protect, sendConnectionRequest);

// get pending requests for logged-in user
router.get('/pending', protect, getPendingRequests);

// get all accepted connections
router.get('/', protect, getConnections);

// accept/decline a request
router.post('/:requestId/respond', protect, respondToConnectionRequest);

export default router;
