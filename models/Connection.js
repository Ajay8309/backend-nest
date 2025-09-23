import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// ensure only one connection exists between two users
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model('Connection', connectionSchema);
