// services/jobService.js
const Job = require('../models/Job');
const Profile = require('../models/Profile');

async function createJob(employerProfileId, jobData) {
  const profile = await Profile.findById(employerProfileId);
  if (!profile) throw new Error('Employer profile not found');

  const job = new Job({
    ...jobData,
    company: profile._id,
    companyName: profile.companyName || profile.name
  });
  await job.save();
  return job;
}

/**
 * Get jobs with optional filters and a simple relevance sort.
 * For demo: relevance = number of matching skills with query.skills OR seeker's skills.
 */
async function listJobs({ seekerProfileId, skills = [], query = {}, limit = 50 }) {
  // basic filter
  const filter = { active: true, ...query };
  const jobs = await Job.find(filter).limit(limit).lean();

  if (seekerProfileId || (skills && skills.length)) {
    let seekerSkills = skills;
    if (seekerProfileId) {
      const p = await Profile.findById(seekerProfileId);
      if (p && p.skills) seekerSkills = p.skills;
    }
    // compute simple relevance: count overlapping skills
    jobs.forEach(j => {
      const req = j.skillsRequired || [];
      const overlap = req.filter(s => seekerSkills.includes(s)).length;
      j._relevance = overlap;
    });
    jobs.sort((a,b) => b._relevance - a._relevance || (new Date(b.postedAt) - new Date(a.postedAt)));
  }
  return jobs;
}

module.exports = { createJob, listJobs };
