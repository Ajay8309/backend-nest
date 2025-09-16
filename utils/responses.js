export const success = (res, statusCode, data) => {
    return res.status(statusCode).json(data);
  };
  
  export const error = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
  };
  