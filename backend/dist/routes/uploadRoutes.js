"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = __importDefault(require("../middleware/authorize"));
const uploadController_1 = require("../controllers/uploadController");
const agentController_1 = require("../controllers/agentController");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, (0, authorize_1.default)("admin"), uploadMiddleware_1.upload.single("file"), uploadController_1.uploadAndDistribute);
router.get("/tasks", authMiddleware_1.protect, (0, authorize_1.default)("admin"), agentController_1.getTasks);
exports.default = router;
