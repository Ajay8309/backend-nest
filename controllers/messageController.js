import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { toProfileId, text } = req.body;
    const attachmentFile = req.files['attachments'] ? req.files['attachments'][0] : null;

    const message = new Message({
      from: req.user._id,
      to: toProfileId,
      text,
      attachments: attachmentFile ? { data: attachmentFile.buffer, contentType: attachmentFile.mimetype } : undefined
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: 'invalid request body' });
  }
};
