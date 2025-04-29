import Joi from "joi";

const stationSchema = Joi.object({
  user: Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().allow('', null), // Optional
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('GAS_STATION').required()
  }).required(),
  
  en_name: Joi.string().required(),
  am_name: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  tin_number:Joi.number().required(),
  address: Joi.string().required()
});

export const validateCreateStation = (req, res, next) => {
  const { error } = stationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};
