import Joi from "joi";

const userSignUpScheme = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name:Joi.string(),
  username:Joi.string().required(),
  password:Joi.string().required(),
  role:Joi.string().required(),
  email: Joi.string().email().required(),
  profile_pic:Joi.string()
});
const userCreateScheme = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name:Joi.string(),
  username:Joi.string().required(),
  password:Joi.string().required(),
  role:Joi.string().required(),
  email: Joi.string().email().required(),
  profile_pic:Joi.string()
});

const userUpdateSchema = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string(),
  username: Joi.string().required(),
  email: Joi.string().email()
});


export const validateSignUpUser = (req, res, next) => {
  const { error } = userSignUpScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

export const validateCreateUser = (req, res, next) => {
  const { error } = userCreateScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

