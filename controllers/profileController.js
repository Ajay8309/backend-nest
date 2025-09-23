// profileController.js
import Profile from '../models/Profile.js';


export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, skills, personalityAssessment, socialLinks, jobPreferences } = req.body;

    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
    const coverLetterFile = req.files['coverLetter'] ? req.files['coverLetter'][0] : null;

    const profile = new Profile({
      user: userId,
      name,
      email,
      skills: skills ? skills.split(",").map(s => s.trim()) : undefined,
      personalityAssessment,
      resume: resumeFile ? { data: resumeFile.buffer, contentType: resumeFile.mimetype } : undefined,
      coverLetter: coverLetterFile ? { data: coverLetterFile.buffer, contentType: coverLetterFile.mimetype } : undefined,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : undefined,
      jobPreferences: jobPreferences ? JSON.parse(jobPreferences) : undefined
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  }
};


// Get employer profile by user ID
export const getEmployerProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id, companyName: { $exists: true } });

    if (!profile) {
      return res.status(404).json({ error: 'Employer profile not found' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employer profile' });
  }
};

// Create employer profile
export const createEmployerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      companyName, 
      companyDescription, 
      website, 
      location, 
      industry, 
      companySize, 
      jobPreferences 
    } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    const profile = new Profile({
      user: userId,
      companyName,
      companyDescription,
      website,
      location,
      industry,
      companySize,
      jobPreferences // directly assign object
    });

    await profile.save();
    res.status(201).json({ message: 'Employer profile created successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  }
};
