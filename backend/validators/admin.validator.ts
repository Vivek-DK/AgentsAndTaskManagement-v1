import Joi from "joi";

export const createAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
});

export const deleteAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});