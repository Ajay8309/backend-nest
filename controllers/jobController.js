// controllers/jobController.js
const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const { uploadBuffer } = require('../services/cloudinaryService');
const { sendApplicationEmail } = require('../services/emailService');
const { createJob, listJobs } = require('../services/jobService');
const responses = require('../utils/responses');

async function getJobs(req, res) {
  try {
    // optional: pass seekerProfileId to compute relevance
    const seekerProfileId = req.query.seekerProfileId || null;
    const skills = req.query.skills ? req.query.skills.split(',').map(s=>s.trim()) : [];
    const jobs = await listJobs({ seekerProfileId, skills });
    // format response
    const out = jobs.map(j => ({
      _id: j._id,
      title: j.title,
      description: j.description,
      company: j.companyName,
      skills_required: j.skillsRequired,
      salary_range: j.salaryRange,
      relevance: j._relevance || 0
    }));
    return responses.success(res, 200, { jobs: out });
  } catch (err) {
    console.error(err);
    return responses.error(res, 500, { error: 'Failed to fetch jobs' });
  }
}

async function createJobHandler(req, res) {
  try {
    // employer must create job via their employer profile
    const user = req.user;
    if (user.role !== 'employer') return responses.error(res, 403, { error: 'Only employers can create jobs' });
    const employerProfile = await Profile.findOne({ user: user._id });
    if (!employerProfile) return responses.error(res, 400, { error: 'Employer profile required' });
    const job = await createJob(employerProfile._id, req.body);
    return responses.success(res, 201, { job });
  } catch (err) {
    console.error(err);
    return responses.error(res, 400, { error: err.message });
  }
}

async function applyJobHandler(req, res) {
  try {
    const jobId = req.params.jobId;
    const seekerProfile = await Profile.findOne({ user: req.user._id });
    if (!seekerProfile) return responses.error(res, 400, { error: 'Create a profile first' });

    const job = await Job.findById(jobId);
    if (!job) return responses.error(res, 404, { error: 'Job not found' });

    const applicationData = {
      job: job._id,
      seeker: seekerProfile._id,
      message: req.body.message || ''
    };

    // handle file uploads (resume, coverLetter)
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        const r = await uploadBuffer(req.files.resume[0], 'jobnest/applications/resumes');
        applicationData.resume = { url: r.secure_url, publicId: r.public_id };
      }
      if (req.files.coverLetter && req.files.coverLetter[0]) {
        const c = await uploadBuffer(req.files.coverLetter[0], 'jobnest/applications/coverletters');
        applicationData.coverLetter = { url: c.secure_url, publicId: c.public_id };
      }
    }

    const application = new Application(applicationData);
    await application.save();

    // send notification email to seeker (confirmation) and optionally to employer
    try {
      await sendApplicationEmail({
        to: req.user.email,
        subject: `Application received for ${job.title}`,
        text: `You have successfully applied for ${job.title} at ${job.companyName}.`,
        html: `<p>You have successfully applied for <strong>${job.title}</strong> at <strong>${job.companyName}</strong>.</p>`
      });
    } catch (e) {
      console.error('Email send failed', e);
    }

    return responses.success(res, 201, { message: 'Application submitted successfully', applicationId: application._id });
  } catch (err) {
    console.error(err);
    return responses.error(res, 400, { error: err.message });
  }
}

module.exports = { getJobs, createJobHandler, applyJobHandler };
