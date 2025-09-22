// controllers/userController.js
// import User from '../models/User';
import Profile from '../models/Profile.js';

export const getJobSeekers = async (req, res) => {
  try {
    // Find all profiles that belong to job seekers (exclude company/employer profiles)
    const profiles = await Profile.find({ name: { $exists: true } }) // job seekers have `name`
      .populate('user', 'email'); // get user email

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job seekers' });
  }
};
