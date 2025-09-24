// jobRoutes.js

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
import Application from '../models/Application.js';


const router = express.Router();

router.get('/', protect, getJobs);

router.get('/:jobId', protect, getJobById);

router.post('/', protect, createJob);

router.get('/:jobId/applied', protect, checkApplicationStatus);

// routes/jobs.js
router.get("/:jobId/applicants",protect ,async (req, res) => {
  const { jobId } = req.params;
  try {
    const applicants = await Application.find({ job: jobId })
      .populate("user", "name email skills"); 
    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
});



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
