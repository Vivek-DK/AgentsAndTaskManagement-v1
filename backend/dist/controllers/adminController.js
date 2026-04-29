"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAdminProfile = exports.getAdmins = exports.deleteAdminByCredentials = exports.createAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
// create new admin
exports.createAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, mobile } = req.body;
    const exists = await User_1.User.findOne({ email });
    if (exists) {
        throw new AppError_1.AppError("User already exists", 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const admin = await User_1.User.create({
        email,
        password: hashedPassword,
        role: "admin",
        mobile,
    });
    res.status(201).json({
        message: "Admin created successfully",
        admin: {
            id: admin._id,
            email: admin.email,
        },
    });
});
// delete admin
exports.deleteAdminByCredentials = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== "admin") {
        throw new AppError_1.AppError("Not authorized", 403);
    }
    const admin = await User_1.User.findOne({ email });
    if (!admin || admin.role !== "admin") {
        throw new AppError_1.AppError("Admin not found", 404);
    }
    if (admin.isSuperAdmin) {
        throw new AppError_1.AppError("Super admin cannot be deleted", 400);
    }
    if (admin._id.toString() === currentUser._id.toString()) {
        throw new AppError_1.AppError("You cannot delete your own account", 400);
    }
    const match = await bcryptjs_1.default.compare(password, admin.password);
    if (!match) {
        throw new AppError_1.AppError("Invalid password", 400);
    }
    await admin.deleteOne();
    res.json({
        message: "Admin deleted successfully",
    });
});
// get admins
exports.getAdmins = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const admins = await User_1.User.find({ role: "admin" })
        .select("-password")
        .sort({ createdAt: -1 });
    res.json(admins);
});
// get my profile
exports.getMyAdminProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const currentUser = req.user;
    if (!currentUser) {
        throw new AppError_1.AppError("Not authorized", 401);
    }
    const admin = await User_1.User.findById(currentUser._id).select("-password");
    if (!admin || admin.role !== "admin") {
        throw new AppError_1.AppError("Admin not found", 404);
    }
    res.json(admin);
});
