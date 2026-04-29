"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const validate_1 = require("../middleware/validate");
const admin_validator_1 = require("../validators/admin.validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = __importDefault(require("../middleware/authorize"));
const router = (0, express_1.Router)();
router.post("/create-admin", authMiddleware_1.protect, (0, authorize_1.default)("admin"), (0, validate_1.validate)(admin_validator_1.createAdminSchema), adminController_1.createAdmin);
router.post("/delete", authMiddleware_1.protect, (0, authorize_1.default)("admin"), (0, validate_1.validate)(admin_validator_1.deleteAdminSchema), adminController_1.deleteAdminByCredentials);
router.get("/", authMiddleware_1.protect, (0, authorize_1.default)("admin"), adminController_1.getAdmins);
router.get("/me", authMiddleware_1.protect, (0, authorize_1.default)("admin"), adminController_1.getMyAdminProfile);
exports.default = router;
