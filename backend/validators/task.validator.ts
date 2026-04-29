import Joi from "joi";

export const taskSchema = Joi.object({
  FirstName: Joi.string().required(),
  Phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  Notes: Joi.string().allow(""),
});