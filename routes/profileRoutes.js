import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { createProfile, getProfile } from '../controllers/profileController.js';
import { createEmployerProfile, getEmployerProfile, getProfileByUserId, updateProfile} from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get("/me", protect, getProfile);

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  createProfile
);

router.put(
  '/',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  updateProfile
);

router.get("/employer/me", protect, getEmployerProfile);
router.post('/employer', protect, createEmployerProfile);
router.get('/:userId', protect, getProfileByUserId);

export default router;
