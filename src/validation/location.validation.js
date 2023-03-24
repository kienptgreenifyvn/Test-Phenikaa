const joi = require('@hapi/joi');
const location = joi.object({
  title: joi.string().required(),
  description: joi.string(),
  lat: joi.number().min(-90).max(90).required(),
  long: joi.number().min(-90).max(90).required(),
  alt: joi.number().required(),
  map: joi.string(),
  images: joi.array(),
  type: joi.string(),
});

const addLocationValidation = async (req, res, next) => {
  const value = location.validate(req.body);
  if (value.error) {
    res.json({ success: 0, message: value.error.details[0].message });
  } else {
    next();
  }
};

module.exports = { addLocationValidation };
