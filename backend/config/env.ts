import Joi from "joi";

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number().default(5000),

  MONGO_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().min(10).required(),

  ADMIN_EMAIL: Joi.string().email().required(),

  ADMIN_PASSWORD: Joi.string().min(6).required(),
}).unknown(); // allow other env vars

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`ENV VALIDATION ERROR: ${error.message}`);
}

export const env = value;