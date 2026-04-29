import Joi from "joi";

export const addAgentSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^\d{10}$/).required(),
  password: Joi.string().min(6).required(),
});