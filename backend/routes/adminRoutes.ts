import { Router } from "express";
import {
  createAdmin,
  deleteAdminByCredentials,
  getAdmins,
  getMyAdminProfile,
} from "../controllers/adminController";
import { validate } from "../middleware/validate";
import { createAdminSchema, deleteAdminSchema } from "../validators/admin.validator";
import { protect } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";

const router = Router();

router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  validate(createAdminSchema),
  createAdmin
);

router.post(
  "/delete",
  protect,
  authorize("admin"),
  validate(deleteAdminSchema),
  deleteAdminByCredentials
);

router.get(
  "/", 
  protect, 
  authorize("admin"), 
  getAdmins
);

router.get(
  "/me", 
  protect, 
  authorize("admin"), 
  getMyAdminProfile
);

export default router;