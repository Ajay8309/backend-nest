import Connection from '../models/Connection.js';

/**
 * Create a connection request
 */
export const createConnection = async (requesterId, recipientId) => {
  const connection = new Connection({
    requester: requesterId,
    recipient: recipientId
  });
  return await connection.save();
};

/**
 * List connections for a user
 */
export const getConnectionsForUser = async (userId) => {
  return await Connection.find({
    $or: [{ requester: userId }, { recipient: userId }]
  }).populate('requester recipient');
};
