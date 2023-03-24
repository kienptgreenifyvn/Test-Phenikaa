const joi = require('@hapi/joi');
const user = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  role: joi.string().valid('USER').valid('ADMIN'),
});

const addUserValidation = async (req, res, next) => {
  const value = user.validate(req.body);
  if (value.error) {
    res.json({ success: false, message: value.error.details });
  } else {
    next();
  }
};

module.exports = { addUserValidation };
