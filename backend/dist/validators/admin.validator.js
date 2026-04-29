"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminSchema = exports.createAdminSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    mobile: joi_1.default.string().pattern(/^[6-9]\d{9}$/).required(),
});
exports.deleteAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
