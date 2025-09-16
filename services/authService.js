import User from '../models/User.js';


export const registerUser = async (email, password, role) => {
  const user = new User({ email, password, role });
  return await user.save();
};


export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
