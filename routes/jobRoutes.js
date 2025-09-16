// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { getJobs, createJobHandler, applyJobHandler } = require('../controllers/jobController');

// view jobs
router.get('/', getJobs);

// employers create job
router.post('/', auth, createJobHandler);

// apply to job (authenticated seeker), allow resume/cover upload in apply
router.post('/:jobId/apply', auth, upload.fields([{ name: 'resume' }, { name: 'coverLetter' }]), applyJobHandler);

module.exports = router;
