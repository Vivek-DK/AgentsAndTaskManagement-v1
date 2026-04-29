"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.taskSchema = joi_1.default.object({
    FirstName: joi_1.default.string().required(),
    Phone: joi_1.default.string().pattern(/^[0-9]{10}$/).required(),
    Notes: joi_1.default.string().allow(""),
});
