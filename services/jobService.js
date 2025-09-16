import Job from '../models/Job.js';
import Application from '../models/Application.js';

/**
 * Get all jobs
 */
export const getAllJobs = async () => {
  return await Job.find();
};

/**
 * Post a new job (for employers)
 */
export const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

/**
 * Apply for a job
 */
export const createApplication = async (applicationData) => {
  const application = new Application(applicationData);
  return await application.save();
};
