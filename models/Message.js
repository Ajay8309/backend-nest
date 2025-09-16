// models/Message.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  text: String,
  attachments: [
    {
      url: String,
      publicId: String,
      filename: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
