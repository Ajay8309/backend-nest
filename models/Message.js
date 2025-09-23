import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
text: String,
attachments: [{ data: Buffer, contentType: String }],
read: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now }
});


messageSchema.index({ from: 1, to: 1, createdAt: -1 });


export default mongoose.model('Message', messageSchema);