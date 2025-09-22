import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import {
  getJobs,
  getJobById,       
  applyJob,
  createJob, 
  checkApplicationStatus
} from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getJobs);

router.get('/:jobId', protect, getJobById);

router.post('/', protect, createJob);

router.get('/:jobId/applied', protect, checkApplicationStatus);


router.post(
  '/:jobId/apply',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  applyJob
);

export default router;
