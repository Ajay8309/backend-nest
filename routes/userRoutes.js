// userRoutes.js
import express from 'express';
import { getJobSeekers, getUserById } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/jobseekers', protect, getJobSeekers);

router.get('/:id', protect, getUserById);

export default router;
