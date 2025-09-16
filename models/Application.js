import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { data: Buffer, contentType: String },
  coverLetter: { data: Buffer, contentType: String }
});

export default mongoose.model('Application', applicationSchema);
