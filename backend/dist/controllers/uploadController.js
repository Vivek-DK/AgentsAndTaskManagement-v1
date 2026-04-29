"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAndDistribute = void 0;
const fs_1 = __importDefault(require("fs"));
const fileParser_1 = __importDefault(require("../utils/fileParser"));
const distributionService_1 = __importDefault(require("../services/distributionService"));
const Agent_1 = require("../models/Agent");
const Task_1 = require("../models/Task");
const task_validator_1 = require("../validators/task.validator");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
// 🔥 NORMALIZATION (CRITICAL FIX)
const normalizeTask = (item) => {
    let phone = item.Phone;
    // convert to string safely
    phone = String(phone || "").trim();
    // handle Excel scientific notation (e.g., 9.88E+09)
    if (/e\+?/i.test(phone)) {
        phone = Number(phone).toFixed(0);
    }
    // remove non-digits (spaces, symbols, etc.)
    phone = phone.replace(/\D/g, "");
    return {
        FirstName: String(item.FirstName || "").trim(),
        Phone: phone,
        Notes: item.Notes ? String(item.Notes).trim() : "",
    };
};
exports.uploadAndDistribute = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new AppError_1.AppError("File is required", 400);
    }
    const filePath = req.file.path;
    try {
        // 🔥 validate extension
        const allowedExtensions = [".csv", ".xlsx", ".xls"];
        const isValidFile = allowedExtensions.some((ext) => req.file.originalname.toLowerCase().endsWith(ext));
        if (!isValidFile) {
            throw new AppError_1.AppError("Only CSV, XLSX or XLS files are allowed", 400);
        }
        // 🔥 parse file
        const data = await (0, fileParser_1.default)(filePath);
        if (!data.length) {
            throw new AppError_1.AppError("File is empty", 400);
        }
        // 🔥 validate headers
        const requiredHeaders = ["FirstName", "Phone", "Notes"];
        const fileHeaders = Object.keys(data[0]);
        const isValidHeaders = requiredHeaders.every((h) => fileHeaders.includes(h));
        if (!isValidHeaders) {
            throw new AppError_1.AppError("Invalid format. Required headers: FirstName, Phone, Notes", 400);
        }
        // 🔥 NORMALIZE + VALIDATE
        const cleanedData = [];
        for (const rawItem of data) {
            const item = normalizeTask(rawItem);
            const { error } = task_validator_1.taskSchema.validate(item);
            if (error) {
                throw new AppError_1.AppError(`Invalid data for ${item.FirstName || "row"}`, 400);
            }
            cleanedData.push(item);
        }
        // 🔥 fetch active agents
        const agents = await Agent_1.Agent.find({ isActive: true }).lean();
        if (!agents.length) {
            throw new AppError_1.AppError("No active agents available", 400);
        }
        // 🔥 distribute tasks
        const distributedData = (0, distributionService_1.default)(cleanedData, agents);
        const tasksToInsert = distributedData.map((task) => ({
            FirstName: task.FirstName,
            Phone: task.Phone,
            Notes: task.Notes,
            agent: task.agent,
        }));
        // 🔥 bulk insert
        await Task_1.Task.insertMany(tasksToInsert);
        res.json({
            message: "Tasks distributed successfully",
            totalTasks: tasksToInsert.length,
        });
    }
    finally {
        // 🔥 ALWAYS CLEAN FILE (safe cleanup)
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
});
