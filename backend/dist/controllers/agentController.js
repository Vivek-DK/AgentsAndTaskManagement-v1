"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAgent = exports.getMyProfile = exports.getTasks = exports.getAgents = exports.addAgent = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Agent_1 = require("../models/Agent");
const User_1 = require("../models/User");
const Task_1 = require("../models/Task");
const distributionService_1 = __importDefault(require("../services/distributionService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
// add agent
exports.addAgent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const emailExists = (await Agent_1.Agent.findOne({ email })) ||
        (await User_1.User.findOne({ email }));
    if (emailExists) {
        throw new AppError_1.AppError("Email already exists", 400);
    }
    const mobileExists = await Agent_1.Agent.findOne({ mobile });
    if (mobileExists) {
        throw new AppError_1.AppError("Mobile already exists", 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await User_1.User.create({
        email,
        mobile,
        password: hashedPassword,
        role: "agent",
    });
    const agent = await Agent_1.Agent.create({
        name,
        email,
        mobile,
        password: hashedPassword,
    });
    res.status(201).json({
        message: "Agent created successfully",
        agent,
    });
});
// get agents
exports.getAgents = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const agents = await Agent_1.Agent.find({ isActive: true })
        .select("-password")
        .sort({ createdAt: -1 });
    res.json(agents);
});
// get all tasks (admin)
exports.getTasks = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const tasks = await Task_1.Task.find()
        .populate("agent", "name email")
        .sort({ createdAt: -1 });
    res.json(tasks);
});
// get logged-in agent profile
exports.getMyProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const currentUser = req.user;
    if (!currentUser) {
        throw new AppError_1.AppError("Not authorized", 401);
    }
    const agent = await Agent_1.Agent.findOne({
        email: currentUser.email,
    }).select("-password");
    if (!agent) {
        throw new AppError_1.AppError("Agent not found", 404);
    }
    res.status(201).json({
        message: "Agent created successfully",
        agent: {
            id: agent._id,
            name: agent.name,
            email: agent.email,
        },
    });
});
// deactivate agent + redistribute tasks
exports.deactivateAgent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid agent id", 400);
    }
    const agent = await Agent_1.Agent.findById(id);
    if (!agent) {
        throw new AppError_1.AppError("Agent not found", 404);
    }
    // deactivate
    agent.isActive = false;
    await agent.save();
    const tasks = await Task_1.Task.find({ agent: id });
    if (tasks.length > 0) {
        const activeAgents = await Agent_1.Agent.find({
            isActive: true,
            _id: { $ne: new mongoose_1.default.Types.ObjectId(id) },
        });
        if (activeAgents.length) {
            const redistributed = (0, distributionService_1.default)(tasks, activeAgents);
            // 🔥 optimize: Promise.all instead of loop await
            await Promise.all(tasks.map((task, i) => {
                task.agent = redistributed[i].agent;
                return task.save();
            }));
        }
    }
    res.json({
        message: "Agent deactivated and tasks reassigned",
    });
});
