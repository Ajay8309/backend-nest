// utils/responses.js
module.exports = {
    success: (res, status = 200, data = {}) => res.status(status).json(data),
    error: (res, status = 400, data = {}) => res.status(status).json(data)
  };
  