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
    const { name, email, preferences, companyName, companyDescription, jobPreferences } = req.body;
    
    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
    const coverLetterFile = req.files['coverLetter'] ? req.files['coverLetter'][0] : null;
    
    const profile = new Profile({
        user: userId,
        name,
        email,
        preferences: preferences ? JSON.parse(preferences) : undefined,
        resume: resumeFile ? { data: resumeFile.buffer, contentType: resumeFile.mimetype } : undefined,
        coverLetter: coverLetterFile ? { data: coverLetterFile.buffer, contentType: coverLetterFile.mimetype } : undefined,
        companyName,
        companyDescription,
        jobPreferences: jobPreferences ? JSON.parse(jobPreferences) : undefined
    });
    console.log("innn");
    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    res.status(400).json({ error: 'invalid request body' });
  }
};
