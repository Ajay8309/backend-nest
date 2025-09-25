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
    const {
      name,
      email,
      skills,
      personalityAssessment,
      socialLinks,
      jobPreferences,
      experience // <-- new field
    } = req.body;

    // Handle uploaded files
    const resumeFile = req.files?.['resume'] ? req.files['resume'][0] : null;
    const coverLetterFile = req.files?.['coverLetter'] ? req.files['coverLetter'][0] : null;

    // Parse skills (comma separated string) and experience (JSON string)
    const parsedSkills = skills ? skills.split(",").map(s => s.trim()) : undefined;
    const parsedExperience = experience ? JSON.parse(experience) : undefined;

    const profile = new Profile({
      user: userId,
      name,
      email,
      skills: parsedSkills,
      personalityAssessment,
      resume: resumeFile ? { data: resumeFile.buffer, contentType: resumeFile.mimetype } : undefined,
      coverLetter: coverLetterFile ? { data: coverLetterFile.buffer, contentType: coverLetterFile.mimetype } : undefined,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : undefined,
      jobPreferences: jobPreferences ? JSON.parse(jobPreferences) : undefined,
      experience: parsedExperience
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

export const getProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await Profile.findOne({ user: userId }).populate('user', 'email role');
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      email,
      skills,
      personalityAssessment,
      socialLinks,
      jobPreferences,
      experience
    } = req.body;

    const resumeFile = req.files?.['resume'] ? req.files['resume'][0] : null;
    const coverLetterFile = req.files?.['coverLetter'] ? req.files['coverLetter'][0] : null;

    const parsedSkills = skills ? skills.split(",").map(s => s.trim()) : undefined;
    const parsedExperience = experience ? JSON.parse(experience) : undefined;

    // Find the profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update fields only if provided
    if (name !== undefined) profile.name = name;
    if (email !== undefined) profile.email = email;
    if (parsedSkills !== undefined) profile.skills = parsedSkills;
    if (personalityAssessment !== undefined) profile.personalityAssessment = personalityAssessment;
    if (socialLinks !== undefined) profile.socialLinks = JSON.parse(socialLinks);
    if (jobPreferences !== undefined) profile.jobPreferences = JSON.parse(jobPreferences);
    if (parsedExperience !== undefined) profile.experience = parsedExperience;

    if (resumeFile) {
      profile.resume = { data: resumeFile.buffer, contentType: resumeFile.mimetype };
    }
    if (coverLetterFile) {
      profile.coverLetter = { data: coverLetterFile.buffer, contentType: coverLetterFile.mimetype };
    }

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  }
};
