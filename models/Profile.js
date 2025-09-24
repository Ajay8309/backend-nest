import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Jobseeker fields
  name: String,
  email: String,
  skills: [String],                     // Individual array field
  personalityAssessment: String,        // Individual field
  resume: { data: Buffer, contentType: String },
  coverLetter: { data: Buffer, contentType: String },

  // Work experience
  experience: [
    {
      companyName: String,
      role: String,
      years: Number
    }
  ],

  // Company / Employer fields
  companyName: String,
  companyDescription: String,
  website: String,
  location: String,
  industry: String,
  companySize: String,
  foundedYear: Number,
  logo: { data: Buffer, contentType: String },
  socialLinks: {                        // Social media links
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },

  jobPreferences: {
    requiredSkills: [String],
    salaryRange: String
  }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
