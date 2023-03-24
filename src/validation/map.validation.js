const joi = require('@hapi/joi');
const map = joi.object({
  title: joi.string().required(),
  description: joi.string(),
  openingTime: joi.date(),
  price: joi.number(),
  contact: joi.object(),
});

const addMapValidation = async (req, res, next) => {
  const value = map.validate(req.body);
  if (value.error) {
    res.json({ success: 0, message: value.error.details[0].message });
  } else {
    next();
  }
};

module.exports = { addMapValidation };
