"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// middleware to protect routes using JWT authentication
const protect = async (req, res, next) => {
    try {
        let token;
        // check authorization header
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            // extract token
            token = req.headers.authorization.split(" ")[1];
            // verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // get user from DB (without password)
            const user = await User_1.User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({
                    message: "User not found",
                });
            }
            // attach to request
            req.user = user;
            next();
        }
        else {
            return res.status(401).json({
                message: "Not authorized, token missing",
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
};
exports.protect = protect;
