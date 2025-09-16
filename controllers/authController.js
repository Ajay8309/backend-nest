// controllers/authController.js
const { signUp, login } = require('../services/authService');
const responses = require('../utils/responses');

async function signup(req, res) {
  try {
    const { email, password, role } = req.body;
    await signUp({ email, password, role });
    return responses.success(res, 201, { message: 'User created successfully' });
  } catch (err) {
    const status = err.status || 400;
    return responses.error(res, status, { message: err.message || 'invalid request body' });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const token = await login({ email, password });
    return responses.success(res, 200, { token });
  } catch (err) {
    const status = err.status || 401;
    return responses.error(res, status, { error: err.message || 'Invalid credentials' });
  }
}

module.exports = { signup, signin };
