// controllers/messageController.js
import Message from '../models/Message.js';

/**
 * Get the conversation between the logged-in user and another user
 */
export const getConversation = async (req, res) => {
  const { userId } = req.params; // other user ID
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id }
      ]
    }).sort({ createdAt: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Send a message (REST version, if you want non-socket clients)
 */
export const sendMessage = async (req, res) => {
  const from = req.user._id;
  const { toUserId, text } = req.body;
  try {
    if (!toUserId || !text) return res.status(400).json({ error: 'Missing toUserId or text' });

    const msg = await Message.create({ from, to: toUserId, text });

    // Optionally: if you export your io instance from socketServer, you can push live:
    // io.to(`user:${toUserId}`).emit('message:received', { message: msg });

    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Mark all messages from a specific user as read
 */
export const markMessagesRead = async (req, res) => {
  const { fromUserId } = req.params;
  try {
    await Message.updateMany({ from: fromUserId, to: req.user._id, read: false }, { read: true });
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
