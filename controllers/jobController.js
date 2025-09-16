import Job from '../models/Job.js';
import Application from '../models/Application.js';
// import { sendEmail } from '../services/emailService.js';

export const getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.status(200).json({ jobs });
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
    console.log("hello");
    // await sendEmail(req.user.email, 'Application Received', 'Your application has been received.');
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (err) {
    res.status(400).json({ error: 'invalid request body' });
  }
};


export const createJob = async (req, res) => {
    try {
      // only employer allowed
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
          : skillsRequired?.split(',').map(s => s.trim()), // handle CSV string too
        salaryRange
      });
      console.log("hekko");
  
      await job.save();
      res.status(201).json({ message: 'Job created successfully', job });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Invalid request body' });
    }
  };