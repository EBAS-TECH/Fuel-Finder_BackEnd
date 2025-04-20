import Joi from "joi";

const userScheme = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name:Joi.string(),
  username:Joi.string().required(),
  password:Joi.string().required(),
  confirmPassword:Joi.string().required(),
  role:Joi.string().required(),
  email: Joi.string().email().required(),
  profile_pic:Joi.string()
});

const validateUser = (req, res, next) => {
  const { error } = userScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

export default validateUser;