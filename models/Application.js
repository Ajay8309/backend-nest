// models/Application.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  seeker: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  resume: { url: String, publicId: String },
  coverLetter: { url: String, publicId: String },
  message: String,
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['applied','reviewing','rejected','hired'], default: 'applied' }
});

module.exports = mongoose.model('Application', applicationSchema);
