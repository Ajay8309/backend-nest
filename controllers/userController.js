// controllers/userController.js
// import User from '../models/User';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

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


// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
