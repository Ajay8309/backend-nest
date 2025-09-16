// services/connectionService.js
const Connection = require('../models/Connection');

async function sendConnection(requesterId, recipientId) {
  if (requesterId.toString() === recipientId.toString()) {
    const err = new Error('Cannot connect to yourself');
    err.status = 400;
    throw err;
  }
  const existing = await Connection.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId }
    ]
  });
  if (existing) return existing;
  const c = new Connection({ requester: requesterId, recipient: recipientId });
  await c.save();
  return c;
}

async function respondConnection(connId, action) {
  const c = await Connection.findById(connId);
  if (!c) throw new Error('Connection not found');
  if (action === 'accept') c.status = 'accepted';
  if (action === 'decline') c.status = 'declined';
  await c.save();
  return c;
}

module.exports = { sendConnection, respondConnection };
