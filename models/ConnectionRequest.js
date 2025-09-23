import mongoose from 'mongoose';


const connectionRequestSchema = new mongoose.Schema({
from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
message: String,
status: { type: String, enum: ['pending','accepted','declined'], default: 'pending' },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('ConnectionRequest', connectionRequestSchema);