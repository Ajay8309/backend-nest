import Profile from '../models/Profile.js';

/**
 * Create a new profile
 */
export const createUserProfile = async (profileData) => {
  const profile = new Profile(profileData);
  return await profile.save();
};

/**
 * Get profile by user id
 */
export const getUserProfile = async (userId) => {
  return await Profile.findOne({ user: userId });
};

/**
 * Update profile
 */
export const updateUserProfile = async (userId, updateData) => {
  return await Profile.findOneAndUpdate({ user: userId }, updateData, { new: true });
};
