// routes/userRoutes.js
import express from 'express';
import { getJobSeekers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/jobseekers', protect, getJobSeekers);

export default router;
