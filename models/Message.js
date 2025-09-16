import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  attachments: { data: Buffer, contentType: String },
  sentAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
