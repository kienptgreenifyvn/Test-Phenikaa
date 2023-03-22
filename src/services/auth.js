const jwt = require('jsonwebtoken');

const keys = require('../constants/constants');

const generateToken = (payload) => {
  const token = jwt.sign(payload, keys.SECRET_KEY, {
    expiresIn: keys.EXPIRES_IN,
  });

  return token;
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, keys.SECRET_KEY);
    return payload;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
