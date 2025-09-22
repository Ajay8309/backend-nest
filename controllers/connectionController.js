import Connection from '../models/Connection.js';


export const connectUser = async (req, res) => {
  try {
    const { recipientProfileId } = req.body;

    if (recipientProfileId === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot connect with yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientProfileId },
        { requester: recipientProfileId, recipient: req.user._id }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: "Connection already exists" });
    }

    const connection = new Connection({
      requester: req.user._id,
      recipient: recipientProfileId,
      status: "pending" // initial status
    });

    await connection.save();
    res.status(201).json(connection);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request body' });
  }
};


export const listIncomingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.user._id,
      status: 'pending'
    })
      .populate('requester', 'name email');

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not fetch incoming requests' });
  }
};


// update status (accept/reject)
export const updateConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    const connection = await Connection.findOne({
      _id: id,
      recipient: req.user._id
    });

    if (!connection) return res.status(404).json({ error: 'Not authorized or not found' });

    connection.status = status;
    await connection.save();

    res.status(200).json({ message: `Connection ${status}`, connection });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update status' });
  }
};

