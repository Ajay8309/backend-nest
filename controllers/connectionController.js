// controllers/connectionController.js
import ConnectionRequest from '../models/ConnectionRequest.js';
import Connection from '../models/Connection.js';

/**
 * Send a connection request
 */
export const sendConnectionRequest = async (req, res) => {
  try {
    const from = req.user._id;
    const { to, message } = req.body;

    if (!to) return res.status(400).json({ error: 'Recipient user ID required' });
    if (from.toString() === to) return res.status(400).json({ error: 'Cannot send request to yourself' });

    const existing = await ConnectionRequest.findOne({ from, to, status: 'pending' });
    if (existing) return res.status(400).json({ error: 'Request already pending' });

    const reqDoc = await ConnectionRequest.create({ from, to, message });

    res.status(201).json(reqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all pending connection requests received by the logged-in user
 */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ to: req.user._id, status: 'pending' })
      .populate('from', 'email'); // include sender email
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all connections of the logged-in user
 */
export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const conns = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }]
    })
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    // format to show the other user
    const formatted = conns
      .map(conn => {
        const otherUser =
          conn.requester._id.toString() === userId.toString()
            ? conn.recipient
            : conn.requester;
        return { _id: conn._id, user: otherUser };
      })
      .filter(c => c.user !== null); // remove null users

    // send only ONE response
    return res.json({ accepted: formatted });
  } catch (err) {
    console.error('Error in getConnections:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
/**
 * Accept or decline a connection request
 */
export const respondToConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const userId = req.user._id.toString();

    // fetch the connection request
    const reqDoc = await ConnectionRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    if (reqDoc.to.toString() !== userId)
      return res.status(403).json({ error: 'Not authorized to respond' });

    if (action === 'accept') {
      reqDoc.status = 'accepted';
      await reqDoc.save();

      // ensure connection exists only once
      let existingConnection = await Connection.findOne({
        $or: [
          { requester: reqDoc.from, recipient: reqDoc.to },
          { requester: reqDoc.to, recipient: reqDoc.from }
        ]
      });

      if (!existingConnection) {
        existingConnection = await Connection.create({
          requester: reqDoc.from,
          recipient: reqDoc.to
        });
      }

      return res.json({ status: 'accepted', connection: existingConnection });
    } else if (action === 'decline') {
      reqDoc.status = 'declined';
      await reqDoc.save();
      return res.json({ status: 'declined' });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Error in respondToConnectionRequest:', err);
    res.status(500).json({ error: 'Server error' });
  }
};