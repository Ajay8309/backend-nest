// controllers/connectionController.js
const Profile = require('../models/Profile');
const { sendConnection, respondConnection } = require('../services/connectionService');
const responses = require('../utils/responses');

async function connectHandler(req, res) {
  try {
    const requesterProfile = await Profile.findOne({ user: req.user._id });
    if (!requesterProfile) return responses.error(res, 400, { error: 'Create profile first' });
    const recipientId = req.body.recipientProfileId;
    if (!recipientId) return responses.error(res, 400, { error: 'recipientProfileId required' });

    const c = await sendConnection(requesterProfile._id, recipientId);
    return responses.success(res, 201, { connection: c });
  } catch (err) {
    console.error(err);
    return responses.error(res, 400, { error: err.message });
  }
}

async function respondHandler(req, res) {
  try {
    const connId = req.params.id;
    const action = req.body.action; // 'accept' or 'decline'
    if (!['accept','decline'].includes(action)) return responses.error(res, 400, { error: 'invalid action' });
    const c = await respondConnection(connId, action);
    return responses.success(res, 200, { connection: c });
  } catch (err) {
    console.error(err);
    return responses.error(res, 400, { error: err.message });
  }
}

module.exports = { connectHandler, respondHandler };
