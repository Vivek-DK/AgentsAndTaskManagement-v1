"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const joi_1 = __importDefault(require("joi"));
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: joi_1.default.number().default(5000),
    MONGO_URI: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().min(10).required(),
    ADMIN_EMAIL: joi_1.default.string().email().required(),
    ADMIN_PASSWORD: joi_1.default.string().min(6).required(),
}).unknown(); // allow other env vars
const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`ENV VALIDATION ERROR: ${error.message}`);
}
exports.env = value;
