import Job from '../models/Job.js';
import Application from '../models/Application.js';
// import { sendEmail } from '../services/emailService.js';


export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user._id
    });

    res.json({ applied: !!existingApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJobs = async (req, res) => {
  try {
    if (req.query.mine === 'true') {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ error: 'Only employers can view their jobs' });
      }
      const jobs = await Job.find({ employer: req.user._id });
      return res.json(jobs);
    }

    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
    const coverLetterFile = req.files['coverLetter'] ? req.files['coverLetter'][0] : null;

    const application = new Application({
      job: jobId,
      user: req.user._id,
      resume: resumeFile ? { data: resumeFile.buffer, contentType: resumeFile.mimetype } : undefined,
      coverLetter: coverLetterFile ? { data: coverLetterFile.buffer, contentType: coverLetterFile.mimetype } : undefined
    });

    await application.save();
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid request body' });
  }
};

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create jobs' });
    }

    const { title, description, company, skillsRequired, salaryRange } = req.body;

    const job = new Job({
      employer: req.user._id,
      title,
      description,
      company,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired?.split(',').map(s => s.trim()),
      salaryRange
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  }
};