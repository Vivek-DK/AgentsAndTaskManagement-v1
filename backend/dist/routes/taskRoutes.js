"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = __importDefault(require("../middleware/authorize"));
const router = (0, express_1.Router)();
router.get("/my-tasks", authMiddleware_1.protect, (0, authorize_1.default)("agent"), taskController_1.getMyTasks);
router.get("/agent/:agentId", authMiddleware_1.protect, (0, authorize_1.default)("admin"), taskController_1.getTasksByAgentId);
router.delete("/:id", authMiddleware_1.protect, (0, authorize_1.default)("admin"), taskController_1.deleteTask);
router.delete("/", authMiddleware_1.protect, (0, authorize_1.default)("admin"), taskController_1.deleteAllTasks);
exports.default = router;
