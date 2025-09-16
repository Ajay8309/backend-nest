// services/profileService.js
const Profile = require('../models/Profile');
const User = require('../models/User');

async function createProfile(userId, profileData) {
    console.log("gello");
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const exists = await Profile.findOne({ user: userId });
  if (exists) {
    // update
    Object.assign(exists, profileData);
    await exists.save();
    return exists;
  }
  const profile = new Profile({ user: userId, email: user.email, ...profileData });
  await profile.save();
  return profile;
}

module.exports = { createProfile };
