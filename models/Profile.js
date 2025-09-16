import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  email: String,
  preferences: {
    skills: [String],
    personalityAssessment: String
  },
  resume: { data: Buffer, contentType: String },
  coverLetter: { data: Buffer, contentType: String },
  companyName: String,
  companyDescription: String,
  jobPreferences: {
    requiredSkills: [String],
    salaryRange: String
  }
});

export default mongoose.model('Profile', profileSchema);
