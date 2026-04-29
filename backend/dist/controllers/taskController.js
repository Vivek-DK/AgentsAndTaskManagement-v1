"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllTasks = exports.deleteTask = exports.getTasksByAgentId = exports.getMyTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Task_1 = require("../models/Task");
const Agent_1 = require("../models/Agent");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
// get tasks for logged-in agent
exports.getMyTasks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const currentUser = req.user;
    if (!currentUser) {
        throw new AppError_1.AppError("Not authorized", 401);
    }
    const agent = await Agent_1.Agent.findOne({
        email: currentUser.email,
    });
    if (!agent) {
        throw new AppError_1.AppError("Agent not found", 404);
    }
    const tasks = await Task_1.Task.find({ agent: agent._id })
        .populate("agent", "name email mobile")
        .sort({ createdAt: -1 })
        .lean();
    res.json(tasks);
});
// get tasks by agent id (admin)
exports.getTasksByAgentId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const agentId = req.params.agentId;
    if (!mongoose_1.default.Types.ObjectId.isValid(agentId)) {
        throw new AppError_1.AppError("Invalid agent id", 400);
    }
    const tasks = await Task_1.Task.find({
        agent: new mongoose_1.default.Types.ObjectId(agentId),
    })
        .populate("agent", "name email mobile")
        .sort({ createdAt: -1 })
        .lean();
    res.json(tasks);
});
// delete single task
exports.deleteTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid task id", 400);
    }
    const deleted = await Task_1.Task.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppError_1.AppError("Task not found", 404);
    }
    res.json({
        message: "Task deleted successfully",
    });
});
// delete all tasks
exports.deleteAllTasks = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const result = await Task_1.Task.deleteMany({});
    res.json({
        message: "All tasks deleted",
        deletedCount: result.deletedCount,
    });
});
