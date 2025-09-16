// models/Job.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: String,
  description: String,
  company: { type: Schema.Types.ObjectId, ref: 'Profile' }, // employer profile
  companyName: String,
  skillsRequired: [String],
  salaryRange: String,
  location: String,
  postedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Job', jobSchema);
