import Connection from '../models/Connection.js';

// existing connectUser
export const connectUser = async (req, res) => {
  try {
    const connection = new Connection({
      requester: req.user._id,
      recipient: req.body.recipientProfileId
    });
    await connection.save();
    res.status(201).json(connection);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid request body' });
  }
};

export const listConnections = async (req, res) => {
  try {
    // find connections where logged-in user is requester or recipient
    const connections = await Connection.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }]
    })
      .populate('requester', 'email') // populate requester info (optional)
      .populate('recipient', 'email'); // populate recipient info (optional)

    res.status(200).json(connections);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not fetch connections' });
  }
};



// update status (accept/reject)
export const updateConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params; // connection id
    const { status } = req.body; // 'accepted' or 'rejected'

    // Only recipient can change status
    const connection = await Connection.findOne({
      _id: id,
      recipient: req.user._id
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found or not authorized' });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({ message: 'Status updated', connection });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update status' });
  }
};
