import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { getJobs, applyJob, createJob } from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs); 

router.post('/', protect, createJob);

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
