"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Agent_1 = require("../models/Agent");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
// generate token
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, loginAs } = req.body;
    // normalize email
    const normalizedEmail = email.toLowerCase();
    const user = await User_1.User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    // 🔥 role validation
    if (loginAs !== user.role) {
        throw new AppError_1.AppError(loginAs === "admin"
            ? "Agents cannot login as admin"
            : "Admins cannot login as agent", 403);
    }
    // 🔥 agent active check
    if (user.role === "agent") {
        const agent = await Agent_1.Agent.findOne({ email: user.email });
        if (!agent || !agent.isActive) {
            throw new AppError_1.AppError("Agent account is deactivated", 403);
        }
    }
    // 🔥 password check
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    // success
    res.json({
        message: "Login successful",
        token: generateToken(user._id.toString(), user.role),
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
        },
    });
});
