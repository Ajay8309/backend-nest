import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import jobRoutes from './jobRoutes.js';
import connectionRoutes from './connectionRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', jobRoutes);
router.use('/connections', connectionRoutes);
router.use('/messages', messageRoutes);

export default router;
