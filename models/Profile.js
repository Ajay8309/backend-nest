// models/Profile.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // For job seekers
  name: String,
  email: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      from: Date,
      to: Date,
      description: String
    }
  ],
  preferences: {
    locations: [String],
    salaryRange: String,
    roles: [String]
  },
  personalityAssessment: Schema.Types.Mixed,
  resume: {
    url: String,
    publicId: String
  },
  coverLetter: {
    url: String,
    publicId: String
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    other: String
  },
  // For employers
  companyName: String,
  companyDescription: String,
  companyCulture: String,
  companyValues: [String],
  jobPreferences: {
    requiredSkills: [String],
    salaryRange: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
