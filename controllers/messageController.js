// controllers/messageController.js
const Message = require('../models/Message');
const Profile = require('../models/Profile');
const { uploadBuffer } = require('../services/cloudinaryService');
const responses = require('../utils/responses');

async function sendMessage(req, res) {
  try {
    const fromProfile = await Profile.findOne({ user: req.user._id });
    if (!fromProfile) return responses.error(res, 400, { error: 'Create profile first' });
    const { toProfileId, text } = req.body;
    if (!toProfileId) return responses.error(res, 400, { error: 'toProfileId required' });

    const messageData = {
      from: fromProfile._id,
      to: toProfileId,
      text
    };

    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const f of req.files.attachments) {
        const r = await uploadBuffer(f, 'jobnest/messages');
        attachments.push({ url: r.secure_url, publicId: r.public_id, filename: f.originalname });
      }
      messageData.attachments = attachments;
    }

    const m = new Message(messageData);
    await m.save();
    return responses.success(res, 201, { message: m });
  } catch (err) {
    console.error(err);
    return responses.error(res, 400, { error: err.message });
  }
}

module.exports = { sendMessage };
