"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentController_1 = require("../controllers/agentController");
const validate_1 = require("../middleware/validate");
const agent_validator_1 = require("../validators/agent.validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = __importDefault(require("../middleware/authorize"));
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, (0, authorize_1.default)("admin"), (0, validate_1.validate)(agent_validator_1.addAgentSchema), agentController_1.addAgent);
router.get("/", authMiddleware_1.protect, (0, authorize_1.default)("admin"), agentController_1.getAgents);
router.get("/tasks", authMiddleware_1.protect, (0, authorize_1.default)("admin"), agentController_1.getTasks);
router.get("/me", authMiddleware_1.protect, agentController_1.getMyProfile);
router.delete("/:id", authMiddleware_1.protect, (0, authorize_1.default)("admin"), agentController_1.deactivateAgent);
exports.default = router;
