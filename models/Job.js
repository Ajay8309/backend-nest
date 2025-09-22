// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  skillsRequired: [String],
  salaryRange: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);